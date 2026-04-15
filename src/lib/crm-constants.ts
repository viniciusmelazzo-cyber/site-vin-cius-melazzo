// CRM Pipeline & Constants — adapted from Dashboard Life for Melazzo

export type CrmPipelineStatus =
  | 'prospeccao'
  | 'analise_documental'
  | 'em_negociacao'
  | 'aprovado'
  | 'em_fechamento'
  | 'contrato_assinado'
  | 'concluido'
  | 'cancelado'
  | 'analise_inicial'
  | 'acompanhamento';

export interface CrmCliente {
  id: string;
  user_id: string;
  nome: string;
  cpf?: string | null;
  rg?: string | null;
  profissao?: string | null;
  telefones?: string | null;
  email?: string | null;
  endereco?: string | null;
  cidade?: string | null;
  estado?: string | null;
  data_nascimento?: string | null;
  estado_civil?: string | null;
  regime_casamento?: string | null;
  conjuge_nome?: string | null;
  conjuge_cpf?: string | null;
  conjuge_data_nascimento?: string | null;
  conjuge_telefone?: string | null;
  conjuge_email?: string | null;
  conjuge_endereco?: string | null;
  conjuge_cidade?: string | null;
  conjuge_estado?: string | null;
  perfil_renda?: string | null;
  formalizacao_renda?: string | null;
  produto?: string | null;
  subproduto?: string | null;
  banco?: string | null;
  valor?: number | null;
  status: CrmPipelineStatus;
  comissao_tipo?: string | null;
  comissao_percentual?: number | null;
  honorarios_iniciais?: number | null;
  data_entrada?: string | null;
  data_indicacao?: string | null;
  indicacao?: string | null;
  comissao_indicador?: string | null;
  google_drive_url?: string | null;
  observacoes?: string | null;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CrmHistorico {
  id: string;
  cliente_id: string;
  user_id: string;
  tipo: string;
  titulo: string;
  descricao?: string | null;
  status_anterior?: string | null;
  status_novo?: string | null;
  created_at: string;
}

export const PIPELINE_STATUSES: { value: CrmPipelineStatus; label: string }[] = [
  { value: 'prospeccao', label: 'Prospecção' },
  { value: 'analise_documental', label: 'Análise Documental' },
  { value: 'em_negociacao', label: 'Em Negociação' },
  { value: 'aprovado', label: 'Aprovado' },
  { value: 'em_fechamento', label: 'Em Fechamento' },
  { value: 'contrato_assinado', label: 'Contrato Assinado' },
  { value: 'concluido', label: 'Concluído' },
  { value: 'cancelado', label: 'Cancelado' },
];

export const CONSULTORIA_STATUSES: { value: CrmPipelineStatus; label: string }[] = [
  { value: 'analise_inicial', label: 'Análise Inicial' },
  { value: 'acompanhamento', label: 'Acompanhamento' },
  { value: 'concluido', label: 'Concluído' },
  { value: 'cancelado', label: 'Cancelado' },
];

export const KANBAN_STATUSES: CrmPipelineStatus[] = [
  'prospeccao',
  'analise_documental',
  'em_negociacao',
  'aprovado',
  'em_fechamento',
  'contrato_assinado',
];

export const PRODUTO_OPTIONS = [
  'Crédito Rural',
  'Crédito Imobiliário',
  'Crédito Consignado',
  'Crédito Pessoal',
  'Financiamento Veicular',
  'Capital de Giro',
  'Consultoria Financeira',
  'Outro',
];

export const SUBPRODUTO_MAP: Record<string, string[]> = {
  'Crédito Rural': ['Custeio', 'Investimento', 'Comercialização', 'Industrialização'],
  'Crédito Imobiliário': ['SFH', 'SFI', 'MCMV', 'Home Equity'],
  'Crédito Consignado': ['INSS', 'Servidor Público', 'Privado', 'FGTS'],
  'Crédito Pessoal': ['CDC', 'Refinanciamento', 'Antecipação'],
  'Financiamento Veicular': ['Novo', 'Usado', 'Refinanciamento'],
  'Capital de Giro': ['Conta Garantida', 'Desconto de Duplicatas', 'Antecipação de Recebíveis'],
  'Consultoria Financeira': ['Planejamento', 'Reestruturação', 'Investimentos'],
  Outro: ['Outro'],
};

export const ESTADO_CIVIL_OPTIONS = [
  'Solteiro(a)',
  'Casado(a)',
  'União Estável',
  'Divorciado(a)',
  'Viúvo(a)',
];

export const PERFIL_RENDA_OPTIONS = [
  'Assalariado',
  'Autônomo',
  'Empresário',
  'Servidor Público',
  'Aposentado/Pensionista',
  'Produtor Rural',
];

export const FORMALIZACAO_RENDA_OPTIONS = [
  'CLT',
  'Pró-labore',
  'DECORE',
  'IRPF',
  'Nota Fiscal',
  'Extrato Bancário',
];

export const COMISSAO_TIPO_OPTIONS = [
  'Percentual sobre valor',
  'Valor fixo',
  'Honorários + Percentual',
];

export const ESTADOS_BR = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
];

export function formatCurrency(value: number | null | undefined): string {
  if (value == null) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  } catch {
    return dateStr;
  }
}

export function getStatusConfig(status: CrmPipelineStatus) {
  const map: Record<CrmPipelineStatus, { label: string; color: string; bg: string }> = {
    prospeccao: { label: 'Prospecção', color: 'text-blue-700', bg: 'bg-blue-100' },
    analise_documental: { label: 'Análise Documental', color: 'text-amber-700', bg: 'bg-amber-100' },
    em_negociacao: { label: 'Em Negociação', color: 'text-purple-700', bg: 'bg-purple-100' },
    aprovado: { label: 'Aprovado', color: 'text-emerald-700', bg: 'bg-emerald-100' },
    em_fechamento: { label: 'Em Fechamento', color: 'text-orange-700', bg: 'bg-orange-100' },
    contrato_assinado: { label: 'Contrato Assinado', color: 'text-teal-700', bg: 'bg-teal-100' },
    concluido: { label: 'Concluído', color: 'text-green-700', bg: 'bg-green-100' },
    cancelado: { label: 'Cancelado', color: 'text-red-700', bg: 'bg-red-100' },
    analise_inicial: { label: 'Análise Inicial', color: 'text-sky-700', bg: 'bg-sky-100' },
    acompanhamento: { label: 'Acompanhamento', color: 'text-indigo-700', bg: 'bg-indigo-100' },
  };
  return map[status] || { label: status, color: 'text-gray-700', bg: 'bg-gray-100' };
}
