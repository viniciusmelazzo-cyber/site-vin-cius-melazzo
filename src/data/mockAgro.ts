// Mock data — Melazzo Consultoria · Demo Agro & Pecuária
// Cliente fictício: Fazenda São João — Pecuária de corte + Soja, 1.200 ha
// Safra de referência: 2024/25

export const fazenda = {
  nome: "Fazenda São João",
  proprietario: "José Almeida",
  car: "MT-5103403-1A2B3C4D",
  segmento: "Pecuária de Corte + Soja",
  cidade: "Sorriso · MT",
  area: 1200, // hectares totais
  areaPastagem: 720,
  areaLavoura: 420,
  areaPreservacao: 60,
  desde: "2009",
  rebanho: 2480, // cabeças totais
  safra: "2024/25",
};

export const fmt = (v: number) =>
  `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
export const fmtK = (v: number) =>
  v >= 1_000_000 ? `R$ ${(v / 1_000_000).toFixed(1)}M` : `R$ ${(v / 1000).toFixed(0)}k`;
export const fmtHa = (v: number) => `${v.toLocaleString("pt-BR")} ha`;
export const pct = (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`;

// ─── Visão Executiva — KPIs ───────────────────────────────────────
export const kpisVisaoExecutiva = [
  { label: "Receita Safra 24/25", value: 8_640_000, prev: 7_820_000, format: "money" },
  { label: "EBITDA Projetado", value: 2_980_000, prev: 2_640_000, format: "money" },
  { label: "Dívida Total", value: 4_120_000, prev: 4_460_000, format: "money", inverse: true },
  { label: "Margem Operacional", value: 34.5, prev: 33.8, format: "pct" },
];

// ─── Lastro Patrimonial ───────────────────────────────────────────
export const lastroPatrimonial = {
  total: 32_480_000,
  composicao: [
    { categoria: "Terras (1.200 ha)", valor: 21_600_000, observacao: "R$ 18.000/ha · Sorriso/MT" },
    { categoria: "Rebanho (2.480 cab)", valor: 6_200_000, observacao: "Média R$ 2.500/cab" },
    { categoria: "Maquinário Agrícola", valor: 2_840_000, observacao: "2 colheitadeiras, 4 tratores" },
    { categoria: "Benfeitorias & Instalações", valor: 1_240_000, observacao: "Sede, currais, silos" },
    { categoria: "Veículos & Frota", valor: 380_000, observacao: "3 caminhonetes, 1 caminhão" },
    { categoria: "Estoque Insumos", valor: 220_000, observacao: "Defensivos + sementes" },
  ],
  bens: [
    { tipo: "Terra", descricao: "Sede - Matrícula 12.345", area: 720, valor: 12_960_000, situacao: "Quitada" },
    { tipo: "Terra", descricao: "Anexo Norte - Matrícula 12.346", area: 480, valor: 8_640_000, situacao: "Hipotecada BB" },
    { tipo: "Máquina", descricao: "Colheitadeira John Deere S780", area: 0, valor: 1_280_000, situacao: "Alienada Sicredi" },
    { tipo: "Máquina", descricao: "Trator John Deere 7230J", area: 0, valor: 580_000, situacao: "Quitado" },
    { tipo: "Máquina", descricao: "Pulverizador Jacto Uniport", area: 0, valor: 480_000, situacao: "Alienada BNDES" },
    { tipo: "Benfeitoria", descricao: "Sede + Galpão Principal", area: 0, valor: 740_000, situacao: "Quitada" },
    { tipo: "Benfeitoria", descricao: "Currais + Sistema Confinamento", area: 0, valor: 320_000, situacao: "Quitada" },
  ],
};

// ─── Endividamento ────────────────────────────────────────────────
export const dividasAgro = [
  { id: 1, credor: "Banco do Brasil", linha: "Pronaf Custeio", valor: 1_280_000, taxaAno: 8.5, prazo: 12, vencimento: "Mai/26", garantia: "Hipoteca terra", status: "ativa" },
  { id: 2, credor: "Sicredi", linha: "Custeio Pecuária", valor: 680_000, taxaAno: 9.2, prazo: 18, vencimento: "Out/26", garantia: "Penhor rebanho", status: "ativa" },
  { id: 3, credor: "BNDES", linha: "Moderfrota", valor: 920_000, taxaAno: 10.5, prazo: 60, vencimento: "Mar/29", garantia: "Alienação máquina", status: "ativa" },
  { id: 4, credor: "Bradesco", linha: "Capital de Giro", valor: 480_000, taxaAno: 14.8, prazo: 24, vencimento: "Jul/27", garantia: "Aval", status: "atencao" },
  { id: 5, credor: "Cooperativa", linha: "Insumos a prazo", valor: 540_000, taxaAno: 12.0, prazo: 8, vencimento: "Fev/26", garantia: "Penhor safra", status: "ativa" },
  { id: 6, credor: "Banco da Amazônia", linha: "FNO Agro", valor: 220_000, taxaAno: 7.8, prazo: 36, vencimento: "Set/28", garantia: "Aval", status: "ativa" },
];

