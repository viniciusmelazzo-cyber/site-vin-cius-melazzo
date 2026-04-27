import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionCard } from "@/components/ui/section-card";
import { faturamento12m, fmt, fmtK } from "@/data/mockData";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Receipt, TrendingUp, Target, Award } from "lucide-react";

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--gold) / 0.3)",
  borderRadius: 4, fontSize: 12, color: "hsl(var(--navy))",
};

export default function FaturamentoGerencial() {
  const totalRevenda = faturamento12m.reduce((s, m) => s + m.revenda, 0);
  const totalOficina = faturamento12m.reduce((s, m) => s + m.oficina, 0);
  const total = totalRevenda + totalOficina;
  const ticketMedio = total / 12;
  const ultimo = faturamento12m[faturamento12m.length - 1];
  const penultimo = faturamento12m[faturamento12m.length - 2];
  const crescimento = ((ultimo.total - penultimo.total) / penultimo.total) * 100;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Resultado · Receita"
        title="Faturamento Gerencial"
        description="Análise consolidada da receita por linha de negócio nos últimos 12 meses."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Receita Acumulada 12m" value={fmt(total)} icon={<Receipt className="h-4 w-4" />} highlight />
        <KpiCard label="Ticket Médio Mensal" value={fmt(ticketMedio)} icon={<Target className="h-4 w-4" />} />
        <KpiCard label="Mês Atual" value={fmt(ultimo.total)} delta={crescimento} icon={<TrendingUp className="h-4 w-4" />} />
        <KpiCard label="Melhor Mês" value="Dez/24" icon={<Award className="h-4 w-4" />} />
      </div>

      <SectionCard title="Receita Mensal · Composição" subtitle="Barras = receita por unidade · Linha = total consolidado">
        <ResponsiveContainer width="100%" height={340}>
          <ComposedChart data={faturamento12m}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={fmtK} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            <Bar dataKey="revenda" stackId="a" fill="hsl(var(--navy))" name="Revenda" radius={[0, 0, 0, 0]} />
            <Bar dataKey="oficina" stackId="a" fill="hsl(var(--gold))" name="Oficina" radius={[3, 3, 0, 0]} />
            <Line type="monotone" dataKey="total" stroke="hsl(var(--finance-positive))" strokeWidth={2.5} dot={{ r: 4 }} name="Total Consolidado" />
          </ComposedChart>
        </ResponsiveContainer>
      </SectionCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard title="Mix por Unidade" subtitle="Participação acumulada 12 meses">
          <div className="space-y-4">
            {[
              { nome: "Revenda de Veículos", valor: totalRevenda, cor: "hsl(var(--navy))" },
              { nome: "Oficina Mecânica", valor: totalOficina, cor: "hsl(var(--gold))" },
            ].map((u) => {
              const pct = (u.valor / total) * 100;
              return (
                <div key={u.nome}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm font-medium text-navy">{u.nome}</span>
                    <span className="text-sm tabular text-gold-dark font-semibold">{pct.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-secondary rounded-sm overflow-hidden">
                    <div className="h-full rounded-sm transition-all duration-700" style={{ width: `${pct}%`, background: u.cor }} />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1 tabular">{fmt(u.valor)}</p>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Tabela Detalhada" subtitle="Últimos 6 meses">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-2 text-xs uppercase tracking-wider text-gold-dark font-semibold">Mês</th>
                  <th className="py-2 text-xs uppercase tracking-wider text-gold-dark font-semibold text-right">Revenda</th>
                  <th className="py-2 text-xs uppercase tracking-wider text-gold-dark font-semibold text-right">Oficina</th>
                  <th className="py-2 text-xs uppercase tracking-wider text-gold-dark font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {faturamento12m.slice(-6).map((m) => (
                  <tr key={m.mes} className="border-b border-border/40 hover:bg-secondary/40 transition-colors">
                    <td className="py-2.5 font-medium text-navy">{m.mes}</td>
                    <td className="py-2.5 text-right tabular">{fmt(m.revenda)}</td>
                    <td className="py-2.5 text-right tabular text-gold-dark">{fmt(m.oficina)}</td>
                    <td className="py-2.5 text-right tabular font-semibold text-navy">{fmt(m.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
