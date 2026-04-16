// Twilio WhatsApp webhook: receives messages from users, identifies them by phone, and either:
//   1) Creates a financial entry (text/photo/audio) using Gemini extraction
//   2) Answers an analytical question about their finances (conversational mode)
//   3) Verifies a WhatsApp link via 6-digit code
//
// Configure this function URL in the Twilio Console:
//   Sandbox: Messaging → Try it out → Send a WhatsApp message → "WHEN A MESSAGE COMES IN" webhook
//   Production: Messaging → Senders → WhatsApp Sender → webhook URL
//
// Deployed URL: https://<project-ref>.supabase.co/functions/v1/whatsapp-webhook

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
};

const CATEGORIES = [
  "Salário", "Freelance", "Investimentos", "Aluguel", "Alimentação",
  "Transporte", "Saúde", "Educação", "Lazer", "Moradia", "Cartão de Crédito", "Outros",
];

const TWIML_OK = `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`;

function twimlReply(text: string) {
  // Escape XML special chars
  const safe = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${safe}</Message></Response>`;
}

function fmtBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Normalize Twilio's "whatsapp:+5534999998888" to "+5534999998888"
function normalizePhone(twilioFrom: string): string {
  return twilioFrom.replace(/^whatsapp:/, "").trim();
}

interface ParsedEntry {
  type: "receita" | "despesa";
  amount: number;
  category: string;
  description: string;
  date: string;
  confidence: number;
}

const EXTRACT_TOOL = {
  type: "function",
  function: {
    name: "extract_entry",
    description: "Extrai um lançamento financeiro estruturado.",
    parameters: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["receita", "despesa"] },
        amount: { type: "number" },
        category: { type: "string", enum: CATEGORIES },
        description: { type: "string" },
        date: { type: "string" },
        confidence: { type: "number" },
      },
      required: ["type", "amount", "category", "description", "date", "confidence"],
      additionalProperties: false,
    },
  },
};

const ROUTER_TOOL = {
  type: "function",
  function: {
    name: "route_intent",
    description: "Decide se a mensagem é um novo lançamento OU uma pergunta analítica.",
    parameters: {
      type: "object",
      properties: {
        intent: {
          type: "string",
          enum: ["new_entry", "question", "greeting", "help"],
          description: "new_entry: usuário quer registrar gasto/receita. question: pergunta sobre suas finanças. greeting: oi/olá. help: pediu ajuda.",
        },
      },
      required: ["intent"],
      additionalProperties: false,
    },
  },
};

async function callAI(messages: any[], tools?: any[], toolChoice?: any) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
  const body: any = {
    model: "google/gemini-2.5-flash",
    messages,
  };
  if (tools) body.tools = tools;
  if (toolChoice) body.tool_choice = toolChoice;

  const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`AI ${r.status}: ${t}`);
  }
  return await r.json();
}

async function fetchTwilioMedia(url: string): Promise<{ base64: string; mime: string }> {
  // Twilio media URLs require Basic Auth with the account SID + auth token.
  // Via the connector gateway we don't have these; instead we use the gateway prefix.
  const TWILIO_API_KEY = Deno.env.get("TWILIO_API_KEY");
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!TWILIO_API_KEY || !LOVABLE_API_KEY) throw new Error("Twilio creds missing");

  // Twilio media URL example: https://api.twilio.com/2010-04-01/Accounts/ACxxx/Messages/MMxxx/Media/MExxx
  // Strip the host + account prefix and route through the gateway
  const path = url.replace(/^https?:\/\/api\.twilio\.com\/2010-04-01\/Accounts\/[^/]+/, "");
  const gatewayUrl = `https://connector-gateway.lovable.dev/twilio${path}`;

  const r = await fetch(gatewayUrl, {
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": TWILIO_API_KEY,
    },
    redirect: "follow",
  });
  if (!r.ok) throw new Error(`Twilio media fetch ${r.status}`);
  const mime = r.headers.get("content-type") || "image/jpeg";
  const buf = new Uint8Array(await r.arrayBuffer());
  // base64 encode
  let binary = "";
  for (let i = 0; i < buf.length; i++) binary += String.fromCharCode(buf[i]);
  const base64 = btoa(binary);
  return { base64, mime };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Twilio sends application/x-www-form-urlencoded
    const formData = await req.formData();
    const From = String(formData.get("From") || "");
    const Body = String(formData.get("Body") || "").trim();
    const NumMedia = parseInt(String(formData.get("NumMedia") || "0"), 10);
    const MediaUrl0 = NumMedia > 0 ? String(formData.get("MediaUrl0") || "") : "";
    const MediaContentType0 = NumMedia > 0 ? String(formData.get("MediaContentType0") || "") : "";

    const phone = normalizePhone(From);
    console.log("WhatsApp inbound:", { phone, Body: Body.slice(0, 80), NumMedia });

    // ── 1. Verify code? (user typed a 6-digit code to confirm phone)
    if (/^\d{6}$/.test(Body)) {
      const { data: link } = await supabase
        .from("whatsapp_links")
        .select("*")
        .eq("phone_e164", phone)
        .eq("verification_code", Body)
        .eq("verified", false)
        .maybeSingle();
      if (link) {
        await supabase
          .from("whatsapp_links")
          .update({ verified: true, verified_at: new Date().toISOString(), verification_code: null })
          .eq("id", link.id);
        return new Response(
          twimlReply("✅ Número verificado! A partir de agora você pode mandar seus gastos por aqui.\n\nExemplos:\n• \"Mercado 127,50\"\n• \"Uber 25\"\n• Foto do cupom fiscal\n• \"Quanto gastei essa semana?\""),
          { headers: { "Content-Type": "text/xml" } },
        );
      }
    }

    // ── 2. Find linked + verified user
    const { data: link } = await supabase
      .from("whatsapp_links")
      .select("user_id, verified")
      .eq("phone_e164", phone)
      .maybeSingle();

    if (!link || !link.verified) {
      return new Response(
        twimlReply("Olá! Esse número ainda não está vinculado a uma conta Melazzo.\n\nAcesse melazzo.co/cliente/configuracoes para conectar seu WhatsApp."),
        { headers: { "Content-Type": "text/xml" } },
      );
    }

    const userId = link.user_id;

    // ── 3. Route intent (skip routing if there's a media — always treat as new entry)
    let intent: "new_entry" | "question" | "greeting" | "help" = "new_entry";
    if (NumMedia === 0) {
      const router = await callAI(
        [
          {
            role: "system",
            content: "Classifique a mensagem do usuário em uma das intenções. Mensagens curtas com valor (ex: 'almoço 35') são new_entry.",
          },
          { role: "user", content: Body },
        ],
        [ROUTER_TOOL],
        { type: "function", function: { name: "route_intent" } },
      );
      const args = JSON.parse(router.choices[0].message.tool_calls[0].function.arguments);
      intent = args.intent;
    }

    if (intent === "greeting") {
      return new Response(
        twimlReply(`Olá! 👋 Sou o assistente Melazzo. Mande seus gastos por mensagem ou foto, ou pergunte sobre suas finanças.\n\nDigite *ajuda* para ver exemplos.`),
        { headers: { "Content-Type": "text/xml" } },
      );
    }

    if (intent === "help") {
      return new Response(
        twimlReply(`*Como usar:*\n• "Mercado 127,50" — registra despesa\n• "Recebi 3000 freelance" — registra receita\n• Foto do cupom — IA lê valor + estabelecimento\n• "Quanto gastei semana?" — resumo\n• "Maior categoria do mês?" — análise`),
        { headers: { "Content-Type": "text/xml" } },
      );
    }

    // ── 4a. Question: build context + answer
    if (intent === "question") {
      const sinceMonth = new Date();
      sinceMonth.setMonth(sinceMonth.getMonth() - 2);
      const { data: entries } = await supabase
        .from("financial_entries")
        .select("type, category, description, amount, date")
        .eq("user_id", userId)
        .gte("date", sinceMonth.toISOString().slice(0, 10))
        .order("date", { ascending: false })
        .limit(200);

      const ctx = (entries || []).map((e) =>
        `${e.date} ${e.type === "receita" ? "+" : "-"}${e.amount} ${e.category} ${e.description}`
      ).join("\n");

      const ans = await callAI([
        {
          role: "system",
          content: `Você é o assistente financeiro da Melazzo via WhatsApp. Responda BREVEMENTE (máx 3 linhas), em português, com números formatados em R$. Hoje é ${new Date().toISOString().slice(0, 10)}.\n\nLançamentos recentes do usuário:\n${ctx || "(sem dados)"}`,
        },
        { role: "user", content: Body },
      ]);
      const answer = ans.choices[0].message.content || "Não consegui responder agora.";
      return new Response(twimlReply(answer), { headers: { "Content-Type": "text/xml" } });
    }

    // ── 4b. New entry: extract via AI (multimodal)
    const userContent: any[] = [];
    const today = new Date().toISOString().slice(0, 10);

    if (Body) {
      userContent.push({
        type: "text",
        text: `Hoje é ${today}. Entrada: ${Body}`,
      });
    }
    if (MediaUrl0 && MediaContentType0.startsWith("image/")) {
      try {
        const { base64, mime } = await fetchTwilioMedia(MediaUrl0);
        if (!Body) {
          userContent.push({ type: "text", text: `Hoje é ${today}. Extraia o lançamento desta foto:` });
        }
        userContent.push({ type: "image_url", image_url: { url: `data:${mime};base64,${base64}` } });
      } catch (mediaErr) {
        console.error("media fetch failed:", mediaErr);
        return new Response(twimlReply("Não consegui baixar a imagem. Tente enviar de novo."), { headers: { "Content-Type": "text/xml" } });
      }
    }

    if (userContent.length === 0) {
      return new Response(twimlReply("Mande um texto como 'almoço 35' ou uma foto do cupom."), { headers: { "Content-Type": "text/xml" } });
    }

    const ai = await callAI(
      [
        {
          role: "system",
          content: `Extraia UM lançamento financeiro. Categorias: ${CATEGORIES.join(", ")}. Use a data de hoje se não houver.`,
        },
        { role: "user", content: userContent },
      ],
      [EXTRACT_TOOL],
      { type: "function", function: { name: "extract_entry" } },
    );

    const parsed: ParsedEntry = JSON.parse(ai.choices[0].message.tool_calls[0].function.arguments);

    if (parsed.confidence < 0.4) {
      return new Response(
        twimlReply("Não entendi 100%. Pode reformular? Ex: 'almoço 35' ou 'recebi 1500 salário'."),
        { headers: { "Content-Type": "text/xml" } },
      );
    }

    const { error: insertErr } = await supabase.from("financial_entries").insert({
      user_id: userId,
      type: parsed.type,
      category: parsed.category,
      description: parsed.description,
      amount: parsed.amount,
      date: parsed.date || today,
      source: MediaUrl0 ? "photo" : "whatsapp",
    });

    if (insertErr) {
      console.error("insert error:", insertErr);
      return new Response(twimlReply("Não consegui registrar agora. Tente em 1 minuto."), { headers: { "Content-Type": "text/xml" } });
    }

    // Update category memory
    const keyword = parsed.description.toLowerCase().split(/\s+/)[0]?.slice(0, 30);
    if (keyword) {
      await supabase.rpc; // noop — use upsert instead
      const { data: existing } = await supabase
        .from("category_memory")
        .select("id, hit_count")
        .eq("user_id", userId)
        .eq("keyword", keyword)
        .maybeSingle();
      if (existing) {
        await supabase.from("category_memory").update({
          category: parsed.category,
          hit_count: existing.hit_count + 1,
          updated_at: new Date().toISOString(),
        }).eq("id", existing.id);
      } else {
        await supabase.from("category_memory").insert({
          user_id: userId, keyword, category: parsed.category,
        });
      }
    }

    // Compute month balance for confirmation
    const monthStart = new Date();
    monthStart.setDate(1);
    const { data: monthEntries } = await supabase
      .from("financial_entries")
      .select("type, amount")
      .eq("user_id", userId)
      .gte("date", monthStart.toISOString().slice(0, 10));
    const balance = (monthEntries || []).reduce((s, e) =>
      s + (e.type === "receita" ? Number(e.amount) : -Number(e.amount)), 0);

    const sign = parsed.type === "receita" ? "+" : "-";
    return new Response(
      twimlReply(`✅ ${sign}${fmtBRL(parsed.amount)} em *${parsed.category}*\n${parsed.description}\n\nSaldo do mês: ${fmtBRL(balance)}`),
      { headers: { "Content-Type": "text/xml" } },
    );
  } catch (e) {
    console.error("webhook error:", e);
    return new Response(TWIML_OK, { headers: { "Content-Type": "text/xml" } });
  }
});
