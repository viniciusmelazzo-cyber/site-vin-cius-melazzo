import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionCard } from "@/components/ui/section-card";
import { aging, carteiraPorProduto, fmt, fmtK } from "@/data/mockCobranca";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, ResponsiveContainer, Cell,
} from "recharts";
import { ShieldCheck, AlertTriangle, Wallet, Layers } from "lucide-react";

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--cobranca) / 0.3)",
  borderRadius: 4,
  fontSize: 12,
  color: "hsl(var(--navy))",
};

export default function CarteiraAging() {
  const totalCarteira = aging.reduce((s, a) => s + a.valor, 0);
  const totalPDD = aging.reduce((s, a) => s + a.pdd, 0);
  const inadimplente = aging.filter((a) => a.faixa !== "A vencer").reduce((s, a) => s + a.valor, 0);
  const taxaInad = (inadimplente / totalCarteira) * 100;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Carteira"
        title="Aging & PDD"
        description="Distribuição da carteira por faixa de atraso e provisão acumulada para devedores duvidosos."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Carteira Total" value={fmtK(totalCarteira)} icon={<Wallet className="h-4 w-4" />} highlight />
        <KpiCard label="Inadimplente Total" value={fmtK(inadimplente)} icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="Taxa Inadimplência" value={`${taxaInad.toFixed(1)}%`} icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="PDD Acumulada" value={fmtK(totalPDD)} icon={<ShieldCheck className="h-4 w-4" />} />
      </div>

      <SectionCard title="Aging Report" subtitle="Distribuição por faixa de atraso · valores em R$" icon={<Layers className="h-5 w-5" />}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={aging}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="faixa" tick={{ fill: "hsl(var(--navy))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={fmtK} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
            <Bar dataKey="valor" radius={[3, 3, 0, 0]}>
              {aging.map((a, i) => <Cell key={i} fill={a.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard title="Detalhamento" subtitle="Faixa · contratos · provisão exigida">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Faixa</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Contratos</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Valor</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">% Carteira</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">PDD</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">% PDD</th>
              </tr>
            </thead>
            <tbody>
              {aging.map((a) => (
                <tr key={a.faixa} className="border-b border-border/40 hover:bg-secondary/30 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-navy flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full" style={{ background: a.color }} />
                    {a.faixa}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular text-foreground">{a.contratos.toLocaleString("pt-BR")}</td>
                  <td className="py-2.5 px-3 text-right tabular font-semibold text-navy">{fmtK(a.valor)}</td>
                  <td className="py-2.5 px-3 text-right tabular text-muted-foreground">{((a.valor / totalCarteira) * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 text-right tabular text-cobranca font-medium">{a.pdd > 0 ? fmtK(a.pdd) : "—"}</td>
                  <td className="py-2.5 px-3 text-right tabular text-muted-foreground">{a.pdd > 0 ? `${((a.pdd / a.valor) * 100).toFixed(0)}%` : "—"}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-cobranca">
                <td className="py-3 px-3 font-semibold text-navy">Total</td>
                <td className="py-3 px-3 text-right tabular font-bold text-navy">
                  {aging.reduce((s, a) => s + a.contratos, 0).toLocaleString("pt-BR")}
                </td>
                <td className="py-3 px-3 text-right tabular font-bold text-navy">{fmtK(totalCarteira)}</td>
                <td className="py-3 px-3 text-right tabular text-muted-foreground">100%</td>
                <td className="py-3 px-3 text-right tabular font-bold text-cobranca">{fmtK(totalPDD)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Mix por Produto" subtitle="Composição da exposição">
        <div className="space-y-3">
          {carteiraPorProduto.map((p) => (
            <div key={p.produto}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-navy font-medium">{p.produto}</span>
                <span className="tabular text-muted-foreground">{fmtK(p.valor)} · {p.share.toFixed(1)}%</span>
              </div>
              <div className="h-2 rounded bg-secondary overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cobranca to-cobranca-light" style={{ width: `${p.share}%` }} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
