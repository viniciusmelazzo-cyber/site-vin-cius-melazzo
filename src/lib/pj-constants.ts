// PJ Clients Constants

export type PjStatus = 'ativo' | 'inativo' | 'prospeccao';
export type RecebimentoTipo = 'honorarios_iniciais' | 'mensalidade' | 'avulso';
export type RecebimentoFrequencia = 'mensal' | 'quinzenal' | 'semanal' | 'unica';
export type RecebimentoStatus = 'pendente' | 'pago' | 'atrasado' | 'cancelado';
export type HistoricoTipo = 'nota' | 'demanda' | 'reuniao' | 'documento' | 'pagamento';
export type CompromissoTipo = 'reuniao' | 'prazo' | 'tarefa' | 'lembrete';
export type CompromissoStatus = 'pendente' | 'concluido' | 'cancelado';

export interface ClientePj {
  id: string;
  user_id: string;
  nome: string;
  cnpj?: string | null;
  razao_social?: string | null;
  responsavel?: string | null;
  telefone?: string | null;
  email?: string | null;
  endereco?: string | null;
  cidade?: string | null;
  estado?: string | null;
  segmento?: string | null;
  atividade?: string | null;
  status: PjStatus;
  observacoes?: string | null;
  google_drive_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PjRecebimento {
  id: string;
  cliente_pj_id: string;
  tipo: RecebimentoTipo;
  descricao?: string | null;
  valor: number;
  recorrente: boolean;
  frequencia: RecebimentoFrequencia;
  parcelas_total?: number | null;
  parcelas_pagas?: number | null;
  data_inicio?: string | null;
  data_vencimento?: string | null;
  status: RecebimentoStatus;
  created_at: string;
  updated_at: string;
}

export interface PjHistorico {
  id: string;
  cliente_pj_id: string;
  user_id: string;
  tipo: HistoricoTipo;
  titulo: string;
  descricao?: string | null;
  created_at: string;
}

export interface Compromisso {
  id: string;
  user_id: string;
  titulo: string;
  descricao?: string | null;
  data_hora: string;
  duracao_minutos: number;
  cliente_pj_id?: string | null;
  tipo: CompromissoTipo;
  status: CompromissoStatus;
  google_calendar_id?: string | null;
  created_at: string;
  updated_at: string;
  // joined
  cliente_nome?: string;
}

export const PJ_STATUS_OPTIONS: { value: PjStatus; label: string }[] = [
  { value: 'ativo', label: 'Ativo' },
  { value: 'inativo', label: 'Inativo' },
  { value: 'prospeccao', label: 'Prospecção' },
];

export const RECEBIMENTO_TIPO_OPTIONS: { value: RecebimentoTipo; label: string }[] = [
  { value: 'honorarios_iniciais', label: 'Honorários Iniciais' },
  { value: 'mensalidade', label: 'Mensalidade' },
  { value: 'avulso', label: 'Avulso' },
];

export const RECEBIMENTO_FREQUENCIA_OPTIONS: { value: RecebimentoFrequencia; label: string }[] = [
  { value: 'mensal', label: 'Mensal' },
  { value: 'quinzenal', label: 'Quinzenal' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'unica', label: 'Única' },
];

export const RECEBIMENTO_STATUS_OPTIONS: { value: RecebimentoStatus; label: string }[] = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'pago', label: 'Pago' },
  { value: 'atrasado', label: 'Atrasado' },
  { value: 'cancelado', label: 'Cancelado' },
];

export const HISTORICO_TIPO_OPTIONS: { value: HistoricoTipo; label: string }[] = [
  { value: 'nota', label: 'Nota' },
  { value: 'demanda', label: 'Demanda' },
  { value: 'reuniao', label: 'Reunião' },
  { value: 'documento', label: 'Documento' },
  { value: 'pagamento', label: 'Pagamento' },
];

export const COMPROMISSO_TIPO_OPTIONS: { value: CompromissoTipo; label: string }[] = [
  { value: 'reuniao', label: 'Reunião' },
  { value: 'prazo', label: 'Prazo' },
  { value: 'tarefa', label: 'Tarefa' },
  { value: 'lembrete', label: 'Lembrete' },
];

export const SEGMENTO_OPTIONS = [
  'Agronegócio',
  'Construção Civil',
  'Comércio',
  'Indústria',
  'Serviços',
  'Tecnologia',
  'Saúde',
  'Educação',
  'Outro',
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
  try { return new Date(dateStr).toLocaleDateString('pt-BR'); } catch { return dateStr; }
}

export function getStatusConfig(status: PjStatus) {
  const map: Record<PjStatus, { label: string; color: string; bg: string }> = {
    ativo: { label: 'Ativo', color: 'text-emerald-700', bg: 'bg-emerald-100' },
    inativo: { label: 'Inativo', color: 'text-red-700', bg: 'bg-red-100' },
    prospeccao: { label: 'Prospecção', color: 'text-blue-700', bg: 'bg-blue-100' },
  };
  return map[status] || { label: status, color: 'text-gray-700', bg: 'bg-gray-100' };
}

export function getRecebimentoStatusConfig(status: RecebimentoStatus) {
  const map: Record<RecebimentoStatus, { label: string; color: string; bg: string }> = {
    pendente: { label: 'Pendente', color: 'text-amber-700', bg: 'bg-amber-100' },
    pago: { label: 'Pago', color: 'text-emerald-700', bg: 'bg-emerald-100' },
    atrasado: { label: 'Atrasado', color: 'text-red-700', bg: 'bg-red-100' },
    cancelado: { label: 'Cancelado', color: 'text-gray-700', bg: 'bg-gray-100' },
  };
  return map[status] || { label: status, color: 'text-gray-700', bg: 'bg-gray-100' };
}