export const cronogramaDividas = [
  { mes: "Mai/25", principal: 280_000, juros: 42_000 },
  { mes: "Jun/25", principal: 195_000, juros: 38_500 },
  { mes: "Jul/25", principal: 420_000, juros: 45_200 },
  { mes: "Ago/25", principal: 310_000, juros: 41_800 },
  { mes: "Set/25", principal: 280_000, juros: 39_500 },
  { mes: "Out/25", principal: 680_000, juros: 48_200 },
  { mes: "Nov/25", principal: 320_000, juros: 36_400 },
  { mes: "Dez/25", principal: 240_000, juros: 32_100 },
];

// ─── Capacidade de Pagamento ─────────────────────────────────────
export const capacidadePagamento = {
  dscr: 1.84, // Debt Service Coverage Ratio
  margemOperacional: 34.5,
  ebitdaServicoDivida: 4.2,
  liquidezCorrente: 2.1,
  projecaoSafras: [
    { safra: "2022/23", receita: 6_840_000, custos: 4_580_000, ebitda: 2_260_000, servicoDivida: 980_000 },
    { safra: "2023/24", receita: 7_820_000, custos: 5_180_000, ebitda: 2_640_000, servicoDivida: 1_120_000 },
    { safra: "2024/25", receita: 8_640_000, custos: 5_660_000, ebitda: 2_980_000, servicoDivida: 1_280_000 },
    { safra: "2025/26", receita: 9_180_000, custos: 5_920_000, ebitda: 3_260_000, servicoDivida: 1_180_000 },
    { safra: "2026/27", receita: 9_640_000, custos: 6_140_000, ebitda: 3_500_000, servicoDivida: 1_080_000 },
  ],
};

// ─── Custeio de Safra (Soja 420 ha) ──────────────────────────────
export const custeioSafra = {
  cultura: "Soja",
  hectares: 420,
  produtividadeEsperada: 62, // sacas/ha
  precoSaca: 128, // R$/saca
  receitaProjetada: 420 * 62 * 128, // ~3.336.960
  custos: [
    { categoria: "Sementes", valorPorHa: 480, total: 201_600, pct: 11.4 },
    { categoria: "Fertilizantes", valorPorHa: 1_280, total: 537_600, pct: 30.4 },
    { categoria: "Defensivos", valorPorHa: 920, total: 386_400, pct: 21.8 },
    { categoria: "Operações Mecanizadas", valorPorHa: 580, total: 243_600, pct: 13.7 },
    { categoria: "Mão de Obra", valorPorHa: 240, total: 100_800, pct: 5.7 },
    { categoria: "Combustíveis", valorPorHa: 320, total: 134_400, pct: 7.6 },
    { categoria: "Arrendamento/Outros", valorPorHa: 380, total: 159_600, pct: 9.0 },
  ],
  custoTotalPorHa: 4_200,
  custoTotal: 1_764_000,
  margemBrutaProjetada: 1_572_960,
  pontoEquilibrio: 33, // sacas/ha
};

// ─── Pecuária ─────────────────────────────────────────────────────
export const pecuaria = {
  rebanhoTotal: 2_480,
  lotacaoMedia: 1.85, // UA/ha
  gmd: 0.82, // ganho médio diário kg
  taxaMortalidade: 1.8,
  taxaPrenhez: 84,
  categorias: [
    { categoria: "Bezerros (até 12m)", qtde: 420, peso: 165, valorCab: 2_100 },
    { categoria: "Garrotes (12-24m)", qtde: 580, peso: 285, valorCab: 2_650 },
    { categoria: "Novilhos (24-36m)", qtde: 480, peso: 380, valorCab: 3_180 },
    { categoria: "Bois Gordos (acima 36m)", qtde: 320, peso: 510, valorCab: 4_200 },
    { categoria: "Vacas em Reprodução", qtde: 580, peso: 420, valorCab: 2_480 },
    { categoria: "Touros Reprodutores", qtde: 22, peso: 720, valorCab: 8_500 },
    { categoria: "Bezerras (recria)", qtde: 78, peso: 155, valorCab: 1_980 },
  ],
  cicloMedio: 32, // meses até abate
  produtividadeArroba: 14.8, // @/ha/ano
};

// ─── Cotações de Mercado ─────────────────────────────────────────
export const cotacoes = {
  boiGordo: { atual: 248, anterior: 232, unidade: "R$/@", historico: [
    { mes: "Out", valor: 218 }, { mes: "Nov", valor: 224 }, { mes: "Dez", valor: 228 },
    { mes: "Jan", valor: 232 }, { mes: "Fev", valor: 240 }, { mes: "Mar", valor: 245 },
    { mes: "Abr", valor: 248 },
  ]},
  soja: { atual: 128, anterior: 134, unidade: "R$/saca", historico: [
    { mes: "Out", valor: 142 }, { mes: "Nov", valor: 138 }, { mes: "Dez", valor: 136 },
    { mes: "Jan", valor: 134 }, { mes: "Fev", valor: 130 }, { mes: "Mar", valor: 128 },
    { mes: "Abr", valor: 128 },
  ]},
  milho: { atual: 62, anterior: 58, unidade: "R$/saca", historico: [
    { mes: "Out", valor: 54 }, { mes: "Nov", valor: 56 }, { mes: "Dez", valor: 57 },
    { mes: "Jan", valor: 58 }, { mes: "Fev", valor: 60 }, { mes: "Mar", valor: 61 },
    { mes: "Abr", valor: 62 },
  ]},
  dolar: { atual: 5.18, anterior: 4.94, unidade: "R$", historico: [
    { mes: "Out", valor: 5.62 }, { mes: "Nov", valor: 5.78 }, { mes: "Dez", valor: 6.18 },
    { mes: "Jan", valor: 6.04 }, { mes: "Fev", valor: 5.82 }, { mes: "Mar", valor: 5.42 },
    { mes: "Abr", valor: 5.18 },
  ]},
};

