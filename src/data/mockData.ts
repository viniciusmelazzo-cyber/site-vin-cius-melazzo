// Mock data — Melazzo Consultoria · Demo
// Cliente fictício: Auto Center Demo (revenda + oficina)

export const cliente = {
  nome: "Auto Center Demo",
  cnpj: "12.345.678/0001-90",
  socio: "Carlos Mendes",
  segmento: "Revenda de Veículos & Oficina",
  cidade: "São Paulo · SP",
  desde: "2018",
};

export const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
export const mesesFull = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

export const fmt = (v: number) =>
  `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
export const fmtK = (v: number) =>
  v >= 1_000_000 ? `R$ ${(v / 1_000_000).toFixed(1)}M` : `R$ ${(v / 1000).toFixed(0)}k`;
export const pct = (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`;

// ─── KPIs Panorama ────────────────────────────────────────────────
export const kpisPanorama = [
  { label: "Faturamento (mês)", value: 487_300, prev: 432_100, format: "money" },
  { label: "Margem Líquida", value: 18.4, prev: 16.1, format: "pct" },
  { label: "Fluxo de Caixa", value: 89_400, prev: 72_500, format: "money" },
  { label: "Endividamento Total", value: 318_000, prev: 342_000, format: "money", inverse: true },
];

// ─── Faturamento últimos 12 meses ─────────────────────────────────
export const faturamento12m = [
  { mes: "Mai/24", revenda: 280_000, oficina: 78_000, total: 358_000 },
  { mes: "Jun/24", revenda: 312_000, oficina: 84_000, total: 396_000 },
  { mes: "Jul/24", revenda: 295_000, oficina: 91_000, total: 386_000 },
  { mes: "Ago/24", revenda: 340_000, oficina: 88_000, total: 428_000 },
  { mes: "Set/24", revenda: 318_000, oficina: 95_000, total: 413_000 },
  { mes: "Out/24", revenda: 365_000, oficina: 102_000, total: 467_000 },
  { mes: "Nov/24", revenda: 388_000, oficina: 98_000, total: 486_000 },
  { mes: "Dez/24", revenda: 412_000, oficina: 105_000, total: 517_000 },
  { mes: "Jan/25", revenda: 298_000, oficina: 89_000, total: 387_000 },
  { mes: "Fev/25", revenda: 326_000, oficina: 94_000, total: 420_000 },
  { mes: "Mar/25", revenda: 348_000, oficina: 108_000, total: 456_000 },
  { mes: "Abr/25", revenda: 372_000, oficina: 115_000, total: 487_000 },
];

// ─── DRE Resumida ─────────────────────────────────────────────────
export const dre = {
  receitaBruta: 487_300,
  deducoes: -42_800,
  receitaLiquida: 444_500,
  cmv: -268_300,
  lucroBruto: 176_200,
  custosFixos: -68_400,
  custosVariaveis: -18_200,
  lucroOperacional: 89_600,
  despFinanceiras: -8_900,
  lucroLiquido: 89_400,
  margemLiquida: 18.4,
};

// ─── Fluxo de Caixa 6 meses ────────────────────────────────────
export const fluxo6m = [
  { mes: "Abr", entradas: 487_000, saidas: 397_600, saldo: 89_400 },
  { mes: "Mai", entradas: 510_000, saidas: 412_000, saldo: 98_000 },
  { mes: "Jun", entradas: 495_000, saidas: 408_500, saldo: 86_500 },
  { mes: "Jul", entradas: 528_000, saidas: 421_000, saldo: 107_000 },
  { mes: "Ago", entradas: 542_000, saidas: 432_800, saldo: 109_200 },
  { mes: "Set", entradas: 518_000, saidas: 425_400, saldo: 92_600 },
];

// ─── Custos Fixos ─────────────────────────────────────────────────
export const custosFixos = [
  { id: 1, descricao: "Aluguel - Loja Matriz", categoria: "Imóvel", valor: 18_500, dia: 5, status: "ativo" },
  { id: 2, descricao: "Folha de Pagamento", categoria: "Pessoal", valor: 32_400, dia: 5, status: "ativo" },
  { id: 3, descricao: "Pró-labore Sócio", categoria: "Pessoal", valor: 12_000, dia: 10, status: "ativo" },
  { id: 4, descricao: "Energia Elétrica", categoria: "Utilities", valor: 4_800, dia: 15, status: "ativo" },
  { id: 5, descricao: "Internet + Telefonia", categoria: "Utilities", valor: 980, dia: 20, status: "ativo" },
  { id: 6, descricao: "Software Gestão (ERP)", categoria: "Tecnologia", valor: 1_450, dia: 8, status: "ativo" },
  { id: 7, descricao: "Contabilidade", categoria: "Serviços", valor: 2_800, dia: 10, status: "ativo" },
  { id: 8, descricao: "Seguro Patrimonial", categoria: "Seguros", valor: 1_950, dia: 18, status: "ativo" },
  { id: 9, descricao: "IPTU + Taxas", categoria: "Tributos", valor: 3_200, dia: 12, status: "ativo" },
  { id: 10, descricao: "Marketing Digital", categoria: "Marketing", valor: 4_500, dia: 25, status: "ativo" },
  { id: 11, descricao: "Limpeza & Manutenção", categoria: "Operacional", valor: 1_800, dia: 22, status: "ativo" },
  { id: 12, descricao: "Vale Refeição", categoria: "Pessoal", valor: 4_200, dia: 5, status: "ativo" },
];

