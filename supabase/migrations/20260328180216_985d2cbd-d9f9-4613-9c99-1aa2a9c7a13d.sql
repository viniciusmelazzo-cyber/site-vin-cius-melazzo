-- Create leads table
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  propriedade TEXT,
  segmento TEXT CHECK (segmento IN ('Agro', 'Indústria', 'Serviços', 'Outro')),
  wants_checklist BOOLEAN NOT NULL DEFAULT false,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  page_path TEXT,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS - no public SELECT, INSERT only via service role (edge function)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- No SELECT policy = no public reads
-- No INSERT policy for anon = inserts only work via service_role key in edge function

-- Create lead_download_logs table
CREATE TABLE public.lead_download_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.lead_download_logs ENABLE ROW LEVEL SECURITY;

-- Create private storage bucket for lead magnets
INSERT INTO storage.buckets (id, name, public)
VALUES ('lead-magnets', 'lead-magnets', false);

-- Index for email lookups
CREATE INDEX idx_leads_email ON public.leads (email);
CREATE INDEX idx_leads_created_at ON public.leads (created_at DESC);