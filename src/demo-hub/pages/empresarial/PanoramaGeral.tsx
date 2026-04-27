import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionCard } from "@/components/ui/section-card";
import { ClickableCard } from "@/components/ui/clickable-card";
import {
  kpisPanorama, faturamento12m, dre, fluxo6m, scoreSaude, insights,
  fmt, fmtK, cliente,
} from "@/data/mockData";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, ResponsiveContainer, Cell,
} from "recharts";
import { DollarSign, Percent, Wallet, TrendingDown, Sparkles, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useDrillDown } from "@/hooks/use-drill-down";
import { empresarialDrills } from "@/data/drillBuilders";

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--gold) / 0.3)",
  borderRadius: 4,
  fontSize: 12,
  fontFamily: "var(--font-body)",
  color: "hsl(var(--navy))",
};

export default function PanoramaGeral() {
  const { openDrill } = useDrillDown();
  const formatKpi = (k: typeof kpisPanorama[0]) => {
    if (k.format === "pct") return `${k.value}%`;
    return fmt(k.value);
  };
  const calcDelta = (k: typeof kpisPanorama[0]) =>
    k.format === "pct" ? k.value - k.prev : ((k.value - k.prev) / k.prev) * 100;

  const insightIcons = {
    oportunidade: <CheckCircle2 className="h-4 w-4 text-positive" />,
    alerta: <AlertTriangle className="h-4 w-4 text-warning" />,
    tendencia: <Sparkles className="h-4 w-4 text-gold-dark" />,
  };

  const icons = [DollarSign, Percent, Wallet, TrendingDown];
  const kpiDrills = [
    () => openDrill(empresarialDrills.faturamentoMes()),
    () => openDrill(empresarialDrills.margemLiquida()),
    () => openDrill(empresarialDrills.fluxoCaixa()),
    () => openDrill(empresarialDrills.endividamento()),
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Panorama Executivo"
        title={`Bom dia, ${cliente.socio.split(" ")[0]}`}
        description={`Visão consolidada de ${cliente.nome} · Atualizado hoje, ${new Date().toLocaleDateString("pt-BR")}`}
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpisPanorama.map((k, i) => {
          const Icon = icons[i];
          return (
            <KpiCard
              key={k.label}
              label={k.label}
              value={formatKpi(k)}
              delta={calcDelta(k)}
              inverse={k.inverse}
              icon={<Icon className="h-4 w-4" />}
              highlight={i === 0}
              onClick={kpiDrills[i]}
            />
          );
        })}
      </div>

      {/* Faturamento 12m + Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ClickableCard
          className="lg:col-span-2"
          onClick={() => openDrill(empresarialDrills.faturamentoMes())}
          ariaLabel="Ver detalhamento mensal do faturamento"
        >
          <SectionCard
            title="Evolução do Faturamento"
            subtitle="Últimos 12 meses · Revenda + Oficina · Clique para ver tabela mensal"
          >
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={faturamento12m}>
                <defs>
                  <linearGradient id="gNavy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--navy))" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="hsl(var(--navy))" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--gold))" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(var(--gold))" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={fmtK} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
                <Area type="monotone" dataKey="revenda" stackId="1" stroke="hsl(var(--navy))" strokeWidth={2} fill="url(#gNavy)" name="Revenda" />
                <Area type="monotone" dataKey="oficina" stackId="1" stroke="hsl(var(--gold))" strokeWidth={2} fill="url(#gGold)" name="Oficina" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-6 mt-2 justify-center">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-navy" /><span className="text-xs text-muted-foreground">Revenda</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-gold" /><span className="text-xs text-muted-foreground">Oficina</span></div>
            </div>
          </SectionCard>
        </ClickableCard>

        <ClickableCard
          onClick={() => openDrill(empresarialDrills.scoreSaude())}
          ariaLabel="Ver detalhamento do Score de Saúde"
        >
          <SectionCard navy title="Score de Saúde" subtitle="Diagnóstico Melazzo" icon={<Sparkles className="h-4 w-4" />}>
            <div className="text-center py-2">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-36 h-36 -rotate-90">
                  <circle cx="72" cy="72" r="60" stroke="hsl(var(--linen) / 0.1)" strokeWidth="8" fill="none" />
                  <circle
                    cx="72" cy="72" r="60"
                    stroke="hsl(var(--gold))"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(scoreSaude.score / 100) * 377} 377`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-5xl font-bold text-linen tabular">{scoreSaude.score}</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gold mt-1">{scoreSaude.classificacao}</span>
                </div>
              </div>
              <div className="divider-gold my-5" />
              <div className="space-y-2 text-left">
                {scoreSaude.pilares.slice(0, 4).map((p) => (
                  <div key={p.nome} className="flex items-center justify-between text-xs">
                    <span className="text-linen/80">{p.nome}</span>
                    <span className="text-gold font-semibold tabular">{p.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </ClickableCard>
      </div>

      {/* DRE + Fluxo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ClickableCard
          onClick={() => openDrill(empresarialDrills.margemLiquida())}
          ariaLabel="Ver DRE detalhada"
        >
          <SectionCard title="DRE Resumida" subtitle={`Mês corrente · Margem líquida ${dre.margemLiquida}% · Clique para detalhar`}>
            <div className="space-y-2">
              {[
                ["Receita Bruta", dre.receitaBruta, false],
                ["(–) Deduções", dre.deducoes, false],
                ["Receita Líquida", dre.receitaLiquida, true],
                ["(–) CMV", dre.cmv, false],
                ["Lucro Bruto", dre.lucroBruto, true],
                ["(–) Custos Fixos", dre.custosFixos, false],
                ["(–) Custos Variáveis", dre.custosVariaveis, false],
                ["Lucro Operacional", dre.lucroOperacional, true],
                ["(–) Desp. Financeiras", dre.despFinanceiras, false],
                ["Lucro Líquido", dre.lucroLiquido, true],
              ].map(([label, val, bold], i) => (
                <div
                  key={i}
                  className={`flex justify-between items-baseline px-3 py-2 rounded ${
                    bold ? "bg-secondary border-l-2 border-gold" : ""
                  }`}
                >
                  <span className={`text-sm ${bold ? "font-semibold text-navy" : "text-foreground"}`}>{label}</span>
                  <span className={`tabular text-sm ${bold ? "font-bold text-navy" : (val as number) < 0 ? "text-negative" : "text-foreground"}`}>
                    {fmt(val as number)}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>
        </ClickableCard>

        <ClickableCard
          onClick={() => openDrill(empresarialDrills.fluxoCaixa())}
          ariaLabel="Ver fluxo de caixa detalhado"
        >
          <SectionCard title="Fluxo de Caixa" subtitle="Entradas vs Saídas · 6 meses · Clique para detalhar">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={fluxo6m}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={fmtK} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
                <Bar dataKey="entradas" fill="hsl(var(--finance-positive))" radius={[3, 3, 0, 0]} name="Entradas" />
                <Bar dataKey="saidas" fill="hsl(var(--finance-negative))" radius={[3, 3, 0, 0]} name="Saídas" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 grid grid-cols-3 gap-3 text-center">
              <div><p className="kpi-label">Saldo médio</p><p className="text-sm font-semibold text-positive tabular mt-1">{fmt(fluxo6m.reduce((s, m) => s + m.saldo, 0) / fluxo6m.length)}</p></div>
              <div><p className="kpi-label">Melhor mês</p><p className="text-sm font-semibold text-navy tabular mt-1">{fluxo6m.reduce((b, m) => m.saldo > b.saldo ? m : b).mes}</p></div>
              <div><p className="kpi-label">Acumulado</p><p className="text-sm font-semibold text-gold-dark tabular mt-1">{fmt(fluxo6m.reduce((s, m) => s + m.saldo, 0))}</p></div>
            </div>
          </SectionCard>
        </ClickableCard>
      </div>

      {/* Insights */}
      <SectionCard title="Insights Estratégicos" subtitle="Análise automatizada — clique em um insight para ver as evidências" icon={<Sparkles className="h-5 w-5" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {insights.slice(0, 3).map((ins, i) => (
            <button
              key={i}
              type="button"
              onClick={() => openDrill(empresarialDrills.insightEvidencia(i))}
              className="text-left p-4 rounded border border-border bg-secondary/40 hover:border-gold hover:shadow-md hover:-translate-y-0.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 group"
            >
              <div className="flex items-start gap-2 mb-2">
                {insightIcons[ins.tipo as keyof typeof insightIcons]}
                <h3 className="font-display font-semibold text-sm text-navy leading-tight">{ins.titulo}</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{ins.descricao}</p>
              <div className="mt-3 flex items-center justify-between">
                {ins.valor !== null ? (
                  <p className="text-xs text-positive font-semibold tabular">+ {fmt(ins.valor!)}</p>
                ) : <span />}
                <span className="text-[10px] uppercase tracking-[0.16em] text-gold-dark font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver evidências →
                </span>
              </div>
            </button>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
