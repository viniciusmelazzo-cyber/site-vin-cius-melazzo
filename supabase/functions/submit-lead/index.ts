import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple in-memory rate limiter (per instance)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ipHash: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ipHash) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  rateLimitMap.set(ipHash, timestamps);
  if (timestamps.length >= RATE_LIMIT_MAX) return true;
  timestamps.push(now);
  return false;
}

async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + (Deno.env.get("IP_SALT") || "melazzo-salt"));
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

function validateBody(body: Record<string, unknown>) {
  const errors: string[] = [];
  const nome = String(body.nome || "").trim();
  const email = String(body.email || "").trim();
  const telefone = String(body.telefone || "").trim();

  if (nome.length < 3) errors.push("Nome deve ter pelo menos 3 caracteres.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("E-mail inválido.");
  if (telefone.replace(/\D/g, "").length < 10)
    errors.push("Telefone deve ter pelo menos 10 dígitos.");

  return { errors, nome, email, telefone };
}

const MANUAL_PATH = "manual-credito-rural-2026.pdf";
const SIGNED_URL_EXPIRY = 60 * 60 * 24; // 24h in seconds

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ sucesso: false, mensagem: "Método não permitido." }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await req.json();

    // Honeypot check
    if (body.honeypot) {
      // Silently accept to not reveal anti-spam
      return new Response(
        JSON.stringify({ sucesso: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate
    const { errors, nome, email, telefone } = validateBody(body);
    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ sucesso: false, mensagem: errors.join(" ") }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Rate limit by IP
    const clientIP =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const ipHash = await hashIP(clientIP);

    if (isRateLimited(ipHash)) {
      return new Response(
        JSON.stringify({
          sucesso: false,
          mensagem: "Muitas solicitações. Tente novamente mais tarde.",
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Origem do lead — controla se gera/envia o manual
    const origem = String(body.origem || "manual-rural").trim().slice(0, 50);
    const isManualRural = origem === "manual-rural";
    const mensagem = body.mensagem ? String(body.mensagem).trim().slice(0, 2000) : null;

    // Insert lead
    const leadData = {
      nome,
      email,
      telefone,
      propriedade: body.propriedade ? String(body.propriedade).trim() : null,
      segmento: body.segmento ? String(body.segmento).trim() : null,
      wants_checklist: Boolean(body.wants_checklist),
      origem,
      mensagem,
      utm_source: body.utm_source || null,
      utm_medium: body.utm_medium || null,
      utm_campaign: body.utm_campaign || null,
      utm_content: body.utm_content || null,
      utm_term: body.utm_term || null,
      page_path: body.page_path || null,
      ip_hash: ipHash,
    };

    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .insert(leadData)
      .select("id")
      .single();

    if (leadError) {
      console.error("Lead insert error:", leadError);
      return new Response(
        JSON.stringify({ sucesso: false, mensagem: "Erro ao salvar seus dados." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const fromEmail = Deno.env.get("FROM_EMAIL") || "vinicius@melazzo.co";
    const consultorEmail = Deno.env.get("CONSULTOR_EMAIL") || "vinicius@melazzo.co";

    if (isManualRural) {
      // ===== Fluxo Manual Crédito Rural =====
      await supabase.from("lead_download_logs").insert({
        lead_id: lead.id,
        file_path: MANUAL_PATH,
      });

      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from("lead-magnets")
        .createSignedUrl(MANUAL_PATH, SIGNED_URL_EXPIRY);

      if (signedUrlError) console.error("Signed URL error:", signedUrlError);
      const downloadUrl = signedUrlData?.signedUrl || "";

      if (resendApiKey && downloadUrl) {
        try {
          const emailResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: `Melazzo Consultoria <${fromEmail}>`,
              to: [email],
              subject: "Seu Manual de Crédito Rural 2026 — Melazzo Consultoria",
              html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f7f5f0;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e8e4dc;">
        <tr><td style="padding:40px 40px 30px;border-bottom:2px solid #c9a96e;">
          <h1 style="margin:0;font-size:22px;color:#1a1f2e;font-weight:700;">Melazzo Consultoria</h1>
          <p style="margin:8px 0 0;font-size:12px;color:#c9a96e;letter-spacing:2px;text-transform:uppercase;">Estratégia & Performance</p>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="margin:0 0 20px;font-size:16px;color:#2d3748;line-height:1.6;">Olá, <strong>${nome}</strong>!</p>
          <p style="margin:0 0 20px;font-size:15px;color:#4a5568;line-height:1.7;">Obrigado por seu interesse. Aqui está o seu acesso exclusivo ao <strong>Manual Completo de Crédito Rural 2026</strong>.</p>
          <table cellpadding="0" cellspacing="0" style="margin:30px 0;">
            <tr><td style="background:#c9a96e;padding:14px 36px;">
              <a href="${downloadUrl}" style="color:#1a1f2e;font-size:13px;font-weight:700;text-decoration:none;letter-spacing:1px;text-transform:uppercase;font-family:Arial,sans-serif;">Baixar Manual (PDF)</a>
            </td></tr>
          </table>
          <p style="margin:0 0 10px;font-size:13px;color:#a0aec0;line-height:1.5;">Este link expira em 24 horas. Caso precise de um novo acesso, preencha o formulário novamente.</p>
        </td></tr>
        <tr><td style="padding:20px 40px;background:#f7f5f0;border-top:1px solid #e8e4dc;">
          <p style="margin:0;font-size:11px;color:#a0aec0;text-align:center;">© 2026 Melazzo Consultoria — Uberaba &amp; Uberlândia, MG</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
            }),
          });
          if (!emailResponse.ok) console.error("Resend error:", await emailResponse.text());
        } catch (emailErr) {
          console.error("Email send error:", emailErr);
        }
      } else {
        console.warn("RESEND_API_KEY not set or signed URL not generated. Email not sent.");
      }
    } else {
      // ===== Fluxo Captação de Reunião / Contato (PF, PJ, etc) =====
      if (resendApiKey) {
        try {
          const labelOrigem = origem === "reuniao-pf" ? "Reunião · Pessoa Física" : origem;
          const safeMsg = mensagem ? mensagem.replace(/</g, "&lt;") : "";
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: `Melazzo Site <${fromEmail}>`,
              to: [consultorEmail],
              reply_to: email,
              subject: `🔔 Novo lead — ${labelOrigem} — ${nome}`,
              html: `
<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f7f5f0;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e8e4dc;">
        <tr><td style="padding:32px 40px 20px;border-bottom:2px solid #c9a96e;">
          <p style="margin:0;font-size:11px;color:#c9a96e;letter-spacing:2px;text-transform:uppercase;font-weight:700;">${labelOrigem}</p>
          <h1 style="margin:8px 0 0;font-size:20px;color:#1a1f2e;font-weight:700;">Novo lead recebido</h1>
        </td></tr>
        <tr><td style="padding:32px 40px;">
          <table width="100%" cellpadding="6" cellspacing="0" style="font-size:14px;color:#2d3748;">
            <tr><td style="width:130px;color:#a0aec0;text-transform:uppercase;font-size:11px;letter-spacing:1px;">Nome</td><td><strong>${nome}</strong></td></tr>
            <tr><td style="color:#a0aec0;text-transform:uppercase;font-size:11px;letter-spacing:1px;">E-mail</td><td><a href="mailto:${email}" style="color:#1a1f2e;">${email}</a></td></tr>
            <tr><td style="color:#a0aec0;text-transform:uppercase;font-size:11px;letter-spacing:1px;">Telefone</td><td><a href="https://wa.me/55${telefone.replace(/\D/g, "")}" style="color:#1a1f2e;">${telefone}</a></td></tr>
            ${safeMsg ? `<tr><td style="color:#a0aec0;text-transform:uppercase;font-size:11px;letter-spacing:1px;vertical-align:top;">Mensagem</td><td style="white-space:pre-wrap;line-height:1.6;">${safeMsg}</td></tr>` : ""}
            <tr><td style="color:#a0aec0;text-transform:uppercase;font-size:11px;letter-spacing:1px;">Página</td><td style="color:#718096;font-size:12px;">${body.page_path || "—"}</td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:20px 40px;background:#f7f5f0;border-top:1px solid #e8e4dc;">
          <p style="margin:0;font-size:11px;color:#a0aec0;text-align:center;">Lead disponível também no painel do consultor.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`,
            }),
          });
        } catch (emailErr) {
          console.error("Notify consultant error:", emailErr);
        }
      }
    }

    return new Response(
      JSON.stringify({ sucesso: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ sucesso: false, mensagem: "Erro interno do servidor." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
