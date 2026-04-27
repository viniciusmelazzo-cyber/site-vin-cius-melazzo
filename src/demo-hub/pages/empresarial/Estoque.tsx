import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionCard } from "@/components/ui/section-card";
import { estoqueVeiculos, fmt } from "@/data/mockData";
import { Package, Clock, TrendingUp, AlertTriangle } from "lucide-react";
import { useDrillDown } from "@/hooks/use-drill-down";
import { empresarialDrills } from "@/data/drillBuilders";

const statusBadge = {
  disponivel: "badge-positive",
  reservado: "badge-gold",
  atencao: "badge-warning",
} as const;

export default function Estoque() {
  const { openDrill } = useDrillDown();
  const total = estoqueVeiculos.length;
  const valorEstoque = estoqueVeiculos.reduce((s, v) => s + v.custoAquisicao, 0);
  const valorPotencial = estoqueVeiculos.reduce((s, v) => s + v.precoVenda, 0);
  const margemPotencial = ((valorPotencial - valorEstoque) / valorEstoque) * 100;
  const giroMedio = estoqueVeiculos.reduce((s, v) => s + v.diasEstoque, 0) / total;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Comercial"
        title="Estoque de Veículos"
        description="Inventário ativo, valor de capital empenhado e potencial de margem."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Veículos em Estoque" value={String(total)} icon={<Package className="h-4 w-4" />} highlight onClick={() => openDrill(empresarialDrills.estoque())} />
        <KpiCard label="Capital Empenhado" value={fmt(valorEstoque)} icon={<TrendingUp className="h-4 w-4" />} onClick={() => openDrill(empresarialDrills.estoque())} />
        <KpiCard label="Margem Potencial" value={`${margemPotencial.toFixed(1)}%`} icon={<TrendingUp className="h-4 w-4" />} onClick={() => openDrill(empresarialDrills.estoque())} />
        <KpiCard label="Giro Médio (dias)" value={giroMedio.toFixed(0)} icon={<Clock className="h-4 w-4" />} onClick={() => openDrill(empresarialDrills.estoque())} />
      </div>

      <SectionCard title="Inventário Ativo" subtitle={`Valor de revenda projetado: ${fmt(valorPotencial)}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-xs uppercase tracking-wider text-gold-dark font-semibold">Modelo</th>
                <th className="text-left py-2 text-xs uppercase tracking-wider text-gold-dark font-semibold">Placa</th>
                <th className="text-center py-2 text-xs uppercase tracking-wider text-gold-dark font-semibold">Ano</th>
                <th className="text-right py-2 text-xs uppercase tracking-wider text-gold-dark font-semibold">Custo</th>
                <th className="text-right py-2 text-xs uppercase tracking-wider text-gold-dark font-semibold">Venda</th>
                <th className="text-center py-2 text-xs uppercase tracking-wider text-gold-dark font-semibold">Margem</th>
                <th className="text-center py-2 text-xs uppercase tracking-wider text-gold-dark font-semibold">Dias</th>
                <th className="text-center py-2 text-xs uppercase tracking-wider text-gold-dark font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {estoqueVeiculos.map((v) => {
                const margem = ((v.precoVenda - v.custoAquisicao) / v.custoAquisicao) * 100;
                return (
                  <tr key={v.id} className="border-b border-border/40 hover:bg-secondary/40">
                    <td className="py-2.5 font-medium text-navy">{v.modelo}</td>
                    <td className="py-2.5 text-muted-foreground tabular">{v.placa}</td>
                    <td className="py-2.5 text-center tabular">{v.ano}</td>
                    <td className="py-2.5 text-right tabular">{fmt(v.custoAquisicao)}</td>
                    <td className="py-2.5 text-right tabular font-semibold text-navy">{fmt(v.precoVenda)}</td>
                    <td className="py-2.5 text-center tabular text-positive font-semibold">{margem.toFixed(1)}%</td>
                    <td className={`py-2.5 text-center tabular font-semibold ${v.diasEstoque > 60 ? "text-negative" : v.diasEstoque > 30 ? "text-warning" : "text-foreground"}`}>
                      {v.diasEstoque}
                      {v.diasEstoque > 60 && <AlertTriangle className="inline h-3 w-3 ml-1 text-negative" />}
                    </td>
                    <td className="py-2.5 text-center">
                      <span className={statusBadge[v.status as keyof typeof statusBadge]}>{v.status}</span>
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
