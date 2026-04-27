import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionCard } from "@/components/ui/section-card";
import { InsightCard } from "@/components/ui/insight-card";
import { capacidadePagamento, fmt, fmtK } from "@/data/mockAgro";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Wallet, ShieldCheck, Activity, Droplets } from "lucide-react";

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--gold) / 0.3)",
  borderRadius: 4,
  fontSize: 12,
  color: "hsl(var(--navy))",
};

export default function CapacidadePagamento() {
  const safrasComCobertura = capacidadePagamento.projecaoSafras.map((s) => ({
    ...s,
    cobertura: s.ebitda / s.servicoDivida,
  }));

  const dscr = capacidadePagamento.dscr;
  const dscrTone = dscr >= 1.5 ? "positive" : dscr >= 1.2 ? "warning" : "critical";

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Patrimônio & Crédito"
        title="Capacidade de Pagamento"
        description="Indicadores de cobertura da dívida e projeção de geração de caixa para honrar compromissos financeiros."
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="DSCR Atual" value={`${dscr.toFixed(2)}x`} icon={<ShieldCheck className="h-4 w-4" />} highlight />
        <KpiCard label="Margem Operacional" value={`${capacidadePagamento.margemOperacional}%`} icon={<Activity className="h-4 w-4" />} />
        <KpiCard label="EBITDA / Serviço Dívida" value={`${capacidadePagamento.ebitdaServicoDivida.toFixed(1)}x`} icon={<Wallet className="h-4 w-4" />} />
        <KpiCard label="Liquidez Corrente" value={`${capacidadePagamento.liquidezCorrente.toFixed(1)}x`} icon={<Droplets className="h-4 w-4" />} />
      </div>

      {/* Insight DSCR */}
      <InsightCard
        tone={dscrTone}
        badge="Diagnóstico Melazzo"
        title={`Capacidade de pagamento ${dscr >= 1.5 ? "saudável" : dscr >= 1.2 ? "em atenção" : "comprometida"}`}
        description={
          dscr >= 1.5
            ? `O DSCR de ${dscr.toFixed(2)}x indica que a fazenda gera ${dscr.toFixed(1)}x o necessário para cobrir o serviço da dívida — patamar reconhecido pelo mercado como confortável (acima de 1,3x).`
            : `O DSCR de ${dscr.toFixed(2)}x está abaixo do patamar conservador. Recomenda-se revisar estrutura de capital ou alongar prazos.`
        }
        metric={`${dscr.toFixed(2)}x`}
        metricLabel="Debt Service Coverage Ratio"
      />

      {/* Projeção plurianual */}
      <SectionCard
        title="Projeção EBITDA × Serviço da Dívida"
        subtitle="Histórico de 3 safras + Projeção de 2 safras"
      >
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={safrasComCobertura}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="safra" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tickFormatter={fmtK} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: "hsl(var(--gold-dark))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <RTooltip contentStyle={tooltipStyle} formatter={(v: number, name: string) => name === "cobertura" ? `${v.toFixed(2)}x` : fmt(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar yAxisId="left" dataKey="ebitda" fill="hsl(var(--agro))" radius={[3, 3, 0, 0]} name="EBITDA" />
            <Bar yAxisId="left" dataKey="servicoDivida" fill="hsl(var(--finance-warning))" radius={[3, 3, 0, 0]} name="Serviço Dívida" />
            <Line yAxisId="right" type="monotone" dataKey="cobertura" stroke="hsl(var(--gold))" strokeWidth={3} dot={{ fill: "hsl(var(--gold))", r: 5 }} name="Cobertura (x)" />
          </ComposedChart>
        </ResponsiveContainer>
      </SectionCard>

      {/* Tabela detalhada */}
      <SectionCard title="Detalhamento por Safra" subtitle="Receita, custos, EBITDA e cobertura">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Safra</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Receita</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Custos</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">EBITDA</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Margem</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Serviço Dívida</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">DSCR</th>
              </tr>
            </thead>
            <tbody>
              {safrasComCobertura.map((s) => {
                const margem = (s.ebitda / s.receita) * 100;
                return (
                  <tr key={s.safra} className="border-b border-border/40 hover:bg-secondary/30 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-navy">{s.safra}</td>
                    <td className="py-2.5 px-3 text-right tabular text-foreground">{fmtK(s.receita)}</td>
                    <td className="py-2.5 px-3 text-right tabular text-negative">{fmtK(s.custos)}</td>
                    <td className="py-2.5 px-3 text-right tabular font-semibold text-positive">{fmtK(s.ebitda)}</td>
                    <td className="py-2.5 px-3 text-right tabular text-foreground">{margem.toFixed(1)}%</td>
                    <td className="py-2.5 px-3 text-right tabular text-foreground">{fmtK(s.servicoDivida)}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={s.cobertura >= 1.5 ? "badge-positive" : s.cobertura >= 1.2 ? "badge-warning" : "badge-negative"}>
                        {s.cobertura.toFixed(2)}x
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
