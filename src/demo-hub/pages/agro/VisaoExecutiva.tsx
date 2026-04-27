import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionCard } from "@/components/ui/section-card";
import { ClickableCard } from "@/components/ui/clickable-card";
import { InsightCard } from "@/components/ui/insight-card";
import {
  fazenda, kpisVisaoExecutiva, capacidadePagamento, lastroPatrimonial,
  cotacoes, insightsAgro, fmt, fmtK,
} from "@/data/mockAgro";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, ResponsiveContainer,
} from "recharts";
import { DollarSign, TrendingUp, TrendingDown, Percent, Sprout, Beef, Wheat, MapPin } from "lucide-react";
import { useDrillDown } from "@/hooks/use-drill-down";
import { agroDrills } from "@/data/drillBuilders";

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--gold) / 0.3)",
  borderRadius: 4,
  fontSize: 12,
  fontFamily: "var(--font-body)",
  color: "hsl(var(--navy))",
};

export default function VisaoExecutiva() {
  const { openDrill } = useDrillDown();
  const formatKpi = (k: typeof kpisVisaoExecutiva[0]) => {
    if (k.format === "pct") return `${k.value}%`;
    return fmtK(k.value);
  };
  const calcDelta = (k: typeof kpisVisaoExecutiva[0]) =>
    k.format === "pct" ? k.value - k.prev : ((k.value - k.prev) / k.prev) * 100;

  const icons = [DollarSign, TrendingUp, TrendingDown, Percent];
  const kpiDrills = [
    () => openDrill(agroDrills.receitaSafra()),
    () => openDrill(agroDrills.ebitda()),
    () => openDrill(agroDrills.dividaTotal()),
    () => openDrill(agroDrills.margemOperacional()),
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Visão Executiva"
        title={`Bom dia, ${fazenda.proprietario.split(" ")[0]}`}
        description={`${fazenda.nome} · Safra ${fazenda.safra} · ${fazenda.area.toLocaleString("pt-BR")} hectares totais`}
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpisVisaoExecutiva.map((k, i) => {
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

      {/* Composição da operação */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="melazzo-card p-5 text-center">
          <Sprout className="h-7 w-7 text-agro mx-auto mb-2" />
          <p className="kpi-label">Lavoura (Soja)</p>
          <p className="font-display text-2xl font-bold text-navy mt-1">{fazenda.areaLavoura} ha</p>
          <p className="text-xs text-muted-foreground mt-1">{((fazenda.areaLavoura / fazenda.area) * 100).toFixed(0)}% da área</p>
        </div>
        <div className="melazzo-card p-5 text-center">
          <Beef className="h-7 w-7 text-gold-dark mx-auto mb-2" />
          <p className="kpi-label">Pecuária</p>
          <p className="font-display text-2xl font-bold text-navy mt-1">{fazenda.areaPastagem} ha</p>
          <p className="text-xs text-muted-foreground mt-1">{fazenda.rebanho.toLocaleString("pt-BR")} cabeças</p>
        </div>
        <div className="melazzo-card p-5 text-center">
          <MapPin className="h-7 w-7 text-finance-positive mx-auto mb-2" />
          <p className="kpi-label">Preservação Legal</p>
          <p className="font-display text-2xl font-bold text-navy mt-1">{fazenda.areaPreservacao} ha</p>
          <p className="text-xs text-muted-foreground mt-1">5% Reserva + APP</p>
        </div>
      </div>

      {/* Projeção 5 safras */}
      <SectionCard
        title="Projeção Plurianual de Safras"
        subtitle="Receita, EBITDA e serviço da dívida — 2022 → 2027"
      >
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={capacidadePagamento.projecaoSafras}>
            <defs>
              <linearGradient id="gReceita" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--navy))" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(var(--navy))" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gEbitda" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--agro))" stopOpacity={0.5} />
                <stop offset="100%" stopColor="hsl(var(--agro))" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="safra" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={fmtK} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
            <Area type="monotone" dataKey="receita" stroke="hsl(var(--navy))" strokeWidth={2} fill="url(#gReceita)" name="Receita" />
            <Area type="monotone" dataKey="ebitda" stroke="hsl(var(--agro))" strokeWidth={2} fill="url(#gEbitda)" name="EBITDA" />
          </AreaChart>
        </ResponsiveContainer>
      </SectionCard>

      {/* Cotações + Lastro */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ClickableCard onClick={() => openDrill(agroDrills.cotacoesDrill())} ariaLabel="Ver histórico de cotações">
          <SectionCard title="Cotações Atuais" subtitle="Mercado spot · Clique para histórico" icon={<Wheat className="h-5 w-5" />}>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Boi Gordo", ...cotacoes.boiGordo, color: "text-gold-dark" },
                { label: "Soja", ...cotacoes.soja, color: "text-agro" },
                { label: "Milho", ...cotacoes.milho, color: "text-finance-warning" },
                { label: "Dólar", ...cotacoes.dolar, color: "text-navy" },
              ].map((c) => {
                const delta = ((c.atual - c.anterior) / c.anterior) * 100;
                const up = delta >= 0;
                return (
                  <div key={c.label} className="p-4 bg-secondary/40 rounded border border-border">
                    <p className="kpi-label">{c.label}</p>
                    <p className={`font-display text-2xl font-bold tabular mt-1 ${c.color}`}>
                      {c.unidade === "R$" ? "R$ " : ""}{c.atual.toLocaleString("pt-BR", { minimumFractionDigits: c.unidade === "R$" ? 2 : 0 })}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{c.unidade}</p>
                    <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${up ? "text-positive" : "text-negative"}`}>
                      {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {Math.abs(delta).toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </ClickableCard>

        <ClickableCard onClick={() => openDrill(agroDrills.lastroPatrimonialDrill())} ariaLabel="Ver bens do lastro patrimonial">
          <SectionCard title="Composição do Lastro" subtitle={`Patrimônio total · ${fmtK(lastroPatrimonial.total)} · Clique para detalhar`}>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={lastroPatrimonial.composicao} layout="vertical" margin={{ left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tickFormatter={fmtK} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="categoria" tick={{ fill: "hsl(var(--navy))", fontSize: 10 }} axisLine={false} tickLine={false} width={140} />
                <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
                <Bar dataKey="valor" fill="hsl(var(--agro))" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>
        </ClickableCard>
      </div>

      {/* Insights */}
      <div>
        <div className="mb-4">
          <p className="section-label">Inteligência Melazzo</p>
          <h2 className="font-display text-2xl text-navy font-semibold mt-1">Insights Estratégicos</h2>
          <div className="ornament-line mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insightsAgro.slice(0, 3).map((ins, i) => (
            <InsightCard
              key={ins.titulo}
              tone={ins.tipo === "oportunidade" ? "positive" : ins.tipo === "alerta" ? "warning" : "neutral"}
              title={ins.titulo}
              description={ins.descricao}
              metric={ins.valor ? fmtK(ins.valor) : undefined}
              metricLabel={ins.valor ? "Impacto estimado" : undefined}
              onClick={() => openDrill(agroDrills.insightEvidenciaAgro(i))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
