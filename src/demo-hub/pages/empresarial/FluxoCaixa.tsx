import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionCard } from "@/components/ui/section-card";
import { fluxo6m, proximosVencimentos, fmt, fmtK } from "@/data/mockData";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { Wallet, ArrowDownCircle, ArrowUpCircle, Calendar } from "lucide-react";
import { useDrillDown } from "@/hooks/use-drill-down";
import { empresarialDrills } from "@/data/drillBuilders";

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--gold) / 0.3)",
  borderRadius: 4, fontSize: 12, color: "hsl(var(--navy))",
};

export default function FluxoCaixa() {
  const { openDrill } = useDrillDown();
  const totalEntradas = fluxo6m.reduce((s, m) => s + m.entradas, 0);
  const totalSaidas = fluxo6m.reduce((s, m) => s + m.saidas, 0);
  const saldoAcumulado = totalEntradas - totalSaidas;
  const saldoAtual = fluxo6m[fluxo6m.length - 1].saldo;

  // Projeção 30d com base nos vencimentos + entradas estimadas
  const totalVencimentos = proximosVencimentos.reduce((s, v) => s + v.valor, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Resultado · Liquidez"
        title="Fluxo de Caixa"
        description="Movimentação financeira realizada e projetada — base para decisões de curto prazo."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Saldo Atual" value={fmt(saldoAtual)} icon={<Wallet className="h-4 w-4" />} highlight onClick={() => openDrill(empresarialDrills.fluxoCaixa())} />
        <KpiCard label="Entradas 6m" value={fmt(totalEntradas)} icon={<ArrowUpCircle className="h-4 w-4" />} onClick={() => openDrill(empresarialDrills.fluxoCaixa())} />
        <KpiCard label="Saídas 6m" value={fmt(totalSaidas)} icon={<ArrowDownCircle className="h-4 w-4" />} onClick={() => openDrill(empresarialDrills.fluxoCaixa())} />
        <KpiCard label="Saldo Acumulado 6m" value={fmt(saldoAcumulado)} icon={<Calendar className="h-4 w-4" />} onClick={() => openDrill(empresarialDrills.vencimentos())} drillLabel="Ver vencimentos" />
      </div>

      <SectionCard title="Evolução do Saldo" subtitle="Diferença entre entradas e saídas — últimos 6 meses">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={fluxo6m}>
            <defs>
              <linearGradient id="gSaldo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--gold))" stopOpacity={0.5} />
                <stop offset="100%" stopColor="hsl(var(--gold))" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={fmtK} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
            <ReferenceLine y={0} stroke="hsl(var(--border))" />
            <Area
              type="monotone" dataKey="saldo"
              stroke="hsl(var(--gold-dark))" strokeWidth={2.5}
              fill="url(#gSaldo)" name="Saldo Mensal"
            />
          </AreaChart>
        </ResponsiveContainer>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="Detalhamento Mensal" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-xs uppercase tracking-wider text-gold-dark font-semibold">Mês</th>
                  <th className="text-right py-2 text-xs uppercase tracking-wider text-gold-dark font-semibold">Entradas</th>
                  <th className="text-right py-2 text-xs uppercase tracking-wider text-gold-dark font-semibold">Saídas</th>
                  <th className="text-right py-2 text-xs uppercase tracking-wider text-gold-dark font-semibold">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {fluxo6m.map((m) => (
                  <tr key={m.mes} className="border-b border-border/40 hover:bg-secondary/40">
                    <td className="py-2.5 font-medium text-navy">{m.mes}</td>
                    <td className="py-2.5 text-right tabular text-positive">{fmt(m.entradas)}</td>
                    <td className="py-2.5 text-right tabular text-negative">{fmt(m.saidas)}</td>
                    <td className="py-2.5 text-right tabular font-semibold text-navy">{fmt(m.saldo)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard navy title="Projeção 30 dias" subtitle="Compromissos confirmados" icon={<Calendar className="h-4 w-4" />}>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gold mb-1">Saídas previstas</p>
              <p className="font-display text-3xl font-bold text-linen tabular">{fmt(totalVencimentos)}</p>
            </div>
            <div className="divider-gold" />
            <div className="space-y-1.5">
              {proximosVencimentos.slice(0, 6).map((v, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-linen/70">Dia {v.dia} · {v.descricao}</span>
                  <span className="text-gold tabular font-semibold">{fmt(v.valor)}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-linen/50 pt-2">+ {proximosVencimentos.length - 6} compromissos no calendário</p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
