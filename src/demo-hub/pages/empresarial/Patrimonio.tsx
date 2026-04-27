import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionCard } from "@/components/ui/section-card";
import {
  patrimonio, totalAtivos, totalPassivos, patrimonioLiquido, fmt, fmtK,
} from "@/data/mockData";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RTooltip,
} from "recharts";
import { Gem, ArrowUp, ArrowDown, Wallet } from "lucide-react";

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--gold) / 0.3)",
  borderRadius: 4, fontSize: 12, color: "hsl(var(--navy))",
};

const ativoColors = [
  "hsl(var(--navy))", "hsl(var(--gold))", "hsl(var(--navy-medium))",
  "hsl(var(--gold-light))", "hsl(var(--finance-positive))", "hsl(var(--navy-light))",
];
const passivoColors = [
  "hsl(var(--finance-negative))", "hsl(var(--finance-warning))",
  "hsl(var(--navy-light))", "hsl(var(--graphite))", "hsl(var(--muted-foreground))",
];

export default function Patrimonio() {
  const indiceLiquidez = totalAtivos / totalPassivos;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Posição Patrimonial"
        title="Patrimônio"
        description="Composição de ativos e passivos da operação consolidada."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Patrimônio Líquido" value={fmt(patrimonioLiquido)} icon={<Gem className="h-4 w-4" />} highlight />
        <KpiCard label="Total de Ativos" value={fmt(totalAtivos)} icon={<ArrowUp className="h-4 w-4" />} />
        <KpiCard label="Total de Passivos" value={fmt(totalPassivos)} icon={<ArrowDown className="h-4 w-4" />} />
        <KpiCard label="Índice de Liquidez" value={`${indiceLiquidez.toFixed(2)}x`} icon={<Wallet className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Composição de Ativos" subtitle={`Total: ${fmt(totalAtivos)}`}>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={patrimonio.ativos} dataKey="valor" nameKey="categoria" innerRadius={60} outerRadius={100} paddingAngle={2}>
                {patrimonio.ativos.map((_, i) => (
                  <Cell key={i} fill={ativoColors[i % ativoColors.length]} />
                ))}
              </Pie>
              <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {patrimonio.ativos.map((a, i) => {
              const pct = (a.valor / totalAtivos) * 100;
              return (
                <div key={a.categoria} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: ativoColors[i % ativoColors.length] }} />
                  <span className="flex-1 text-foreground">{a.categoria}</span>
                  <span className="text-muted-foreground tabular w-12 text-right">{pct.toFixed(1)}%</span>
                  <span className="tabular font-semibold text-navy w-24 text-right">{fmt(a.valor)}</span>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Composição de Passivos" subtitle={`Total: ${fmt(totalPassivos)}`}>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={patrimonio.passivos} dataKey="valor" nameKey="categoria" innerRadius={60} outerRadius={100} paddingAngle={2}>
                {patrimonio.passivos.map((_, i) => (
                  <Cell key={i} fill={passivoColors[i % passivoColors.length]} />
                ))}
              </Pie>
              <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {patrimonio.passivos.map((p, i) => {
              const pct = (p.valor / totalPassivos) * 100;
              return (
                <div key={p.categoria} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: passivoColors[i % passivoColors.length] }} />
                  <span className="flex-1 text-foreground">{p.categoria}</span>
                  <span className="text-muted-foreground tabular w-12 text-right">{pct.toFixed(1)}%</span>
                  <span className="tabular font-semibold text-navy w-24 text-right">{fmt(p.valor)}</span>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      <SectionCard navy title="Demonstração Patrimonial" subtitle="Resultado consolidado">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold mb-2">Total Ativos</p>
            <p className="font-display text-3xl font-bold text-linen tabular">{fmt(totalAtivos)}</p>
          </div>
          <div className="md:border-x border-gold/20">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold mb-2">Total Passivos</p>
            <p className="font-display text-3xl font-bold text-linen/80 tabular">{fmt(totalPassivos)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold mb-2">Patrimônio Líquido</p>
            <p className="font-display text-3xl font-bold text-gradient-gold tabular">{fmt(patrimonioLiquido)}</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
