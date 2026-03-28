
-- Explicit deny-all policies for leads table (PII protection)
-- All access is via Edge Function using service_role which bypasses RLS

-- No SELECT for anon/authenticated (default deny already applies, but explicit is better)
CREATE POLICY "deny_select_leads"
  ON public.leads FOR SELECT
  TO anon, authenticated
  USING (false);

CREATE POLICY "deny_insert_leads"
  ON public.leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

CREATE POLICY "deny_update_leads"
  ON public.leads FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "deny_delete_leads"
  ON public.leads FOR DELETE
  TO anon, authenticated
  USING (false);

-- Explicit deny-all policies for lead_download_logs table
CREATE POLICY "deny_select_lead_download_logs"
  ON public.lead_download_logs FOR SELECT
  TO anon, authenticated
  USING (false);

CREATE POLICY "deny_insert_lead_download_logs"
  ON public.lead_download_logs FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

CREATE POLICY "deny_update_lead_download_logs"
  ON public.lead_download_logs FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "deny_delete_lead_download_logs"
  ON public.lead_download_logs FOR DELETE
  TO anon, authenticated
  USING (false);
