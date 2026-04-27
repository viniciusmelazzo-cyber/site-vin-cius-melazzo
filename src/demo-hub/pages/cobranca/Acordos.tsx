import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionCard } from "@/components/ui/section-card";
import { acordosFirmados, fmt, fmtK } from "@/data/mockCobranca";
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, ResponsiveContainer, Legend,
} from "recharts";
import { FileSignature, TrendingUp, CheckCircle2, BarChart3 } from "lucide-react";

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--cobranca) / 0.3)",
  borderRadius: 4,
  fontSize: 12,
  color: "hsl(var(--navy))",
};

export default function Acordos() {
  const ultimo = acordosFirmados[acordosFirmados.length - 1];
  const totalQtd = acordosFirmados.reduce((s, m) => s + m.quantidade, 0);
  const totalValor = acordosFirmados.reduce((s, m) => s + m.valor, 0);
  const taxaMedia = acordosFirmados.reduce((s, m) => s + m.taxaCumprimento, 0) / acordosFirmados.length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Acordos"
        title="Acordos Firmados"
        description="Histórico mensal de acordos formalizados, valor recuperado e aderência ao pagamento."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Acordos no mês" value={ultimo.quantidade.toString()} icon={<FileSignature className="h-4 w-4" />} highlight />
        <KpiCard label="Valor recuperado" value={fmtK(ultimo.valor)} icon={<TrendingUp className="h-4 w-4" />} />
        <KpiCard label="Taxa de cumprimento" value={`${ultimo.taxaCumprimento}%`} icon={<CheckCircle2 className="h-4 w-4" />} />
        <KpiCard label="Total no período" value={totalQtd.toString()} icon={<BarChart3 className="h-4 w-4" />} />
      </div>

      <SectionCard
        title="Evolução Mensal"
        subtitle={`Quantidade vs valor recuperado · Taxa média ${taxaMedia.toFixed(0)}%`}
      >
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={acordosFirmados}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tickFormatter={fmtK} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <RTooltip contentStyle={tooltipStyle} formatter={(v: number, name: string) => name === "Valor recuperado" ? fmt(v) : `${v}`} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar yAxisId="left" dataKey="valor" fill="hsl(var(--cobranca))" radius={[3, 3, 0, 0]} name="Valor recuperado" />
            <Line yAxisId="right" type="monotone" dataKey="quantidade" stroke="hsl(var(--navy))" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(var(--gold))" }} name="Quantidade" />
            <Line yAxisId="right" type="monotone" dataKey="taxaCumprimento" stroke="hsl(var(--finance-positive))" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Cumprimento %" />
          </ComposedChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard title="Detalhamento mensal">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Mês</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Acordos</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Valor recuperado</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Ticket médio</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Cumprimento</th>
              </tr>
            </thead>
            <tbody>
              {acordosFirmados.map((m) => (
                <tr key={m.mes} className="border-b border-border/40 hover:bg-secondary/30 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-navy">{m.mes}</td>
                  <td className="py-2.5 px-3 text-right tabular text-foreground">{m.quantidade}</td>
                  <td className="py-2.5 px-3 text-right tabular font-semibold text-navy">{fmtK(m.valor)}</td>
                  <td className="py-2.5 px-3 text-right tabular text-muted-foreground">{fmtK(m.valor / m.quantidade)}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={m.taxaCumprimento >= 80 ? "badge-positive" : "badge-warning"}>
                      {m.taxaCumprimento}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-cobranca">
                <td className="py-3 px-3 font-semibold text-navy">Total</td>
                <td className="py-3 px-3 text-right tabular font-bold text-navy">{totalQtd}</td>
                <td className="py-3 px-3 text-right tabular font-bold text-navy">{fmtK(totalValor)}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
