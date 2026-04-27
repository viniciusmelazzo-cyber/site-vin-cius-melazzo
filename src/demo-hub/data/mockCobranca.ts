// Mock data — Melazzo Consultoria · Demo Inadimplência & Cobrança
// Cliente fictício: Sartini Financeira — Crédito direto ao consumidor (CDC)
// Carteira ativa: R$ 48,2M · Inadimplência: 8,4% · Equipe: 18 operadores

export const empresa = {
  nome: "Sartini Financeira",
  segmento: "Crédito Direto ao Consumidor",
  cidade: "Ribeirão Preto · SP",
  carteiraAtiva: 48_200_000,
  inadimplencia: 8.4,
  ticketMedio: 4_850,
  contratos: 9930,
  equipe: 18,
  desde: "2014",
};

export const fmt = (v: number) =>
  `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
export const fmtK = (v: number) =>
  v >= 1_000_000 ? `R$ ${(v / 1_000_000).toFixed(1)}M` : `R$ ${(v / 1000).toFixed(0)}k`;
export const pct = (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`;

// ─── Visão Geral — KPIs ──────────────────────────────────────────
export const kpisVisaoGeral = [
  { label: "Carteira Ativa", value: 48_200_000, prev: 46_100_000, format: "money" },
  { label: "Inadimplência (90+)", value: 8.4, prev: 9.1, format: "pct", inverse: true },
  { label: "Recuperado no Mês", value: 2_180_000, prev: 1_920_000, format: "money" },
  { label: "PDD Acumulada", value: 3_840_000, prev: 4_020_000, format: "money", inverse: true },
];

// Evolução mensal — recuperação vs novos inadimplentes
export const evolucaoMensal = [
  { mes: "Jan", recuperado: 1_640_000, novos: 1_820_000, carteira: 44_200_000 },
  { mes: "Fev", recuperado: 1_780_000, novos: 1_910_000, carteira: 44_800_000 },
  { mes: "Mar", recuperado: 1_920_000, novos: 1_740_000, carteira: 45_400_000 },
  { mes: "Abr", recuperado: 2_040_000, novos: 1_680_000, carteira: 46_100_000 },
  { mes: "Mai", recuperado: 2_180_000, novos: 1_580_000, carteira: 46_800_000 },
  { mes: "Jun", recuperado: 2_320_000, novos: 1_490_000, carteira: 47_400_000 },
  { mes: "Jul", recuperado: 2_180_000, novos: 1_620_000, carteira: 48_200_000 },
];

// ─── Carteira & Aging ────────────────────────────────────────────
export const aging = [
  { faixa: "A vencer", valor: 32_400_000, contratos: 6840, pdd: 0, color: "hsl(var(--finance-positive))" },
  { faixa: "1-30 dias", valor: 6_280_000, contratos: 1320, pdd: 314_000, color: "hsl(var(--finance-neutral))" },
  { faixa: "31-60 dias", valor: 3_140_000, contratos: 680, pdd: 471_000, color: "hsl(var(--gold))" },
  { faixa: "61-90 dias", valor: 1_980_000, contratos: 420, pdd: 594_000, color: "hsl(var(--finance-warning))" },
  { faixa: "91-180 dias", valor: 2_840_000, contratos: 480, pdd: 1_420_000, color: "hsl(var(--cobranca))" },
  { faixa: "180+ dias", valor: 1_560_000, contratos: 190, pdd: 1_041_000, color: "hsl(var(--finance-negative))" },
];

export const carteiraPorProduto = [
  { produto: "CDC Veículo", valor: 22_400_000, share: 46.5 },
  { produto: "Crédito Pessoal", valor: 14_800_000, share: 30.7 },
  { produto: "Refinanciamento", valor: 7_200_000, share: 14.9 },
  { produto: "Consignado", valor: 3_800_000, share: 7.9 },
];

