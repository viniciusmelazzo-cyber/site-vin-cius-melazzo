import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionCard } from "@/components/ui/section-card";
import { pipelineFases, vendedores, fmt, fmtK } from "@/data/mockData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, ResponsiveContainer, Cell,
} from "recharts";
import { Users, Target, TrendingUp, Award } from "lucide-react";
import { useDrillDown } from "@/hooks/use-drill-down";
import { empresarialDrills } from "@/data/drillBuilders";

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--gold) / 0.3)",
  borderRadius: 4, fontSize: 12, color: "hsl(var(--navy))",
};

const faseColors = ["hsl(var(--navy-light))", "hsl(var(--navy-medium))", "hsl(var(--navy))", "hsl(var(--gold-dark))", "hsl(var(--finance-positive))"];

export default function Pipeline() {
  const { openDrill } = useDrillDown();
  const totalLeads = pipelineFases[0].qtde;
  const totalFechados = pipelineFases[pipelineFases.length - 1].qtde;
  const conversao = (totalFechados / totalLeads) * 100;
  const valorPipeline = pipelineFases.slice(0, -1).reduce((s, f) => s + f.valor, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Comercial"
        title="Pipeline de Vendas"
        description="Funil comercial e desempenho da equipe de vendas."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Leads Totais" value={String(totalLeads)} icon={<Users className="h-4 w-4" />} highlight onClick={() => openDrill(empresarialDrills.pipelineFase())} />
        <KpiCard label="Pipeline Aberto" value={fmt(valorPipeline)} icon={<Target className="h-4 w-4" />} onClick={() => openDrill(empresarialDrills.pipelineFase())} />
        <KpiCard label="Taxa de Conversão" value={`${conversao.toFixed(1)}%`} icon={<TrendingUp className="h-4 w-4" />} onClick={() => openDrill(empresarialDrills.pipelineFase())} />
        <KpiCard label="Vendas Fechadas (mês)" value={String(totalFechados)} icon={<Award className="h-4 w-4" />} onClick={() => openDrill(empresarialDrills.pipelineFase("Fechado"))} />
      </div>

      <SectionCard title="Funil de Conversão" subtitle="Volume por etapa do pipeline">
        <div className="space-y-3">
          {pipelineFases.map((f, i) => {
            const pct = (f.qtde / totalLeads) * 100;
            return (
              <div key={f.fase} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium text-navy">{f.fase}</div>
                <div className="flex-1 h-9 bg-secondary rounded-sm overflow-hidden relative">
                  <div
                    className="h-full rounded-sm transition-all duration-700 flex items-center justify-end pr-3"
                    style={{ width: `${pct}%`, background: faseColors[i] }}
                  >
                    <span className="text-xs font-semibold text-linen tabular">{f.qtde}</span>
                  </div>
                </div>
                <div className="w-32 text-right">
                  <p className="text-sm tabular font-semibold text-gold-dark">{fmt(f.valor)}</p>
                  <p className="text-[10px] text-muted-foreground tabular">{pct.toFixed(0)}% do topo</p>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Performance da Equipe" subtitle="Vendas vs metas no mês corrente">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={vendedores} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis type="number" tickFormatter={fmtK} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="nome" tick={{ fill: "hsl(var(--navy))", fontSize: 12 }} axisLine={false} tickLine={false} width={110} />
            <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
            <Bar dataKey="meta" fill="hsl(var(--secondary))" name="Meta" radius={[0, 3, 3, 0]} />
            <Bar dataKey="receita" fill="hsl(var(--gold))" name="Realizado" radius={[0, 3, 3, 0]}>
              {vendedores.map((v, i) => (
                <Cell key={i} fill={v.receita >= v.meta ? "hsl(var(--finance-positive))" : "hsl(var(--gold))"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {vendedores.map((v) => {
            const atingiu = (v.receita / v.meta) * 100;
            return (
              <div key={v.nome} className="p-3 rounded border border-border bg-secondary/40">
                <p className="text-sm font-display font-semibold text-navy">{v.nome}</p>
                <p className="text-xs text-muted-foreground">{v.vendas} vendas · {fmt(v.receita)}</p>
                <p className={`text-xs mt-1 font-semibold tabular ${atingiu >= 100 ? "text-positive" : "text-warning"}`}>
                  {atingiu.toFixed(0)}% da meta
                </p>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
