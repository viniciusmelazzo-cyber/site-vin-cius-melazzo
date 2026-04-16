
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS origem TEXT NOT NULL DEFAULT 'manual-rural',
  ADD COLUMN IF NOT EXISTS mensagem TEXT,
  ADD COLUMN IF NOT EXISTS lido BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_leads_origem ON public.leads(origem);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);

DROP POLICY IF EXISTS admins_read_all_leads ON public.leads;
CREATE POLICY admins_read_all_leads ON public.leads
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS admins_update_leads ON public.leads;
CREATE POLICY admins_update_leads ON public.leads
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
