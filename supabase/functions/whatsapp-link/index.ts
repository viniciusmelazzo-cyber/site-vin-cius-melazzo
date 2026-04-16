// Edge function: starts a WhatsApp link by sending a 6-digit verification code via Twilio.
// The user types the code back in WhatsApp; whatsapp-webhook marks it verified.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/twilio";

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// Brazilian phone normalization → E.164
function toE164(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11) return `+55${digits}`;     // 34999998888 → +5534999998888
  if (digits.length === 13 && digits.startsWith("55")) return `+${digits}`;
  if (raw.startsWith("+") && digits.length >= 10) return `+${digits}`;
  return null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autenticado" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const TWILIO_API_KEY = Deno.env.get("TWILIO_API_KEY");
    const TWILIO_FROM = Deno.env.get("TWILIO_WHATSAPP_FROM"); // e.g. 'whatsapp:+14155238886' (Sandbox)

    if (!LOVABLE_API_KEY || !TWILIO_API_KEY) {
      return new Response(JSON.stringify({ error: "WhatsApp não configurado. Conecte o Twilio em Lovable Cloud." }), {
        status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!TWILIO_FROM) {
      return new Response(JSON.stringify({ error: "TWILIO_WHATSAPP_FROM não configurado. Adicione o número remetente nos secrets." }), {
        status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Sessão inválida" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;

    const { phone } = await req.json();
    const e164 = toE164(String(phone || ""));
    if (!e164) {
      return new Response(JSON.stringify({ error: "Número inválido. Use formato (34) 99999-8888." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const code = generateCode();
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Upsert link as not verified
    await admin.from("whatsapp_links").delete().eq("user_id", userId);
    await admin.from("whatsapp_links").delete().eq("phone_e164", e164);
    const { error: insertErr } = await admin.from("whatsapp_links").insert({
      user_id: userId,
      phone_e164: e164,
      verification_code: code,
      verified: false,
    });
    if (insertErr) throw insertErr;

    // Send WhatsApp message via Twilio Gateway
    const body = new URLSearchParams({
      To: `whatsapp:${e164}`,
      From: TWILIO_FROM,
      Body: `Seu código Melazzo é ${code}. Responda esta mensagem com o código para ativar o assistente financeiro no WhatsApp.`,
    });

    const twilioRes = await fetch(`${GATEWAY_URL}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": TWILIO_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const twilioData = await twilioRes.json();
    if (!twilioRes.ok) {
      console.error("Twilio error:", twilioRes.status, twilioData);
      return new Response(JSON.stringify({
        error: "Não foi possível enviar a mensagem. Verifique se o número é válido e se o sandbox Twilio aceita esse destinatário.",
        details: twilioData,
      }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, sid: twilioData.sid }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("whatsapp-link error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
