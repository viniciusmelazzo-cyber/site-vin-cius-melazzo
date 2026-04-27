import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionCard } from "@/components/ui/section-card";
import { pecuaria, totalRebanhoValor, fmt, fmtK, lotesPecuaria } from "@/data/mockAgro";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer,
  LineChart, Line,
} from "recharts";
import { Beef, Activity, TrendingUp, Heart, Calculator, ArrowRight, Wallet } from "lucide-react";
import { useDrillDown } from "@/hooks/use-drill-down";
import { agroDrills } from "@/data/drillBuilders";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { OperacoesPecuariaActions } from "@/components/agro/OperacoesPecuariaActions";

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--gold) / 0.3)",
  borderRadius: 4,
  fontSize: 12,
  color: "hsl(var(--navy))",
};

export default function Pecuaria() {
  const { openDrill } = useDrillDown();
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <PageHeader
          eyebrow="Operação Agro"
          title="Pecuária de Corte"
          description={`Rebanho ativo de ${pecuaria.rebanhoTotal.toLocaleString("pt-BR")} cabeças · Lotação ${pecuaria.lotacaoMedia} UA/ha · GMD ${pecuaria.gmd} kg/dia`}
        />
        <Link
          to="/restrito/demonstracoes/agro/central-financeira"
          className="text-xs font-semibold text-gold-dark hover:text-gold flex items-center gap-1.5 px-3 py-1.5 border border-gold/30 rounded hover:bg-gold/5 transition-colors shrink-0"
        >
          <Wallet className="h-3.5 w-3.5" /> Central Financeira PJ <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Ações de operação */}
      <div className="border-t border-b border-border py-4">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Ações rápidas da operação</p>
        <OperacoesPecuariaActions />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Rebanho Total" value={`${pecuaria.rebanhoTotal.toLocaleString("pt-BR")} cab`} icon={<Beef className="h-4 w-4" />} highlight onClick={() => openDrill(agroDrills.rebanho())} />
        <KpiCard label="GMD Médio" value={`${pecuaria.gmd} kg/dia`} icon={<TrendingUp className="h-4 w-4" />} onClick={() => openDrill(agroDrills.rebanho())} />
        <KpiCard label="Taxa de Prenhez" value={`${pecuaria.taxaPrenhez}%`} icon={<Heart className="h-4 w-4" />} onClick={() => openDrill(agroDrills.rebanho())} />
        <KpiCard label="Mortalidade" value={`${pecuaria.taxaMortalidade}%`} icon={<Activity className="h-4 w-4" />} inverse onClick={() => openDrill(agroDrills.rebanho())} />
      </div>

      {/* Valor + Produtividade */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="navy-card p-6 lg:col-span-2">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold mb-2">Valor de Mercado do Rebanho</p>
          <p className="font-display text-5xl font-bold text-linen tabular">{fmtK(totalRebanhoValor)}</p>
          <div className="divider-gold my-4 w-32" />
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-linen/60">Ciclo Médio</p>
              <p className="text-2xl font-display font-semibold text-gold mt-1">{pecuaria.cicloMedio}m</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-linen/60">Lotação</p>
              <p className="text-2xl font-display font-semibold text-gold mt-1">{pecuaria.lotacaoMedia}</p>
              <p className="text-[10px] text-linen/50">UA/ha</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-linen/60">Produtividade</p>
              <p className="text-2xl font-display font-semibold text-gold mt-1">{pecuaria.produtividadeArroba}</p>
              <p className="text-[10px] text-linen/50">@/ha/ano</p>
            </div>
          </div>
        </div>

        <SectionCard title="Composição por Categoria" subtitle="Cabeças por faixa">
          <div className="space-y-2.5">
            {pecuaria.categorias.map((c) => {
              const pct = (c.qtde / pecuaria.rebanhoTotal) * 100;
              return (
                <div key={c.categoria}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground truncate pr-2">{c.categoria}</span>
                    <span className="tabular font-semibold text-navy shrink-0">{c.qtde}</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-agro to-agro-light" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* Gráfico valor por categoria */}
      <SectionCard title="Valor de Estoque por Categoria" subtitle="Quantidade × Valor médio por cabeça">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={pecuaria.categorias.map((c) => ({ ...c, valorTotal: c.qtde * c.valorCab }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="categoria" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} angle={-15} textAnchor="end" height={70} />
            <YAxis tickFormatter={fmtK} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
            <Bar dataKey="valorTotal" fill="hsl(var(--agro))" radius={[3, 3, 0, 0]} name="Valor total" />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      {/* Tabela detalhada */}
      <SectionCard title="Detalhamento do Rebanho" subtitle="Categoria · Qtde · Peso médio · Valor">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Categoria</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Quantidade</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Peso Médio</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">R$ / cab</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Valor Total</th>
              </tr>
            </thead>
            <tbody>
              {pecuaria.categorias.map((c) => (
                <tr key={c.categoria} className="border-b border-border/40 hover:bg-secondary/30">
                  <td className="py-2.5 px-3 font-medium text-navy">{c.categoria}</td>
                  <td className="py-2.5 px-3 text-right tabular text-foreground">{c.qtde}</td>
                  <td className="py-2.5 px-3 text-right tabular text-foreground">{c.peso} kg</td>
                  <td className="py-2.5 px-3 text-right tabular text-foreground">R$ {c.valorCab.toLocaleString("pt-BR")}</td>
                  <td className="py-2.5 px-3 text-right tabular font-semibold text-navy">{fmtK(c.qtde * c.valorCab)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gold">
                <td className="py-3 px-3 font-bold text-navy">Total</td>
                <td className="py-3 px-3 text-right tabular font-bold text-navy">{pecuaria.rebanhoTotal}</td>
                <td colSpan={2} />
                <td className="py-3 px-3 text-right tabular font-bold text-navy">{fmtK(totalRebanhoValor)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </SectionCard>

      {/* Lotes Ativos com drill-down de pesagens */}
      <SectionCard
        title="Lotes Ativos em Operação"
        subtitle={`${lotesPecuaria.length} lotes · clique para ver curva de pesagens e ciclo completo`}
        icon={<Activity className="h-4 w-4" />}
        actions={
          <Link
            to="/restrito/demonstracoes/agro/simulador-engorda"
            className="text-xs font-semibold text-gold-dark hover:text-gold flex items-center gap-1.5 px-3 py-1.5 border border-gold/30 rounded hover:bg-gold/5 transition-colors"
          >
            <Calculator className="h-3 w-3" /> Simulador de Engorda <ArrowRight className="h-3 w-3" />
          </Link>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Código</th>
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Raça</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Cab</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Peso atual</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">GMD</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Dias</th>
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Área</th>
                <th className="text-center py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {lotesPecuaria.map((l) => {
                const ganho = l.pesoAtual - l.pesoEntrada;
                return (
                  <tr
                    key={l.codigo}
                    onClick={() =>
                      openDrill({
                        title: `Lote ${l.codigo} · ${l.raca}`,
                        subtitle: `${l.qtde} cabeças · ${l.area} · ${l.diasConfinamento} dias em ciclo`,
                        kpis: [
                          { label: "Peso entrada", value: `${l.pesoEntrada} kg` },
                          { label: "Peso atual", value: `${l.pesoAtual} kg` },
                          { label: "Ganho total", value: `+${ganho} kg` },
                          { label: "GMD", value: `${l.gmd} kg/dia` },
                        ],
                        narrative: `Lote em fase de ${l.status}. Ciclo iniciado há ${l.diasConfinamento} dias com ${l.pesagens.length} pesagens registradas. Custo médio por cabeça na entrada: R$ ${l.custoCabeca.toLocaleString("pt-BR")}.`,
                        renderExtra: () => (
                          <div className="bg-secondary/30 rounded p-4">
                            <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2 font-semibold">Curva de Pesagens</p>
                            <ResponsiveContainer width="100%" height={200}>
                              <LineChart data={l.pesagens}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="data" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
                                <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v} kg`} />
                                <Line type="monotone" dataKey="peso" stroke="hsl(var(--agro))" strokeWidth={2.5} dot={{ fill: "hsl(var(--gold))", r: 4 }} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        ),
                        columns: [
                          { key: "data", label: "Data" },
                          { key: "peso", label: "Peso médio (kg)", align: "right", format: (v: number) => `${v} kg` },
                        ],
                        rows: l.pesagens,
                      })
                    }
                    className="border-b border-border/40 hover:bg-secondary/30 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-3 tabular text-xs font-semibold text-navy">{l.codigo}</td>
                    <td className="py-2.5 px-3 text-xs text-foreground">{l.raca}</td>
                    <td className="py-2.5 px-3 text-right tabular">{l.qtde}</td>
                    <td className="py-2.5 px-3 text-right tabular font-semibold text-navy">{l.pesoAtual} kg</td>
                    <td className={cn("py-2.5 px-3 text-right tabular font-semibold", l.gmd >= 0.85 ? "text-positive" : l.gmd >= 0.7 ? "text-foreground" : "text-amber-700")}>
                      {l.gmd}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular text-muted-foreground">{l.diasConfinamento}</td>
                    <td className="py-2.5 px-3 text-xs text-foreground">{l.area}</td>
                    <td className="py-2.5 px-3 text-center">
                      <Badge
                        className={cn(
                          "text-[10px]",
                          l.status === "pronto" && "bg-positive/10 text-positive hover:bg-positive/10",
                          l.status === "engorda" && "bg-gold/10 text-gold-dark hover:bg-gold/10",
                          l.status === "recria" && "bg-secondary text-foreground hover:bg-secondary"
                        )}
                      >
                        {l.status}
                      </Badge>
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
