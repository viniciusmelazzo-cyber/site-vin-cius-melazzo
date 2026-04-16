-- Source tracking for entries (web | whatsapp | photo | voice | recurring)
ALTER TABLE public.financial_entries
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'web';

-- Recurring templates
CREATE TABLE IF NOT EXISTS public.recurring_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL CHECK (type IN ('receita','despesa')),
  category text NOT NULL DEFAULT 'Outros',
  description text NOT NULL DEFAULT '',
  amount numeric NOT NULL DEFAULT 0,
  day_of_month smallint NOT NULL DEFAULT 1 CHECK (day_of_month BETWEEN 1 AND 31),
  active boolean NOT NULL DEFAULT true,
  last_generated_month text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.recurring_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_manage_own_recurring" ON public.recurring_entries FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admins_read_all_recurring" ON public.recurring_entries FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Category memory per user
CREATE TABLE IF NOT EXISTS public.category_memory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  keyword text NOT NULL,
  category text NOT NULL,
  hit_count integer NOT NULL DEFAULT 1,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, keyword)
);
ALTER TABLE public.category_memory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_manage_own_memory" ON public.category_memory FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- WhatsApp link
CREATE TABLE IF NOT EXISTS public.whatsapp_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  phone_e164 text NOT NULL UNIQUE,
  verification_code text,
  verified boolean NOT NULL DEFAULT false,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.whatsapp_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_manage_own_whatsapp" ON public.whatsapp_links FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admins_read_all_whatsapp" ON public.whatsapp_links FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS idx_financial_entries_user_date ON public.financial_entries (user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_category_memory_user_keyword ON public.category_memory (user_id, keyword);
CREATE INDEX IF NOT EXISTS idx_whatsapp_links_phone ON public.whatsapp_links (phone_e164);

CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

DROP TRIGGER IF EXISTS recurring_entries_updated_at ON public.recurring_entries;
CREATE TRIGGER recurring_entries_updated_at
  BEFORE UPDATE ON public.recurring_entries
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();