// ─── Custos Variáveis ─────────────────────────────────────────────
export const custosVariaveis = [
  { id: 1, descricao: "Comissão Vendedores", categoria: "Vendas", percentual: 2.5, valorMes: 12_180 },
  { id: 2, descricao: "Frete / Transporte Veículos", categoria: "Logística", percentual: 0.8, valorMes: 3_900 },
  { id: 3, descricao: "Documentação DETRAN", categoria: "Burocracia", percentual: 0.6, valorMes: 2_920 },
  { id: 4, descricao: "Combustível Frota", categoria: "Operacional", percentual: 0.4, valorMes: 1_950 },
  { id: 5, descricao: "Embalagens Oficina", categoria: "Suprimentos", percentual: 0.2, valorMes: 980 },
];

// ─── Endividamento ─────────────────────────────────────────────────
export const dividas = [
  { id: 1, credor: "Banco do Brasil", tipo: "Capital de Giro", valor: 120_000, parcelaMensal: 4_850, parcelasRestantes: 28, taxaMes: 1.85, garantia: "Aval", status: "ativa" },
  { id: 2, credor: "Itaú", tipo: "Financiamento Veicular", valor: 85_000, parcelaMensal: 2_980, parcelasRestantes: 32, taxaMes: 1.42, garantia: "Alienação", status: "ativa" },
  { id: 3, credor: "Sicoob", tipo: "Cheque Especial", valor: 28_000, parcelaMensal: 0, parcelasRestantes: 0, taxaMes: 5.8, garantia: "Sem garantia", status: "atencao" },
  { id: 4, credor: "BNDES", tipo: "Modernização", valor: 65_000, parcelaMensal: 1_820, parcelasRestantes: 42, taxaMes: 0.95, garantia: "Equipamento", status: "ativa" },
  { id: 5, credor: "Cartão Empresa", tipo: "Rotativo", valor: 20_000, parcelaMensal: 3_400, parcelasRestantes: 6, taxaMes: 12.5, garantia: "Sem garantia", status: "critica" },
];

// ─── Pipeline Vendas ─────────────────────────────────────────────
export const pipelineFases = [
  { fase: "Lead", qtde: 48, valor: 1_840_000 },
  { fase: "Qualificado", qtde: 22, valor: 980_000 },
  { fase: "Proposta", qtde: 11, valor: 520_000 },
  { fase: "Negociação", qtde: 7, valor: 340_000 },
  { fase: "Fechado", qtde: 4, valor: 187_000 },
];

export const vendedores = [
  { nome: "Ana Paula", vendas: 12, receita: 432_000, meta: 400_000 },
  { nome: "Roberto Silva", vendas: 9, receita: 298_000, meta: 350_000 },
  { nome: "Marcos Lima", vendas: 14, receita: 512_000, meta: 400_000 },
  { nome: "Juliana Costa", vendas: 7, receita: 215_000, meta: 300_000 },
];

// ─── Estoque Veículos ─────────────────────────────────────────────
export const estoqueVeiculos = [
  { id: 1, modelo: "Honda Civic EXL 2022", placa: "ABC-1234", ano: 2022, km: 38_000, custoAquisicao: 98_000, precoVenda: 124_900, diasEstoque: 18, status: "disponivel" },
  { id: 2, modelo: "Toyota Corolla XEi 2021", placa: "DEF-5678", ano: 2021, km: 52_000, custoAquisicao: 89_000, precoVenda: 112_500, diasEstoque: 32, status: "disponivel" },
  { id: 3, modelo: "VW T-Cross Highline 2023", placa: "GHI-9012", ano: 2023, km: 18_500, custoAquisicao: 118_000, precoVenda: 145_900, diasEstoque: 9, status: "reservado" },
  { id: 4, modelo: "Hyundai HB20 Comfort 2022", placa: "JKL-3456", ano: 2022, km: 41_000, custoAquisicao: 62_000, precoVenda: 78_900, diasEstoque: 45, status: "disponivel" },
  { id: 5, modelo: "Jeep Renegade Sport 2021", placa: "MNO-7890", ano: 2021, km: 58_000, custoAquisicao: 78_000, precoVenda: 96_500, diasEstoque: 67, status: "atencao" },
  { id: 6, modelo: "Fiat Pulse Drive 2023", placa: "PQR-1357", ano: 2023, km: 22_000, custoAquisicao: 84_000, precoVenda: 102_900, diasEstoque: 14, status: "disponivel" },
  { id: 7, modelo: "Chevrolet Onix LT 2022", placa: "STU-2468", ano: 2022, km: 36_500, custoAquisicao: 58_000, precoVenda: 72_900, diasEstoque: 22, status: "disponivel" },
  { id: 8, modelo: "Renault Kwid Zen 2023", placa: "VWX-9753", ano: 2023, km: 12_800, custoAquisicao: 52_000, precoVenda: 64_900, diasEstoque: 8, status: "disponivel" },
];

