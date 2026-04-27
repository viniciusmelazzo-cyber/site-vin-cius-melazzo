import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionCard } from "@/components/ui/section-card";
import { juridico, fmt, fmtK } from "@/data/mockCobranca";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, ResponsiveContainer,
} from "recharts";
import { Scale, Gavel, Clock, TrendingUp } from "lucide-react";
import { useDrillDown } from "@/hooks/use-drill-down";
import { cobrancaDrills } from "@/data/drillBuilders";

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--cobranca) / 0.3)",
  borderRadius: 4,
  fontSize: 12,
  color: "hsl(var(--navy))",
};

export default function Juridico() {
  const { openDrill } = useDrillDown();
  const drillJur = () => openDrill(cobrancaDrills.juridicoDrill());
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Risco"
        title="Visão Jurídica"
        description="Carteira em fase judicial · processos ativos, valor em disputa e taxa de sucesso histórica."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Processos ativos" value={juridico.totalProcessos.toString()} icon={<Gavel className="h-4 w-4" />} highlight onClick={drillJur} />
        <KpiCard label="Valor em disputa" value={fmtK(juridico.valorEmDisputa)} icon={<Scale className="h-4 w-4" />} onClick={drillJur} />
        <KpiCard label="Recuperado judicial" value={fmtK(juridico.recuperadoJudicial)} icon={<TrendingUp className="h-4 w-4" />} onClick={drillJur} />
        <KpiCard label="Tempo médio" value={`${juridico.tempoMedioDias}d`} icon={<Clock className="h-4 w-4" />} onClick={drillJur} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SectionCard title="Processos por Fase" subtitle="Funil judicial · quantidade e valor" icon={<Gavel className="h-5 w-5" />}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={juridico.porFase}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="fase" tick={{ fill: "hsl(var(--navy))", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tickFormatter={fmtK} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} />
                <RTooltip contentStyle={tooltipStyle} formatter={(v: number, name: string) => name === "valor" ? fmt(v) : v} />
                <Bar yAxisId="left" dataKey="quantidade" fill="hsl(var(--navy))" radius={[3, 3, 0, 0]} name="Quantidade" />
                <Bar yAxisId="right" dataKey="valor" fill="hsl(var(--cobranca))" radius={[3, 3, 0, 0]} name="Valor (R$)" />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>

        <div className="space-y-4">
          <div className="navy-card p-5 text-center">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold mb-2">Taxa de Sucesso</p>
            <p className="font-display text-5xl font-bold text-linen tabular">{juridico.taxaSucesso}%</p>
            <p className="text-xs text-linen/60 mt-2">dos processos com decisão favorável</p>
            <div className="mt-4 h-1.5 rounded-full bg-navy-medium overflow-hidden">
              <div className="h-full bg-gradient-to-r from-gold to-gold-light" style={{ width: `${juridico.taxaSucesso}%` }} />
            </div>
          </div>

          <div className="melazzo-card p-5">
            <p className="kpi-label">Custo médio por processo</p>
            <p className="kpi-value mt-1">R$ 2.840</p>
            <p className="text-xs text-muted-foreground mt-1">honorários + custas processuais</p>
          </div>

          <div className="melazzo-card p-5">
            <p className="kpi-label">Recuperação líquida</p>
            <p className="kpi-value mt-1">{fmtK(juridico.recuperadoJudicial - juridico.totalProcessos * 2840)}</p>
            <p className="text-xs text-positive mt-1">após custas</p>
          </div>
        </div>
      </div>

      <SectionCard title="Detalhamento por Fase">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Fase</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Processos</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Valor</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Ticket médio</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">% Total</th>
              </tr>
            </thead>
            <tbody>
              {juridico.porFase.map((f) => (
                <tr key={f.fase} className="border-b border-border/40 hover:bg-secondary/30 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-navy">{f.fase}</td>
                  <td className="py-2.5 px-3 text-right tabular text-foreground">{f.quantidade}</td>
                  <td className="py-2.5 px-3 text-right tabular font-semibold text-navy">{fmtK(f.valor)}</td>
                  <td className="py-2.5 px-3 text-right tabular text-muted-foreground">{fmtK(f.valor / f.quantidade)}</td>
                  <td className="py-2.5 px-3 text-right tabular text-muted-foreground">{((f.valor / juridico.valorEmDisputa) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
