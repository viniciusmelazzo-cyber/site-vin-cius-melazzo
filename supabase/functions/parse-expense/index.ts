// Edge function: parse natural-language text OR a receipt image into a structured financial entry.
// Uses Lovable AI Gateway (Gemini multimodal) with tool calling for guaranteed structured output.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CATEGORIES = [
  "Salário", "Freelance", "Investimentos", "Aluguel", "Alimentação",
  "Transporte", "Saúde", "Educação", "Lazer", "Moradia", "Cartão de Crédito", "Outros",
];

const SYSTEM_PROMPT = `Você é um assistente financeiro brasileiro. Recebe entrada de texto livre OU imagem de recibo/cupom fiscal.
Sua tarefa é extrair UM lançamento financeiro estruturado.

Regras:
- "type": "receita" (entrada de dinheiro: salário, freelance, venda) ou "despesa" (saída: compras, contas).
- "amount": número em reais. Aceite formatos "R$ 35,90", "35.90", "35,90", "35 reais".
- "category": ESCOLHA UMA da lista: ${CATEGORIES.join(", ")}.
- "description": resumo curto (estabelecimento ou item, máx 60 chars).
- "date": YYYY-MM-DD. Se a entrada não disser data, use a data de hoje fornecida no contexto.
- Se for foto de cupom fiscal, leia o estabelecimento, valor TOTAL e data.
- Em caso de dúvida na categoria, use o histórico do usuário fornecido.
- Se NÃO for possível extrair (texto não relacionado a finanças), defina "confidence" baixo.`;

const tool = {
  type: "function",
  function: {
    name: "extract_entry",
    description: "Extrai um lançamento financeiro estruturado do input.",
    parameters: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["receita", "despesa"] },
        amount: { type: "number", description: "Valor em reais (positivo)" },
        category: { type: "string", enum: CATEGORIES },
        description: { type: "string", description: "Resumo curto" },
        date: { type: "string", description: "YYYY-MM-DD" },
        confidence: { type: "number", description: "0-1, confiança da extração" },
        notes: { type: "string", description: "Observações adicionais (opcional)" },
      },
      required: ["type", "amount", "category", "description", "date", "confidence"],
      additionalProperties: false,
    },
  },
};

interface RequestBody {
  text?: string;
  image_base64?: string; // data URL or raw base64
  image_mime?: string;   // e.g. 'image/jpeg'
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autenticado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Sessão inválida" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;

    const body: RequestBody = await req.json();
    if (!body.text && !body.image_base64) {
      return new Response(JSON.stringify({ error: "Envie 'text' ou 'image_base64'" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Pull user's recent category memory to bias the model
    const { data: memory } = await supabase
      .from("category_memory")
      .select("keyword, category")
      .eq("user_id", userId)
      .order("hit_count", { ascending: false })
      .limit(20);

    const memoryHint = memory && memory.length > 0
      ? `Histórico do usuário (palavra → categoria): ${memory.map((m) => `${m.keyword}→${m.category}`).join(", ")}`
      : "";

    const today = new Date().toISOString().slice(0, 10);

    // Build multimodal user content
    const userContent: any[] = [];
    if (body.text) {
      userContent.push({
        type: "text",
        text: `Hoje é ${today}.\n${memoryHint}\n\nEntrada: ${body.text}`,
      });
    }
    if (body.image_base64) {
      const dataUrl = body.image_base64.startsWith("data:")
        ? body.image_base64
        : `data:${body.image_mime || "image/jpeg"};base64,${body.image_base64}`;
      if (!body.text) {
        userContent.push({
          type: "text",
          text: `Hoje é ${today}.\n${memoryHint}\n\nExtraia o lançamento desta imagem de recibo:`,
        });
      }
      userContent.push({ type: "image_url", image_url: { url: dataUrl } });
    }

    // Use multimodal-capable Gemini model
    const model = body.image_base64 ? "google/gemini-2.5-flash" : "google/gemini-2.5-flash";

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        tools: [tool],
        tool_choice: { type: "function", function: { name: "extract_entry" } },
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Muitas requisições. Tente em alguns segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos esgotados. Recarregue em Settings → Workspace → Usage." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway ${aiResponse.status}: ${errText}`);
    }

    const data = await aiResponse.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: "Não foi possível interpretar o lançamento. Tente novamente." }), {
        status: 422,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsed = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({
        type: parsed.type,
        amount: Number(parsed.amount),
        category: parsed.category,
        description: parsed.description,
        date: parsed.date || today,
        confidence: parsed.confidence ?? 0.8,
        notes: parsed.notes,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("parse-expense error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