// ─── Patrimônio ───────────────────────────────────────────────────
export const patrimonio = {
  ativos: [
    { categoria: "Estoque de Veículos", valor: 698_000 },
    { categoria: "Imóvel da Loja", valor: 850_000 },
    { categoria: "Equipamentos Oficina", valor: 145_000 },
    { categoria: "Veículos da Frota", valor: 92_000 },
    { categoria: "Caixa & Bancos", valor: 184_500 },
    { categoria: "Contas a Receber", valor: 86_300 },
  ],
  passivos: [
    { categoria: "Empréstimos Bancários", valor: 270_000 },
    { categoria: "Cartões / Rotativo", valor: 48_000 },
    { categoria: "Fornecedores", valor: 124_000 },
    { categoria: "Impostos a Pagar", valor: 38_500 },
    { categoria: "Folha a Pagar", valor: 36_600 },
  ],
};

// ─── Score Saúde Financeira ─────────────────────────────────────
export const scoreSaude = {
  score: 78,
  classificacao: "Saudável",
  pilares: [
    { nome: "Liquidez", score: 82, peso: 25, descricao: "Capacidade de pagar obrigações de curto prazo" },
    { nome: "Endividamento", score: 71, peso: 25, descricao: "Nível de alavancagem e capacidade de pagamento" },
    { nome: "Rentabilidade", score: 84, peso: 25, descricao: "Margens e retorno sobre operação" },
    { nome: "Eficiência", score: 75, peso: 25, descricao: "Giro de estoque e produtividade operacional" },
  ],
  recomendacoes: [
    { prioridade: "alta", titulo: "Reduzir cheque especial", impacto: "+6 pts no score" },
    { prioridade: "media", titulo: "Acelerar giro de estoque acima de 60 dias", impacto: "+4 pts no score" },
    { prioridade: "baixa", titulo: "Negociar prazo com fornecedores principais", impacto: "+2 pts no score" },
  ],
};

// ─── Inteligência Financeira (insights pré-prontos) ────────────
export const insights = [
  {
    tipo: "oportunidade",
    titulo: "Oportunidade de quitação antecipada",
    descricao: "Quitar o rotativo do cartão (R$ 20k a 12,5%/mês) com o caixa atual geraria economia projetada de R$ 18.400 em 6 meses.",
    valor: 18_400,
  },
  {
    tipo: "alerta",
    titulo: "Concentração de custos fixos",
    descricao: "Folha + pró-labore representam 65% dos custos fixos. Diversificar fontes de receita (oficina) reduziria risco.",
    valor: null,
  },
  {
    tipo: "tendencia",
    titulo: "Crescimento sustentado da oficina",
    descricao: "Faturamento da oficina cresceu 47% em 12 meses vs 33% da revenda. Considere expansão da capacidade.",
    valor: null,
  },
  {
    tipo: "oportunidade",
    titulo: "Margem em modelos premium",
    descricao: "Veículos acima de R$ 100k têm margem média 4,2pp maior. Aumentar mix premium pode elevar margem líquida para 21%+.",
    valor: 12_300,
  },
  {
    tipo: "alerta",
    titulo: "Veículos parados",
    descricao: "1 veículo (Jeep Renegade) está há 67 dias em estoque. Risco de desvalorização e custo de oportunidade do capital.",
    valor: 96_500,
  },
];

// ─── Calendário de Vencimentos (próximos 30 dias) ──────────────
export const proximosVencimentos = [
  { dia: 5, descricao: "Aluguel + Folha + VR", valor: 55_100, tipo: "Custo Fixo" },
  { dia: 8, descricao: "ERP / Software", valor: 1_450, tipo: "Custo Fixo" },
  { dia: 10, descricao: "Pró-labore + Contábil", valor: 14_800, tipo: "Custo Fixo" },
  { dia: 12, descricao: "IPTU + Taxas", valor: 3_200, tipo: "Tributos" },
  { dia: 15, descricao: "Energia Elétrica", valor: 4_800, tipo: "Utilities" },
  { dia: 15, descricao: "Parcela BB - Capital de Giro", valor: 4_850, tipo: "Empréstimo" },
  { dia: 18, descricao: "Seguro Patrimonial", valor: 1_950, tipo: "Seguros" },
  { dia: 20, descricao: "Internet + Telefonia", valor: 980, tipo: "Utilities" },
  { dia: 20, descricao: "Parcela Itaú - Veicular", valor: 2_980, tipo: "Empréstimo" },
  { dia: 22, descricao: "Limpeza & Manutenção", valor: 1_800, tipo: "Operacional" },
  { dia: 25, descricao: "Marketing Digital", valor: 4_500, tipo: "Marketing" },
  { dia: 28, descricao: "Parcela BNDES", valor: 1_820, tipo: "Empréstimo" },
];