// ─── Risco de Crédito ────────────────────────────────────────────
export const riscoCredito = {
  scoreSerasa: 782,
  rating: "BB+",
  classificacao: "Risco Médio-Baixo",
  exposicaoTotal: 4_120_000,
  limiteAprovado: 6_500_000,
  utilizacao: 63.4,
  alertas: [
    { tipo: "clima", severidade: "media", titulo: "Estiagem prevista MT/MS",
      descricao: "Modelos climáticos indicam La Niña fraca para safrinha 2025. Probabilidade de déficit hídrico em Sorriso: 38%." },
    { tipo: "mercado", severidade: "alta", titulo: "Soja em queda há 6 meses",
      descricao: "Preço da saca caiu de R$ 142 (Out/24) para R$ 128 (Abr/25). Recomenda-se hedge de 60% da produção." },
    { tipo: "credito", severidade: "baixa", titulo: "Parcela Bradesco com taxa elevada",
      descricao: "Capital de giro Bradesco a 14,8% a.a. Considerar quitação antecipada usando linha Pronaf disponível." },
    { tipo: "mercado", severidade: "positivo", titulo: "Boi gordo em alta sustentada",
      descricao: "Arroba subiu 14% nos últimos 6 meses. Janela favorável para escoamento de lote pronto (320 cabeças)." },
  ],
};

// ─── Fluxo Projetado por Safra ───────────────────────────────────
export const fluxoProjetado = [
  { mes: "Mai/25", entradas: 0, saidas: 580_000, saldo: -580_000, evento: "Plantio soja - insumos" },
  { mes: "Jun/25", entradas: 240_000, saidas: 320_000, saldo: -80_000, evento: "Custeio + venda bezerros" },
  { mes: "Jul/25", entradas: 480_000, saidas: 280_000, saldo: 200_000, evento: "Venda boi gordo lote 1" },
  { mes: "Ago/25", entradas: 180_000, saidas: 380_000, saldo: -200_000, evento: "Tratos culturais" },
  { mes: "Set/25", entradas: 320_000, saidas: 240_000, saldo: 80_000, evento: "Venda bezerros desmama" },
  { mes: "Out/25", entradas: 420_000, saidas: 320_000, saldo: 100_000, evento: "Plantio milho safrinha" },
  { mes: "Nov/25", entradas: 0, saidas: 280_000, saldo: -280_000, evento: "Defensivos soja" },
  { mes: "Dez/25", entradas: 580_000, saidas: 240_000, saldo: 340_000, evento: "Venda boi gordo lote 2" },
  { mes: "Jan/26", entradas: 280_000, saidas: 180_000, saldo: 100_000, evento: "Início colheita soja" },
  { mes: "Fev/26", entradas: 1_840_000, saidas: 420_000, saldo: 1_420_000, evento: "Pico colheita soja" },
  { mes: "Mar/26", entradas: 1_480_000, saidas: 380_000, saldo: 1_100_000, evento: "Venda final soja" },
  { mes: "Abr/26", entradas: 380_000, saidas: 320_000, saldo: 60_000, evento: "Início safrinha milho" },
];

// ─── Insights IA ──────────────────────────────────────────────────
export const insightsAgro = [
  {
    tipo: "oportunidade" as const,
    titulo: "Janela favorável para escoar lote de boi gordo",
    descricao: "320 cabeças prontas para abate, com arroba a R$ 248 (alta de 14% em 6 meses). Comercialização imediata gera receita estimada de R$ 1,68M com margem 22% acima da média histórica.",
    valor: 1_680_000,
  },
  {
    tipo: "alerta" as const,
    titulo: "Hedge recomendado para safra de soja",
    descricao: "Soja em tendência de baixa (R$ 142 → R$ 128 em 6 meses). Recomenda-se travar 60% da produção em mercado futuro a R$ 132/saca para proteger margem operacional.",
    valor: null,
  },
  {
    tipo: "oportunidade" as const,
    titulo: "Migração da dívida Bradesco para Pronaf",
    descricao: "Capital de giro Bradesco custa 14,8% a.a. enquanto há limite Pronaf a 8,5% disponível. Migração geraria economia de R$ 30.240/ano em juros.",
    valor: 30_240,
  },
  {
    tipo: "tendencia" as const,
    titulo: "Produtividade pecuária acima da região",
    descricao: "GMD de 0,82 kg/dia e lotação 1,85 UA/ha superam médias da região (0,68 kg e 1,42 UA/ha). Margem para expansão da capacidade de confinamento.",
    valor: null,
  },
  {
    tipo: "alerta" as const,
    titulo: "Risco hídrico para safrinha de milho",
    descricao: "Modelos climáticos indicam La Niña fraca com 38% de probabilidade de déficit hídrico. Considerar antecipação do plantio em 15 dias para reduzir exposição.",
    valor: null,
  },
];

