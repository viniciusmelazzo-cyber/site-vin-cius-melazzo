import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import type { DrillPayload, DrillColumn, DrillTone } from "@/hooks/use-drill-down";

import {
  faturamento12m,
  fluxo6m,
  custosFixos,
  custosVariaveis,
  dividas,
  estoqueVeiculos,
  pipelineFases,
  vendedores,
  patrimonio,
  scoreSaude,
  proximosVencimentos,
  insights as insightsEmpresarial,
  dre,
  fmt,
  fmtK,
} from "@/data/mockData";

import {
  lastroPatrimonial,
  dividasAgro,
  cronogramaDividas,
  capacidadePagamento,
  custeioSafra,
  pecuaria,
  cotacoes,
  riscoCredito,
  fluxoProjetado,
  insightsAgro,
  fmt as fmtAgro,
  fmtK as fmtKAgro,
  fmtHa,
  totalLastro,
  totalRebanhoValor,
} from "@/data/mockAgro";

import {
  evolucaoMensal,
  aging,
  carteiraPorProduto,
  topDevedores,
  equipe,
  reguaCobranca,
  acordosFirmados,
  juridico,
  insightsIA,
  empresa as empresaCobranca,
  fmt as fmtCob,
  fmtK as fmtKCob,
} from "@/data/mockCobranca";

// ═══════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════

const num = (n: number) => n.toLocaleString("pt-BR");
const pct = (n: number) => `${n.toFixed(1)}%`;

function statusBadge(s: string): ReactNode {
  const map: Record<string, { label: string; cls: string }> = {
    ativa: { label: "Ativa", cls: "bg-positive/15 text-positive border-positive/30" },
    ativo: { label: "Ativo", cls: "bg-positive/15 text-positive border-positive/30" },
    atencao: { label: "Atenção", cls: "bg-warning/15 text-warning border-warning/30" },
    critica: { label: "Crítica", cls: "bg-negative/15 text-negative border-negative/30" },
    disponivel: { label: "Disponível", cls: "bg-positive/15 text-positive border-positive/30" },
    reservado: { label: "Reservado", cls: "bg-gold/15 text-gold-dark border-gold/30" },
  };
  const m = map[s.toLowerCase()] ?? { label: s, cls: "bg-secondary text-foreground" };
  return <Badge variant="outline" className={`${m.cls} text-[10px]`}>{m.label}</Badge>;
}

// ═══════════════════════════════════════════════════════════════════
// EMPRESARIAL — Panorama Geral
// ═══════════════════════════════════════════════════════════════════

