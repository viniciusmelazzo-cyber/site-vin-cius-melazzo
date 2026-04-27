import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { simuladorCenarios, fmt, fmtK } from "@/data/mockCobranca";
import { Slider } from "@/components/ui/slider";
import { Calculator, CheckCircle2, Sparkles, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, ResponsiveContainer, Cell,
} from "recharts";

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--cobranca) / 0.3)",
  borderRadius: 4,
  fontSize: 12,
  color: "hsl(var(--navy))",
};

export default function SimuladorAcordo() {
  const [valorOriginal, setValorOriginal] = useState(64200);
  const [desconto, setDesconto] = useState(20);
  const [parcelas, setParcelas] = useState(6);

  const valorAcordo = valorOriginal * (1 - desconto / 100);
  const taxa = 0.025; // 2,5% a.m.
  const valorPresente = parcelas === 1
    ? valorAcordo
    : Array.from({ length: parcelas }).reduce<number>(
        (acc, _, i) => acc + (valorAcordo / parcelas) / Math.pow(1 + taxa, i + 1),
        0,
      );
  const aceitacaoEstimada = Math.min(95, 30 + parcelas * 2.5 + (1 - desconto / 100) * 30);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Operação"
        title="Simulador de Acordo"
        description="Teste cenários de acordo em tempo real · veja o valor presente líquido e a probabilidade de aceitação."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inputs */}
        <SectionCard title="Parâmetros" subtitle="Ajuste e veja o resultado" icon={<Calculator className="h-5 w-5" />}>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-navy">Valor original</label>
                <span className="text-sm tabular font-bold text-navy">{fmt(valorOriginal)}</span>
              </div>
              <Slider value={[valorOriginal]} onValueChange={(v) => setValorOriginal(v[0])} min={10000} max={200000} step={1000} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-navy">Desconto sobre principal</label>
                <span className="text-sm tabular font-bold text-cobranca">{desconto}%</span>
              </div>
              <Slider value={[desconto]} onValueChange={(v) => setDesconto(v[0])} min={0} max={50} step={1} />
              <p className="text-[10px] text-muted-foreground mt-1">Política interna: até 50% para acordos finais</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-navy">Parcelas</label>
                <span className="text-sm tabular font-bold text-navy">{parcelas}x</span>
              </div>
              <Slider value={[parcelas]} onValueChange={(v) => setParcelas(v[0])} min={1} max={36} step={1} />
            </div>
          </div>
        </SectionCard>

        {/* Resultado */}
        <SectionCard navy title="Resultado do Cenário" subtitle="Valor presente líquido considerando custo de capital de 2,5% a.m.">
          <div className="space-y-5">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold">Valor do acordo</p>
              <p className="font-display text-4xl font-bold text-linen mt-1 tabular">{fmt(valorAcordo)}</p>
              <p className="text-xs text-linen/60 mt-1">{parcelas === 1 ? "À vista" : `${parcelas} parcelas de ${fmt(valorAcordo / parcelas)}`}</p>
            </div>

            <div className="border-t border-gold/20 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-linen/70">Valor presente líquido</span>
                <span className="font-semibold text-gold tabular">{fmt(valorPresente)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-linen/70">Recuperação efetiva</span>
                <span className="font-semibold text-linen tabular">{((valorPresente / valorOriginal) * 100).toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-linen/70">Probabilidade de aceitação</span>
                <span className={cn(
                  "font-semibold tabular",
                  aceitacaoEstimada >= 70 ? "text-finance-positive" : aceitacaoEstimada >= 50 ? "text-gold" : "text-cobranca-light"
                )}>
                  {aceitacaoEstimada.toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="bg-gold/10 border border-gold/30 rounded p-3 flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-gold shrink-0 mt-0.5" />
              <p className="text-[11px] text-linen/80 leading-relaxed">
                {desconto > 30 && parcelas <= 3 && "Cenário agressivo — boa recuperação imediata, exige aprovação supervisor."}
                {desconto <= 30 && parcelas <= 6 && "Cenário equilibrado — bom valor presente e aceitação razoável."}
                {parcelas > 12 && "Atenção: parcelamentos longos reduzem o valor presente e elevam risco de quebra de acordo."}
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Insights */}
        <SectionCard title="Sensibilidade" subtitle="Impacto dos parâmetros" icon={<TrendingDown className="h-5 w-5" />}>
          <div className="space-y-3">
            <div className="p-3 bg-secondary/40 rounded">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Política interna</p>
              <p className="text-xs text-foreground">Acordos com desconto &gt;30% exigem aprovação do supervisor.</p>
            </div>
            <div className="p-3 bg-secondary/40 rounded">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Histórico</p>
              <p className="text-xs text-foreground">Acordos &gt;12x têm 38% de quebra nos primeiros 90 dias.</p>
            </div>
            <div className="p-3 bg-cobranca-pale/60 rounded border border-cobranca/30">
              <p className="text-[10px] uppercase tracking-wider text-cobranca font-semibold mb-1">Recomendado</p>
              <p className="text-xs text-foreground">Entrada + 6x com 18% de desconto: melhor combinação valor/aceitação.</p>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Cenários pré-calculados */}
      <SectionCard title="Cenários pré-calculados" subtitle="Comparativo lado-a-lado para o contrato CT-5847 (R$ 64.200)">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {simuladorCenarios.map((c) => (
            <div
              key={c.nome}
              className={cn(
                "p-4 rounded border transition-all",
                c.recomendado
                  ? "border-cobranca bg-cobranca-pale/40 shadow-sm"
                  : "border-border bg-card"
              )}
            >
              {c.recomendado && (
                <div className="flex items-center gap-1 mb-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cobranca" />
                  <span className="text-[10px] uppercase tracking-wider text-cobranca font-bold">Recomendado</span>
                </div>
              )}
              <h4 className="font-display font-semibold text-navy text-sm mb-3">{c.nome}</h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Desconto</span><span className="tabular font-medium">{c.desconto}%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Parcelas</span><span className="tabular font-medium">{c.parcelas}x</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Valor acordo</span><span className="tabular font-semibold text-navy">{fmtK(c.valorAcordo)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">VP líquido</span><span className="tabular font-semibold text-cobranca">{fmtK(c.valorPresente)}</span></div>
                <div className="flex justify-between pt-1.5 border-t border-border/40">
                  <span className="text-muted-foreground">Aceitação</span>
                  <span className={cn(
                    "tabular font-bold",
                    c.aceitacao >= 70 ? "text-positive" : c.aceitacao >= 50 ? "text-gold-dark" : "text-warning"
                  )}>{c.aceitacao}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Valor presente comparativo</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={simuladorCenarios}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="nome" tick={{ fill: "hsl(var(--navy))", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={fmtK} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} />
              <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
              <Bar dataKey="valorPresente" radius={[3, 3, 0, 0]}>
                {simuladorCenarios.map((c, i) => (
                  <Cell key={i} fill={c.recomendado ? "hsl(var(--cobranca))" : "hsl(var(--navy))"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
    </div>
  );
}
