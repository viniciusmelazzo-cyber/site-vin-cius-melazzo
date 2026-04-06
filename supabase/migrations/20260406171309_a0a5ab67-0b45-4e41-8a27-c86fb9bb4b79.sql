
ALTER TABLE public.onboarding_data
  ADD COLUMN IF NOT EXISTS personal_data jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS activity_type text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS income_data jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS housing_data jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS expenses_data jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS assets_liabilities_data jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS profile_module_data jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS onboarding_step integer DEFAULT 0;