// ─── Helper agregados ─────────────────────────────────────────────
export const totalAtivos = patrimonio.ativos.reduce((s, a) => s + a.valor, 0);
export const totalPassivos = patrimonio.passivos.reduce((s, p) => s + p.valor, 0);
export const patrimonioLiquido = totalAtivos - totalPassivos;
export const totalCustosFixos = custosFixos.reduce((s, c) => s + c.valor, 0);
export const totalDividas = dividas.reduce((s, d) => s + d.valor, 0);

// ═══════════════════════════════════════════════════════════════════
// ETAPA E2 — Estratégia: Cenários, BTS, OKRs, Timeline
// ═══════════════════════════════════════════════════════════════════

// ─── Simulador de Cenários (DSCR) ────────────────────────────────
export const ebitdaMensal = 112_400; // base para DSCR
export const receitaMensal = 487_300;

export const dividasSimulaveis = dividas.map((d) => ({
  id: d.id,
  credor: d.credor,
  tipo: d.tipo,
  saldo: d.valor,
  parcela: d.parcelaMensal,
  taxaMes: d.taxaMes,
  garantia: d.garantia,
  selecionavel: d.status !== "ativa" || d.taxaMes > 1.5,
}));

// ─── Plano BTS (Build-to-Sell) — 5 fases × 4 ações ───────────────
export type BtsAcao = { id: string; titulo: string; status: "concluido" | "andamento" | "pendente" };
export type BtsFase = {
  id: number;
  nome: string;
  resumo: string;
  progresso: number;
  prazo: string;
  acoes: BtsAcao[];
};

export const planoBTS: BtsFase[] = [
  {
    id: 1, nome: "Diagnóstico", resumo: "Mapeamento da operação, dívidas e gargalos.",
    progresso: 100, prazo: "Concluída em Mar/25",
    acoes: [
      { id: "1a", titulo: "Levantamento patrimonial completo", status: "concluido" },
      { id: "1b", titulo: "Mapa de dívidas e custos fixos", status: "concluido" },
      { id: "1c", titulo: "Entrevistas com sócios e gestores", status: "concluido" },
      { id: "1d", titulo: "Diagnóstico fiscal/societário", status: "concluido" },
    ],
  },
  {
    id: 2, nome: "Reestruturação", resumo: "Renegociação de dívidas e enxugamento de custos.",
    progresso: 78, prazo: "Em curso · jul/25",
    acoes: [
      { id: "2a", titulo: "Quitação do cheque especial Sicoob", status: "concluido" },
      { id: "2b", titulo: "Renegociação Cartão Empresa", status: "concluido" },
      { id: "2c", titulo: "Migração ERP + dashboard gestão", status: "andamento" },
      { id: "2d", titulo: "Redução de custos fixos −12%", status: "andamento" },
    ],
  },
  {
    id: 3, nome: "Formalização", resumo: "Governança, contratos e compliance.",
    progresso: 45, prazo: "Set/25",
    acoes: [
      { id: "3a", titulo: "Acordo de sócios + holding patrimonial", status: "concluido" },
      { id: "3b", titulo: "Padronização de contratos comerciais", status: "andamento" },
      { id: "3c", titulo: "Conformidade trabalhista e fiscal", status: "andamento" },
      { id: "3d", titulo: "Política de compliance LGPD", status: "pendente" },
    ],
  },
  {
    id: 4, nome: "Crescimento", resumo: "Aceleração comercial com base saneada.",
    progresso: 20, prazo: "Out/25 → Mar/26",
    acoes: [
      { id: "4a", titulo: "Plano comercial 12m (+30% receita)", status: "andamento" },
      { id: "4b", titulo: "Expansão canal digital", status: "pendente" },
      { id: "4c", titulo: "Captação capital de giro saudável", status: "pendente" },
      { id: "4d", titulo: "Programa de fidelidade B2B", status: "pendente" },
    ],
  },
  {
    id: 5, nome: "Saída / Liquidez", resumo: "Empresa pronta para venda parcial ou sucessão.",
    progresso: 5, prazo: "2026 →",
    acoes: [
      { id: "5a", titulo: "Valuation independente", status: "pendente" },
      { id: "5b", titulo: "Memorando de informações (CIM)", status: "pendente" },
      { id: "5c", titulo: "Roadshow para investidores", status: "pendente" },
      { id: "5d", titulo: "Negociação e fechamento", status: "pendente" },
    ],
  },
];

