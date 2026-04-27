import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionCard } from "@/components/ui/section-card";
import { dividas, totalDividas, fmt } from "@/data/mockData";
import { TrendingDown, AlertTriangle, Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDrillDown } from "@/hooks/use-drill-down";
import { empresarialDrills } from "@/data/drillBuilders";

const statusBadge = {
  ativa: "badge-positive",
  atencao: "badge-warning",
  critica: "badge-negative",
} as const;

export default function Endividamento() {
  const { openDrill } = useDrillDown();
  const totalParcela = dividas.reduce((s, d) => s + d.parcelaMensal, 0);
  const dividaCritica = dividas.filter((d) => d.status === "critica").reduce((s, d) => s + d.valor, 0);

  // Mini-simulador
  const [valor, setValor] = useState(50_000);
  const [taxa, setTaxa] = useState(2);
  const [meses, setMeses] = useState(24);

  const i = taxa / 100;
  const parcelaSim = (valor * i * Math.pow(1 + i, meses)) / (Math.pow(1 + i, meses) - 1);
  const totalPago = parcelaSim * meses;
  const totalJuros = totalPago - valor;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Solvência"
        title="Endividamento"
        description="Mapa completo de obrigações financeiras com simulador de novas operações."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard label="Dívida Total" value={fmt(totalDividas)} icon={<TrendingDown className="h-4 w-4" />} highlight onClick={() => openDrill(empresarialDrills.endividamento())} />
        <KpiCard label="Parcela Mensal Consolidada" value={fmt(totalParcela)} icon={<Calculator className="h-4 w-4" />} onClick={() => openDrill(empresarialDrills.endividamento())} />
        <KpiCard label="Em Situação Crítica" value={fmt(dividaCritica)} icon={<AlertTriangle className="h-4 w-4" />} onClick={() => openDrill(empresarialDrills.endividamento())} />
      </div>

      <SectionCard title="Operações Ativas" subtitle={`${dividas.length} contratos vigentes`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-xs uppercase tracking-wider text-gold-dark font-semibold">Credor</th>
                <th className="text-left py-2 text-xs uppercase tracking-wider text-gold-dark font-semibold">Tipo</th>
                <th className="text-right py-2 text-xs uppercase tracking-wider text-gold-dark font-semibold">Saldo</th>
                <th className="text-right py-2 text-xs uppercase tracking-wider text-gold-dark font-semibold">Parcela</th>
                <th className="text-center py-2 text-xs uppercase tracking-wider text-gold-dark font-semibold">Restantes</th>
                <th className="text-center py-2 text-xs uppercase tracking-wider text-gold-dark font-semibold">Taxa/mês</th>
                <th className="text-center py-2 text-xs uppercase tracking-wider text-gold-dark font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {dividas.map((d) => (
                <tr key={d.id} className="border-b border-border/40 hover:bg-secondary/40">
                  <td className="py-2.5 font-medium text-navy">{d.credor}</td>
                  <td className="py-2.5 text-foreground">{d.tipo}</td>
                  <td className="py-2.5 text-right tabular font-semibold text-navy">{fmt(d.valor)}</td>
                  <td className="py-2.5 text-right tabular text-negative">{d.parcelaMensal > 0 ? fmt(d.parcelaMensal) : "—"}</td>
                  <td className="py-2.5 text-center text-muted-foreground tabular">{d.parcelasRestantes || "—"}</td>
                  <td className="py-2.5 text-center tabular text-gold-dark font-semibold">{d.taxaMes}%</td>
                  <td className="py-2.5 text-center">
                    <span className={statusBadge[d.status as keyof typeof statusBadge]}>{d.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Simulador de Nova Operação" subtitle="Estime o impacto antes de contratar" icon={<Calculator className="h-5 w-5" />}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4 lg:col-span-1">
            <div>
              <Label className="text-xs uppercase tracking-wider text-gold-dark font-semibold">Valor (R$)</Label>
              <Input type="number" value={valor} onChange={(e) => setValor(Number(e.target.value))} className="mt-1.5" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-gold-dark font-semibold">Taxa (% ao mês)</Label>
              <Input type="number" step="0.1" value={taxa} onChange={(e) => setTaxa(Number(e.target.value))} className="mt-1.5" />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-gold-dark font-semibold">Prazo (meses)</Label>
              <Input type="number" value={meses} onChange={(e) => setMeses(Number(e.target.value))} className="mt-1.5" />
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3 content-center">
            <div className="p-5 rounded melazzo-card-highlight text-center">
              <p className="kpi-label mb-2">Parcela mensal</p>
              <p className="font-display text-2xl font-bold text-navy tabular">{fmt(parcelaSim)}</p>
            </div>
            <div className="p-5 rounded melazzo-card text-center">
              <p className="kpi-label mb-2">Total pago</p>
              <p className="font-display text-2xl font-bold text-navy tabular">{fmt(totalPago)}</p>
            </div>
            <div className="p-5 rounded melazzo-card text-center">
              <p className="kpi-label mb-2">Juros totais</p>
              <p className="font-display text-2xl font-bold text-negative tabular">{fmt(totalJuros)}</p>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
