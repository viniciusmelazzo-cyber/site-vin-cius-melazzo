import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionCard } from "@/components/ui/section-card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cenariosEngorda, simularEngorda, fmt, fmtK, type SimEngordaParams } from "@/data/mockAgro";
import {
  Beef, Calculator, TrendingUp, Wallet, Sparkles, Clock, Percent, Target, RefreshCcw,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--gold) / 0.3)",
  borderRadius: 4,
  fontSize: 12,
  color: "hsl(var(--navy))",
};

interface SliderRowProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  prefix?: string;
}

function SliderRow({ label, value, onChange, min, max, step = 1, suffix, prefix }: SliderRowProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-xs text-foreground/80 font-medium">{label}</Label>
        <span className="tabular text-sm font-semibold text-navy">
          {prefix}
          {value.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}
          {suffix}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0])}
        className="cursor-pointer"
      />
    </div>
  );
}

export default function SimuladorEngorda() {
  const [params, setParams] = useState<SimEngordaParams>(cenariosEngorda[0]);
  const [cenarioAtivo, setCenarioAtivo] = useState<string>(cenariosEngorda[0].id);

  const result = useMemo(() => simularEngorda(params), [params]);

  // Comparativo com todos os cenários pré-salvos
  const comparativo = useMemo(
    () =>
      cenariosEngorda.map((c) => {
        const r = simularEngorda(c);
        return { nome: c.nome.split(" — ")[0], margem: r.margem, margemPct: r.margemPct, custoArroba: r.custoArrobaProduzida };
      }),
    []
  );

  const carregarCenario = (id: string) => {
    const c = cenariosEngorda.find((x) => x.id === id);
    if (!c) return;
    setParams(c);
    setCenarioAtivo(id);
  };

  const set = <K extends keyof SimEngordaParams>(k: K) => (v: number) =>
    setParams((p) => ({ ...p, [k]: v }));

  const margemColor = result.margem >= 0 ? "text-positive" : "text-negative";
  const cores = [
    "hsl(var(--agro))", "hsl(var(--gold))", "hsl(var(--navy))",
    "hsl(var(--agro-light))", "hsl(var(--gold-dark))", "hsl(var(--muted-foreground))",
  ];
  const composicaoCustos = [
    { nome: "Compra", valor: result.custoCompra, fill: cores[0] },
    { nome: "Alimentação", valor: result.custoAlimentacao, fill: cores[1] },
    { nome: "Sanidade", valor: result.custoSanitario, fill: cores[2] },
    { nome: "Arrendamento", valor: result.custoArrendamento, fill: cores[3] },
    { nome: "Mão de obra", valor: result.custoMaoObra, fill: cores[4] },
    { nome: "Outros", valor: params.outrosCustos, fill: cores[5] },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Operação Agro"
        title="Simulador de Engorda"
        description="Calculadora interativa de ciclo pecuário · ajuste parâmetros e veja margem, custo da arroba produzida e ROI em tempo real"
      />

      {/* Cenários pré-salvos */}
      <SectionCard title="Cenários Salvos" subtitle="Carregue um modelo de referência ou ajuste manualmente abaixo" icon={<Sparkles className="h-4 w-4" />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {cenariosEngorda.map((c) => {
            const r = simularEngorda(c);
            const ativo = cenarioAtivo === c.id;
            return (
              <button
                key={c.id}
                onClick={() => carregarCenario(c.id)}
                className={cn(
                  "text-left p-4 rounded border transition-all",
                  ativo
                    ? "border-gold bg-gold/5 shadow-sm"
                    : "border-border hover:border-gold/50 hover:bg-secondary/30"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-semibold text-navy leading-tight">{c.nome}</p>
                  {ativo && <Badge className="bg-gold text-navy hover:bg-gold shrink-0 text-[10px]">Ativo</Badge>}
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Cabeças</p>
                    <p className="font-semibold text-foreground tabular">{c.qtdCabecas}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Margem</p>
                    <p className={cn("font-semibold tabular", r.margem >= 0 ? "text-positive" : "text-negative")}>
                      {fmtK(r.margem)}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* KPIs do cenário atual */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Margem Líquida"
          value={fmtK(result.margem)}
          icon={<Wallet className="h-4 w-4" />}
          highlight
        />
        <KpiCard
          label="Margem %"
          value={`${result.margemPct.toFixed(1)}%`}
          icon={<Percent className="h-4 w-4" />}
        />
        <KpiCard
          label="Custo @ Produzida"
          value={`R$ ${result.custoArrobaProduzida.toFixed(0)}`}
          icon={<Target className="h-4 w-4" />}
          inverse
        />
        <KpiCard
          label="ROI do Ciclo"
          value={`${result.roi.toFixed(1)}%`}
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      {/* Resumo destacado */}
      <div className="navy-card p-6">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-gold mb-2">Resultado do Ciclo</p>
            <p className={cn("font-display text-4xl md:text-5xl font-bold tabular", margemColor === "text-positive" ? "text-gold" : "text-red-300")}>
              {fmt(result.margem)}
            </p>
            <p className="text-xs text-linen/60 mt-1">
              {result.cabecasFinais} cab finalizadas · {result.duracaoDias} dias · {result.arrobasTotal.toFixed(0)} @ totais
            </p>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-linen/60">Receita Líquida</p>
              <p className="font-display text-xl font-semibold text-linen tabular">{fmtK(result.receitaLiquida)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-linen/60">Custo Total</p>
              <p className="font-display text-xl font-semibold text-linen tabular">{fmtK(result.custoTotal)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-linen/60">Duração</p>
              <p className="font-display text-xl font-semibold text-gold tabular flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {result.duracaoDias}d
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sliders + Gráfico de custos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SectionCard
          title="Parâmetros do Lote"
          subtitle="Ajuste e veja impacto imediato"
          icon={<Beef className="h-4 w-4" />}
          className="lg:col-span-2"
          actions={
            <Button
              size="sm"
              variant="outline"
              onClick={() => carregarCenario(cenarioAtivo)}
              className="text-xs"
            >
              <RefreshCcw className="h-3 w-3 mr-1.5" /> Resetar
            </Button>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <SliderRow label="Quantidade de cabeças" value={params.qtdCabecas} onChange={set("qtdCabecas")} min={20} max={300} suffix=" cab" />
            <SliderRow label="Peso de entrada" value={params.pesoEntrada} onChange={set("pesoEntrada")} min={150} max={400} suffix=" kg" />
            <SliderRow label="Peso de saída (alvo)" value={params.pesoSaida} onChange={set("pesoSaida")} min={300} max={600} suffix=" kg" />
            <SliderRow label="GMD (kg/dia)" value={params.gmd} onChange={set("gmd")} min={0.4} max={1.6} step={0.02} suffix=" kg/d" />
            <SliderRow label="Preço de compra" value={params.precoCompra} onChange={set("precoCompra")} min={1500} max={3500} step={20} prefix="R$ " suffix="/cab" />
            <SliderRow label="Preço da arroba" value={params.precoArroba} onChange={set("precoArroba")} min={180} max={320} step={2} prefix="R$ " suffix="/@" />
            <SliderRow label="Rendimento de carcaça" value={params.rendimentoCarcaca} onChange={set("rendimentoCarcaca")} min={48} max={60} step={0.5} suffix="%" />
            <SliderRow label="Mortalidade" value={params.mortalidadePct} onChange={set("mortalidadePct")} min={0} max={6} step={0.1} suffix="%" />
            <SliderRow label="Custo alimentação/dia" value={params.custoAlimentacaoDia} onChange={set("custoAlimentacaoDia")} min={1} max={15} step={0.1} prefix="R$ " />
            <SliderRow label="Custo sanitário / cabeça" value={params.custoSanitarioCabeca} onChange={set("custoSanitarioCabeca")} min={20} max={250} step={5} prefix="R$ " />
            <SliderRow label="Arrendamento mensal" value={params.custoArrendamentoMes} onChange={set("custoArrendamentoMes")} min={0} max={50000} step={500} prefix="R$ " />
            <SliderRow label="Mão de obra mensal" value={params.custoMaoObraMes} onChange={set("custoMaoObraMes")} min={0} max={20000} step={200} prefix="R$ " />
          </div>
        </SectionCard>

        <SectionCard title="Composição de Custos" subtitle="Onde está cada real do ciclo" icon={<Calculator className="h-4 w-4" />}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={composicaoCustos} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tickFormatter={fmtK} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="nome" tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }} axisLine={false} tickLine={false} width={88} />
              <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
              <Bar dataKey="valor" radius={[0, 3, 3, 0]} />

            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Comparativo entre os 3 cenários */}
      <SectionCard title="Comparativo entre Cenários" subtitle="Margem absoluta e custo da arroba produzida">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={comparativo}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="nome" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tickFormatter={fmtK} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `R$${v.toFixed(0)}`} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <RTooltip contentStyle={tooltipStyle} formatter={(v: number, n: string) => (n === "Custo @" ? `R$ ${v.toFixed(0)}/@` : fmt(v))} />
            <Bar yAxisId="left" dataKey="margem" name="Margem" fill="hsl(var(--agro))" radius={[3, 3, 0, 0]} />
            <Bar yAxisId="right" dataKey="custoArroba" name="Custo @" fill="hsl(var(--gold))" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>
    </div>
  );
}
