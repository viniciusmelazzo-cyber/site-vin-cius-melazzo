export type CrmTipoPessoa = "pf" | "pj";
export type CrmPrioridade = "baixa" | "media" | "alta" | "critica";
export type CrmRisco = "baixo" | "moderado" | "alto";
export type CrmOperacaoStatus =
  | "lead_novo"
  | "contato_inicial"
  | "triagem"
  | "analise_inicial"
  | "analise_documental"
  | "viabilidade"
  | "proposta_enviada"
  | "em_negociacao"
  | "aprovado"
  | "em_fechamento"
  | "contrato_assinado"
  | "em_execucao"
  | "acompanhamento"
  | "concluido"
  | "cancelado"
  | "suspenso";

export type CrmModeloCobranca =
  | "honorarios_mensalidade"
  | "fee_sucesso"
  | "hibrido"
  | "fixo_parcelado";

export type CrmFeeTipo = "percentual" | "fixo";
export type CrmRecebivelStatus = "previsto" | "pendente" | "pago" | "vencido" | "cancelado";
export type CrmRecebivelTipo = "honorario_inicial" | "mensalidade" | "fee_sucesso" | "parcela_fixa" | "ajuste";
export type CrmEventoTipo = "nota" | "status" | "pendencia" | "documento" | "financeiro" | "agenda" | "sistema";

