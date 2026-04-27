import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionCard } from "@/components/ui/section-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { custosFixos, custosVariaveis, totalCustosFixos, fmt } from "@/data/mockData";
import { Coins, TrendingUp, ListChecks } from "lucide-react";
import { useDrillDown } from "@/hooks/use-drill-down";
import { empresarialDrills } from "@/data/drillBuilders";

export default function Custos() {
  const { openDrill } = useDrillDown();
  const totalVariaveis = custosVariaveis.reduce((s, c) => s + c.valorMes, 0);
  const totalGeral = totalCustosFixos + totalVariaveis;

  const categorias = [...new Set(custosFixos.map((c) => c.categoria))];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Resultado · Custos"
        title="Estrutura de Custos"
        description="Detalhamento de custos fixos e variáveis com categorização gerencial."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard label="Custos Fixos / mês" value={fmt(totalCustosFixos)} icon={<Coins className="h-4 w-4" />} highlight onClick={() => openDrill(empresarialDrills.custosFixos())} />
        <KpiCard label="Custos Variáveis / mês" value={fmt(totalVariaveis)} icon={<TrendingUp className="h-4 w-4" />} onClick={() => openDrill(empresarialDrills.margemLiquida())} drillLabel="Ver DRE" />
        <KpiCard label="Total Geral" value={fmt(totalGeral)} icon={<ListChecks className="h-4 w-4" />} onClick={() => openDrill(empresarialDrills.margemLiquida())} drillLabel="Ver DRE" />
      </div>

      <Tabs defaultValue="fixos" className="space-y-4">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="fixos" className="data-[state=active]:bg-navy data-[state=active]:text-linen">
            Custos Fixos ({custosFixos.length})
          </TabsTrigger>
          <TabsTrigger value="variaveis" className="data-[state=active]:bg-navy data-[state=active]:text-linen">
            Custos Variáveis ({custosVariaveis.length})
          </TabsTrigger>
          <TabsTrigger value="categorias" className="data-[state=active]:bg-navy data-[state=active]:text-linen">
            Por Categoria
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fixos">
          <SectionCard>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-xs uppercase tracking-wider text-gold-dark font-semibold">Descrição</th>
                    <th className="text-left py-2 text-xs uppercase tracking-wider text-gold-dark font-semibold">Categoria</th>
                    <th className="text-center py-2 text-xs uppercase tracking-wider text-gold-dark font-semibold">Vencimento</th>
                    <th className="text-right py-2 text-xs uppercase tracking-wider text-gold-dark font-semibold">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {custosFixos.map((c) => (
                    <tr key={c.id} className="border-b border-border/40 hover:bg-secondary/40">
                      <td className="py-2.5 font-medium text-navy">{c.descricao}</td>
                      <td className="py-2.5"><span className="badge-gold">{c.categoria}</span></td>
                      <td className="py-2.5 text-center text-muted-foreground tabular">Dia {c.dia}</td>
                      <td className="py-2.5 text-right tabular font-semibold text-navy">{fmt(c.valor)}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-gold">
                    <td className="py-3 font-display font-semibold text-navy" colSpan={3}>Total Custos Fixos</td>
                    <td className="py-3 text-right tabular font-bold text-navy">{fmt(totalCustosFixos)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="variaveis">
          <SectionCard>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-xs uppercase tracking-wider text-gold-dark font-semibold">Descrição</th>
                    <th className="text-left py-2 text-xs uppercase tracking-wider text-gold-dark font-semibold">Categoria</th>
                    <th className="text-center py-2 text-xs uppercase tracking-wider text-gold-dark font-semibold">% Receita</th>
                    <th className="text-right py-2 text-xs uppercase tracking-wider text-gold-dark font-semibold">Valor (mês atual)</th>
                  </tr>
                </thead>
                <tbody>
                  {custosVariaveis.map((c) => (
                    <tr key={c.id} className="border-b border-border/40 hover:bg-secondary/40">
                      <td className="py-2.5 font-medium text-navy">{c.descricao}</td>
                      <td className="py-2.5"><span className="badge-gold">{c.categoria}</span></td>
                      <td className="py-2.5 text-center tabular text-gold-dark font-semibold">{c.percentual}%</td>
                      <td className="py-2.5 text-right tabular font-semibold text-navy">{fmt(c.valorMes)}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-gold">
                    <td className="py-3 font-display font-semibold text-navy" colSpan={3}>Total Custos Variáveis</td>
                    <td className="py-3 text-right tabular font-bold text-navy">{fmt(totalVariaveis)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="categorias">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorias.map((cat) => {
              const items = custosFixos.filter((c) => c.categoria === cat);
              const total = items.reduce((s, c) => s + c.valor, 0);
              const pct = (total / totalCustosFixos) * 100;
              return (
                <SectionCard key={cat} title={cat} subtitle={`${items.length} item(s) · ${pct.toFixed(1)}% dos fixos`}>
                  <p className="font-display text-2xl font-semibold text-navy tabular">{fmt(total)}</p>
                  <div className="mt-3 space-y-1">
                    {items.map((i) => (
                      <div key={i.id} className="flex justify-between text-xs">
                        <span className="text-muted-foreground truncate">{i.descricao}</span>
                        <span className="tabular text-foreground">{fmt(i.valor)}</span>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
