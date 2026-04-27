import { useMemo, useState } from "react";
import { Calculator, Wallet, TrendingUp, ShieldCheck, RefreshCcw, Sparkles } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, Legend,
} from "recharts";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionCard } from "@/components/ui/section-card";
import { InsightCard } from "@/components/ui/insight-card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  dividasSimulaveis, ebitdaMensal, receitaMensal, fmt, fmtK,
} from "@/data/mockData";

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--gold) / 0.3)",
  borderRadius: 4,
  fontSize: 12,
  color: "hsl(var(--navy))",
};

export default function SimuladorCenarios() {
  const [selecionadas, setSelecionadas] = useState<number[]>([3, 5]);
  const [desconto, setDesconto] = useState(20);
  const [investimento, setInvestimento] = useState(45_000);

  const calc = useMemo(() => {
    const dAtuais = dividasSimulaveis;
    const parcelaAtual = dAtuais.reduce((s, d) => s + d.parcela, 0);
    const saldoAtual = dAtuais.reduce((s, d) => s + d.saldo, 0);

    const sel = dAtuais.filter((d) => selecionadas.includes(d.id));
    const saldoSelecionado = sel.reduce((s, d) => s + d.saldo, 0);
    const parcelaEliminada = sel.reduce((s, d) => s + d.parcela, 0);
    const valorQuitacao = saldoSelecionado * (1 - desconto / 100);
    const economiaJuros = saldoSelecionado - valorQuitacao;

    const parcelaSimulada = parcelaAtual - parcelaEliminada;
    const dscrAtual = ebitdaMensal / parcelaAtual;
    const dscrSimulado = parcelaSimulada > 0 ? ebitdaMensal / parcelaSimulada : 99;
    const compReceitaAtual = (parcelaAtual / receitaMensal) * 100;
    const compReceitaSim = (parcelaSimulada / receitaMensal) * 100;
    const payback = parcelaEliminada > 0 ? valorQuitacao / parcelaEliminada : 0;

    return {
      saldoAtual, saldoSelecionado, valorQuitacao, economiaJuros,
      parcelaAtual, parcelaSimulada, parcelaEliminada,
      dscrAtual, dscrSimulado, compReceitaAtual, compReceitaSim, payback,
    };
  }, [selecionadas, desconto]);

  const fluxoCompar = useMemo(() => {
    const meses = ["Mai", "Jun", "Jul", "Ago", "Set", "Out"];
    return meses.map((m, i) => ({
      mes: m,
      atual: 89_400 - i * 800 - calc.parcelaAtual * 0.05,
      simulado: 89_400 - i * 800 - calc.parcelaSimulada * 0.05 + (i === 0 ? -investimento : 0),
    }));
  }, [calc, investimento]);

  const toggle = (id: number) =>
    setSelecionadas((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const reset = () => {
    setSelecionadas([3, 5]);
    setDesconto(20);
    setInvestimento(45_000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Estratégia · Empresarial"
        title="Simulador de Cenários"
        description="Selecione dívidas para quitar, ajuste o desconto e veja o impacto no DSCR e no fluxo de caixa em tempo real."
        actions={
          <Button variant="outline" size="sm" onClick={reset}>
            <RefreshCcw className="h-3.5 w-3.5 mr-1.5" /> Restaurar
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="DSCR Atual" value={calc.dscrAtual.toFixed(2)} icon={<ShieldCheck className="h-4 w-4" />} />
        <KpiCard
          label="DSCR Simulado"
          value={calc.dscrSimulado >= 99 ? "∞" : calc.dscrSimulado.toFixed(2)}
          icon={<TrendingUp className="h-4 w-4" />}
          highlight
        />
        <KpiCard label="Comprometimento Receita" value={`${calc.compReceitaSim.toFixed(1)}%`} icon={<Wallet className="h-4 w-4" />} />
        <KpiCard label="Payback do investimento" value={calc.payback > 0 ? `${calc.payback.toFixed(1)} meses` : "—"} icon={<Calculator className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SectionCard title="Dívidas selecionáveis" subtitle="Marque as que deseja quitar/renegociar" className="lg:col-span-2" icon={<Wallet className="h-4 w-4" />}>
          <div className="space-y-2">
            {dividasSimulaveis.map((d) => {
              const ativo = selecionadas.includes(d.id);
              return (
                <label
                  key={d.id}
                  className={`flex items-center gap-3 p-3 rounded border transition-all cursor-pointer ${
                    ativo ? "border-gold/50 bg-gold/5" : "border-border hover:border-gold/30"
                  }`}
                >
                  <Checkbox checked={ativo} onCheckedChange={() => toggle(d.id)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-navy">{d.credor}</span>
                      <Badge variant="outline" className="text-[10px]">{d.tipo}</Badge>
                      <Badge variant={d.taxaMes > 5 ? "destructive" : d.taxaMes > 1.5 ? "secondary" : "outline"} className="text-[10px]">
                        {d.taxaMes.toFixed(2)}%/mês
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Saldo: <span className="tabular text-navy font-medium">{fmt(d.saldo)}</span> · Parcela:{" "}
                      <span className="tabular text-navy font-medium">{fmt(d.parcela)}</span> · {d.garantia}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Parâmetros" subtitle="Ajuste desconto e investimento inicial" icon={<Calculator className="h-4 w-4" />}>
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Desconto na quitação</Label>
                <span className="text-sm font-semibold text-navy tabular">{desconto}%</span>
              </div>
              <Slider value={[desconto]} min={0} max={50} step={1} onValueChange={(v) => setDesconto(v[0])} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Investimento inicial</Label>
                <span className="text-sm font-semibold text-navy tabular">{fmt(investimento)}</span>
              </div>
              <Slider value={[investimento]} min={0} max={150_000} step={5_000} onValueChange={(v) => setInvestimento(v[0])} />
            </div>

            <div className="rounded border border-gold/30 bg-gold/5 p-3 space-y-1.5 text-[12px]">
              <div className="flex justify-between"><span className="text-muted-foreground">Saldo selecionado</span><span className="tabular text-navy font-medium">{fmt(calc.saldoSelecionado)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Valor de quitação</span><span className="tabular text-navy font-medium">{fmt(calc.valorQuitacao)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Economia em juros</span><span className="tabular text-positive font-semibold">{fmt(calc.economiaJuros)}</span></div>
              <div className="flex justify-between border-t border-border/50 pt-1.5"><span className="text-muted-foreground">Parcela eliminada/mês</span><span className="tabular text-navy font-semibold">{fmt(calc.parcelaEliminada)}</span></div>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Fluxo de Caixa: Atual × Simulado" subtitle="Projeção de 6 meses considerando o investimento inicial e a redução de parcelas">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={fluxoCompar}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={fmtK} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
            <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="atual" name="Cenário Atual" fill="hsl(var(--muted-foreground) / 0.6)" radius={[3, 3, 0, 0]} />
            <Bar dataKey="simulado" name="Cenário Simulado" fill="hsl(var(--gold))" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      <InsightCard
        tone={calc.dscrSimulado > 1.4 ? "positive" : "warning"}
        title={calc.dscrSimulado > 1.4 ? "Cenário viável e saudável" : "Cuidado: DSCR ainda apertado"}
        description={
          calc.dscrSimulado > 1.4
            ? `Com a quitação proposta (${desconto}% desconto) o DSCR sobe para ${calc.dscrSimulado.toFixed(2)} e o comprometimento da receita cai para ${calc.compReceitaSim.toFixed(1)}%. Recuperação do investimento em ${calc.payback.toFixed(1)} meses.`
            : `Mesmo após a quitação, o DSCR fica em ${calc.dscrSimulado.toFixed(2)}. Combine com renegociação de prazo nas dívidas restantes para liberar mais caixa.`
        }
        metric={fmt(calc.economiaJuros)}
        metricLabel="Economia total em juros"
      />
    </div>
  );
}
