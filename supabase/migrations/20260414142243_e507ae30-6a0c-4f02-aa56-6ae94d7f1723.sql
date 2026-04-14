
-- Create client_health_scores table for caching calculated health scores
CREATE TABLE public.client_health_scores (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  score numeric NOT NULL DEFAULT 0,
  p1_score numeric NOT NULL DEFAULT 0,
  p2_score numeric NOT NULL DEFAULT 0,
  p3_score numeric NOT NULL DEFAULT 0,
  p4_score numeric NOT NULL DEFAULT 0,
  breakdown jsonb DEFAULT '{}'::jsonb,
  calculated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.client_health_scores ENABLE ROW LEVEL SECURITY;

-- Admins can read all scores
CREATE POLICY "admins_read_all_scores"
ON public.client_health_scores
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Users can read their own score
CREATE POLICY "users_read_own_score"
ON public.client_health_scores
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can upsert their own score (calculated client-side)
CREATE POLICY "users_upsert_own_score"
ON public.client_health_scores
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_update_own_score"
ON public.client_health_scores
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add health_score cache to profiles for quick access in admin list
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS health_score numeric DEFAULT NULL,
ADD COLUMN IF NOT EXISTS last_score_update timestamptz DEFAULT NULL;
