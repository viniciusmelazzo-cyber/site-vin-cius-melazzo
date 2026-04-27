import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { topDevedores, fmt, fmtK } from "@/data/mockCobranca";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TopDevedores() {
  const total = topDevedores.reduce((s, d) => s + d.valor, 0);

  const faseColor = (fase: string) => {
    if (fase === "Jurídico") return "badge-negative";
    if (fase === "Acordo") return "badge-positive";
    if (fase === "Negociação") return "badge-gold";
    return "badge-warning";
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Carteira"
        title="Top Devedores"
        description="Maiores exposições da carteira inadimplente · concentração de risco e fase de tratativa."
        actions={
          <>
            <Button variant="outline" size="sm" className="text-xs">
              <Filter className="h-3.5 w-3.5 mr-1.5" /> Filtrar
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="melazzo-card-highlight p-5">
          <p className="kpi-label">Top 10 — Concentração</p>
          <p className="kpi-value mt-1">{fmtK(total)}</p>
          <p className="text-xs text-muted-foreground mt-1">{topDevedores.length} contratos · representam ~12% da inadimplência</p>
        </div>
        <div className="melazzo-card p-5">
          <p className="kpi-label">Maior exposição</p>
          <p className="kpi-value mt-1">{fmtK(topDevedores[0].valor)}</p>
          <p className="text-xs text-muted-foreground mt-1">{topDevedores[0].cliente}</p>
        </div>
        <div className="melazzo-card p-5">
          <p className="kpi-label">Em fase jurídica</p>
          <p className="kpi-value mt-1">
            {topDevedores.filter((d) => d.fase === "Jurídico").length}
          </p>
          <p className="text-xs text-muted-foreground mt-1">contratos em ação judicial</p>
        </div>
      </div>

      <SectionCard
        title="Lista detalhada"
        subtitle="Ordenado por valor decrescente"
        actions={
          <div className="relative w-64">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
            <Input placeholder="Buscar contrato ou cliente..." className="h-8 pl-8 text-xs" />
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Contrato</th>
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Cliente</th>
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Produto</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Valor</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Atraso</th>
                <th className="text-center py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Fase</th>
              </tr>
            </thead>
            <tbody>
              {topDevedores.map((d) => (
                <tr key={d.id} className="border-b border-border/40 hover:bg-secondary/30 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-xs text-muted-foreground">{d.id}</td>
                  <td className="py-2.5 px-3 font-medium text-navy">{d.cliente}</td>
                  <td className="py-2.5 px-3 text-xs text-muted-foreground">{d.produto}</td>
                  <td className="py-2.5 px-3 text-right tabular font-semibold text-navy">{fmt(d.valor)}</td>
                  <td className={`py-2.5 px-3 text-right tabular ${d.atraso > 90 ? "text-negative font-semibold" : d.atraso > 60 ? "text-warning font-medium" : "text-foreground"}`}>
                    {d.atraso}d
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={faseColor(d.fase)}>{d.fase}</span>
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
