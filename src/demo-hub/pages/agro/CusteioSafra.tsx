import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionCard } from "@/components/ui/section-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { custeioSafra, fmt, fmtK, culturasSafraAtual, evolucaoSafras, cotacoes } from "@/data/mockAgro";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ComposedChart, Legend, Line, LineChart,
} from "recharts";
import { Sprout, Coins, MapPin, Target, Plus, AlertTriangle, TrendingUp, TrendingDown, Wheat } from "lucide-react";
import { NovaSafraWizard } from "@/components/agro/NovaSafraWizard";
import { cn } from "@/lib/utils";

const PALETTE = ["hsl(var(--agro))", "hsl(var(--gold))", "hsl(var(--positive))", "hsl(var(--navy))", "hsl(var(--gold-dark))", "hsl(var(--agro-light))", "hsl(var(--finance-warning))"];

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--gold) / 0.3)",
  borderRadius: 4,
  fontSize: 12,
  color: "hsl(var(--navy))",
};

export default function CusteioSafra() {
  const [wizardOpen, setWizardOpen] = useState(false);

  // Totais consolidados multi-cultura
  const totais = useMemo(() => {
    const area = culturasSafraAtual.reduce((s, c) => s + c.area, 0);
    const receita = culturasSafraAtual.reduce((s, c) => s + c.receitaBruta, 0);
    const custo = culturasSafraAtual.reduce((s, c) => s + c.custoTotal, 0);
    const margem = receita - custo;
    const margemPct = receita > 0 ? (margem / receita) * 100 : 0;
    const custoMedioHa = area > 0 ? custo / area : 0;
    return { area, receita, custo, margem, margemPct, custoMedioHa };
  }, []);

  // Mapa de cotações de mercado
  const cotacaoMap: Record<string, number> = {
    "Soja": cotacoes.soja.atual,
    "Milho Safrinha": cotacoes.milho.atual,
    "Algodão": 152, // mock
  };

  // Break-even por cultura
  const breakEven = useMemo(() =>
    culturasSafraAtual.map((c) => {
      const beScHa = c.precoSaca > 0 ? c.custoHa / c.precoSaca : 0;
      const folga = c.produtividade - beScHa;
      const folgaPct = beScHa > 0 ? (folga / beScHa) * 100 : 0;
      return { cultura: c.cultura, prod: c.produtividade, beScHa, folga, folgaPct };
    }),
  []);

  const culturaCritica = breakEven.find((b) => b.folgaPct < 30);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <PageHeader
          eyebrow="Operação Agro"
          title={`Custeio de Safra ${custeioSafra.cultura} 24/25`}
          description={`${culturasSafraAtual.length} culturas · ${totais.area.toLocaleString("pt-BR")} hectares plantados · Margem operacional projetada ${totais.margemPct.toFixed(1)}%`}
        />
        <Button onClick={() => setWizardOpen(true)} className="bg-gold hover:bg-gold-dark text-navy shrink-0" size="sm">
          <Plus className="h-4 w-4 mr-1.5" /> Nova Safra
        </Button>
      </div>

      <NovaSafraWizard open={wizardOpen} onOpenChange={setWizardOpen} />

      {/* Alerta de cultura crítica */}
      {culturaCritica && (
        <Card className="border-amber-500/40 bg-amber-50/50">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div className="text-sm">
              <p className="font-semibold text-amber-900">
                Atenção: {culturaCritica.cultura} com folga reduzida sobre o break-even
              </p>
              <p className="mt-0.5 text-muted-foreground">
                Produtividade atual {culturaCritica.prod.toFixed(1)} sc/ha vs. mínima para cobrir custos {culturaCritica.beScHa.toFixed(1)} sc/ha. Folga de apenas {culturaCritica.folgaPct.toFixed(1)}%.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPIs consolidados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard label="Área Total" value={`${totais.area.toLocaleString("pt-BR")} ha`} icon={<Sprout className="h-4 w-4" />} />
        <KpiCard label="Receita Bruta" value={fmtK(totais.receita)} icon={<Coins className="h-4 w-4" />} highlight />
        <KpiCard label="Custo Total" value={fmtK(totais.custo)} icon={<MapPin className="h-4 w-4" />} />
        <KpiCard label="Margem Operacional" value={fmtK(totais.margem)} icon={<Wheat className="h-4 w-4" />} highlight />
        <KpiCard label="Culturas" value={String(culturasSafraAtual.length)} icon={<Target className="h-4 w-4" />} />
      </div>

      <Tabs defaultValue="comparativo" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="comparativo">Comparativo</TabsTrigger>
          <TabsTrigger value="composicao">Composição</TabsTrigger>
          <TabsTrigger value="breakeven">Break-even</TabsTrigger>
          <TabsTrigger value="evolucao">Evolução Histórica</TabsTrigger>
        </TabsList>

        {/* COMPARATIVO MULTI-CULTURA */}
        <TabsContent value="comparativo" className="mt-6">
          <SectionCard title="Comparativo entre culturas — Safra 24/25" subtitle="Produtividade · Custo · Receita · Margem · Cotação de mercado">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Cultura</th>
                    <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Área (ha)</th>
                    <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Produtividade</th>
                    <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Preço Safra</th>
                    <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Mercado hoje</th>
                    <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Custo R$/ha</th>
                    <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Receita</th>
                    <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Margem</th>
                  </tr>
                </thead>
                <tbody>
                  {culturasSafraAtual.map((c) => {
                    const mercado = cotacaoMap[c.cultura];
                    const delta = mercado ? mercado - c.precoSaca : 0;
                    return (
                      <tr key={c.id} className="border-b border-border/40 hover:bg-secondary/30">
                        <td className="py-2.5 px-3 font-medium text-navy">
                          <span className="mr-2">{c.icone}</span>{c.cultura}
                        </td>
                        <td className="py-2.5 px-3 text-right tabular">{c.area.toLocaleString("pt-BR")}</td>
                        <td className="py-2.5 px-3 text-right tabular">{c.produtividade} sc/ha</td>
                        <td className="py-2.5 px-3 text-right tabular">R$ {c.precoSaca}</td>
                        <td className="py-2.5 px-3 text-right tabular">
                          {mercado ? (
                            <span className="inline-flex items-center gap-1 justify-end">
                              R$ {mercado}
                              {delta !== 0 && (
                                delta > 0 ? <TrendingUp className="h-3 w-3 text-positive" /> : <TrendingDown className="h-3 w-3 text-destructive" />
                              )}
                            </span>
                          ) : <span className="text-muted-foreground">—</span>}
                        </td>
                        <td className="py-2.5 px-3 text-right tabular">R$ {c.custoHa.toLocaleString("pt-BR")}</td>
                        <td className="py-2.5 px-3 text-right tabular font-semibold text-navy">{fmtK(c.receitaBruta)}</td>
                        <td className="py-2.5 px-3 text-right">
                          <Badge className={cn("text-[10px]",
                            c.margemPct >= 50 ? "bg-positive/10 text-positive hover:bg-positive/10" :
                            c.margemPct >= 30 ? "bg-gold/10 text-gold-dark hover:bg-gold/10" :
                            "bg-destructive/10 text-destructive hover:bg-destructive/10"
                          )}>
                            {c.margemPct.toFixed(1)}%
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gold">
                    <td className="py-3 px-3 font-bold text-navy">Total / Média</td>
                    <td className="py-3 px-3 text-right tabular font-bold text-navy">{totais.area.toLocaleString("pt-BR")}</td>
                    <td colSpan={3} />
                    <td className="py-3 px-3 text-right tabular font-bold text-navy">R$ {totais.custoMedioHa.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}</td>
                    <td className="py-3 px-3 text-right tabular font-bold text-navy">{fmtK(totais.receita)}</td>
                    <td className="py-3 px-3 text-right tabular font-bold text-navy">{totais.margemPct.toFixed(1)}%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </SectionCard>
        </TabsContent>

        {/* COMPOSIÇÃO POR CULTURA */}
        <TabsContent value="composicao" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {culturasSafraAtual.map((c) => {
              const total = c.composicao.reduce((s, i) => s + i.valor, 0);
              const sorted = [...c.composicao].sort((a, b) => b.valor - a.valor);
              return (
                <SectionCard
                  key={c.id}
                  title={`${c.icone} ${c.cultura}`}
                  subtitle={`${c.area} ha · Custo total ${fmtK(total)}`}
                >
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={sorted} dataKey="valor" nameKey="rubrica" innerRadius={45} outerRadius={80} paddingAngle={2}>
                        {sorted.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                      </Pie>
                      <RTooltip formatter={(v: number) => fmt(v)} contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1 mt-2">
                    {sorted.slice(0, 5).map((it, i) => {
                      const pct = (it.valor / total) * 100;
                      return (
                        <div key={it.rubrica} className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-2 text-foreground">
                            <span className="h-2 w-2 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} />
                            {it.rubrica}
                          </span>
                          <span className="tabular text-muted-foreground">{pct.toFixed(1)}%</span>
                        </div>
                      );
                    })}
                  </div>
                </SectionCard>
              );
            })}
          </div>
        </TabsContent>

        {/* BREAK-EVEN */}
        <TabsContent value="breakeven" className="mt-6 space-y-6">
          <SectionCard title="Ponto de Equilíbrio · Produtividade Mínima vs Realizada" subtitle="Sacas/ha necessárias para cobrir todos os custos">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={breakEven} layout="vertical" margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="cultura" tick={{ fill: "hsl(var(--navy))", fontSize: 11 }} axisLine={false} tickLine={false} width={120} />
                <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v.toFixed(1)} sc/ha`} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="beScHa" fill="hsl(var(--gold))" name="Break-even (mínimo)" radius={[0, 3, 3, 0]} />
                <Bar dataKey="prod" fill="hsl(var(--positive))" name="Produtividade realizada" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {breakEven.map((b) => (
              <div key={b.cultura} className="border border-border rounded p-5 space-y-2">
                <p className="font-display text-lg text-navy">{b.cultura}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Mínimo</p>
                    <p className="tabular font-semibold text-navy text-base">{b.beScHa.toFixed(1)}<span className="text-[10px] text-muted-foreground ml-1">sc/ha</span></p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Realizado</p>
                    <p className="tabular font-semibold text-positive text-base">{b.prod.toFixed(1)}<span className="text-[10px] text-muted-foreground ml-1">sc/ha</span></p>
                  </div>
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">Folga sobre o break-even</p>
                  <Badge className={cn("mt-1",
                    b.folgaPct >= 50 ? "bg-positive/10 text-positive hover:bg-positive/10" :
                    b.folgaPct >= 30 ? "bg-gold/10 text-gold-dark hover:bg-gold/10" :
                    "bg-amber-100 text-amber-800 hover:bg-amber-100"
                  )}>
                    +{b.folgaPct.toFixed(1)}% · {b.folga.toFixed(1)} sc/ha
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* EVOLUÇÃO HISTÓRICA */}
        <TabsContent value="evolucao" className="mt-6 space-y-6">
          <SectionCard title="Evolução por safra · 5 ciclos" subtitle="Receita, Custo e Margem operacional">
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={evolucaoSafras}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="safra" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tickFormatter={fmtK} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}%`} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <RTooltip contentStyle={tooltipStyle} formatter={(v: number, n: string) => n === "Margem %" ? `${v.toFixed(1)}%` : fmt(v)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar yAxisId="left" dataKey="receita" fill="hsl(var(--positive))" name="Receita" radius={[3, 3, 0, 0]} />
                <Bar yAxisId="left" dataKey="custo" fill="hsl(var(--gold))" name="Custo" radius={[3, 3, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="margemPct" stroke="hsl(var(--navy))" strokeWidth={2.5} name="Margem %" dot={{ fill: "hsl(var(--navy))", r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </SectionCard>

          <SectionCard title="Histórico detalhado">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Safra</th>
                    <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Área</th>
                    <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Receita</th>
                    <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Custo</th>
                    <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Margem</th>
                    <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">%</th>
                  </tr>
                </thead>
                <tbody>
                  {evolucaoSafras.map((s) => (
                    <tr key={s.safra} className="border-b border-border/40 hover:bg-secondary/30">
                      <td className="py-2.5 px-3 font-medium text-navy">{s.safra}</td>
                      <td className="py-2.5 px-3 text-right tabular">{s.area} ha</td>
                      <td className="py-2.5 px-3 text-right tabular">{fmtK(s.receita)}</td>
                      <td className="py-2.5 px-3 text-right tabular">{fmtK(s.custo)}</td>
                      <td className="py-2.5 px-3 text-right tabular font-semibold text-positive">{fmtK(s.margem)}</td>
                      <td className="py-2.5 px-3 text-right tabular font-semibold text-navy">{s.margemPct.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