// ─── OKRs — 4 objetivos com Key Results ──────────────────────────
export type Kr = { titulo: string; progresso: number; meta: string; atual: string };
export type Okr = {
  id: string;
  area: "Financeiro" | "Operacional" | "Comercial" | "Pessoas";
  objetivo: string;
  responsavel: string;
  trimestre: string;
  krs: Kr[];
};

export const objetivosOKR: Okr[] = [
  {
    id: "fin-1", area: "Financeiro",
    objetivo: "Sair do estresse financeiro e construir caixa de 90 dias",
    responsavel: "Carlos Mendes", trimestre: "Q2/2025",
    krs: [
      { titulo: "Reduzir endividamento total", progresso: 72, meta: "R$ 250k", atual: "R$ 318k → R$ 268k" },
      { titulo: "Aumentar caixa operacional", progresso: 58, meta: "R$ 180k", atual: "R$ 89k → R$ 112k" },
      { titulo: "Score de saúde ≥ 75", progresso: 80, meta: "75 pts", atual: "62 → 71" },
    ],
  },
  {
    id: "com-1", area: "Comercial",
    objetivo: "Acelerar receita com mix mais rentável",
    responsavel: "Ana Paula", trimestre: "Q2/2025",
    krs: [
      { titulo: "Receita mensal", progresso: 64, meta: "R$ 600k", atual: "R$ 487k" },
      { titulo: "Ticket médio oficina", progresso: 81, meta: "R$ 1.800", atual: "R$ 1.620" },
      { titulo: "Conversão pipeline", progresso: 55, meta: "18%", atual: "12,4%" },
    ],
  },
  {
    id: "ope-1", area: "Operacional",
    objetivo: "Reduzir custo fixo e ganhar produtividade",
    responsavel: "Roberto Silva", trimestre: "Q2/2025",
    krs: [
      { titulo: "Custo fixo / receita", progresso: 70, meta: "≤ 12%", atual: "16% → 13,8%" },
      { titulo: "OS/dia oficina", progresso: 62, meta: "22", atual: "18" },
      { titulo: "Giro de estoque (dias)", progresso: 48, meta: "45 dias", atual: "68 dias" },
    ],
  },
  {
    id: "pes-1", area: "Pessoas",
    objetivo: "Profissionalizar gestão e reter talento-chave",
    responsavel: "Mariana Costa", trimestre: "Q2/2025",
    krs: [
      { titulo: "Plano de cargos implantado", progresso: 90, meta: "100%", atual: "90%" },
      { titulo: "Turnover anual", progresso: 35, meta: "≤ 12%", atual: "22%" },
      { titulo: "NPS interno", progresso: 75, meta: "≥ 8", atual: "7,2" },
    ],
  },
];

// ─── Timeline de Eventos (últimos 60 dias) ───────────────────────
export type EventoTipo = "lancamento" | "ajuste" | "marco" | "alerta" | "reuniao";
export type Evento = {
  id: string;
  data: string; // ISO
  tipo: EventoTipo;
  titulo: string;
  descricao: string;
  autor: string;
};

