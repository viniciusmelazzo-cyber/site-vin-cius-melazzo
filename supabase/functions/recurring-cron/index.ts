// Edge function (cron): generates this month's recurring entries for every active template
// that hasn't been generated yet. Idempotent (uses last_generated_month).
//
// Security gate: requires the X-Cron-Secret header to match the CRON_SECRET env var.
// This is necessary because verify_jwt is disabled for this function (it must be
// invokable by an external scheduler), so without a shared secret anyone could
// trigger it and pollute financial_entries.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // --- Security gate ---------------------------------------------------------
  const expected = Deno.env.get("CRON_SECRET");
  const received = req.headers.get("x-cron-secret");
  if (!expected) {
    console.error("CRON_SECRET not configured in function secrets");
    return new Response(JSON.stringify({ error: "server misconfigured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (received !== expected) {
    console.warn("recurring-cron: missing or invalid X-Cron-Secret");
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  // ---------------------------------------------------------------------------

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const monthKey = `${yyyy}-${mm}`;

  const { data: templates, error } = await supabase
    .from("recurring_entries")
    .select("*")
    .eq("active", true)
    .or(`last_generated_month.is.null,last_generated_month.neq.${monthKey}`);

  if (error) {
    console.error("fetch templates error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }

  let created = 0;
  for (const t of templates || []) {
    const day = Math.min(t.day_of_month, new Date(yyyy, now.getMonth() + 1, 0).getDate());
    const date = `${monthKey}-${String(day).padStart(2, "0")}`;

    const { error: insErr } = await supabase.from("financial_entries").insert({
      user_id: t.user_id,
      type: t.type,
      category: t.category,
      description: t.description,
      amount: t.amount,
      date,
      source: "recurring",
    });
    if (insErr) {
      console.error("insert recurring error:", insErr);
      continue;
    }
    await supabase.from("recurring_entries").update({ last_generated_month: monthKey }).eq("id", t.id);
    created++;
  }

  return new Response(JSON.stringify({ ok: true, created, month: monthKey }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
