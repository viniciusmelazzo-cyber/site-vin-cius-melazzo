import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionCard } from "@/components/ui/section-card";
import { ClickableCard } from "@/components/ui/clickable-card";
import { InsightCard } from "@/components/ui/insight-card";
import {
  empresa, kpisVisaoGeral, evolucaoMensal, aging, carteiraPorProduto,
  insightsIA, fmt, fmtK,
} from "@/data/mockCobranca";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Wallet, TrendingDown, TrendingUp, ShieldCheck, Briefcase, Users } from "lucide-react";
import { useDrillDown } from "@/hooks/use-drill-down";
import { cobrancaDrills } from "@/data/drillBuilders";

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--cobranca) / 0.3)",
  borderRadius: 4,
  fontSize: 12,
  color: "hsl(var(--navy))",
};

export default function VisaoGeral() {
  const { openDrill } = useDrillDown();
  const formatKpi = (k: typeof kpisVisaoGeral[0]) => {
    if (k.format === "pct") return `${k.value}%`;
    return fmtK(k.value);
  };
  const calcDelta = (k: typeof kpisVisaoGeral[0]) =>
    k.format === "pct" ? k.value - k.prev : ((k.value - k.prev) / k.prev) * 100;

  const icons = [Wallet, TrendingDown, TrendingUp, ShieldCheck];
  const kpiDrills = [
    () => openDrill(cobrancaDrills.carteiraAtiva()),
    () => openDrill(cobrancaDrills.inadimplencia()),
    () => openDrill(cobrancaDrills.recuperado()),
    () => openDrill(cobrancaDrills.pdd()),
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Visão Geral"
        title={`Cockpit · ${empresa.nome}`}
        description={`${empresa.contratos.toLocaleString("pt-BR")} contratos ativos · Ticket médio ${fmtK(empresa.ticketMedio)} · Equipe de ${empresa.equipe} operadores`}
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpisVisaoGeral.map((k, i) => {
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

      {/* Composição operacional */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="melazzo-card p-5 text-center">
          <Briefcase className="h-7 w-7 text-cobranca mx-auto mb-2" />
          <p className="kpi-label">Carteira sob gestão</p>
          <p className="font-display text-2xl font-bold text-navy mt-1">{fmtK(empresa.carteiraAtiva)}</p>
          <p className="text-xs text-muted-foreground mt-1">{empresa.contratos.toLocaleString("pt-BR")} contratos</p>
        </div>
        <div className="melazzo-card p-5 text-center">
          <Users className="h-7 w-7 text-gold-dark mx-auto mb-2" />
          <p className="kpi-label">Equipe Operacional</p>
          <p className="font-display text-2xl font-bold text-navy mt-1">{empresa.equipe}</p>
          <p className="text-xs text-muted-foreground mt-1">operadores ativos</p>
        </div>
        <div className="melazzo-card p-5 text-center">
          <TrendingDown className="h-7 w-7 text-finance-warning mx-auto mb-2" />
          <p className="kpi-label">Inadimplência 90+</p>
          <p className="font-display text-2xl font-bold text-navy mt-1">{empresa.inadimplencia}%</p>
          <p className="text-xs text-muted-foreground mt-1">benchmark setor: 11,2%</p>
        </div>
      </div>

      {/* Evolução mensal */}
      <SectionCard
        title="Recuperação vs Novos Inadimplentes"
        subtitle="Últimos 7 meses · Tendência de virada na operação"
      >
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={evolucaoMensal}>
            <defs>
              <linearGradient id="gRecup" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--finance-positive))" stopOpacity={0.5} />
                <stop offset="100%" stopColor="hsl(var(--finance-positive))" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gNovos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--cobranca))" stopOpacity={0.5} />
                <stop offset="100%" stopColor="hsl(var(--cobranca))" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={fmtK} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
            <Area type="monotone" dataKey="recuperado" stroke="hsl(var(--finance-positive))" strokeWidth={2} fill="url(#gRecup)" name="Recuperado" />
            <Area type="monotone" dataKey="novos" stroke="hsl(var(--cobranca))" strokeWidth={2} fill="url(#gNovos)" name="Novos inadimplentes" />
          </AreaChart>
        </ResponsiveContainer>
      </SectionCard>

      {/* Aging + Produto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Distribuição por Aging" subtitle="Concentração por faixa · Clique numa barra para detalhar">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={aging} layout="vertical" margin={{ left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tickFormatter={fmtK} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="faixa" tick={{ fill: "hsl(var(--navy))", fontSize: 10 }} axisLine={false} tickLine={false} width={90} />
              <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
              <Bar
                dataKey="valor"
                radius={[0, 3, 3, 0]}
                cursor="pointer"
                onClick={(d: { payload?: typeof aging[number] }) => d?.payload && openDrill(cobrancaDrills.agingFaixa(d.payload))}
              >
                {aging.map((a, i) => <Cell key={i} fill={a.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Carteira por Produto" subtitle="Mix de exposição · Clique numa fatia para ver contratos">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={carteiraPorProduto}
                dataKey="valor"
                nameKey="produto"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
                paddingAngle={2}
                cursor="pointer"
                onClick={(d: { payload?: typeof carteiraPorProduto[number] }) =>
                  d?.payload && openDrill(cobrancaDrills.produtoCarteira(d.payload))
                }
              >
                {carteiraPorProduto.map((_, i) => (
                  <Cell
                    key={i}
                    fill={[
                      "hsl(var(--cobranca))",
                      "hsl(var(--gold))",
                      "hsl(var(--navy))",
                      "hsl(var(--finance-neutral))",
                    ][i]}
                  />
                ))}
              </Pie>
              <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Insights IA */}
      <div>
        <div className="mb-4">
          <p className="section-label">Inteligência Melazzo</p>
          <h2 className="font-display text-2xl text-navy font-semibold mt-1">Recomendações para a operação</h2>
          <div className="ornament-line mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insightsIA.map((ins, i) => (
            <InsightCard
              key={ins.titulo}
              tone={ins.tipo === "oportunidade" ? "positive" : ins.tipo === "alerta" ? "warning" : "neutral"}
              title={ins.titulo}
              description={ins.descricao}
              metric={ins.impacto}
              onClick={() => openDrill(cobrancaDrills.insightEvidenciaCob(i))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