export const timelineEventos: Evento[] = [
  { id: "e1", data: "2025-04-25", tipo: "marco", titulo: "Quitação Cheque Especial Sicoob", descricao: "R$ 28k liquidados — economia de R$ 1.624/mês em juros.", autor: "Carlos Mendes" },
  { id: "e2", data: "2025-04-23", tipo: "reuniao", titulo: "Reunião mensal de gestão", descricao: "Revisão de KRs Q2, ajustes em metas comerciais.", autor: "Time Melazzo" },
  { id: "e3", data: "2025-04-22", tipo: "lancamento", titulo: "Recebimento Carteira PJ", descricao: "Entrada de R$ 184k referente a 12 contratos.", autor: "Ana Paula" },
  { id: "e4", data: "2025-04-20", tipo: "alerta", titulo: "Atraso parcela BB +10 dias", descricao: "Provável compensação dia 28 com folga de caixa.", autor: "Sistema" },
  { id: "e5", data: "2025-04-18", tipo: "ajuste", titulo: "Reclassificação custos marketing", descricao: "R$ 4.5k movido de Operacional → Marketing Digital.", autor: "Roberto Silva" },
  { id: "e6", data: "2025-04-15", tipo: "lancamento", titulo: "Folha de pagamento Abr/25", descricao: "R$ 38k processados, sem horas extras.", autor: "Mariana Costa" },
  { id: "e7", data: "2025-04-12", tipo: "marco", titulo: "Score de saúde sobe para 71", descricao: "+9 pts após renegociações e melhora do DSCR.", autor: "Melazzo IA" },
  { id: "e8", data: "2025-04-10", tipo: "reuniao", titulo: "Comitê de crédito BNDES", descricao: "Pré-aprovação de linha de modernização R$ 80k.", autor: "Carlos Mendes" },
  { id: "e9", data: "2025-04-08", tipo: "ajuste", titulo: "Atualização de PDD oficina", descricao: "Provisão ajustada de 4,2% → 3,5% sobre carteira.", autor: "Sistema" },
  { id: "e10", data: "2025-04-05", tipo: "alerta", titulo: "Estoque parado >120 dias", descricao: "3 veículos identificados — sugerir campanha relâmpago.", autor: "Melazzo IA" },
  { id: "e11", data: "2025-04-02", tipo: "lancamento", titulo: "Vendas Mar/25 fechadas", descricao: "R$ 456k consolidados, +8% vs Fev.", autor: "Ana Paula" },
  { id: "e12", data: "2025-03-30", tipo: "marco", titulo: "Migração ERP — fase 1 concluída", descricao: "Cadastros mestres importados, integração contábil ativa.", autor: "TI Externo" },
  { id: "e13", data: "2025-03-28", tipo: "reuniao", titulo: "Workshop Plano BTS", descricao: "Revisão das 5 fases com sócios e Melazzo.", autor: "Time Melazzo" },
  { id: "e14", data: "2025-03-25", tipo: "ajuste", titulo: "Renegociação Cartão Empresa", descricao: "Taxa caiu de 12,5% → 6,8% ao mês após acordo.", autor: "Carlos Mendes" },
  { id: "e15", data: "2025-03-20", tipo: "alerta", titulo: "Conciliação bancária divergente", descricao: "R$ 1.240 não identificado — em apuração.", autor: "Sistema" },
  { id: "e16", data: "2025-03-15", tipo: "lancamento", titulo: "Pagamento INSS/FGTS", descricao: "R$ 12,8k recolhidos no prazo.", autor: "Mariana Costa" },
  { id: "e17", data: "2025-03-12", tipo: "marco", titulo: "Acordo de sócios assinado", descricao: "Holding patrimonial constituída, participações 60/30/10.", autor: "Jurídico" },
  { id: "e18", data: "2025-03-10", tipo: "reuniao", titulo: "Diagnóstico apresentado", descricao: "Encerramento da Fase 1 do BTS com aprovação geral.", autor: "Melazzo Consultoria" },
  { id: "e19", data: "2025-03-05", tipo: "ajuste", titulo: "Revisão de comissões comerciais", descricao: "Nova grade aprovada: 1,5% → 2,2% para mix margem alta.", autor: "Carlos Mendes" },
  { id: "e20", data: "2025-03-01", tipo: "lancamento", titulo: "Fechamento Fev/25", descricao: "Margem líquida 16,1% — abaixo da meta de 18%.", autor: "Sistema" },
];

// ─── Governança · E3 ──────────────────────────────────────────────
export type CheckupStatus = "ok" | "atencao" | "critico" | "pendente";
export type CheckupItem = { id: string; titulo: string; status: CheckupStatus; descricao: string; responsavel: string };
export type CheckupBloco = { id: string; titulo: string; descricao: string; itens: CheckupItem[] };

