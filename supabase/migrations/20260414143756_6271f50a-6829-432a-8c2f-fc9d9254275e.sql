CREATE TABLE public.client_monthly_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  month TEXT NOT NULL,
  patrimonio_liquido NUMERIC NOT NULL DEFAULT 0,
  health_score NUMERIC NOT NULL DEFAULT 0,
  receitas NUMERIC NOT NULL DEFAULT 0,
  despesas NUMERIC NOT NULL DEFAULT 0,
  resultado NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, month)
);

ALTER TABLE public.client_monthly_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_manage_own_snapshots"
ON public.client_monthly_snapshots
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admins_read_all_snapshots"
ON public.client_monthly_snapshots
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));