export interface CrmClienteMaster {
  id: string;
  user_id: string;
  legacy_crm_cliente_id?: string | null;
  tipo_pessoa: CrmTipoPessoa;
  nome: string;
  cpf?: string | null;
  cnpj?: string | null;
  rg_ie?: string | null;
  data_nascimento?: string | null;
  nacionalidade?: string | null;
  profissao?: string | null;
  estado_civil?: string | null;
  regime_bens?: string | null;
  telefone_principal?: string | null;
  telefone_secundario?: string | null;
  email_principal?: string | null;
  cep?: string | null;
  endereco?: string | null;
  cidade?: string | null;
  estado?: string | null;
  nome_conjuge?: string | null;
  cpf_conjuge?: string | null;
  data_nascimento_conjuge?: string | null;
  telefone_conjuge?: string | null;
  email_conjuge?: string | null;
  perfil_renda?: string | null;
  formalizacao_renda?: string | null;
  renda_declarada?: number | null;
  renda_percebida?: number | null;
  notas_renda?: string | null;
  sazonalidade?: string | null;
  empresas_relacionadas?: string | null;
  funcao_empresarial?: string | null;
  participacao_societaria?: string | null;
  grupo_economico?: string | null;
  relacionamentos_bancarios?: string | null;
  patrimonio_resumo?: string | null;
  garantias_resumo?: string | null;
  checklist_documental?: Record<string, unknown> | null;
  estrategia_resumo?: string | null;
  riscos_observacoes?: string | null;
  google_drive_url?: string | null;
  origem_canal?: string | null;
  origem_parceiro?: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface CrmOperacao {
  id: string;
  user_id: string;
  cliente_id: string;
  legacy_crm_cliente_id?: string | null;
  titulo: string;
  descricao?: string | null;
  categoria_produto: string;
  produto: string;
  subproduto?: string | null;
  status: CrmOperacaoStatus;
  prioridade: CrmPrioridade;
  risco: CrmRisco;
  origem_lead?: string | null;
  indicador_nome?: string | null;
  banco_alvo?: string | null;
  valor_objetivo?: number | null;
  valor_aprovado?: number | null;
  data_entrada: string;
  data_previsao_fechamento?: string | null;
  proxima_acao?: string | null;
  proxima_acao_data?: string | null;
  responsavel_user_id?: string | null;
  drive_url?: string | null;
  observacoes_internas?: string | null;
  modelo_cobranca?: CrmModeloCobranca | null;
  honorarios_iniciais?: number | null;
  honorarios_data_vencimento?: string | null;
  mensalidade_valor?: number | null;
  mensalidade_inicio?: string | null;
  mensalidade_frequencia?: string | null;
  mensalidade_quantidade?: number | null;
  fee_sucesso_tipo?: CrmFeeTipo | null;
  fee_sucesso_valor?: number | null;
  fee_sucesso_percentual?: number | null;
  fee_sucesso_gatilho_status?: CrmOperacaoStatus | null;
  parcelas_fixas_quantidade?: number | null;
  parcelas_fixas_valor?: number | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface CrmRecebivel {
  id: string;
  user_id: string;
  cliente_id: string;
  operacao_id: string;
  tipo: CrmRecebivelTipo;
  status: CrmRecebivelStatus;
  descricao?: string | null;
  valor: number;
  data_competencia?: string | null;
  data_vencimento: string;
  data_pagamento?: string | null;
  origem_automatica: boolean;
  evento_gatilho?: string | null;
  parcela_atual?: number | null;
  parcelas_total?: number | null;
  created_at: string;
  updated_at: string;
}

export interface CrmEvento {
  id: string;
  user_id: string;
  cliente_id?: string | null;
  operacao_id: string;
  tipo: CrmEventoTipo;
  titulo: string;
  descricao?: string | null;
  status_anterior?: CrmOperacaoStatus | null;
  status_novo?: CrmOperacaoStatus | null;
  prazo?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at: string;
}

export interface CrmCompromisso {
  id: string;
  user_id: string;
  cliente_pj_id?: string | null;
  cliente_id?: string | null;
  operacao_id?: string | null;
  titulo: string;
  tipo: string;
  status: string;
  descricao?: string | null;
  data_hora: string;
  duracao_minutos?: number | null;
  google_calendar_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CrmDashboardMetrics {
  clientesAtivos: number;
  operacoesAndamento: number;
  aReceberMes: number;
  recebidoMes: number;
  emAtraso: number;
  compromissosAmanha: number;
  projetosCriticos: number;
}

export const CRM_STATUS_OPTIONS: { value: CrmOperacaoStatus; label: string }[] = [
  { value: "lead_novo", label: "Lead novo" },
  { value: "contato_inicial", label: "Contato inicial" },
  { value: "triagem", label: "Triagem" },
  { value: "analise_inicial", label: "Análise inicial" },
  { value: "analise_documental", label: "Análise documental" },
  { value: "viabilidade", label: "Viabilidade" },
  { value: "proposta_enviada", label: "Proposta enviada" },
  { value: "em_negociacao", label: "Em negociação" },
  { value: "aprovado", label: "Aprovado" },
  { value: "em_fechamento", label: "Em fechamento" },
  { value: "contrato_assinado", label: "Contrato assinado" },
  { value: "em_execucao", label: "Em execução" },
  { value: "acompanhamento", label: "Acompanhamento" },
  { value: "concluido", label: "Concluído" },
  { value: "cancelado", label: "Cancelado" },
  { value: "suspenso", label: "Suspenso" },
];

export const CRM_STATUS_LABELS = Object.fromEntries(CRM_STATUS_OPTIONS.map((item) => [item.value, item.label])) as Record<CrmOperacaoStatus, string>;

export const CRM_PRIORIDADE_OPTIONS: { value: CrmPrioridade; label: string }[] = [
  { value: "baixa", label: "Baixa" },
  { value: "media", label: "Média" },
  { value: "alta", label: "Alta" },
  { value: "critica", label: "Crítica" },
];

export const CRM_RISCO_OPTIONS: { value: CrmRisco; label: string }[] = [
  { value: "baixo", label: "Baixo" },
  { value: "moderado", label: "Moderado" },
  { value: "alto", label: "Alto" },
];

export const CRM_MODELO_COBRANCA_OPTIONS: { value: CrmModeloCobranca; label: string }[] = [
  { value: "honorarios_mensalidade", label: "Honorários iniciais + mensalidade" },
  { value: "fee_sucesso", label: "Fee no sucesso" },
  { value: "hibrido", label: "Híbrido" },
  { value: "fixo_parcelado", label: "Valor fixo parcelado" },
];

export const CRM_TIPO_PESSOA_OPTIONS: { value: CrmTipoPessoa; label: string }[] = [
  { value: "pf", label: "Pessoa física" },
  { value: "pj", label: "Pessoa jurídica" },
];

export const CRM_RECEBIVEL_STATUS_LABELS: Record<CrmRecebivelStatus, string> = {
  previsto: "Previsto",
  pendente: "Pendente",
  pago: "Pago",
  vencido: "Vencido",
  cancelado: "Cancelado",
};

export const CRM_RECEBIVEL_TIPO_LABELS: Record<CrmRecebivelTipo, string> = {
  honorario_inicial: "Honorário inicial",
  mensalidade: "Mensalidade",
  fee_sucesso: "Fee de sucesso",
  parcela_fixa: "Parcela fixa",
  ajuste: "Ajuste",
};

export const CRM_PRODUTOS = {
  "Consultoria Financeira": {
    "Consultoria Financeira PF": ["Diagnóstico", "Planejamento", "Reorganização", "Acompanhamento"],
    "Consultoria Financeira PJ": ["Diagnóstico", "Reestruturação", "Gestão", "Acompanhamento"],
  },
  "Crédito PF": {
    Aquisição: ["Imóvel residencial", "Imóvel comercial", "Terreno"],
    "Home Equity": ["Urbano", "Rural", "Capital livre", "Quitação"],
    "Aquisição Veículo": ["Leve", "Utilitário", "Pesado"],
    Consórcio: ["Imóvel", "Veículo", "Serviços"],
  },
  "Crédito PJ": {
    "Home Equity": ["Garantia imobiliária empresarial"],
    "Crédito Empresarial": ["Capital de giro", "Investimento", "Antecipação", "Reestruturação"],
    "CRI e CRA": ["Estruturação", "Captação", "Expansão"],
  },
} as const;

export const CRM_CATEGORIAS = Object.keys(CRM_PRODUTOS);

export function getProdutosByCategoria(categoria?: string | null) {
  if (!categoria || !(categoria in CRM_PRODUTOS)) return [];
  return Object.keys(CRM_PRODUTOS[categoria as keyof typeof CRM_PRODUTOS]);
}

export function getSubprodutos(categoria?: string | null, produto?: string | null) {
  if (!categoria || !produto || !(categoria in CRM_PRODUTOS)) return [];
  const categoriaMap = CRM_PRODUTOS[categoria as keyof typeof CRM_PRODUTOS] as Record<string, readonly string[]>;
  return categoriaMap[produto] ? [...categoriaMap[produto]] : [];
}

export function formatCurrency(value?: number | null) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
}

export function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-BR");
}

export function formatDateTime(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("pt-BR");
}

export function getStatusBadgeClasses(status?: string | null) {
  const map: Record<string, string> = {
    lead_novo: "bg-sky-100 text-sky-700",
    contato_inicial: "bg-blue-100 text-blue-700",
    triagem: "bg-slate-100 text-slate-700",
    analise_inicial: "bg-indigo-100 text-indigo-700",
    analise_documental: "bg-amber-100 text-amber-700",
    viabilidade: "bg-violet-100 text-violet-700",
    proposta_enviada: "bg-fuchsia-100 text-fuchsia-700",
    em_negociacao: "bg-purple-100 text-purple-700",
    aprovado: "bg-emerald-100 text-emerald-700",
    em_fechamento: "bg-orange-100 text-orange-700",
    contrato_assinado: "bg-teal-100 text-teal-700",
    em_execucao: "bg-cyan-100 text-cyan-700",
    acompanhamento: "bg-lime-100 text-lime-700",
    concluido: "bg-green-100 text-green-700",
    cancelado: "bg-red-100 text-red-700",
    suspenso: "bg-zinc-100 text-zinc-700",
    pago: "bg-green-100 text-green-700",
    pendente: "bg-amber-100 text-amber-700",
    vencido: "bg-red-100 text-red-700",
    previsto: "bg-blue-100 text-blue-700",
    cancelado_recebivel: "bg-zinc-100 text-zinc-700",
  };
  return map[status || ""] || "bg-secondary text-foreground";
}

export function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function toDateInputValue(date = new Date()) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function toDateTimeInputValue(date = new Date()) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hour = `${date.getHours()}`.padStart(2, "0");
  const minute = `${date.getMinutes()}`.padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

export function isStatusAtivo(status: CrmOperacaoStatus) {
  return !["concluido", "cancelado", "suspenso"].includes(status);
}

export function normalizeRecebivelStatus(status: CrmRecebivelStatus, dataVencimento: string) {
  if (status === "pago" || status === "cancelado") return status;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dataVencimento);
  due.setHours(0, 0, 0, 0);
  return due < today ? "vencido" : status;
}