export const checkupBlocos: CheckupBloco[] = [
  {
    id: "fiscal",
    titulo: "Fiscal & Tributário",
    descricao: "Conformidade tributária e obrigações acessórias.",
    itens: [
      { id: "f1", titulo: "Certidões negativas (Federal, Estadual, Municipal)", status: "ok", descricao: "Todas válidas até Jul/25.", responsavel: "Contábil Externa" },
      { id: "f2", titulo: "Apuração SPED Fiscal Mar/25", status: "ok", descricao: "Entregue em 15/04 sem pendências.", responsavel: "Contábil Externa" },
      { id: "f3", titulo: "Compensação ICMS sobre estoque", status: "atencao", descricao: "R$ 4,2k de crédito não aproveitado nos últimos 60 dias.", responsavel: "Carlos Mendes" },
      { id: "f4", titulo: "Revisão de regime tributário (Simples vs Lucro Presumido)", status: "pendente", descricao: "Estudo solicitado, previsto para Mai/25.", responsavel: "Melazzo Consultoria" },
    ],
  },
  {
    id: "trabalhista",
    titulo: "Trabalhista & Folha",
    descricao: "Obrigações de pessoal e processos.",
    itens: [
      { id: "t1", titulo: "FGTS e INSS em dia", status: "ok", descricao: "Recolhimento Mar/25 efetuado em 06/04.", responsavel: "Mariana Costa" },
      { id: "t2", titulo: "Provisão de férias e 13º atualizada", status: "ok", descricao: "Saldo R$ 38,2k provisionados.", responsavel: "Contábil Externa" },
      { id: "t3", titulo: "Processos trabalhistas ativos", status: "atencao", descricao: "1 reclamação em andamento (R$ 12k em risco).", responsavel: "Jurídico" },
      { id: "t4", titulo: "ESocial — eventos pendentes", status: "ok", descricao: "Sem pendências nos últimos 90 dias.", responsavel: "Mariana Costa" },
    ],
  },
  {
    id: "societario",
    titulo: "Societário & Contratos",
    descricao: "Atos constitutivos e governança societária.",
    itens: [
      { id: "s1", titulo: "Contrato social atualizado", status: "ok", descricao: "Última alteração em 03/2025 (holding).", responsavel: "Jurídico" },
      { id: "s2", titulo: "Acordo de sócios formalizado", status: "ok", descricao: "Assinado 12/03/25 — participações 60/30/10.", responsavel: "Jurídico" },
      { id: "s3", titulo: "Atas de reuniões de sócios", status: "atencao", descricao: "Última ata registrada há 6 meses — recomenda-se atualização.", responsavel: "Carlos Mendes" },
      { id: "s4", titulo: "Procurações vigentes", status: "pendente", descricao: "Mapeamento solicitado, ainda não consolidado.", responsavel: "Jurídico" },
    ],
  },
  {
    id: "financeiro",
    titulo: "Financeiro & Bancário",
    descricao: "Saúde financeira e relacionamento bancário.",
    itens: [
      { id: "fi1", titulo: "Conciliação bancária diária", status: "ok", descricao: "Automatizada, divergências < 0,3%.", responsavel: "Sistema" },
      { id: "fi2", titulo: "DSCR > 1,2x", status: "ok", descricao: "Atual 1,38x — acima do covenant.", responsavel: "Melazzo IA" },
      { id: "fi3", titulo: "Limite de cheque especial", status: "critico", descricao: "Uso recorrente acima de 80% do teto.", responsavel: "Carlos Mendes" },
      { id: "fi4", titulo: "Diversificação bancária", status: "atencao", descricao: "Concentração de 62% em um único banco.", responsavel: "Melazzo Consultoria" },
    ],
  },
  {
    id: "operacional",
    titulo: "Operacional & Estoque",
    descricao: "Controles operacionais e gestão de estoque.",
    itens: [
      { id: "o1", titulo: "Inventário físico mensal", status: "ok", descricao: "Última contagem 30/03 — divergência 0,8%.", responsavel: "Roberto Silva" },
      { id: "o2", titulo: "Curva ABC de estoque", status: "ok", descricao: "Atualizada semanalmente, 80% do giro em 22 SKUs.", responsavel: "Sistema" },
      { id: "o3", titulo: "Estoque parado >120 dias", status: "atencao", descricao: "3 veículos identificados — campanha sugerida.", responsavel: "Melazzo IA" },
      { id: "o4", titulo: "Política formal de descontos", status: "pendente", descricao: "Em revisão — versão preliminar circulando.", responsavel: "Carlos Mendes" },
    ],
  },
  {
    id: "compliance",
    titulo: "Compliance & LGPD",
    descricao: "Privacidade de dados e conformidade regulatória.",
    itens: [
      { id: "c1", titulo: "Política de privacidade publicada", status: "ok", descricao: "Disponível no site, última revisão Jan/25.", responsavel: "Jurídico" },
      { id: "c2", titulo: "Encarregado de dados (DPO)", status: "atencao", descricao: "Função delegada ao sócio — não formalizado em ata.", responsavel: "Jurídico" },
      { id: "c3", titulo: "Mapeamento de dados pessoais", status: "pendente", descricao: "Iniciado em Fev/25 — 40% concluído.", responsavel: "TI Externo" },
      { id: "c4", titulo: "Termo de consentimento clientes", status: "ok", descricao: "Implementado no CRM desde Out/24.", responsavel: "Ana Paula" },
    ],
  },
];

// ─── Inconsistências de Dados ─────────────────────────────────────
export type Severidade = "alta" | "media" | "baixa";
export type Inconsistencia = {
  id: string;
  modulo: string;
  severidade: Severidade;
  titulo: string;
  detectadoEm: string;
  impacto: string;
  acaoSugerida: string;
};

