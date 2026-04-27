import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionCard } from "@/components/ui/section-card";
import { fluxoProjetado, fmt, fmtK } from "@/data/mockAgro";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { TrendingUp, TrendingDown, Wallet, Calendar } from "lucide-react";

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--gold) / 0.3)",
  borderRadius: 4,
  fontSize: 12,
  color: "hsl(var(--navy))",
};

export default function FluxoProjetado() {
  let acc = 0;
  const dadosComAcc = fluxoProjetado.map((m) => {
    acc += m.saldo;
    return { ...m, acumulado: acc };
  });

  const totalEntradas = fluxoProjetado.reduce((s, m) => s + m.entradas, 0);
  const totalSaidas = fluxoProjetado.reduce((s, m) => s + m.saidas, 0);
  const saldoFinal = totalEntradas - totalSaidas;
  const piorMes = dadosComAcc.reduce((p, m) => m.acumulado < p.acumulado ? m : p);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Fluxo Projetado"
        title="Fluxo de Caixa por Safra"
        description="Projeção mensal de entradas e saídas — ciclo completo da safra 2025/26 (Mai/25 → Abr/26)."
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Entradas Projetadas" value={fmtK(totalEntradas)} icon={<TrendingUp className="h-4 w-4" />} />
        <KpiCard label="Saídas Projetadas" value={fmtK(totalSaidas)} icon={<TrendingDown className="h-4 w-4" />} />
        <KpiCard label="Saldo Acumulado" value={fmtK(saldoFinal)} icon={<Wallet className="h-4 w-4" />} highlight />
        <KpiCard label="Pior Momento" value={piorMes.mes} icon={<Calendar className="h-4 w-4" />} />
      </div>

      {/* Chart */}
      <SectionCard
        title="Projeção de Caixa"
        subtitle="Entradas, saídas e saldo acumulado mês a mês"
      >
        <ResponsiveContainer width="100%" height={340}>
          <ComposedChart data={dadosComAcc}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tickFormatter={fmtK} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tickFormatter={fmtK} tick={{ fill: "hsl(var(--gold-dark))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine yAxisId="right" y={0} stroke="hsl(var(--finance-negative))" strokeDasharray="3 3" />
            <Bar yAxisId="left" dataKey="entradas" fill="hsl(var(--finance-positive))" radius={[3, 3, 0, 0]} name="Entradas" />
            <Bar yAxisId="left" dataKey="saidas" fill="hsl(var(--finance-negative))" radius={[3, 3, 0, 0]} name="Saídas" />
            <Line yAxisId="right" type="monotone" dataKey="acumulado" stroke="hsl(var(--gold))" strokeWidth={3} dot={{ fill: "hsl(var(--gold))", r: 4 }} name="Saldo acumulado" />
          </ComposedChart>
        </ResponsiveContainer>
      </SectionCard>

      {/* Tabela detalhada */}
      <SectionCard title="Calendário de Eventos da Safra" subtitle="Mês a mês com evento associado">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Mês</th>
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Evento</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Entradas</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Saídas</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Saldo</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Acumulado</th>
              </tr>
            </thead>
            <tbody>
              {dadosComAcc.map((m) => (
                <tr key={m.mes} className="border-b border-border/40 hover:bg-secondary/30">
                  <td className="py-2.5 px-3 font-medium text-navy">{m.mes}</td>
                  <td className="py-2.5 px-3 text-xs text-muted-foreground">{m.evento}</td>
                  <td className="py-2.5 px-3 text-right tabular text-positive">{m.entradas > 0 ? fmtK(m.entradas) : "—"}</td>
                  <td className="py-2.5 px-3 text-right tabular text-negative">{fmtK(m.saidas)}</td>
                  <td className={`py-2.5 px-3 text-right tabular font-semibold ${m.saldo >= 0 ? "text-positive" : "text-negative"}`}>
                    {m.saldo >= 0 ? "+" : ""}{fmtK(m.saldo)}
                  </td>
                  <td className={`py-2.5 px-3 text-right tabular font-bold ${m.acumulado >= 0 ? "text-navy" : "text-negative"}`}>
                    {fmtK(m.acumulado)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
