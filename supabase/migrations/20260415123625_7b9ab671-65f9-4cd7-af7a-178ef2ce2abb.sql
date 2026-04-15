
-- Enum for CRM pipeline statuses
CREATE TYPE crm_pipeline_status AS ENUM (
  'prospeccao','analise_documental','em_negociacao','aprovado',
  'em_fechamento','contrato_assinado','concluido','cancelado',
  'analise_inicial','acompanhamento'
);

-- CRM clients table
CREATE TABLE public.crm_clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  nome text NOT NULL,
  cpf text,
  rg text,
  profissao text,
  telefones text,
  email text,
  endereco text,
  cidade text,
  estado text,
  data_nascimento text,
  estado_civil text,
  regime_casamento text,
  conjuge_nome text,
  conjuge_cpf text,
  conjuge_data_nascimento text,
  conjuge_telefone text,
  conjuge_email text,
  conjuge_endereco text,
  conjuge_cidade text,
  conjuge_estado text,
  perfil_renda text,
  formalizacao_renda text,
  produto text,
  subproduto text,
  banco text,
  valor numeric,
  status crm_pipeline_status DEFAULT 'prospeccao',
  comissao_tipo text,
  comissao_percentual numeric,
  honorarios_iniciais numeric,
  data_entrada text,
  data_indicacao text,
  indicacao text,
  comissao_indicador text,
  google_drive_url text,
  observacoes text,
  updated_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- CRM history table
CREATE TABLE public.crm_historico (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES public.crm_clientes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  tipo text NOT NULL DEFAULT 'nota',
  titulo text NOT NULL,
  descricao text,
  status_anterior text,
  status_novo text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.crm_clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_historico ENABLE ROW LEVEL SECURITY;

-- Admin-only policies
CREATE POLICY "admins_manage_crm_clientes" ON public.crm_clientes
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_manage_crm_historico" ON public.crm_historico
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at on crm_clientes
CREATE OR REPLACE FUNCTION public.update_crm_clientes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_crm_clientes_updated_at
  BEFORE UPDATE ON public.crm_clientes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_crm_clientes_updated_at();
