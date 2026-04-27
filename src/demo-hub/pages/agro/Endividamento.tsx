import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionCard } from "@/components/ui/section-card";
import { dividasAgro, cronogramaDividas, totalDividas, custoMedioDivida, fmt, fmtK } from "@/data/mockAgro";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, ResponsiveContainer,
} from "recharts";
import { TrendingDown, Landmark, Calendar, Percent } from "lucide-react";

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--gold) / 0.3)",
  borderRadius: 4,
  fontSize: 12,
  color: "hsl(var(--navy))",
};

export default function Endividamento() {
  const prazoMedio = dividasAgro.reduce((s, d) => s + d.prazo * d.valor, 0) / totalDividas;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Patrimônio & Crédito"
        title="Endividamento"
        description="Visão consolidada da dívida bancária, custo médio, cronograma e composição por linha de crédito."
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Dívida Total" value={fmtK(totalDividas)} icon={<TrendingDown className="h-4 w-4" />} highlight />
        <KpiCard label="Custo Médio" value={`${custoMedioDivida.toFixed(2)}% a.a.`} icon={<Percent className="h-4 w-4" />} />
        <KpiCard label="Prazo Médio" value={`${prazoMedio.toFixed(0)} meses`} icon={<Calendar className="h-4 w-4" />} />
        <KpiCard label="Credores Ativos" value={`${dividasAgro.length}`} icon={<Landmark className="h-4 w-4" />} />
      </div>

      {/* Cronograma */}
      <SectionCard
        title="Cronograma de Amortização"
        subtitle="Próximos 8 meses · Principal e juros"
      >
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={cronogramaDividas}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={fmtK} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
            <Bar dataKey="principal" stackId="a" fill="hsl(var(--navy))" radius={[0, 0, 0, 0]} name="Principal" />
            <Bar dataKey="juros" stackId="a" fill="hsl(var(--gold))" radius={[3, 3, 0, 0]} name="Juros" />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-6 mt-2 justify-center">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-navy" /><span className="text-xs text-muted-foreground">Principal</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-gold" /><span className="text-xs text-muted-foreground">Juros</span></div>
        </div>
      </SectionCard>

      {/* Tabela */}
      <SectionCard title="Carteira de Dívidas" subtitle="Detalhamento por contrato">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Credor</th>
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Linha</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Valor</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Taxa a.a.</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Prazo</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Vencimento</th>
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Garantia</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {dividasAgro.map((d) => (
                <tr key={d.id} className="border-b border-border/40 hover:bg-secondary/30 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-navy">{d.credor}</td>
                  <td className="py-2.5 px-3 text-muted-foreground text-xs">{d.linha}</td>
                  <td className="py-2.5 px-3 text-right tabular font-semibold text-navy">{fmtK(d.valor)}</td>
                  <td className={`py-2.5 px-3 text-right tabular ${d.taxaAno > 12 ? "text-negative font-semibold" : "text-foreground"}`}>{d.taxaAno.toFixed(1)}%</td>
                  <td className="py-2.5 px-3 text-right tabular text-foreground">{d.prazo}m</td>
                  <td className="py-2.5 px-3 text-right text-foreground text-xs">{d.vencimento}</td>
                  <td className="py-2.5 px-3 text-xs text-muted-foreground">{d.garantia}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={d.status === "ativa" ? "badge-positive" : d.status === "atencao" ? "badge-warning" : "badge-negative"}>
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gold">
                <td colSpan={2} className="py-3 px-3 font-semibold text-navy">Total</td>
                <td className="py-3 px-3 text-right tabular font-bold text-navy">{fmtK(totalDividas)}</td>
                <td className="py-3 px-3 text-right tabular font-semibold text-gold-dark">{custoMedioDivida.toFixed(2)}%</td>
                <td colSpan={4} />
              </tr>
            </tfoot>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
