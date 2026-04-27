import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionCard } from "@/components/ui/section-card";
import { equipe, fmt, fmtK } from "@/data/mockCobranca";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, ResponsiveContainer, Cell,
} from "recharts";
import { Users, Trophy, Phone, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDrillDown } from "@/hooks/use-drill-down";
import { cobrancaDrills } from "@/data/drillBuilders";

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--cobranca) / 0.3)",
  borderRadius: 4,
  fontSize: 12,
  color: "hsl(var(--navy))",
};

export default function Performance() {
  const { openDrill } = useDrillDown();
  const drillEquipe = () => openDrill(cobrancaDrills.equipeDrill());
  const ranking = [...equipe].sort((a, b) => b.recuperado - a.recuperado);
  const totalRecuperado = equipe.reduce((s, e) => s + e.recuperado, 0);
  const totalAcordos = equipe.reduce((s, e) => s + e.acordos, 0);
  const totalContatos = equipe.reduce((s, e) => s + e.contatos, 0);
  const taxaMedia = (totalAcordos / totalContatos) * 100;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Equipe"
        title="Performance Operacional"
        description="Ranking de produtividade · contatos efetivos, acordos e taxa de conversão por operador."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total recuperado" value={fmtK(totalRecuperado)} icon={<Trophy className="h-4 w-4" />} highlight onClick={drillEquipe} />
        <KpiCard label="Total de acordos" value={totalAcordos.toString()} icon={<Target className="h-4 w-4" />} onClick={drillEquipe} />
        <KpiCard label="Contatos no mês" value={totalContatos.toLocaleString("pt-BR")} icon={<Phone className="h-4 w-4" />} onClick={drillEquipe} />
        <KpiCard label="Taxa de conversão" value={`${taxaMedia.toFixed(1)}%`} icon={<Users className="h-4 w-4" />} onClick={drillEquipe} />
      </div>

      <SectionCard title="Ranking de Recuperação" subtitle="Valor recuperado no mês por operador" icon={<Trophy className="h-5 w-5" />}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={ranking} layout="vertical" margin={{ left: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis type="number" tickFormatter={fmtK} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="nome" tick={{ fill: "hsl(var(--navy))", fontSize: 11 }} axisLine={false} tickLine={false} width={120} />
            <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
            <Bar dataKey="recuperado" radius={[0, 3, 3, 0]}>
              {ranking.map((_, i) => (
                <Cell key={i} fill={i === 0 ? "hsl(var(--gold))" : i === 1 ? "hsl(var(--cobranca))" : "hsl(var(--navy))"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard title="Tabela de Performance" subtitle="Detalhamento e cumprimento de meta">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Operador</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Contatos</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Acordos</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Conversão</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Recuperado</th>
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold w-44">Meta</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((op, i) => (
                <tr key={op.iniciais} className="border-b border-border/40 hover:bg-secondary/30 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-7 h-7 rounded-full text-[10px] font-semibold flex items-center justify-center",
                        i === 0 ? "bg-gold text-navy" : i === 1 ? "bg-cobranca text-white" : "bg-navy text-linen"
                      )}>
                        {op.iniciais}
                      </div>
                      <span className="font-medium text-navy">{op.nome}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-right tabular text-foreground">{op.contatos}</td>
                  <td className="py-2.5 px-3 text-right tabular text-foreground">{op.acordos}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={cn(
                      "tabular font-semibold",
                      op.taxa >= 9.0 ? "text-positive" : op.taxa >= 8.3 ? "text-foreground" : "text-warning"
                    )}>
                      {op.taxa.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right tabular font-semibold text-navy">{fmtK(op.recuperado)}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          className={cn(
                            "h-full",
                            op.meta >= 100 ? "bg-finance-positive" : op.meta >= 85 ? "bg-gold" : "bg-cobranca"
                          )}
                          style={{ width: `${Math.min(op.meta, 100)}%` }}
                        />
                      </div>
                      <span className={cn(
                        "text-[11px] tabular font-semibold w-10 text-right",
                        op.meta >= 100 ? "text-positive" : "text-foreground"
                      )}>
                        {op.meta}%
                      </span>
                    </div>
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