export const empresarialDrills = {
  faturamentoMes: (): DrillPayload => {
    const mesAtual = faturamento12m[faturamento12m.length - 1];
    return {
      eyebrow: "Fonte da informação · Empresarial",
      title: "Faturamento do Mês",
      subtitle: `${mesAtual.mes} · Composição Revenda + Oficina`,
      tone: "navy",
      kpis: [
        { label: "Total mês", value: fmt(mesAtual.total) },
        { label: "Revenda", value: fmt(mesAtual.revenda), hint: `${((mesAtual.revenda / mesAtual.total) * 100).toFixed(1)}%` },
        { label: "Oficina", value: fmt(mesAtual.oficina), hint: `${((mesAtual.oficina / mesAtual.total) * 100).toFixed(1)}%` },
        { label: "12m", value: fmt(faturamento12m.reduce((s, m) => s + m.total, 0)) },
      ],
      narrative:
        "Tendência ascendente nos últimos 5 meses. A oficina cresce em ritmo superior à revenda — motor de margem.",
      columns: [
        { key: "mes", label: "Mês" },
        { key: "revenda", label: "Revenda", align: "right", format: (v) => fmt(v as number) },
        { key: "oficina", label: "Oficina", align: "right", format: (v) => fmt(v as number) },
        { key: "total", label: "Total", align: "right", format: (v) => <strong className="text-navy">{fmt(v as number)}</strong> },
      ],
      rows: [...faturamento12m].reverse(),
      exportFilename: "faturamento-12m",
      fullPageHref: "/empresarial/faturamento",
    };
  },

  margemLiquida: (): DrillPayload => ({
    eyebrow: "Fonte da informação · Empresarial",
    title: "Margem Líquida — DRE Detalhada",
    subtitle: `Mês corrente · Margem ${dre.margemLiquida}%`,
    tone: "gold",
    kpis: [
      { label: "Receita Líquida", value: fmt(dre.receitaLiquida) },
      { label: "Lucro Bruto", value: fmt(dre.lucroBruto), hint: `${((dre.lucroBruto / dre.receitaLiquida) * 100).toFixed(1)}%` },
      { label: "Lucro Operacional", value: fmt(dre.lucroOperacional) },
      { label: "Lucro Líquido", value: fmt(dre.lucroLiquido) },
    ],
    narrative:
      "DRE consolidada do mês corrente. Cada linha é a base do cálculo de margem mostrada no card.",
    columns: [
      { key: "label", label: "Conta" },
      { key: "valor", label: "Valor", align: "right", format: (v) => fmt(v as number) },
      { key: "pct", label: "% Receita", align: "right" },
    ],
    rows: [
      { label: "Receita Bruta", valor: dre.receitaBruta, pct: "100,0%" },
      { label: "(–) Deduções", valor: dre.deducoes, pct: pct((dre.deducoes / dre.receitaBruta) * 100) },
      { label: "Receita Líquida", valor: dre.receitaLiquida, pct: pct((dre.receitaLiquida / dre.receitaBruta) * 100) },
      { label: "(–) CMV", valor: dre.cmv, pct: pct((dre.cmv / dre.receitaBruta) * 100) },
      { label: "Lucro Bruto", valor: dre.lucroBruto, pct: pct((dre.lucroBruto / dre.receitaBruta) * 100) },
      { label: "(–) Custos Fixos", valor: dre.custosFixos, pct: pct((dre.custosFixos / dre.receitaBruta) * 100) },
      { label: "(–) Custos Variáveis", valor: dre.custosVariaveis, pct: pct((dre.custosVariaveis / dre.receitaBruta) * 100) },
      { label: "Lucro Operacional", valor: dre.lucroOperacional, pct: pct((dre.lucroOperacional / dre.receitaBruta) * 100) },
      { label: "(–) Despesas Financeiras", valor: dre.despFinanceiras, pct: pct((dre.despFinanceiras / dre.receitaBruta) * 100) },
      { label: "Lucro Líquido", valor: dre.lucroLiquido, pct: pct((dre.lucroLiquido / dre.receitaBruta) * 100) },
    ],
    exportFilename: "dre-mes",
    fullPageHref: "/empresarial/custos",
  }),

  fluxoCaixa: (): DrillPayload => ({
    eyebrow: "Fonte da informação · Empresarial",
    title: "Fluxo de Caixa — 6 meses",
    subtitle: "Entradas, saídas e saldo mensal",
    tone: "positive",
    kpis: [
      { label: "Saldo médio", value: fmt(fluxo6m.reduce((s, m) => s + m.saldo, 0) / fluxo6m.length) },
      { label: "Acumulado", value: fmt(fluxo6m.reduce((s, m) => s + m.saldo, 0)) },
      { label: "Melhor mês", value: fluxo6m.reduce((b, m) => (m.saldo > b.saldo ? m : b)).mes },
      { label: "Pior mês", value: fluxo6m.reduce((b, m) => (m.saldo < b.saldo ? m : b)).mes },
    ],
    columns: [
      { key: "mes", label: "Mês" },
      { key: "entradas", label: "Entradas", align: "right", format: (v) => <span className="text-positive">{fmt(v as number)}</span> },
      { key: "saidas", label: "Saídas", align: "right", format: (v) => <span className="text-negative">{fmt(v as number)}</span> },
      { key: "saldo", label: "Saldo", align: "right", format: (v) => <strong>{fmt(v as number)}</strong> },
    ],
    rows: fluxo6m,
    exportFilename: "fluxo-caixa-6m",
    fullPageHref: "/empresarial/fluxo-caixa",
  }),

  endividamento: (): DrillPayload => {
    const total = dividas.reduce((s, d) => s + d.valor, 0);
    return {
      eyebrow: "Fonte da informação · Empresarial",
      title: "Endividamento Total — Contratos",
      subtitle: `${dividas.length} contratos ativos · Total ${fmt(total)}`,
      tone: "warning",
      kpis: [
        { label: "Total devido", value: fmt(total) },
        { label: "Nº contratos", value: String(dividas.length) },
        { label: "Parcela mensal", value: fmt(dividas.reduce((s, d) => s + d.parcelaMensal, 0)) },
        { label: "Maior taxa", value: pct(Math.max(...dividas.map((d) => d.taxaMes))) },
      ],
      narrative:
        "Cartão rotativo com 12,5%/mês é o credor mais oneroso — candidato natural a quitação antecipada.",
      columns: [
        { key: "credor", label: "Credor" },
        { key: "tipo", label: "Tipo" },
        { key: "valor", label: "Saldo", align: "right", format: (v) => fmt(v as number) },
        { key: "taxaMes", label: "Taxa/mês", align: "right", format: (v) => `${(v as number).toFixed(2)}%` },
        { key: "parcelasRestantes", label: "Parcelas", align: "right" },
        { key: "status", label: "Status", align: "center", format: (v) => statusBadge(v as string) },
      ],
      rows: dividas,
      exportFilename: "endividamento",
      fullPageHref: "/empresarial/endividamento",
    };
  },

  estoque: (): DrillPayload => {
    const totalEst = estoqueVeiculos.reduce((s, v) => s + v.custoAquisicao, 0);
    return {
      eyebrow: "Fonte da informação · Empresarial",
      title: "Estoque de Veículos",
      subtitle: `${estoqueVeiculos.length} unidades em pátio`,
      tone: "navy",
      kpis: [
        { label: "Capital parado", value: fmt(totalEst) },
        { label: "Unidades", value: String(estoqueVeiculos.length) },
        { label: "Dias médio", value: `${Math.round(estoqueVeiculos.reduce((s, v) => s + v.diasEstoque, 0) / estoqueVeiculos.length)}d` },
        { label: "Acima 60d", value: String(estoqueVeiculos.filter((v) => v.diasEstoque > 60).length) },
      ],
      columns: [
        { key: "modelo", label: "Modelo" },
        { key: "ano", label: "Ano", align: "center" },
        { key: "km", label: "KM", align: "right", format: (v) => num(v as number) },
        { key: "custoAquisicao", label: "Custo", align: "right", format: (v) => fmt(v as number) },
        { key: "precoVenda", label: "Venda", align: "right", format: (v) => fmt(v as number) },
        { key: "diasEstoque", label: "Dias", align: "right", format: (v) => {
          const d = v as number;
          return <span className={d > 60 ? "text-negative font-semibold" : d > 30 ? "text-warning" : ""}>{d}d</span>;
        }},
        { key: "status", label: "Status", align: "center", format: (v) => statusBadge(v as string) },
      ],
      rows: estoqueVeiculos,
      exportFilename: "estoque-veiculos",
      fullPageHref: "/empresarial/estoque",
    };
  },

  pipelineFase: (fase?: string): DrillPayload => ({
    eyebrow: "Fonte da informação · Empresarial",
    title: fase ? `Pipeline — Etapa ${fase}` : "Pipeline Comercial",
    subtitle: "Distribuição de oportunidades por estágio",
    tone: "gold",
    kpis: [
      { label: "Total oportunidades", value: String(pipelineFases.reduce((s, f) => s + f.qtde, 0)) },
      { label: "Valor pipeline", value: fmt(pipelineFases.reduce((s, f) => s + f.valor, 0)) },
      { label: "Conversão Lead→Fechado", value: `${((pipelineFases[4].qtde / pipelineFases[0].qtde) * 100).toFixed(1)}%` },
      { label: "Ticket médio fechado", value: fmt(pipelineFases[4].valor / pipelineFases[4].qtde) },
    ],
    columns: [
      { key: "fase", label: "Etapa" },
      { key: "qtde", label: "Qtde", align: "right" },
      { key: "valor", label: "Valor", align: "right", format: (v) => fmt(v as number) },
      { key: "ticket", label: "Ticket médio", align: "right" },
    ],
    rows: pipelineFases.map((p) => ({ ...p, ticket: fmt(p.valor / p.qtde) })),
    exportFilename: "pipeline",
    fullPageHref: "/empresarial/pipeline",
  }),

  scoreSaude: (): DrillPayload => ({
    eyebrow: "Fonte da informação · Empresarial",
    title: "Score de Saúde Financeira",
    subtitle: `${scoreSaude.score}/100 · ${scoreSaude.classificacao}`,
    tone: "gold",
    kpis: scoreSaude.pilares.map((p) => ({
      label: p.nome,
      value: `${p.score}`,
      hint: `peso ${p.peso}%`,
    })),
    narrative:
      "Composição dos 4 pilares com peso igual. Recomendações priorizadas geram +12 pts em 6 meses.",
    columns: [
      { key: "nome", label: "Pilar" },
      { key: "score", label: "Score", align: "right" },
      { key: "peso", label: "Peso", align: "right", format: (v) => `${v}%` },
      { key: "descricao", label: "Critério" },
    ],
    rows: scoreSaude.pilares,
    renderExtra: () => (
      <div className="rounded-md border border-border bg-card p-4">
        <p className="text-[10px] uppercase tracking-[0.16em] text-gold-dark font-semibold mb-2">
          Recomendações priorizadas
        </p>
        <ul className="space-y-2 text-sm">
          {scoreSaude.recomendacoes.map((r) => (
            <li key={r.titulo} className="flex items-start justify-between gap-3">
              <span className="text-navy">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground mr-2">
                  {r.prioridade}
                </span>
                {r.titulo}
              </span>
              <span className="text-positive font-semibold tabular text-xs">{r.impacto}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
    exportFilename: "score-saude",
    fullPageHref: "/empresarial/score",
  }),

  patrimonioAtivos: (): DrillPayload => {
    const total = patrimonio.ativos.reduce((s, a) => s + a.valor, 0);
    return {
      eyebrow: "Fonte da informação · Empresarial",
      title: "Patrimônio — Ativos",
      subtitle: `Total ${fmt(total)}`,
      tone: "navy",
      kpis: [
        { label: "Total ativos", value: fmt(total) },
        { label: "Categorias", value: String(patrimonio.ativos.length) },
        { label: "Maior ativo", value: patrimonio.ativos.reduce((b, a) => (a.valor > b.valor ? a : b)).categoria },
        { label: "% imobilizado", value: pct((patrimonio.ativos.filter((a) => /imóvel|equipamento|frota/i.test(a.categoria)).reduce((s, a) => s + a.valor, 0) / total) * 100) },
      ],
      columns: [
        { key: "categoria", label: "Categoria" },
        { key: "valor", label: "Valor", align: "right", format: (v) => fmt(v as number) },
        { key: "share", label: "% Total", align: "right" },
      ],
      rows: patrimonio.ativos.map((a) => ({ ...a, share: pct((a.valor / total) * 100) })),
      exportFilename: "patrimonio-ativos",
      fullPageHref: "/empresarial/patrimonio",
    };
  },

  custosFixos: (): DrillPayload => {
    const total = custosFixos.reduce((s, c) => s + c.valor, 0);
    return {
      eyebrow: "Fonte da informação · Empresarial",
      title: "Custos Fixos do Mês",
      subtitle: `${custosFixos.length} lançamentos · Total ${fmt(total)}`,
      tone: "warning",
      kpis: [
        { label: "Total mensal", value: fmt(total) },
        { label: "Itens", value: String(custosFixos.length) },
        { label: "Maior conta", value: custosFixos.reduce((b, c) => (c.valor > b.valor ? c : b)).descricao.split(" - ")[0] },
        { label: "Pessoal", value: fmt(custosFixos.filter((c) => c.categoria === "Pessoal").reduce((s, c) => s + c.valor, 0)) },
      ],
      columns: [
        { key: "descricao", label: "Descrição" },
        { key: "categoria", label: "Categoria" },
        { key: "dia", label: "Dia", align: "center" },
        { key: "valor", label: "Valor", align: "right", format: (v) => fmt(v as number) },
      ],
      rows: custosFixos,
      exportFilename: "custos-fixos",
      fullPageHref: "/empresarial/custos",
    };
  },

  vencimentos: (): DrillPayload => {
    const total = proximosVencimentos.reduce((s, v) => s + v.valor, 0);
    return {
      eyebrow: "Fonte da informação · Empresarial",
      title: "Próximos Vencimentos (30 dias)",
      subtitle: `${proximosVencimentos.length} compromissos · Total ${fmt(total)}`,
      tone: "warning",
      kpis: [
        { label: "Total a pagar", value: fmt(total) },
        { label: "Compromissos", value: String(proximosVencimentos.length) },
        { label: "Próx. 7 dias", value: fmt(proximosVencimentos.filter((v) => v.dia <= 7).reduce((s, v) => s + v.valor, 0)) },
      ],
      columns: [
        { key: "dia", label: "Dia", align: "center" },
        { key: "descricao", label: "Descrição" },
        { key: "tipo", label: "Tipo" },
        { key: "valor", label: "Valor", align: "right", format: (v) => fmt(v as number) },
      ],
      rows: proximosVencimentos,
      exportFilename: "vencimentos-30d",
      fullPageHref: "/empresarial/calendario",
    };
  },

  insightEvidencia: (i: number): DrillPayload => {
    const ins = insightsEmpresarial[i];
    // Pick contextual rows based on insight type
    const rows: Record<string, unknown>[] =
      /quita|rotativo/i.test(ins.titulo)
        ? dividas.filter((d) => d.tipo.match(/Rotativo|Cheque/i))
        : /custos fixos|folha/i.test(ins.titulo)
        ? custosFixos.filter((c) => c.categoria === "Pessoal")
        : /oficina/i.test(ins.titulo)
        ? faturamento12m
        : /premium|margem/i.test(ins.titulo)
        ? estoqueVeiculos.filter((v) => v.precoVenda >= 100_000)
        : /parado/i.test(ins.titulo)
        ? estoqueVeiculos.filter((v) => v.diasEstoque > 60)
        : [];
    const cols: DrillColumn[] = rows.length && "credor" in rows[0]
      ? [
          { key: "credor", label: "Credor" },
          { key: "valor", label: "Valor", align: "right", format: (v) => fmt(v as number) },
          { key: "taxaMes", label: "Taxa/mês", align: "right", format: (v) => `${(v as number).toFixed(2)}%` },
        ]
      : rows.length && "modelo" in rows[0]
      ? [
          { key: "modelo", label: "Modelo" },
          { key: "diasEstoque", label: "Dias", align: "right" },
          { key: "precoVenda", label: "Venda", align: "right", format: (v) => fmt(v as number) },
        ]
      : rows.length && "descricao" in rows[0]
      ? [
          { key: "descricao", label: "Descrição" },
          { key: "categoria", label: "Categoria" },
          { key: "valor", label: "Valor", align: "right", format: (v) => fmt(v as number) },
        ]
      : rows.length && "mes" in rows[0]
      ? [
          { key: "mes", label: "Mês" },
          { key: "oficina", label: "Oficina", align: "right", format: (v) => fmt(v as number) },
          { key: "revenda", label: "Revenda", align: "right", format: (v) => fmt(v as number) },
        ]
      : [];
    return {
      eyebrow: "Evidência do Insight · Empresarial",
      title: ins.titulo,
      subtitle: ins.descricao,
      tone:
        ins.tipo === "oportunidade" ? "positive" : ins.tipo === "alerta" ? "warning" : "gold",
      kpis: ins.valor
        ? [{ label: "Impacto estimado", value: fmt(ins.valor as number) }]
        : undefined,
      narrative: "Esta é a base de dados que originou o insight da Inteligência Melazzo.",
      columns: cols,
      rows,
      emptyMessage: "Insight de tendência — sem registros tabulares.",
      exportFilename: `insight-${i + 1}`,
      fullPageHref: "/empresarial/inteligencia",
    };
  },
};

// ═══════════════════════════════════════════════════════════════════
// AGRO — Visão Executiva
// ═══════════════════════════════════════════════════════════════════

export const agroDrills = {
  receitaSafra: (): DrillPayload => ({
    eyebrow: "Fonte da informação · Agro",
    title: "Receita por Safra",
    subtitle: "Projeção 5 safras · Soja + Pecuária",
    tone: "agro",
    kpis: [
      { label: "Safra atual", value: fmtAgro(capacidadePagamento.projecaoSafras[2].receita) },
      { label: "EBITDA atual", value: fmtAgro(capacidadePagamento.projecaoSafras[2].ebitda) },
      { label: "Crescimento 24→25", value: pct(((capacidadePagamento.projecaoSafras[3].receita - capacidadePagamento.projecaoSafras[2].receita) / capacidadePagamento.projecaoSafras[2].receita) * 100) },
      { label: "DSCR atual", value: capacidadePagamento.dscr.toFixed(2) },
    ],
    columns: [
      { key: "safra", label: "Safra" },
      { key: "receita", label: "Receita", align: "right", format: (v) => fmtAgro(v as number) },
      { key: "custos", label: "Custos", align: "right", format: (v) => fmtAgro(v as number) },
      { key: "ebitda", label: "EBITDA", align: "right", format: (v) => <strong className="text-positive">{fmtAgro(v as number)}</strong> },
      { key: "servicoDivida", label: "Serviço Dívida", align: "right", format: (v) => fmtAgro(v as number) },
    ],
    rows: capacidadePagamento.projecaoSafras,
    exportFilename: "receita-safras",
    fullPageHref: "/agro/capacidade-pagamento",
  }),

  ebitda: (): DrillPayload => ({
    eyebrow: "Fonte da informação · Agro",
    title: "EBITDA Projetado",
    subtitle: `Margem operacional ${capacidadePagamento.margemOperacional}%`,
    tone: "positive",
    kpis: [
      { label: "EBITDA", value: fmtAgro(capacidadePagamento.projecaoSafras[2].ebitda) },
      { label: "Margem", value: pct(capacidadePagamento.margemOperacional) },
      { label: "EBITDA / Serv.Dívida", value: capacidadePagamento.ebitdaServicoDivida.toFixed(2) },
      { label: "Liquidez Corrente", value: capacidadePagamento.liquidezCorrente.toFixed(2) },
    ],
    columns: [
      { key: "safra", label: "Safra" },
      { key: "receita", label: "Receita", align: "right", format: (v) => fmtAgro(v as number) },
      { key: "custos", label: "Custos", align: "right", format: (v) => fmtAgro(v as number) },
      { key: "ebitda", label: "EBITDA", align: "right", format: (v) => fmtAgro(v as number) },
    ],
    rows: capacidadePagamento.projecaoSafras,
    exportFilename: "ebitda-safras",
    fullPageHref: "/agro/capacidade-pagamento",
  }),

  dividaTotal: (): DrillPayload => {
    const total = dividasAgro.reduce((s, d) => s + d.valor, 0);
    return {
      eyebrow: "Fonte da informação · Agro",
      title: "Endividamento Rural",
      subtitle: `${dividasAgro.length} contratos · Total ${fmtAgro(total)}`,
      tone: "warning",
      kpis: [
        { label: "Saldo total", value: fmtAgro(total) },
        { label: "Contratos", value: String(dividasAgro.length) },
        { label: "Custo médio", value: pct(dividasAgro.reduce((s, d) => s + d.taxaAno * d.valor, 0) / total) },
        { label: "Vence 12m", value: fmtAgro(cronogramaDividas.reduce((s, c) => s + c.principal, 0)) },
      ],
      columns: [
        { key: "credor", label: "Credor" },
        { key: "linha", label: "Linha" },
        { key: "valor", label: "Saldo", align: "right", format: (v) => fmtAgro(v as number) },
        { key: "taxaAno", label: "Taxa a.a.", align: "right", format: (v) => `${v}%` },
        { key: "vencimento", label: "Vencimento" },
        { key: "garantia", label: "Garantia" },
        { key: "status", label: "Status", align: "center", format: (v) => statusBadge(v as string) },
      ],
      rows: dividasAgro,
      exportFilename: "endividamento-agro",
      fullPageHref: "/agro/endividamento",
    };
  },

  margemOperacional: (): DrillPayload => ({
    eyebrow: "Fonte da informação · Agro",
    title: "Custeio da Safra — Soja",
    subtitle: `${custeioSafra.cultura} · ${fmtHa(custeioSafra.hectares)}`,
    tone: "agro",
    kpis: [
      { label: "Receita projetada", value: fmtAgro(custeioSafra.receitaProjetada) },
      { label: "Custo total", value: fmtAgro(custeioSafra.custoTotal) },
      { label: "Margem bruta", value: fmtAgro(custeioSafra.margemBrutaProjetada) },
      { label: "Pto. equilíbrio", value: `${custeioSafra.pontoEquilibrio} sc/ha` },
    ],
    columns: [
      { key: "categoria", label: "Rubrica" },
      { key: "valorPorHa", label: "R$/ha", align: "right", format: (v) => fmtAgro(v as number) },
      { key: "total", label: "Total", align: "right", format: (v) => fmtAgro(v as number) },
      { key: "pct", label: "% custo", align: "right", format: (v) => `${v}%` },
    ],
    rows: custeioSafra.custos,
    exportFilename: "custeio-soja",
    fullPageHref: "/agro/custeio-safra",
  }),

  lastroPatrimonialDrill: (): DrillPayload => ({
    eyebrow: "Fonte da informação · Agro",
    title: "Lastro Patrimonial",
    subtitle: `${fmtAgro(totalLastro)} em ativos`,
    tone: "navy",
    kpis: [
      { label: "Total", value: fmtAgro(totalLastro) },
      { label: "Categorias", value: String(lastroPatrimonial.composicao.length) },
      { label: "Bens cadastrados", value: String(lastroPatrimonial.bens.length) },
    ],
    columns: [
      { key: "categoria", label: "Categoria" },
      { key: "valor", label: "Valor", align: "right", format: (v) => fmtAgro(v as number) },
      { key: "observacao", label: "Observação" },
    ],
    rows: lastroPatrimonial.composicao,
    renderExtra: () => (
      <div>
        <p className="text-[10px] uppercase tracking-[0.16em] text-gold-dark font-semibold mb-2">
          Bens individualizados
        </p>
        <div className="rounded-md border border-border overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left px-3 py-2">Tipo</th>
                <th className="text-left px-3 py-2">Descrição</th>
                <th className="text-right px-3 py-2">Valor</th>
                <th className="text-center px-3 py-2">Situação</th>
              </tr>
            </thead>
            <tbody>
              {lastroPatrimonial.bens.map((b, i) => (
                <tr key={i} className="border-t border-border/60">
                  <td className="px-3 py-2 text-navy">{b.tipo}</td>
                  <td className="px-3 py-2 text-foreground/80">{b.descricao}</td>
                  <td className="px-3 py-2 text-right tabular text-navy">{fmtAgro(b.valor)}</td>
                  <td className="px-3 py-2 text-center text-[10px] text-muted-foreground">{b.situacao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
    exportFilename: "lastro-patrimonial",
    fullPageHref: "/agro/lastro-patrimonial",
  }),

  rebanho: (): DrillPayload => ({
    eyebrow: "Fonte da informação · Agro",
    title: "Rebanho — Composição por Categoria",
    subtitle: `${num(pecuaria.rebanhoTotal)} cabeças · ${fmtAgro(totalRebanhoValor)} em valor`,
    tone: "agro",
    kpis: [
      { label: "Total cabeças", value: num(pecuaria.rebanhoTotal) },
      { label: "Valor rebanho", value: fmtAgro(totalRebanhoValor) },
      { label: "GMD médio", value: `${pecuaria.gmd} kg/d` },
      { label: "Taxa prenhez", value: pct(pecuaria.taxaPrenhez) },
    ],
    columns: [
      { key: "categoria", label: "Categoria" },
      { key: "qtde", label: "Cab.", align: "right", format: (v) => num(v as number) },
      { key: "peso", label: "Peso médio", align: "right", format: (v) => `${v} kg` },
      { key: "valorCab", label: "R$/cab", align: "right", format: (v) => fmtAgro(v as number) },
      { key: "valorTotal", label: "Valor total", align: "right", format: (_, r: { qtde: number; valorCab: number }) => fmtAgro(r.qtde * r.valorCab) },
    ],
    rows: pecuaria.categorias,
    exportFilename: "rebanho",
    fullPageHref: "/agro/pecuaria",
  }),

  cotacoesDrill: (): DrillPayload => ({
    eyebrow: "Fonte da informação · Agro",
    title: "Cotações de Mercado",
    subtitle: "Histórico 7 meses · commodities relevantes",
    tone: "gold",
    kpis: [
      { label: "Boi gordo", value: `R$ ${cotacoes.boiGordo.atual}/@`, hint: pct(((cotacoes.boiGordo.atual - cotacoes.boiGordo.anterior) / cotacoes.boiGordo.anterior) * 100) },
      { label: "Soja", value: `R$ ${cotacoes.soja.atual}/sc`, hint: pct(((cotacoes.soja.atual - cotacoes.soja.anterior) / cotacoes.soja.anterior) * 100) },
      { label: "Milho", value: `R$ ${cotacoes.milho.atual}/sc`, hint: pct(((cotacoes.milho.atual - cotacoes.milho.anterior) / cotacoes.milho.anterior) * 100) },
      { label: "Dólar", value: `R$ ${cotacoes.dolar.atual}`, hint: pct(((cotacoes.dolar.atual - cotacoes.dolar.anterior) / cotacoes.dolar.anterior) * 100) },
    ],
    columns: [
      { key: "mes", label: "Mês" },
      { key: "boi", label: "Boi @", align: "right", format: (v) => `R$ ${v}` },
      { key: "soja", label: "Soja sc", align: "right", format: (v) => `R$ ${v}` },
      { key: "milho", label: "Milho sc", align: "right", format: (v) => `R$ ${v}` },
      { key: "dolar", label: "Dólar", align: "right", format: (v) => `R$ ${v}` },
    ],
    rows: cotacoes.boiGordo.historico.map((h, i) => ({
      mes: h.mes,
      boi: h.valor,
      soja: cotacoes.soja.historico[i]?.valor,
      milho: cotacoes.milho.historico[i]?.valor,
      dolar: cotacoes.dolar.historico[i]?.valor,
    })),
    exportFilename: "cotacoes",
    fullPageHref: "/agro/mercado-cotacoes",
  }),

  riscoCreditoDrill: (): DrillPayload => ({
    eyebrow: "Fonte da informação · Agro",
    title: "Risco de Crédito — Alertas",
    subtitle: `Score ${riscoCredito.scoreSerasa} · ${riscoCredito.classificacao}`,
    tone: "warning",
    kpis: [
      { label: "Score Serasa", value: String(riscoCredito.scoreSerasa) },
      { label: "Rating", value: riscoCredito.rating },
      { label: "Limite", value: fmtAgro(riscoCredito.limiteAprovado) },
      { label: "Utilização", value: pct(riscoCredito.utilizacao) },
    ],
    columns: [
      { key: "tipo", label: "Tipo" },
      { key: "severidade", label: "Severidade", align: "center", format: (v) => statusBadge(v as string) },
      { key: "titulo", label: "Alerta" },
      { key: "descricao", label: "Detalhe" },
    ],
    rows: riscoCredito.alertas,
    exportFilename: "risco-alertas",
    fullPageHref: "/agro/risco-credito",
  }),

  fluxoProjetadoDrill: (): DrillPayload => ({
    eyebrow: "Fonte da informação · Agro",
    title: "Fluxo Projetado da Safra",
    subtitle: "12 meses · entradas, saídas e eventos",
    tone: "agro",
    kpis: [
      { label: "Entradas 12m", value: fmtAgro(fluxoProjetado.reduce((s, m) => s + m.entradas, 0)) },
      { label: "Saídas 12m", value: fmtAgro(fluxoProjetado.reduce((s, m) => s + m.saidas, 0)) },
      { label: "Saldo 12m", value: fmtAgro(fluxoProjetado.reduce((s, m) => s + m.saldo, 0)) },
      { label: "Pico", value: fluxoProjetado.reduce((b, m) => (m.saldo > b.saldo ? m : b)).mes },
    ],
    columns: [
      { key: "mes", label: "Mês" },
      { key: "evento", label: "Evento" },
      { key: "entradas", label: "Entradas", align: "right", format: (v) => fmtAgro(v as number) },
      { key: "saidas", label: "Saídas", align: "right", format: (v) => fmtAgro(v as number) },
      { key: "saldo", label: "Saldo", align: "right", format: (v) => {
        const n = v as number;
        return <span className={n < 0 ? "text-negative font-semibold" : "text-positive font-semibold"}>{fmtAgro(n)}</span>;
      }},
    ],
    rows: fluxoProjetado,
    exportFilename: "fluxo-projetado",
    fullPageHref: "/agro/fluxo-projetado",
  }),

  insightEvidenciaAgro: (i: number): DrillPayload => {
    const ins = insightsAgro[i];
    const rows: Record<string, unknown>[] =
      /boi/i.test(ins.titulo)
        ? pecuaria.categorias.filter((c) => /Boi|Novilho/i.test(c.categoria))
        : /soja|hedge/i.test(ins.titulo)
        ? cotacoes.soja.historico
        : /Bradesco|Pronaf/i.test(ins.titulo)
        ? dividasAgro.filter((d) => /Bradesco|Banco/i.test(d.credor))
        : /pecuária|GMD/i.test(ins.titulo)
        ? [pecuaria]
        : /milho|hídrico/i.test(ins.titulo)
        ? riscoCredito.alertas.filter((a) => a.tipo === "clima")
        : [];
    return {
      eyebrow: "Evidência do Insight · Agro",
      title: ins.titulo,
      subtitle: ins.descricao,
      tone: ins.tipo === "oportunidade" ? "positive" : ins.tipo === "alerta" ? "warning" : "gold",
      kpis: ins.valor
        ? [{ label: "Impacto estimado", value: fmtAgro(ins.valor as number) }]
        : undefined,
      narrative: "Base de dados utilizada pela Inteligência Melazzo para gerar este insight.",
      columns: rows.length && "categoria" in rows[0] && "qtde" in rows[0]
        ? [
            { key: "categoria", label: "Categoria" },
            { key: "qtde", label: "Cab.", align: "right" },
            { key: "valorCab", label: "R$/cab", align: "right", format: (v) => fmtAgro(v as number) },
          ]
        : rows.length && "credor" in rows[0]
        ? [
            { key: "credor", label: "Credor" },
            { key: "valor", label: "Saldo", align: "right", format: (v) => fmtAgro(v as number) },
            { key: "taxaAno", label: "Taxa a.a.", align: "right", format: (v) => `${v}%` },
          ]
        : rows.length && "mes" in rows[0]
        ? [
            { key: "mes", label: "Mês" },
            { key: "valor", label: "Cotação", align: "right", format: (v) => `R$ ${v}` },
          ]
        : rows.length && "titulo" in rows[0]
        ? [
            { key: "titulo", label: "Alerta" },
            { key: "severidade", label: "Severidade", align: "center", format: (v) => statusBadge(v as string) },
          ]
        : [],
      rows,
      emptyMessage: "Insight de tendência — base agregada, sem listagem analítica.",
      exportFilename: `insight-agro-${i + 1}`,
      fullPageHref: "/agro/risco-credito",
    };
  },
};

// ═══════════════════════════════════════════════════════════════════
// COBRANÇA — Visão Geral
// ═══════════════════════════════════════════════════════════════════

export const cobrancaDrills = {
  carteiraAtiva: (): DrillPayload => {
    const total = aging.reduce((s, a) => s + a.valor, 0);
    return {
      eyebrow: "Fonte da informação · Cobrança",
      title: "Carteira Ativa — Distribuição",
      subtitle: `${num(empresaCobranca.contratos)} contratos · ${fmtCob(total)}`,
      tone: "cobranca",
      kpis: [
        { label: "Carteira", value: fmtKCob(total) },
        { label: "Contratos", value: num(empresaCobranca.contratos) },
        { label: "Ticket médio", value: fmtCob(empresaCobranca.ticketMedio) },
        { label: "% A vencer", value: pct((aging[0].valor / total) * 100) },
      ],
      columns: [
        { key: "produto", label: "Produto" },
        { key: "valor", label: "Carteira", align: "right", format: (v) => fmtCob(v as number) },
        { key: "share", label: "% Total", align: "right", format: (v) => `${v}%` },
      ],
      rows: carteiraPorProduto,
      exportFilename: "carteira-produto",
      fullPageHref: "/cobranca/carteira-aging",
    };
  },

  inadimplencia: (): DrillPayload => {
    const inad = aging.filter((a) => a.faixa.includes("91") || a.faixa.includes("180+"));
    const total = inad.reduce((s, a) => s + a.valor, 0);
    return {
      eyebrow: "Fonte da informação · Cobrança",
      title: "Inadimplência 90+ — Top Devedores",
      subtitle: `${empresaCobranca.inadimplencia}% da carteira · ${fmtCob(total)} expostos`,
      tone: "negative",
      kpis: [
        { label: "Inadimplência", value: pct(empresaCobranca.inadimplencia) },
        { label: "Valor 90+", value: fmtKCob(total) },
        { label: "Contratos 90+", value: num(inad.reduce((s, a) => s + a.contratos, 0)) },
        { label: "PDD vinculada", value: fmtKCob(inad.reduce((s, a) => s + a.pdd, 0)) },
      ],
      narrative:
        "Os 8 maiores devedores concentram parcela relevante da exposição crítica. Lista priorizada para abordagem.",
      columns: [
        { key: "id", label: "Contrato" },
        { key: "cliente", label: "Cliente" },
        { key: "produto", label: "Produto" },
        { key: "valor", label: "Saldo", align: "right", format: (v) => fmtCob(v as number) },
        { key: "atraso", label: "Atraso", align: "right", format: (v) => `${v}d` },
        { key: "fase", label: "Fase", align: "center", format: (v) => statusBadge(v as string) },
      ],
      rows: topDevedores,
      exportFilename: "top-devedores",
      fullPageHref: "/cobranca/top-devedores",
    };
  },

  recuperado: (): DrillPayload => ({
    eyebrow: "Fonte da informação · Cobrança",
    title: "Recuperação Mensal",
    subtitle: "Histórico 7 meses · acordos firmados",
    tone: "positive",
    kpis: [
      { label: "Recuperado mês", value: fmtKCob(evolucaoMensal[evolucaoMensal.length - 1].recuperado) },
      { label: "Acumulado 7m", value: fmtKCob(evolucaoMensal.reduce((s, m) => s + m.recuperado, 0)) },
      { label: "Acordos no mês", value: num(acordosFirmados[acordosFirmados.length - 1].quantidade) },
      { label: "Cumprimento", value: pct(acordosFirmados[acordosFirmados.length - 1].taxaCumprimento) },
    ],
    columns: [
      { key: "mes", label: "Mês" },
      { key: "quantidade", label: "Acordos", align: "right" },
      { key: "valor", label: "Valor recuperado", align: "right", format: (v) => fmtCob(v as number) },
      { key: "taxaCumprimento", label: "Cumprimento", align: "right", format: (v) => `${v}%` },
    ],
    rows: acordosFirmados,
    exportFilename: "recuperacao-mensal",
    fullPageHref: "/cobranca/acordos",
  }),

  pdd: (): DrillPayload => {
    const total = aging.reduce((s, a) => s + a.pdd, 0);
    return {
      eyebrow: "Fonte da informação · Cobrança",
      title: "PDD — Provisão por Aging",
      subtitle: `Provisão acumulada: ${fmtCob(total)}`,
      tone: "warning",
      kpis: [
        { label: "PDD total", value: fmtKCob(total) },
        { label: "% carteira", value: pct((total / aging.reduce((s, a) => s + a.valor, 0)) * 100) },
        { label: "Maior faixa", value: aging.reduce((b, a) => (a.pdd > b.pdd ? a : b)).faixa },
      ],
      columns: [
        { key: "faixa", label: "Faixa" },
        { key: "contratos", label: "Contratos", align: "right" },
        { key: "valor", label: "Valor", align: "right", format: (v) => fmtCob(v as number) },
        { key: "pdd", label: "PDD", align: "right", format: (v) => fmtCob(v as number) },
        { key: "taxa", label: "Taxa PDD", align: "right" },
      ],
      rows: aging.map((a) => ({
        ...a,
        taxa: a.valor > 0 ? `${((a.pdd / a.valor) * 100).toFixed(1)}%` : "—",
      })),
      exportFilename: "pdd-aging",
      fullPageHref: "/cobranca/carteira-aging",
    };
  },

  agingFaixa: (faixa: typeof aging[number]): DrillPayload => {
    // top devedores filtrados pela faixa de atraso
    const filtrar = (atraso: number) => {
      if (faixa.faixa === "A vencer") return atraso < 0;
      if (faixa.faixa === "1-30 dias") return atraso >= 1 && atraso <= 30;
      if (faixa.faixa === "31-60 dias") return atraso >= 31 && atraso <= 60;
      if (faixa.faixa === "61-90 dias") return atraso >= 61 && atraso <= 90;
      if (faixa.faixa === "91-180 dias") return atraso >= 91 && atraso <= 180;
      return atraso > 180;
    };
    const rows = topDevedores.filter((d) => filtrar(d.atraso));
    return {
      eyebrow: "Fonte da informação · Cobrança",
      title: `Aging — ${faixa.faixa}`,
      subtitle: `${num(faixa.contratos)} contratos · ${fmtCob(faixa.valor)} expostos`,
      tone: faixa.faixa.includes("180") || faixa.faixa.includes("91") ? "negative" : "warning",
      kpis: [
        { label: "Valor faixa", value: fmtKCob(faixa.valor) },
        { label: "Contratos", value: num(faixa.contratos) },
        { label: "PDD", value: fmtKCob(faixa.pdd) },
        { label: "% carteira", value: pct((faixa.valor / aging.reduce((s, a) => s + a.valor, 0)) * 100) },
      ],
      narrative: rows.length
        ? `Mostrando ${rows.length} contratos de exemplo nessa faixa. A base completa traz ${num(faixa.contratos)} contratos.`
        : "Faixa sem destaques na amostra de top devedores. Acesse a página completa para ver todos os contratos.",
      columns: [
        { key: "id", label: "Contrato" },
        { key: "cliente", label: "Cliente" },
        { key: "produto", label: "Produto" },
        { key: "valor", label: "Saldo", align: "right", format: (v) => fmtCob(v as number) },
        { key: "atraso", label: "Atraso", align: "right", format: (v) => `${v}d` },
        { key: "fase", label: "Fase", align: "center", format: (v) => statusBadge(v as string) },
      ],
      rows,
      emptyMessage: "Sem contratos nesta faixa entre os top devedores. Veja a página completa.",
      exportFilename: `aging-${faixa.faixa.replace(/\s+/g, "-")}`,
      fullPageHref: "/cobranca/carteira-aging",
    };
  },

  produtoCarteira: (produto: typeof carteiraPorProduto[number]): DrillPayload => {
    const rows = topDevedores.filter((d) => d.produto === produto.produto);
    return {
      eyebrow: "Fonte da informação · Cobrança",
      title: `Carteira — ${produto.produto}`,
      subtitle: `${fmtCob(produto.valor)} · ${produto.share}% da carteira total`,
      tone: "cobranca",
      kpis: [
        { label: "Carteira", value: fmtKCob(produto.valor) },
        { label: "Share", value: `${produto.share}%` },
        { label: "Top devedores listados", value: String(rows.length) },
      ],
      columns: [
        { key: "id", label: "Contrato" },
        { key: "cliente", label: "Cliente" },
        { key: "valor", label: "Saldo", align: "right", format: (v) => fmtCob(v as number) },
        { key: "atraso", label: "Atraso", align: "right", format: (v) => `${v}d` },
        { key: "fase", label: "Fase", align: "center", format: (v) => statusBadge(v as string) },
      ],
      rows,
      emptyMessage: "Sem destaques deste produto na amostra.",
      exportFilename: `carteira-${produto.produto.replace(/\s+/g, "-")}`,
      fullPageHref: "/cobranca/carteira-aging",
    };
  },

  equipeDrill: (): DrillPayload => {
    const total = equipe.reduce((s, e) => s + e.recuperado, 0);
    return {
      eyebrow: "Fonte da informação · Cobrança",
      title: "Performance da Equipe",
      subtitle: `${equipe.length} operadores · ${fmtKCob(total)} recuperados`,
      tone: "navy",
      kpis: [
        { label: "Operadores", value: String(equipe.length) },
        { label: "Recuperado", value: fmtKCob(total) },
        { label: "Acordos", value: num(equipe.reduce((s, e) => s + e.acordos, 0)) },
        { label: "Top performer", value: equipe.reduce((b, e) => (e.taxa > b.taxa ? e : b)).iniciais },
      ],
      columns: [
        { key: "nome", label: "Operador" },
        { key: "contatos", label: "Contatos", align: "right" },
        { key: "acordos", label: "Acordos", align: "right" },
        { key: "recuperado", label: "Recuperado", align: "right", format: (v) => fmtCob(v as number) },
        { key: "taxa", label: "Conversão", align: "right", format: (v) => `${v}%` },
        { key: "meta", label: "% Meta", align: "right", format: (v) => {
          const n = v as number;
          return <span className={n >= 100 ? "text-positive font-semibold" : n >= 80 ? "text-warning" : "text-negative"}>{n}%</span>;
        }},
      ],
      rows: equipe,
      exportFilename: "equipe-performance",
      fullPageHref: "/cobranca/performance",
    };
  },

  reguaDrill: (): DrillPayload => ({
    eyebrow: "Fonte da informação · Cobrança",
    title: "Régua de Cobrança",
    subtitle: "Acionamentos por canal · taxa de resposta e custo",
    tone: "gold",
    kpis: [
      { label: "Etapas ativas", value: String(reguaCobranca.filter((r) => r.ativa).length) },
      { label: "Custo médio", value: `R$ ${(reguaCobranca.reduce((s, r) => s + r.custo, 0) / reguaCobranca.length).toFixed(2)}` },
      { label: "Maior taxa", value: pct(Math.max(...reguaCobranca.map((r) => r.taxa))) },
    ],
    columns: [
      { key: "dia", label: "Quando", align: "center" },
      { key: "canal", label: "Canal" },
      { key: "titulo", label: "Ação" },
      { key: "taxa", label: "Resposta", align: "right", format: (v) => `${v}%` },
      { key: "custo", label: "Custo/ação", align: "right", format: (v) => `R$ ${(v as number).toFixed(2)}` },
    ],
    rows: reguaCobranca,
    exportFilename: "regua-cobranca",
    fullPageHref: "/cobranca/regua-cobranca",
  }),

  juridicoDrill: (): DrillPayload => ({
    eyebrow: "Fonte da informação · Cobrança",
    title: "Operação Jurídica — Por Fase",
    subtitle: `${juridico.totalProcessos} processos · ${fmtCob(juridico.valorEmDisputa)} em disputa`,
    tone: "warning",
    kpis: [
      { label: "Processos", value: String(juridico.totalProcessos) },
      { label: "Em disputa", value: fmtKCob(juridico.valorEmDisputa) },
      { label: "Recuperado", value: fmtKCob(juridico.recuperadoJudicial) },
      { label: "Tempo médio", value: `${juridico.tempoMedioDias}d` },
    ],
    columns: [
      { key: "fase", label: "Fase" },
      { key: "quantidade", label: "Qtde", align: "right" },
      { key: "valor", label: "Valor", align: "right", format: (v) => fmtCob(v as number) },
    ],
    rows: juridico.porFase,
    exportFilename: "juridico-fases",
    fullPageHref: "/cobranca/juridico",
  }),

  insightEvidenciaCob: (i: number): DrillPayload => {
    const ins = insightsIA[i];
    const rows: Record<string, unknown>[] =
      /60-90|janela/i.test(ins.titulo)
        ? topDevedores.filter((d) => d.atraso >= 61 && d.atraso <= 90)
        : /CDC|Veículo|originação/i.test(ins.titulo)
        ? topDevedores.filter((d) => d.produto === "CDC Veículo")
        : /Paula|conversão|operador/i.test(ins.titulo)
        ? equipe
        : [];
    const cols: DrillColumn[] = rows.length && "cliente" in rows[0]
      ? [
          { key: "id", label: "Contrato" },
          { key: "cliente", label: "Cliente" },
          { key: "valor", label: "Saldo", align: "right", format: (v) => fmtCob(v as number) },
          { key: "atraso", label: "Atraso", align: "right", format: (v) => `${v}d` },
          { key: "fase", label: "Fase", align: "center", format: (v) => statusBadge(v as string) },
        ]
      : rows.length && "nome" in rows[0]
      ? [
          { key: "nome", label: "Operador" },
          { key: "acordos", label: "Acordos", align: "right" },
          { key: "taxa", label: "Conversão", align: "right", format: (v) => `${v}%` },
          { key: "recuperado", label: "Recuperado", align: "right", format: (v) => fmtCob(v as number) },
        ]
      : [];
    return {
      eyebrow: "Evidência do Insight · Cobrança",
      title: ins.titulo,
      subtitle: ins.descricao,
      tone:
        ins.tipo === "oportunidade" ? "positive" : ins.tipo === "alerta" ? "warning" : "gold",
      kpis: [{ label: "Impacto", value: ins.impacto }],
      narrative: "Base de dados utilizada pela Inteligência Melazzo para gerar este insight.",
      columns: cols,
      rows,
      emptyMessage: "Insight agregado — sem listagem analítica direta.",
      exportFilename: `insight-cob-${i + 1}`,
      fullPageHref: "/cobranca/top-devedores",
    };
  },
};