export const inconsistencias: Inconsistencia[] = [
  { id: "i1", modulo: "Faturamento", severidade: "alta", titulo: "5 NFs sem categoria contábil", detectadoEm: "2025-04-24", impacto: "DRE pode subestimar custo operacional em ~R$ 8k", acaoSugerida: "Revisar e classificar manualmente" },
  { id: "i2", modulo: "Bancário", severidade: "alta", titulo: "R$ 1.240 não conciliado", detectadoEm: "2025-04-22", impacto: "Diferença persiste há 3 dias", acaoSugerida: "Investigar extrato Sicoob 22/04" },
  { id: "i3", modulo: "Estoque", severidade: "media", titulo: "2 veículos sem KM atualizado", detectadoEm: "2025-04-20", impacto: "Avaliação de venda imprecisa", acaoSugerida: "Solicitar inspeção física" },
  { id: "i4", modulo: "RH", severidade: "media", titulo: "1 colaborador sem CTPS digital sincronizada", detectadoEm: "2025-04-18", impacto: "Risco de autuação em fiscalização", acaoSugerida: "Atualizar via gov.br" },
  { id: "i5", modulo: "Cobrança", severidade: "media", titulo: "3 acordos sem boleto emitido", detectadoEm: "2025-04-17", impacto: "Atraso de R$ 14k na conversão", acaoSugerida: "Disparar emissão em lote" },
  { id: "i6", modulo: "Contratos", severidade: "baixa", titulo: "Contrato BB sem cópia digitalizada", detectadoEm: "2025-04-15", impacto: "Auditoria pode demandar acesso físico", acaoSugerida: "Digitalizar e anexar ao dossiê" },
  { id: "i7", modulo: "Faturamento", severidade: "baixa", titulo: "Cliente duplicado no cadastro", detectadoEm: "2025-04-12", impacto: "Pode gerar histórico fragmentado", acaoSugerida: "Mesclar registros" },
  { id: "i8", modulo: "Patrimônio", severidade: "baixa", titulo: "1 imobilizado sem nº de patrimônio", detectadoEm: "2025-04-10", impacto: "Controle físico prejudicado", acaoSugerida: "Etiquetar e atualizar planilha" },
];

// ─── Rastreio de Contratos Bancários ──────────────────────────────
export type StatusContrato = "Em dia" | "Atraso leve" | "Renegociar" | "Quitado";
export type ContratoRastreio = {
  id: string;
  banco: string;
  modalidade: string;
  saldoAtual: number;
  parcelaMes: number;
  taxaMes: number;
  vencimento: string;
  parcelasPagas: number;
  parcelasTotais: number;
  status: StatusContrato;
  ultimaAcao: string;
};

export const contratosIntermediacao: ContratoRastreio[] = [
  { id: "ct1", banco: "Banco do Brasil", modalidade: "Capital de Giro", saldoAtual: 124_000, parcelaMes: 8_400, taxaMes: 1.49, vencimento: "2027-09-15", parcelasPagas: 18, parcelasTotais: 36, status: "Em dia", ultimaAcao: "Pgto Abr/25 confirmado" },
  { id: "ct2", banco: "Sicoob", modalidade: "BNDES Modernização", saldoAtual: 78_500, parcelaMes: 3_240, taxaMes: 0.95, vencimento: "2028-02-10", parcelasPagas: 12, parcelasTotais: 48, status: "Em dia", ultimaAcao: "Pgto Abr/25 confirmado" },
  { id: "ct3", banco: "Itaú", modalidade: "Cheque Especial PJ", saldoAtual: 42_300, parcelaMes: 0, taxaMes: 8.20, vencimento: "Rotativo", parcelasPagas: 0, parcelasTotais: 0, status: "Renegociar", ultimaAcao: "Uso 87% do limite" },
  { id: "ct4", banco: "Santander", modalidade: "Antecipação Recebíveis", saldoAtual: 38_700, parcelaMes: 0, taxaMes: 2.85, vencimento: "Mensal", parcelasPagas: 0, parcelasTotais: 0, status: "Em dia", ultimaAcao: "Cessão 22/04/25" },
  { id: "ct5", banco: "Bradesco", modalidade: "Financiamento Veículo", saldoAtual: 18_400, parcelaMes: 1_280, taxaMes: 1.18, vencimento: "2026-04-20", parcelasPagas: 36, parcelasTotais: 48, status: "Em dia", ultimaAcao: "Pgto Abr/25 confirmado" },
  { id: "ct6", banco: "Caixa", modalidade: "Crédito Consignado PJ", saldoAtual: 16_100, parcelaMes: 1_420, taxaMes: 1.65, vencimento: "2026-08-12", parcelasPagas: 9, parcelasTotais: 24, status: "Atraso leve", ultimaAcao: "Parcela Abr/25 em D+8" },
  { id: "ct7", banco: "Sicoob", modalidade: "Cartão Empresa", saldoAtual: 8_900, parcelaMes: 0, taxaMes: 6.80, vencimento: "Rotativo", parcelasPagas: 0, parcelasTotais: 0, status: "Em dia", ultimaAcao: "Renegociado 25/03/25" },
  { id: "ct8", banco: "Banco do Brasil", modalidade: "Capital de Giro 2023", saldoAtual: 0, parcelaMes: 0, taxaMes: 1.62, vencimento: "2025-03-30", parcelasPagas: 24, parcelasTotais: 24, status: "Quitado", ultimaAcao: "Encerrado 30/03/25" },
];
