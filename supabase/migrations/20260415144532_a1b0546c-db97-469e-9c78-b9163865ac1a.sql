-- ============================================
-- CRM V2 ARCHITECTURE
-- ============================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'crm_tipo_pessoa') THEN
    CREATE TYPE public.crm_tipo_pessoa AS ENUM ('pf', 'pj');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'crm_prioridade') THEN
    CREATE TYPE public.crm_prioridade AS ENUM ('baixa', 'media', 'alta', 'critica');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'crm_risco') THEN
    CREATE TYPE public.crm_risco AS ENUM ('baixo', 'moderado', 'alto');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'crm_operacao_status') THEN
    CREATE TYPE public.crm_operacao_status AS ENUM (
      'lead_novo',
      'contato_inicial',
      'triagem',
      'analise_inicial',
      'analise_documental',
      'viabilidade',
      'proposta_enviada',
      'em_negociacao',
      'aprovado',
      'em_fechamento',
      'contrato_assinado',
      'em_execucao',
      'acompanhamento',
      'concluido',
      'cancelado',
      'suspenso'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'crm_modelo_cobranca') THEN
    CREATE TYPE public.crm_modelo_cobranca AS ENUM (
      'honorarios_mensalidade',
      'fee_sucesso',
      'hibrido',
      'fixo_parcelado'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'crm_tipo_fee_sucesso') THEN
    CREATE TYPE public.crm_tipo_fee_sucesso AS ENUM ('percentual', 'fixo');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'crm_recebivel_status') THEN
    CREATE TYPE public.crm_recebivel_status AS ENUM ('previsto', 'pendente', 'pago', 'vencido', 'cancelado');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'crm_recebivel_tipo') THEN
    CREATE TYPE public.crm_recebivel_tipo AS ENUM (
      'honorario_inicial',
      'mensalidade',
      'fee_sucesso',
      'parcela_fixa',
      'ajuste'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'crm_evento_tipo') THEN
    CREATE TYPE public.crm_evento_tipo AS ENUM (
      'nota',
      'status',
      'pendencia',
      'documento',
      'financeiro',
      'agenda',
      'sistema'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.crm_clientes_master (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  legacy_crm_cliente_id uuid REFERENCES public.crm_clientes(id) ON DELETE SET NULL,
  tipo_pessoa public.crm_tipo_pessoa NOT NULL DEFAULT 'pf',
  nome text NOT NULL,
  cpf text,
  cnpj text,
  rg_ie text,
  data_nascimento date,
  nacionalidade text,
  profissao text,
  estado_civil text,
  regime_bens text,
  telefone_principal text,
  telefone_secundario text,
  email_principal text,
  cep text,
  endereco text,
  cidade text,
  estado text,
  nome_conjuge text,
  cpf_conjuge text,
  data_nascimento_conjuge date,
  telefone_conjuge text,
  email_conjuge text,
  perfil_renda text,
  formalizacao_renda text,
  renda_declarada numeric,
  renda_percebida numeric,
  notas_renda text,
  sazonalidade text,
  empresas_relacionadas text,
  funcao_empresarial text,
  participacao_societaria text,
  grupo_economico text,
  relacionamentos_bancarios text,
  patrimonio_resumo text,
  garantias_resumo text,
  checklist_documental jsonb NOT NULL DEFAULT '{}'::jsonb,
  estrategia_resumo text,
  riscos_observacoes text,
  google_drive_url text,
  origem_canal text,
  origem_parceiro text,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.crm_operacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  cliente_id uuid NOT NULL REFERENCES public.crm_clientes_master(id) ON DELETE CASCADE,
  legacy_crm_cliente_id uuid REFERENCES public.crm_clientes(id) ON DELETE SET NULL,
  titulo text NOT NULL,
  descricao text,
  categoria_produto text NOT NULL,
  produto text NOT NULL,
  subproduto text,
  status public.crm_operacao_status NOT NULL DEFAULT 'lead_novo',
  prioridade public.crm_prioridade NOT NULL DEFAULT 'media',
  risco public.crm_risco NOT NULL DEFAULT 'moderado',
  origem_lead text,
  indicador_nome text,
  banco_alvo text,
  valor_objetivo numeric,
  valor_aprovado numeric,
  data_entrada date NOT NULL DEFAULT CURRENT_DATE,
  data_previsao_fechamento date,
  proxima_acao text,
  proxima_acao_data timestamptz,
  responsavel_user_id uuid,
  drive_url text,
  observacoes_internas text,
  modelo_cobranca public.crm_modelo_cobranca,
  honorarios_iniciais numeric,
  honorarios_data_vencimento date,
  mensalidade_valor numeric,
  mensalidade_inicio date,
  mensalidade_frequencia text,
  mensalidade_quantidade integer,
  fee_sucesso_tipo public.crm_tipo_fee_sucesso,
  fee_sucesso_valor numeric,
  fee_sucesso_percentual numeric,
  fee_sucesso_gatilho_status public.crm_operacao_status,
  parcelas_fixas_quantidade integer,
  parcelas_fixas_valor numeric,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.crm_operacao_eventos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  cliente_id uuid REFERENCES public.crm_clientes_master(id) ON DELETE CASCADE,
  operacao_id uuid NOT NULL REFERENCES public.crm_operacoes(id) ON DELETE CASCADE,
  tipo public.crm_evento_tipo NOT NULL DEFAULT 'nota',
  titulo text NOT NULL,
  descricao text,
  status_anterior public.crm_operacao_status,
  status_novo public.crm_operacao_status,
  prazo timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.crm_recebiveis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  cliente_id uuid NOT NULL REFERENCES public.crm_clientes_master(id) ON DELETE CASCADE,
  operacao_id uuid NOT NULL REFERENCES public.crm_operacoes(id) ON DELETE CASCADE,
  tipo public.crm_recebivel_tipo NOT NULL,
  status public.crm_recebivel_status NOT NULL DEFAULT 'pendente',
  descricao text,
  valor numeric NOT NULL DEFAULT 0,
  data_competencia date,
  data_vencimento date NOT NULL,
  data_pagamento timestamptz,
  origem_automatica boolean NOT NULL DEFAULT false,
  evento_gatilho text,
  parcela_atual integer,
  parcelas_total integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.crm_clientes_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_operacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_operacao_eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_recebiveis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_manage_crm_clientes_master" ON public.crm_clientes_master
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_manage_crm_operacoes" ON public.crm_operacoes
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_manage_crm_operacao_eventos" ON public.crm_operacao_eventos
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_manage_crm_recebiveis" ON public.crm_recebiveis
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.admin_compromissos
  ADD COLUMN IF NOT EXISTS cliente_id uuid REFERENCES public.crm_clientes_master(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS operacao_id uuid REFERENCES public.crm_operacoes(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_crm_clientes_master_nome ON public.crm_clientes_master (nome);
CREATE INDEX IF NOT EXISTS idx_crm_clientes_master_ativo ON public.crm_clientes_master (ativo);
CREATE INDEX IF NOT EXISTS idx_crm_operacoes_cliente_id ON public.crm_operacoes (cliente_id);
CREATE INDEX IF NOT EXISTS idx_crm_operacoes_status ON public.crm_operacoes (status);
CREATE INDEX IF NOT EXISTS idx_crm_operacoes_produto ON public.crm_operacoes (produto);
CREATE INDEX IF NOT EXISTS idx_crm_operacoes_proxima_acao_data ON public.crm_operacoes (proxima_acao_data);
CREATE INDEX IF NOT EXISTS idx_crm_recebiveis_operacao_id ON public.crm_recebiveis (operacao_id);
CREATE INDEX IF NOT EXISTS idx_crm_recebiveis_cliente_id ON public.crm_recebiveis (cliente_id);
CREATE INDEX IF NOT EXISTS idx_crm_recebiveis_data_vencimento ON public.crm_recebiveis (data_vencimento);
CREATE INDEX IF NOT EXISTS idx_crm_recebiveis_status ON public.crm_recebiveis (status);
CREATE INDEX IF NOT EXISTS idx_crm_eventos_operacao_id ON public.crm_operacao_eventos (operacao_id);

CREATE TRIGGER update_crm_clientes_master_updated_at
  BEFORE UPDATE ON public.crm_clientes_master
  FOR EACH ROW
  EXECUTE FUNCTION public.update_crm_clientes_updated_at();

CREATE TRIGGER update_crm_operacoes_updated_at
  BEFORE UPDATE ON public.crm_operacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_crm_clientes_updated_at();

CREATE TRIGGER update_crm_recebiveis_updated_at
  BEFORE UPDATE ON public.crm_recebiveis
  FOR EACH ROW
  EXECUTE FUNCTION public.update_crm_clientes_updated_at();

INSERT INTO public.crm_clientes_master (
  user_id,
  legacy_crm_cliente_id,
  tipo_pessoa,
  nome,
  cpf,
  rg_ie,
  data_nascimento,
  profissao,
  estado_civil,
  regime_bens,
  telefone_principal,
  email_principal,
  endereco,
  cidade,
  estado,
  nome_conjuge,
  cpf_conjuge,
  data_nascimento_conjuge,
  telefone_conjuge,
  email_conjuge,
  perfil_renda,
  formalizacao_renda,
  google_drive_url,
  estrategia_resumo,
  origem_parceiro,
  created_at,
  updated_at
)
SELECT
  c.user_id,
  c.id,
  'pf'::public.crm_tipo_pessoa,
  c.nome,
  c.cpf,
  c.rg,
  NULLIF(c.data_nascimento, '')::date,
  c.profissao,
  c.estado_civil,
  c.regime_casamento,
  c.telefones,
  c.email,
  c.endereco,
  c.cidade,
  c.estado,
  c.conjuge_nome,
  c.conjuge_cpf,
  NULLIF(c.conjuge_data_nascimento, '')::date,
  c.conjuge_telefone,
  c.conjuge_email,
  c.perfil_renda,
  c.formalizacao_renda,
  c.google_drive_url,
  c.observacoes,
  c.indicacao,
  COALESCE(c.created_at, now()),
  COALESCE(c.updated_at, now())
FROM public.crm_clientes c
WHERE NOT EXISTS (
  SELECT 1 FROM public.crm_clientes_master m WHERE m.legacy_crm_cliente_id = c.id
);

INSERT INTO public.crm_operacoes (
  user_id,
  cliente_id,
  legacy_crm_cliente_id,
  titulo,
  descricao,
  categoria_produto,
  produto,
  subproduto,
  status,
  origem_lead,
  indicador_nome,
  banco_alvo,
  valor_objetivo,
  data_entrada,
  drive_url,
  observacoes_internas,
  modelo_cobranca,
  honorarios_iniciais,
  fee_sucesso_percentual,
  created_at,
  updated_at
)
SELECT
  c.user_id,
  m.id,
  c.id,
  COALESCE(c.produto, 'Operação CRM'),
  c.observacoes,
  CASE
    WHEN c.produto = 'Consultoria Financeira' THEN 'Consultoria Financeira'
    WHEN c.produto IN ('Crédito Pessoal', 'Crédito Consignado', 'Crédito Imobiliário', 'Financiamento Veicular') THEN 'Crédito PF'
    WHEN c.produto IN ('Capital de Giro', 'Crédito Rural') THEN 'Crédito PJ'
    ELSE 'Outros'
  END,
  COALESCE(c.produto, 'Não definido'),
  c.subproduto,
  CASE c.status::text
    WHEN 'prospeccao' THEN 'lead_novo'::public.crm_operacao_status
    WHEN 'analise_documental' THEN 'analise_documental'::public.crm_operacao_status
    WHEN 'em_negociacao' THEN 'em_negociacao'::public.crm_operacao_status
    WHEN 'aprovado' THEN 'aprovado'::public.crm_operacao_status
    WHEN 'em_fechamento' THEN 'em_fechamento'::public.crm_operacao_status
    WHEN 'contrato_assinado' THEN 'contrato_assinado'::public.crm_operacao_status
    WHEN 'concluido' THEN 'concluido'::public.crm_operacao_status
    WHEN 'cancelado' THEN 'cancelado'::public.crm_operacao_status
    WHEN 'analise_inicial' THEN 'analise_inicial'::public.crm_operacao_status
    WHEN 'acompanhamento' THEN 'acompanhamento'::public.crm_operacao_status
    ELSE 'lead_novo'::public.crm_operacao_status
  END,
  c.indicacao,
  c.comissao_indicador,
  c.banco,
  c.valor,
  COALESCE(NULLIF(c.data_entrada, '')::date, CURRENT_DATE),
  c.google_drive_url,
  c.observacoes,
  CASE
    WHEN COALESCE(c.honorarios_iniciais, 0) > 0 AND COALESCE(c.comissao_percentual, 0) > 0 THEN 'hibrido'::public.crm_modelo_cobranca
    WHEN COALESCE(c.honorarios_iniciais, 0) > 0 THEN 'honorarios_mensalidade'::public.crm_modelo_cobranca
    WHEN COALESCE(c.comissao_percentual, 0) > 0 THEN 'fee_sucesso'::public.crm_modelo_cobranca
    ELSE NULL
  END,
  c.honorarios_iniciais,
  c.comissao_percentual,
  COALESCE(c.created_at, now()),
  COALESCE(c.updated_at, now())
FROM public.crm_clientes c
JOIN public.crm_clientes_master m ON m.legacy_crm_cliente_id = c.id
WHERE NOT EXISTS (
  SELECT 1 FROM public.crm_operacoes o WHERE o.legacy_crm_cliente_id = c.id
);