// ─── Lotes Pecuária (operacional) ────────────────────────────────
export const lotesPecuaria = [
  {
    codigo: "L-2024-08",
    raca: "Nelore",
    sexo: "Macho",
    qtde: 120,
    pesoEntrada: 230,
    pesoAtual: 372,
    gmd: 0.86,
    diasConfinamento: 165,
    area: "Pasto Norte 1",
    status: "engorda" as const,
    custoCabeca: 2_180,
    pesagens: [
      { data: "Nov/24", peso: 230 },
      { data: "Dez/24", peso: 258 },
      { data: "Jan/25", peso: 285 },
      { data: "Fev/25", peso: 312 },
      { data: "Mar/25", peso: 342 },
      { data: "Abr/25", peso: 372 },
    ],
  },
  {
    codigo: "L-2024-09",
    raca: "Nelore × Angus",
    sexo: "Macho",
    qtde: 95,
    pesoEntrada: 245,
    pesoAtual: 408,
    gmd: 0.94,
    diasConfinamento: 175,
    area: "Pasto Norte 2",
    status: "engorda" as const,
    custoCabeca: 2_320,
    pesagens: [
      { data: "Nov/24", peso: 245 },
      { data: "Dez/24", peso: 276 },
      { data: "Jan/25", peso: 308 },
      { data: "Fev/25", peso: 342 },
      { data: "Mar/25", peso: 376 },
      { data: "Abr/25", peso: 408 },
    ],
  },
  {
    codigo: "L-2024-11",
    raca: "Nelore",
    sexo: "Macho",
    qtde: 140,
    pesoEntrada: 220,
    pesoAtual: 318,
    gmd: 0.74,
    diasConfinamento: 132,
    area: "Pasto Sul",
    status: "recria" as const,
    custoCabeca: 1_980,
    pesagens: [
      { data: "Dez/24", peso: 220 },
      { data: "Jan/25", peso: 248 },
      { data: "Fev/25", peso: 270 },
      { data: "Mar/25", peso: 295 },
      { data: "Abr/25", peso: 318 },
    ],
  },
  {
    codigo: "L-2025-01",
    raca: "Nelore × Brahman",
    sexo: "Macho",
    qtde: 85,
    pesoEntrada: 235,
    pesoAtual: 280,
    gmd: 0.78,
    diasConfinamento: 58,
    area: "Confinamento",
    status: "engorda" as const,
    custoCabeca: 2_240,
    pesagens: [
      { data: "Fev/25", peso: 235 },
      { data: "Mar/25", peso: 258 },
      { data: "Abr/25", peso: 280 },
    ],
  },
  {
    codigo: "L-2024-05",
    raca: "Angus",
    sexo: "Macho",
    qtde: 60,
    pesoEntrada: 280,
    pesoAtual: 510,
    gmd: 0.96,
    diasConfinamento: 240,
    area: "Confinamento",
    status: "pronto" as const,
    custoCabeca: 2_680,
    pesagens: [
      { data: "Set/24", peso: 280 },
      { data: "Out/24", peso: 308 },
      { data: "Nov/24", peso: 342 },
      { data: "Dez/24", peso: 380 },
      { data: "Jan/25", peso: 418 },
      { data: "Fev/25", peso: 452 },
      { data: "Mar/25", peso: 482 },
      { data: "Abr/25", peso: 510 },
    ],
  },
];

// ─── Estrutura Societária ───────────────────────────────────────
export const estruturaSocietaria = {
  holding: {
    nome: "São João Participações S.A.",
    cnpj: "12.345.678/0001-90",
    constituicao: "2009",
    capitalSocial: 8_500_000,
    papel: "holding" as const,
  },
  operacional: {
    nome: "Fazenda São João Agropecuária Ltda",
    cnpj: "23.456.789/0001-12",
    constituicao: "2010",
    capitalSocial: 4_200_000,
    papel: "operacional" as const,
  },
  socios: [
    {
      nome: "José Almeida",
      tipo: "PF",
      papel: "Sócio Majoritário",
      participacao: 65,
      cpf: "***.456.789-**",
      desde: "2009",
      coobrigado: true,
      processos: 0,
    },
    {
      nome: "Maria Almeida",
      tipo: "PF",
      papel: "Sócia",
      participacao: 25,
      cpf: "***.789.123-**",
      desde: "2009",
      coobrigado: true,
      processos: 0,
    },
    {
      nome: "Pedro Almeida",
      tipo: "PF",
      papel: "Sócio Minoritário (Gestor)",
      participacao: 10,
      cpf: "***.123.456-**",
      desde: "2015",
      coobrigado: false,
      processos: 1,
    },
  ],
  processos: [
    {
      numero: "0012345-67.2023.8.11.0040",
      tipo: "Trabalhista",
      vara: "1ª Vara do Trabalho — Sorriso/MT",
      valor: 48_000,
      status: "em_andamento",
      socioRelacionado: "Pedro Almeida",
    },
  ],
};

