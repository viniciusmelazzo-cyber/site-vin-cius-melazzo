// Edge function (cron, Friday 18:00): sends a weekly financial summary via WhatsApp
// to every user with a verified link.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/twilio";

const fmtBRL = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

Deno.serve(async () => {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const TWILIO_API_KEY = Deno.env.get("TWILIO_API_KEY");
  const TWILIO_FROM = Deno.env.get("TWILIO_WHATSAPP_FROM");

  if (!LOVABLE_API_KEY || !TWILIO_API_KEY || !TWILIO_FROM) {
    return new Response(JSON.stringify({ error: "Twilio not configured" }), { status: 503 });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);
  const { data: links } = await supabase
    .from("whatsapp_links")
    .select("user_id, phone_e164")
    .eq("verified", true);

  const since = new Date();
  since.setDate(since.getDate() - 7);
  const sinceStr = since.toISOString().slice(0, 10);

  let sent = 0;
  for (const link of links || []) {
    const { data: entries } = await supabase
      .from("financial_entries")
      .select("type, category, amount")
      .eq("user_id", link.user_id)
      .gte("date", sinceStr);

    if (!entries || entries.length === 0) continue;

    const receitas = entries.filter((e) => e.type === "receita").reduce((s, e) => s + Number(e.amount), 0);
    const despesas = entries.filter((e) => e.type === "despesa").reduce((s, e) => s + Number(e.amount), 0);
    const saldo = receitas - despesas;

    // Top despesa category
    const cat: Record<string, number> = {};
    entries.filter((e) => e.type === "despesa").forEach((e) => {
      cat[e.category] = (cat[e.category] || 0) + Number(e.amount);
    });
    const topCat = Object.entries(cat).sort((a, b) => b[1] - a[1])[0];

    const message = `📊 *Resumo da semana*\n\nReceitas: ${fmtBRL(receitas)}\nDespesas: ${fmtBRL(despesas)}\nSaldo: ${fmtBRL(saldo)}\n\nMaior gasto: *${topCat?.[0] || "-"}* (${fmtBRL(topCat?.[1] || 0)})\n\nQuer ver o detalhe? Acesse melazzo.co/cliente/dashboard`;

    const body = new URLSearchParams({
      To: `whatsapp:${link.phone_e164}`,
      From: TWILIO_FROM,
      Body: message,
    });

    const r = await fetch(`${GATEWAY_URL}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": TWILIO_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });
    if (r.ok) sent++;
  }

  return new Response(JSON.stringify({ ok: true, sent }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
