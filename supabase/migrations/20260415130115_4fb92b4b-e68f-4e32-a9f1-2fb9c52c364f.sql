
-- ============================================
-- 1. CLIENTES PJ
-- ============================================
CREATE TABLE public.clientes_pj (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  nome text NOT NULL,
  cnpj text,
  razao_social text,
  responsavel text,
  telefone text,
  email text,
  endereco text,
  cidade text,
  estado text,
  segmento text,
  atividade text,
  status text NOT NULL DEFAULT 'ativo',
  observacoes text,
  google_drive_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.clientes_pj ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_manage_clientes_pj" ON public.clientes_pj
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_clientes_pj_updated_at
  BEFORE UPDATE ON public.clientes_pj
  FOR EACH ROW
  EXECUTE FUNCTION public.update_crm_clientes_updated_at();

-- ============================================
-- 2. PJ RECEBIMENTOS
-- ============================================
CREATE TABLE public.pj_recebimentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_pj_id uuid NOT NULL REFERENCES public.clientes_pj(id) ON DELETE CASCADE,
  tipo text NOT NULL DEFAULT 'mensalidade',
  descricao text,
  valor numeric NOT NULL DEFAULT 0,
  recorrente boolean NOT NULL DEFAULT false,
  frequencia text NOT NULL DEFAULT 'mensal',
  parcelas_total integer,
  parcelas_pagas integer DEFAULT 0,
  data_inicio date,
  data_vencimento date,
  status text NOT NULL DEFAULT 'pendente',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pj_recebimentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_manage_pj_recebimentos" ON public.pj_recebimentos
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_pj_recebimentos_updated_at
  BEFORE UPDATE ON public.pj_recebimentos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_crm_clientes_updated_at();

-- ============================================
-- 3. PJ HISTORICO
-- ============================================
CREATE TABLE public.pj_historico (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_pj_id uuid NOT NULL REFERENCES public.clientes_pj(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  tipo text NOT NULL DEFAULT 'nota',
  titulo text NOT NULL,
  descricao text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pj_historico ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_manage_pj_historico" ON public.pj_historico
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- 4. ADMIN COMPROMISSOS
-- ============================================
CREATE TABLE public.admin_compromissos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  titulo text NOT NULL,
  descricao text,
  data_hora timestamptz NOT NULL,
  duracao_minutos integer DEFAULT 60,
  cliente_pj_id uuid REFERENCES public.clientes_pj(id) ON DELETE SET NULL,
  tipo text NOT NULL DEFAULT 'reuniao',
  status text NOT NULL DEFAULT 'pendente',
  google_calendar_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_compromissos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_manage_compromissos" ON public.admin_compromissos
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_admin_compromissos_updated_at
  BEFORE UPDATE ON public.admin_compromissos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_crm_clientes_updated_at();