// ─── Carteira detalhada (top devedores) ──────────────────────────
export const topDevedores = [
  { id: "CT-7842", cliente: "Auto Center Pinheiros LTDA", valor: 184_200, atraso: 142, fase: "Jurídico", produto: "CDC Veículo" },
  { id: "CT-6391", cliente: "Roberto Almeida Silva", valor: 98_400, atraso: 96, fase: "Acordo", produto: "Crédito Pessoal" },
  { id: "CT-8120", cliente: "Marcia Santos ME", valor: 76_800, atraso: 78, fase: "Negociação", produto: "Refinanciamento" },
  { id: "CT-5847", cliente: "João Carlos Pereira", valor: 64_200, atraso: 124, fase: "Jurídico", produto: "CDC Veículo" },
  { id: "CT-9012", cliente: "Transportes Veloz LTDA", valor: 58_700, atraso: 62, fase: "Negociação", produto: "CDC Veículo" },
  { id: "CT-7234", cliente: "Ana Paula Rodrigues", valor: 42_100, atraso: 48, fase: "Cobrança ativa", produto: "Crédito Pessoal" },
  { id: "CT-6589", cliente: "Marcos Antônio Lima", valor: 38_900, atraso: 35, fase: "Cobrança ativa", produto: "Consignado" },
  { id: "CT-8945", cliente: "Lucia Helena Martins", valor: 29_400, atraso: 84, fase: "Acordo", produto: "Refinanciamento" },
];

// ─── Kanban de Acordos ───────────────────────────────────────────
export const kanbanAcordos = {
  "Triagem": [
    { id: "AC-001", cliente: "Roberto Almeida", valor: 98_400, atraso: 96, operador: "MR", prob: 65 },
    { id: "AC-002", cliente: "João Carlos Pereira", valor: 64_200, atraso: 124, operador: "FS", prob: 48 },
    { id: "AC-003", cliente: "Ana Paula R.", valor: 42_100, atraso: 48, operador: "MR", prob: 78 },
  ],
  "Negociação": [
    { id: "AC-004", cliente: "Marcia Santos ME", valor: 76_800, atraso: 78, operador: "PL", prob: 72 },
    { id: "AC-005", cliente: "Transportes Veloz", valor: 58_700, atraso: 62, operador: "PL", prob: 68 },
    { id: "AC-006", cliente: "Lucia Helena M.", valor: 29_400, atraso: 84, operador: "FS", prob: 81 },
    { id: "AC-007", cliente: "Marcos A. Lima", valor: 38_900, atraso: 35, operador: "MR", prob: 84 },
  ],
  "Proposta enviada": [
    { id: "AC-008", cliente: "Carlos Eduardo S.", valor: 24_800, atraso: 56, operador: "PL", prob: 76 },
    { id: "AC-009", cliente: "Rita de Cássia O.", valor: 18_400, atraso: 42, operador: "FS", prob: 88 },
  ],
  "Acordo fechado": [
    { id: "AC-010", cliente: "Pedro Henrique L.", valor: 31_200, atraso: 0, operador: "MR", prob: 100 },
    { id: "AC-011", cliente: "Sandra Aparecida", valor: 22_600, atraso: 0, operador: "PL", prob: 100 },
    { id: "AC-012", cliente: "Wagner dos Santos", valor: 14_800, atraso: 0, operador: "FS", prob: 100 },
  ],
};

// ─── Simulador de Acordo (cenários pré-calculados) ───────────────
export const simuladorCenarios = [
  {
    nome: "À vista com desconto",
    desconto: 35,
    parcelas: 1,
    valorOriginal: 64_200,
    valorAcordo: 41_730,
    valorPresente: 41_730,
    aceitacao: 42,
    recomendado: true,
  },
  {
    nome: "Entrada + 6x",
    desconto: 18,
    parcelas: 6,
    valorOriginal: 64_200,
    valorAcordo: 52_644,
    valorPresente: 48_120,
    aceitacao: 68,
    recomendado: true,
  },
  {
    nome: "Entrada + 12x",
    desconto: 8,
    parcelas: 12,
    valorOriginal: 64_200,
    valorAcordo: 59_064,
    valorPresente: 49_840,
    aceitacao: 78,
    recomendado: false,
  },
  {
    nome: "24x sem entrada",
    desconto: 0,
    parcelas: 24,
    valorOriginal: 64_200,
    valorAcordo: 64_200,
    valorPresente: 47_280,
    aceitacao: 84,
    recomendado: false,
  },
];

// ─── Performance da Equipe ───────────────────────────────────────
export const equipe = [
  { nome: "Marina Ribeiro", iniciais: "MR", contatos: 412, acordos: 38, recuperado: 412_800, taxa: 9.2, meta: 100 },
  { nome: "Fernando Souza", iniciais: "FS", contatos: 384, acordos: 32, recuperado: 348_200, taxa: 8.3, meta: 88 },
  { nome: "Paula Lima", iniciais: "PL", contatos: 421, acordos: 41, recuperado: 458_400, taxa: 9.7, meta: 112 },
  { nome: "Carlos Mendes", iniciais: "CM", contatos: 298, acordos: 24, recuperado: 268_400, taxa: 8.1, meta: 76 },
  { nome: "Juliana Castro", iniciais: "JC", contatos: 356, acordos: 31, recuperado: 312_800, taxa: 8.7, meta: 92 },
  { nome: "Ricardo Tavares", iniciais: "RT", contatos: 312, acordos: 26, recuperado: 248_200, taxa: 8.3, meta: 82 },
];