// ─── Fazendas (3 propriedades do grupo) ──────────────────────────
export const fazendas = [
  {
    id: "FAZ-01",
    nome: "Fazenda São João — Sede",
    cidade: "Sorriso · MT",
    car: "MT-5103403-1A2B3C4D",
    matricula: "12.345",
    area: 720,
    areaPastagem: 480,
    areaLavoura: 200,
    areaPreservacao: 40,
    cultura: "Soja + Pecuária",
    rebanho: 1_580,
    produtividadeSoja: 64,
    valorPatrimonial: 12_960_000,
    situacao: "Quitada",
    benfeitorias: ["Sede administrativa", "2 currais", "1 silo 800t", "Galpão de máquinas"],
  },
  {
    id: "FAZ-02",
    nome: "Fazenda Anexo Norte",
    cidade: "Sinop · MT",
    car: "MT-5107909-9X8Y7Z6W",
    matricula: "12.346",
    area: 380,
    areaPastagem: 180,
    areaLavoura: 180,
    areaPreservacao: 20,
    cultura: "Soja + Milho safrinha",
    rebanho: 580,
    produtividadeSoja: 60,
    valorPatrimonial: 6_840_000,
    situacao: "Hipotecada — BB",
    benfeitorias: ["Casa de funcionários", "1 curral", "Estrada interna 4 km"],
  },
  {
    id: "FAZ-03",
    nome: "Fazenda Lucas",
    cidade: "Lucas do Rio Verde · MT",
    car: "MT-5105259-2B3C4D5E",
    matricula: "8.912",
    area: 100,
    areaPastagem: 60,
    areaLavoura: 40,
    areaPreservacao: 0,
    cultura: "Pecuária leite + Soja",
    rebanho: 320,
    produtividadeSoja: 58,
    valorPatrimonial: 1_800_000,
    situacao: "Quitada",
    benfeitorias: ["Curral de manejo", "Pequeno galpão"],
  },
];

// ─── Cenários pré-salvos do Simulador de Engorda ─────────────────
export const cenariosEngorda = [
  {
    id: "CEN-01",
    nome: "Lote padrão Nelore — pasto",
    qtdCabecas: 100,
    pesoEntrada: 230,
    pesoSaida: 510,
    gmd: 0.78,
    precoCompra: 2_100,
    precoArroba: 248,
    rendimentoCarcaca: 54,
    custoAlimentacaoDia: 4.2,
    custoSanitarioCabeca: 85,
    custoArrendamentoMes: 18_000,
    custoMaoObraMes: 6_500,
    outrosCustos: 12_000,
    funruralPct: 1.5,
    mortalidadePct: 1.8,
  },
  {
    id: "CEN-02",
    nome: "Cruzamento Angus × confinamento",
    qtdCabecas: 80,
    pesoEntrada: 280,
    pesoSaida: 540,
    gmd: 1.05,
    precoCompra: 2_680,
    precoArroba: 258,
    rendimentoCarcaca: 56,
    custoAlimentacaoDia: 9.8,
    custoSanitarioCabeca: 110,
    custoArrendamentoMes: 8_000,
    custoMaoObraMes: 8_200,
    outrosCustos: 18_000,
    funruralPct: 1.5,
    mortalidadePct: 1.2,
  },
  {
    id: "CEN-03",
    nome: "Recria Nelore — semi-intensivo",
    qtdCabecas: 150,
    pesoEntrada: 180,
    pesoSaida: 360,
    gmd: 0.62,
    precoCompra: 1_780,
    precoArroba: 240,
    rendimentoCarcaca: 53,
    custoAlimentacaoDia: 3.4,
    custoSanitarioCabeca: 75,
    custoArrendamentoMes: 22_000,
    custoMaoObraMes: 5_800,
    outrosCustos: 9_000,
    funruralPct: 1.5,
    mortalidadePct: 2.4,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────
export const totalLastro = lastroPatrimonial.composicao.reduce((s, i) => s + i.valor, 0);
export const totalDividas = dividasAgro.reduce((s, d) => s + d.valor, 0);
export const totalRebanhoValor = pecuaria.categorias.reduce((s, c) => s + c.qtde * c.valorCab, 0);
export const custoMedioDivida =
  dividasAgro.reduce((s, d) => s + d.taxaAno * d.valor, 0) / totalDividas;
export const totalAreaFazendas = fazendas.reduce((s, f) => s + f.area, 0);
export const totalValorFazendas = fazendas.reduce((s, f) => s + f.valorPatrimonial, 0);

// Engine do simulador de engorda — calcula resultado em tempo real
export interface SimEngordaParams {
  qtdCabecas: number;
  pesoEntrada: number;
  pesoSaida: number;
  gmd: number;
  precoCompra: number;
  precoArroba: number;
  rendimentoCarcaca: number;
  custoAlimentacaoDia: number;
  custoSanitarioCabeca: number;
  custoArrendamentoMes: number;
  custoMaoObraMes: number;
  outrosCustos: number;
  funruralPct: number;
  mortalidadePct: number;
}

export function simularEngorda(p: SimEngordaParams) {
  const ganhoPeso = Math.max(0, p.pesoSaida - p.pesoEntrada);
  const duracaoDias = p.gmd > 0 ? Math.round(ganhoPeso / p.gmd) : 0;
  const cabecasFinais = p.qtdCabecas * (1 - p.mortalidadePct / 100);
  const pesoCarcacaTotal = cabecasFinais * p.pesoSaida * (p.rendimentoCarcaca / 100);
  const arrobasTotal = pesoCarcacaTotal / 15;
  const receitaBruta = arrobasTotal * p.precoArroba;
  const funrural = receitaBruta * (p.funruralPct / 100);
  const receitaLiquida = receitaBruta - funrural;
  const custoCompra = p.qtdCabecas * p.precoCompra;
  const custoAlimentacao = p.custoAlimentacaoDia * cabecasFinais * duracaoDias;
  const custoSanitario = p.custoSanitarioCabeca * p.qtdCabecas;
  const custoArrendamento = (p.custoArrendamentoMes * duracaoDias) / 30;
  const custoMaoObra = (p.custoMaoObraMes * duracaoDias) / 30;
  const custoTotal =
    custoCompra + custoAlimentacao + custoSanitario + custoArrendamento + custoMaoObra + p.outrosCustos;
  const margem = receitaLiquida - custoTotal;
  const margemPct = receitaLiquida > 0 ? (margem / receitaLiquida) * 100 : 0;
  const arrobasProduzidas = (cabecasFinais * ganhoPeso * (p.rendimentoCarcaca / 100)) / 15;
  const custoArrobaProduzida = arrobasProduzidas > 0 ? custoTotal / arrobasProduzidas : 0;
  const roi = custoTotal > 0 ? (margem / custoTotal) * 100 : 0;
  return {
    duracaoDias,
    cabecasFinais: Math.round(cabecasFinais),
    arrobasTotal,
    arrobasProduzidas,
    receitaBruta,
    receitaLiquida,
    custoCompra,
    custoAlimentacao,
    custoSanitario,
    custoArrendamento,
    custoMaoObra,
    custoTotal,
    margem,
    margemPct,
    custoArrobaProduzida,
    roi,
  };
}

// ─── Áreas Arrendadas ─────────────────────────────────────────────
export type AreaArrendada = {
  id: string;
  proprietario: string;
  area: number; // ha
  cidade: string;
  cultura: string;
  valorAnual: number;
  inicio: string; // YYYY-MM
  termino: string; // YYYY-MM
  reajusteIndice: string;
  custoPorHa: number;
  status: "Ativo" | "Renovar" | "Encerrar";
};

export const areasArrendadas: AreaArrendada[] = [
  { id: "AR-01", proprietario: "Espólio Antônio Ribeiro", area: 320, cidade: "Sorriso · MT", cultura: "Soja + Milho safrinha", valorAnual: 480_000, inicio: "2022-09", termino: "2027-08", reajusteIndice: "IGP-M", custoPorHa: 1_500, status: "Ativo" },
  { id: "AR-02", proprietario: "Cooperativa Vale Verde", area: 180, cidade: "Lucas do Rio Verde · MT", cultura: "Soja", valorAnual: 234_000, inicio: "2023-10", termino: "2026-09", reajusteIndice: "IPCA + 2%", custoPorHa: 1_300, status: "Ativo" },
  { id: "AR-03", proprietario: "João Henrique Souza", area: 95, cidade: "Sinop · MT", cultura: "Pastagem", valorAnual: 76_000, inicio: "2021-04", termino: "2025-08", reajusteIndice: "IGP-M", custoPorHa: 800, status: "Renovar" },
  { id: "AR-04", proprietario: "Fundação Agro MT", area: 140, cidade: "Sorriso · MT", cultura: "Soja", valorAnual: 196_000, inicio: "2024-09", termino: "2029-08", reajusteIndice: "IPCA", custoPorHa: 1_400, status: "Ativo" },
];

export const totalAreaArrendada = areasArrendadas.reduce((s, a) => s + a.area, 0);
export const custoArrendamentoAnual = areasArrendadas.reduce((s, a) => s + a.valorAnual, 0);

// ─── Central Financeira PJ — Fazenda São João Agropecuária Ltda ─────
export type ContaBancariaPJ = {
  id: string;
  banco: string;
  apelido: string;
  agencia: string;
  conta: string;
  tipo: "corrente" | "poupanca" | "investimento";
  saldo: number;
  atualizadoEm: string;
  ativa: boolean;
};

export const contasBancariasPJ: ContaBancariaPJ[] = [
  { id: "CB-01", banco: "Banco do Brasil", apelido: "BB Operação", agencia: "3940-2", conta: "12345-6", tipo: "corrente", saldo: 482_400, atualizadoEm: "2025-04-22", ativa: true },
  { id: "CB-02", banco: "Sicredi", apelido: "Sicredi Custeio", agencia: "0801", conta: "98765-4", tipo: "corrente", saldo: 218_900, atualizadoEm: "2025-04-22", ativa: true },
  { id: "CB-03", banco: "Bradesco", apelido: "Bradesco Reserva", agencia: "1284", conta: "55555-1", tipo: "investimento", saldo: 1_240_000, atualizadoEm: "2025-04-21", ativa: true },
  { id: "CB-04", banco: "BTG Pactual", apelido: "BTG Investimentos", agencia: "0001", conta: "77821-0", tipo: "investimento", saldo: 680_000, atualizadoEm: "2025-04-22", ativa: true },
  { id: "CB-05", banco: "Caixa", apelido: "Caixa FGTS Empregados", agencia: "0420", conta: "11122-3", tipo: "corrente", saldo: 38_500, atualizadoEm: "2025-04-15", ativa: true },
];

export type CartaoCreditoPJ = {
  id: string;
  banco: string;
  apelido: string;
  bandeira: "Visa" | "Mastercard" | "Elo";
  limite: number;
  faturaAtual: number;
  diaFechamento: number;
  diaVencimento: number;
  ativo: boolean;
};

export const cartoesPJ: CartaoCreditoPJ[] = [
  { id: "CC-01", banco: "Banco do Brasil", apelido: "BB Empresarial Ouro", bandeira: "Visa", limite: 80_000, faturaAtual: 32_480, diaFechamento: 25, diaVencimento: 5, ativo: true },
  { id: "CC-02", banco: "Bradesco", apelido: "Bradesco Insumos", bandeira: "Mastercard", limite: 120_000, faturaAtual: 78_200, diaFechamento: 20, diaVencimento: 30, ativo: true },
  { id: "CC-03", banco: "Sicredi", apelido: "Sicredi Combustível", bandeira: "Elo", limite: 40_000, faturaAtual: 14_800, diaFechamento: 28, diaVencimento: 8, ativo: true },
];

export type LancamentoPJ = {
  id: string;
  data: string; // YYYY-MM-DD
  tipo: "receita" | "despesa";
  descricao: string;
  categoria: string;
  conta: string;
  valor: number;
  status: "pago" | "pendente";
  recorrencia: "unica" | "mensal" | "anual";
};

export const lancamentosPJ: LancamentoPJ[] = [
  { id: "L-001", data: "2025-04-22", tipo: "receita", descricao: "Venda lote L-2024-05 (60 cab Angus)", categoria: "Venda Pecuária", conta: "BB Operação", valor: 924_000, status: "pago", recorrencia: "unica" },
  { id: "L-002", data: "2025-04-20", tipo: "despesa", descricao: "Folha de pagamento — Abril", categoria: "Mão de Obra", conta: "BB Operação", valor: 84_500, status: "pago", recorrencia: "mensal" },
  { id: "L-003", data: "2025-04-18", tipo: "despesa", descricao: "Compra ração concentrado 12t", categoria: "Insumos Pecuária", conta: "Sicredi Custeio", valor: 38_400, status: "pago", recorrencia: "unica" },
  { id: "L-004", data: "2025-04-15", tipo: "despesa", descricao: "Diesel BR para frota (5.200L)", categoria: "Combustível", conta: "Sicredi Combustível", valor: 32_240, status: "pago", recorrencia: "mensal" },
  { id: "L-005", data: "2025-04-12", tipo: "despesa", descricao: "Defensivo Glifosato 800L (Bayer)", categoria: "Defensivos", conta: "Bradesco Insumos", valor: 48_800, status: "pago", recorrencia: "unica" },
  { id: "L-006", data: "2025-04-10", tipo: "receita", descricao: "Venda 80 sc soja (entrega imediata)", categoria: "Venda Soja", conta: "BB Operação", valor: 10_240, status: "pago", recorrencia: "unica" },
  { id: "L-007", data: "2025-04-08", tipo: "despesa", descricao: "Energia elétrica fazenda — Energisa", categoria: "Utilities", conta: "BB Operação", valor: 18_400, status: "pago", recorrencia: "mensal" },
  { id: "L-008", data: "2025-04-05", tipo: "despesa", descricao: "Parcela financiamento BNDES Moderfrota", categoria: "Serviço da Dívida", conta: "BB Operação", valor: 28_400, status: "pago", recorrencia: "mensal" },
  { id: "L-009", data: "2025-04-30", tipo: "despesa", descricao: "Arrendamento Fazenda Anexo Norte", categoria: "Arrendamento", conta: "BB Operação", valor: 40_000, status: "pendente", recorrencia: "mensal" },
  { id: "L-010", data: "2025-04-28", tipo: "despesa", descricao: "Honorários contábeis", categoria: "Serviços", conta: "BB Operação", valor: 6_800, status: "pendente", recorrencia: "mensal" },
  { id: "L-011", data: "2025-03-25", tipo: "receita", descricao: "Venda lote L-2024-03 (95 cab)", categoria: "Venda Pecuária", conta: "BB Operação", valor: 720_000, status: "pago", recorrencia: "unica" },
  { id: "L-012", data: "2025-03-15", tipo: "despesa", descricao: "Vacinação Aftosa rebanho (2.480 cab)", categoria: "Sanitário", conta: "Sicredi Custeio", valor: 18_600, status: "pago", recorrencia: "anual" },
  { id: "L-013", data: "2025-03-10", tipo: "despesa", descricao: "Folha de pagamento — Março", categoria: "Mão de Obra", conta: "BB Operação", valor: 82_100, status: "pago", recorrencia: "mensal" },
  { id: "L-014", data: "2025-02-28", tipo: "receita", descricao: "Venda safra soja — pico colheita", categoria: "Venda Soja", conta: "BB Operação", valor: 1_840_000, status: "pago", recorrencia: "unica" },
  { id: "L-015", data: "2025-02-10", tipo: "despesa", descricao: "Folha de pagamento — Fevereiro", categoria: "Mão de Obra", conta: "BB Operação", valor: 80_400, status: "pago", recorrencia: "mensal" },
  { id: "L-016", data: "2025-01-20", tipo: "despesa", descricao: "Sementes soja safrinha (180sc)", categoria: "Insumos Lavoura", conta: "Bradesco Insumos", valor: 86_400, status: "pago", recorrencia: "unica" },
  { id: "L-017", data: "2025-01-10", tipo: "despesa", descricao: "Folha de pagamento — Janeiro", categoria: "Mão de Obra", conta: "BB Operação", valor: 79_800, status: "pago", recorrencia: "mensal" },
  { id: "L-018", data: "2024-12-22", tipo: "receita", descricao: "Venda boi gordo lote 2 (140 cab)", categoria: "Venda Pecuária", conta: "BB Operação", valor: 580_000, status: "pago", recorrencia: "unica" },
];

export type SocioPJ = {
  id: string;
  nome: string;
  participacao: number;
  cargo: string;
  desde: string;
  coobrigado: boolean;
};

export const sociosPJ: SocioPJ[] = [
  { id: "S-01", nome: "José Almeida", participacao: 65, cargo: "Sócio Administrador", desde: "2010", coobrigado: true },
  { id: "S-02", nome: "Maria Almeida", participacao: 25, cargo: "Sócia", desde: "2010", coobrigado: true },
  { id: "S-03", nome: "Pedro Almeida", participacao: 10, cargo: "Sócio Gestor Operacional", desde: "2015", coobrigado: false },
];

// Helpers Central Financeira
export const saldoTotalContasPJ = contasBancariasPJ.filter(c => c.ativa).reduce((s, c) => s + c.saldo, 0);
export const limiteTotalCartoesPJ = cartoesPJ.filter(c => c.ativo).reduce((s, c) => s + c.limite, 0);
export const faturaTotalCartoesPJ = cartoesPJ.filter(c => c.ativo).reduce((s, c) => s + c.faturaAtual, 0);

// ─── Multi-cultura por safra (para Custeio enriquecido) ──────────
export type CulturaSafra = {
  id: string;
  cultura: string;
  icone: string;
  area: number;
  produtividade: number; // sc/ha
  precoSaca: number;
  precoMercadoHoje: number;
  custoHa: number;
  custoSaca: number;
  receitaBruta: number;
  custoTotal: number;
  margemPct: number;
  composicao: { rubrica: string; valor: number }[];
};

export const culturasSafraAtual: CulturaSafra[] = [
  {
    id: "CS-01",
    cultura: "Soja",
    icone: "🌱",
    area: 420,
    produtividade: 62,
    precoSaca: 128,
    precoMercadoHoje: 128,
    custoHa: 4_200,
    custoSaca: 67.7,
    receitaBruta: 3_336_960,
    custoTotal: 1_764_000,
    margemPct: 47.1,
    composicao: [
      { rubrica: "Sementes", valor: 201_600 },
      { rubrica: "Fertilizantes", valor: 537_600 },
      { rubrica: "Defensivos", valor: 386_400 },
      { rubrica: "Operações Mecanizadas", valor: 243_600 },
      { rubrica: "Mão de Obra", valor: 100_800 },
      { rubrica: "Combustíveis", valor: 134_400 },
      { rubrica: "Arrendamento/Outros", valor: 159_600 },
    ],
  },
  {
    id: "CS-02",
    cultura: "Milho Safrinha",
    icone: "🌽",
    area: 280,
    produtividade: 92,
    precoSaca: 62,
    precoMercadoHoje: 62,
    custoHa: 2_980,
    custoSaca: 32.4,
    receitaBruta: 1_597_120,
    custoTotal: 834_400,
    margemPct: 47.8,
    composicao: [
      { rubrica: "Sementes", valor: 142_800 },
      { rubrica: "Fertilizantes", valor: 280_000 },
      { rubrica: "Defensivos", valor: 156_800 },
      { rubrica: "Operações Mecanizadas", valor: 142_800 },
      { rubrica: "Mão de Obra", valor: 56_000 },
      { rubrica: "Combustíveis", valor: 56_000 },
    ],
  },
  {
    id: "CS-03",
    cultura: "Algodão",
    icone: "🪴",
    area: 120,
    produtividade: 280, // @/ha
    precoSaca: 145, // R$/@
    precoMercadoHoje: 152,
    custoHa: 12_400,
    custoSaca: 44.3,
    receitaBruta: 4_872_000,
    custoTotal: 1_488_000,
    margemPct: 69.5,
    composicao: [
      { rubrica: "Sementes", valor: 144_000 },
      { rubrica: "Fertilizantes", valor: 446_400 },
      { rubrica: "Defensivos", valor: 520_800 },
      { rubrica: "Operações Mecanizadas", valor: 178_560 },
      { rubrica: "Mão de Obra", valor: 96_000 },
      { rubrica: "Colheita/Beneficiamento", valor: 102_240 },
    ],
  },
];

export const evolucaoSafras = [
  { safra: "2020/21", receita: 5_240_000, custo: 3_680_000, margem: 1_560_000, margemPct: 29.8, area: 680 },
  { safra: "2021/22", receita: 6_120_000, custo: 4_120_000, margem: 2_000_000, margemPct: 32.7, area: 720 },
  { safra: "2022/23", receita: 6_840_000, custo: 4_580_000, margem: 2_260_000, margemPct: 33.0, area: 780 },
  { safra: "2023/24", receita: 7_820_000, custo: 5_180_000, margem: 2_640_000, margemPct: 33.8, area: 820 },
  { safra: "2024/25", receita: 9_806_080, custo: 4_086_400, margem: 5_719_680, margemPct: 58.3, area: 820 },
];