// ─── Régua de Cobrança ───────────────────────────────────────────
export const reguaCobranca = [
  { dia: "D-3", canal: "SMS", titulo: "Lembrete amistoso", taxa: 28, custo: 0.12, ativa: true },
  { dia: "D+1", canal: "WhatsApp", titulo: "Vencido — boleto 2ª via", taxa: 42, custo: 0.08, ativa: true },
  { dia: "D+5", canal: "E-mail", titulo: "Notificação formal", taxa: 18, custo: 0.04, ativa: true },
  { dia: "D+10", canal: "Ligação", titulo: "Contato ativo do operador", taxa: 38, custo: 4.20, ativa: true },
  { dia: "D+15", canal: "WhatsApp", titulo: "Proposta de acordo", taxa: 52, custo: 0.08, ativa: true },
  { dia: "D+30", canal: "Ligação", titulo: "Negociação dirigida", taxa: 44, custo: 4.20, ativa: true },
  { dia: "D+45", canal: "Carta", titulo: "Notificação extrajudicial", taxa: 22, custo: 12.40, ativa: true },
  { dia: "D+60", canal: "Serasa", titulo: "Negativação", taxa: 31, custo: 8.80, ativa: true },
  { dia: "D+90", canal: "Jurídico", titulo: "Encaminhamento ao escritório", taxa: 18, custo: 320.00, ativa: true },
];

// ─── Acordos firmados (histórico) ────────────────────────────────
export const acordosFirmados = [
  { mes: "Jan", quantidade: 142, valor: 1_640_000, taxaCumprimento: 78 },
  { mes: "Fev", quantidade: 158, valor: 1_780_000, taxaCumprimento: 81 },
  { mes: "Mar", quantidade: 174, valor: 1_920_000, taxaCumprimento: 79 },
  { mes: "Abr", quantidade: 188, valor: 2_040_000, taxaCumprimento: 83 },
  { mes: "Mai", quantidade: 196, valor: 2_180_000, taxaCumprimento: 85 },
  { mes: "Jun", quantidade: 212, valor: 2_320_000, taxaCumprimento: 84 },
  { mes: "Jul", quantidade: 198, valor: 2_180_000, taxaCumprimento: 86 },
];

// ─── Visão Jurídica ──────────────────────────────────────────────
export const juridico = {
  totalProcessos: 84,
  valorEmDisputa: 4_280_000,
  recuperadoJudicial: 1_120_000,
  taxaSucesso: 62,
  tempoMedioDias: 218,
  porFase: [
    { fase: "Análise inicial", quantidade: 12, valor: 480_000 },
    { fase: "Notificação", quantidade: 18, valor: 740_000 },
    { fase: "Ação ajuizada", quantidade: 32, valor: 1_840_000 },
    { fase: "Penhora", quantidade: 14, valor: 720_000 },
    { fase: "Execução", quantidade: 8, valor: 500_000 },
  ],
};

// ─── Insights de IA ──────────────────────────────────────────────
export const insightsIA = [
  {
    tipo: "oportunidade" as const,
    titulo: "Janela de recuperação 60-90 dias",
    descricao:
      "Há 420 contratos na faixa 61-90d com perfil semelhante a acordos fechados em junho (84% de aceitação). Recomenda-se campanha dirigida com proposta de entrada + 6x.",
    impacto: "Potencial: R$ 1,3M",
  },
  {
    tipo: "alerta" as const,
    titulo: "CDC Veículo concentra 67% da inadimplência crítica",
    descricao:
      "A faixa 91-180d está concentrada em contratos de CDC Veículo originados entre Set/24 e Nov/24. Revisar política de score na originação.",
    impacto: "Exposição: R$ 1,9M",
  },
  {
    tipo: "performance" as const,
    titulo: "Paula Lima lidera taxa de conversão",
    descricao:
      "Operadora PL tem 9,7% de conversão (média da equipe: 8,7%). Sugerido replicar seu script de abordagem inicial nos demais operadores.",
    impacto: "Ganho estimado: +R$ 180k/mês",
  },
];
