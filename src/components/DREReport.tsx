import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Entry {
  id: string;
  type: string;
  category: string;
  description: string;
  amount: number;
  date: string;
}

type DREPeriodView = "mensal" | "trimestral" | "anual";

interface DREReportProps {
  entries: Entry[];
  onboardingExpenses?: any;
  showMonthNav?: boolean;
  selectedMonth?: string;
  /** Liquidez total from onboarding (poupanca + cdb + tesouro) for reserve coverage */
  liquidezTotal?: number;
  /** Total passivos from onboarding for debt ratio */
  passivosTotal?: number;
  /** Total ativos from onboarding for debt ratio */
  ativosTotal?: number;
  /** Renda líquida from onboarding */
  rendaLiquida?: number;
  /** Total parcelas de dívidas mensais */
  parcelasDividas?: number;
}

const RECEITA_CATEGORIES = ["Salário", "Freelance", "Investimentos", "Aluguel"];
const DESPESA_FIXA_CATEGORIES = ["Moradia", "Transporte", "Saúde", "Educação", "Cartão de Crédito"];
const DESPESA_VARIAVEL_CATEGORIES = ["Alimentação", "Lazer", "Vestuário"];

const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function getEntryMonth(e: Entry): string {
  const d = new Date(e.date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthsForView(view: DREPeriodView, refMonth: string): string[] {
  const [y, m] = refMonth.split("-").map(Number);
  if (view === "mensal") return [refMonth];
  if (view === "trimestral") {
    const months: string[] = [];
    for (let i = 2; i >= 0; i--) {
      const d = new Date(y, m - 1 - i, 1);
      months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }
    return months;
  }
  // anual - all months of the year
  const months: string[] = [];
  for (let i = 0; i < 12; i++) {
    months.push(`${y}-${String(i + 1).padStart(2, "0")}`);
  }
  return months;
}

const DREReport = ({
  entries,
  showMonthNav = true,
  selectedMonth: externalMonth,
  liquidezTotal = 0,
  passivosTotal = 0,
  ativosTotal = 0,
  rendaLiquida = 0,
  parcelasDividas = 0,
}: DREReportProps) => {
  const [internalMonth, setInternalMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [periodView, setPeriodView] = useState<DREPeriodView>("mensal");
  const selectedMonth = externalMonth || internalMonth;

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    entries.forEach((e) => months.add(getEntryMonth(e)));
    const now = new Date();
    months.add(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
    return Array.from(months).sort().reverse();
  }, [entries]);

  const navigateMonth = (dir: number) => {
    const idx = availableMonths.indexOf(selectedMonth);
    const next = idx - dir;
    if (next >= 0 && next < availableMonths.length) setInternalMonth(availableMonths[next]);
  };

  const periodMonths = useMemo(
    () => getMonthsForView(periodView, selectedMonth),
    [periodView, selectedMonth]
  );

  const periodEntries = useMemo(() => {
    return entries.filter((e) => periodMonths.includes(getEntryMonth(e)));
  }, [entries, periodMonths]);

  const periodLabel = useMemo(() => {
    if (periodView === "mensal") {
      const [y, m] = selectedMonth.split("-");
      return new Date(Number(y), Number(m) - 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
    }
    if (periodView === "trimestral") {
      const first = periodMonths[0];
      const last = periodMonths[periodMonths.length - 1];
      const [fy, fm] = first.split("-");
      const [ly, lm] = last.split("-");
      const fLabel = new Date(Number(fy), Number(fm) - 1).toLocaleDateString("pt-BR", { month: "short" });
      const lLabel = new Date(Number(ly), Number(lm) - 1).toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
      return `${fLabel} — ${lLabel}`;
    }
    const [y] = selectedMonth.split("-");
    return `Ano ${y}`;
  }, [periodView, selectedMonth, periodMonths]);

  // Aggregate
  const groupByCategory = (items: Entry[]) => {
    const map: Record<string, number> = {};
    items.forEach((e) => { map[e.category] = (map[e.category] || 0) + Number(e.amount); });
    return map;
  };

  const receitas = periodEntries.filter((e) => e.type === "receita");
  const despesas = periodEntries.filter((e) => e.type === "despesa");
  const receitasByCategory = groupByCategory(receitas);
  const despesasByCategory = groupByCategory(despesas);
  const totalReceitas = receitas.reduce((s, e) => s + Number(e.amount), 0);

  const despesasFixas: Record<string, number> = {};
  const despesasVariaveis: Record<string, number> = {};
  const despesasOutras: Record<string, number> = {};
  Object.entries(despesasByCategory).forEach(([cat, val]) => {
    if (DESPESA_FIXA_CATEGORIES.includes(cat)) despesasFixas[cat] = val;
    else if (DESPESA_VARIAVEL_CATEGORIES.includes(cat)) despesasVariaveis[cat] = val;
    else despesasOutras[cat] = val;
  });

  const totalDespesasFixas = Object.values(despesasFixas).reduce((s, v) => s + v, 0);
  const totalDespesasVariaveis = Object.values(despesasVariaveis).reduce((s, v) => s + v, 0);
  const totalDespesasOutras = Object.values(despesasOutras).reduce((s, v) => s + v, 0);
  const totalDespesas = totalDespesasFixas + totalDespesasVariaveis + totalDespesasOutras;
  const resultadoOperacional = totalReceitas - totalDespesasFixas;
  const resultadoLiquido = totalReceitas - totalDespesas;

  // Use renda líquida do onboarding ou receitas do período como base
  const numMonths = periodMonths.length;
  const rendaBase = rendaLiquida > 0 ? rendaLiquida * numMonths : totalReceitas;
  const despFixasMensal = totalDespesasFixas / numMonths;

  // 7 Indicators
  const comprometimentoRenda = rendaBase > 0 ? (totalDespesas / rendaBase) * 100 : 0;
  const taxaPoupanca = rendaBase > 0 ? (resultadoLiquido / rendaBase) * 100 : 0;
  const indiceDespFixas = rendaBase > 0 ? (totalDespesasFixas / rendaBase) * 100 : 0;
  const indiceDespVariaveis = rendaBase > 0 ? (totalDespesasVariaveis / rendaBase) * 100 : 0;
  const coberturaEmergencia = despFixasMensal > 0 ? liquidezTotal / despFixasMensal : 0;
  const indiceEndividamento = ativosTotal > 0 ? (passivosTotal / ativosTotal) * 100 : 0;
  const capacidadePagamento = (rendaBase / numMonths) - despFixasMensal - parcelasDividas;

  const viewLabel = periodView === "mensal" ? "MÊS" : periodView === "trimestral" ? "TRIMESTRE" : "ANO";

  return (
    <div className="space-y-4">
      {/* Period View Selector */}
      <div className="flex flex-wrap items-center gap-2">
        {(["mensal", "trimestral", "anual"] as DREPeriodView[]).map((v) => (
          <Button
            key={v}
            variant={periodView === v ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriodView(v)}
            className={`font-body text-xs capitalize ${periodView === v ? "bg-accent text-accent-foreground" : ""}`}
          >
            {v}
          </Button>
        ))}
      </div>

      {/* Month Navigation */}
      {showMonthNav && (
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)} disabled={availableMonths.indexOf(selectedMonth) === availableMonths.length - 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-display font-bold capitalize">{periodLabel}</h2>
          <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)} disabled={availableMonths.indexOf(selectedMonth) === 0}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {!showMonthNav && (
        <p className="text-sm font-display font-semibold capitalize text-center text-muted-foreground">{periodLabel}</p>
      )}

      {/* DRE Card */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-display flex items-center gap-2">
            Demonstrativo de Resultados — Pessoa Física
          </CardTitle>
          <p className="text-xs text-muted-foreground font-body capitalize">
            Visão {periodView} • {periodLabel}
          </p>
        </CardHeader>
        <CardContent className="space-y-1 text-sm font-body">
          {/* RECEITAS */}
          <DRESection
            title="RECEITAS BRUTAS"
            items={receitasByCategory}
            total={totalReceitas}
            icon={<TrendingUp className="h-3.5 w-3.5 text-finance-positive" />}
            totalClass="text-finance-positive"
          />

          <Divider />

          {/* DESPESAS FIXAS */}
          <DRESection
            title="(-) DESPESAS FIXAS"
            items={despesasFixas}
            total={totalDespesasFixas}
            icon={<Minus className="h-3.5 w-3.5 text-finance-negative" />}
            totalClass="text-finance-negative"
            negative
          />

          <ResultRow label={`= RESULTADO APÓS FIXAS`} value={resultadoOperacional} />

          <Divider />

          {/* DESPESAS VARIÁVEIS */}
          <DRESection
            title="(-) DESPESAS VARIÁVEIS"
            items={despesasVariaveis}
            total={totalDespesasVariaveis}
            icon={<Minus className="h-3.5 w-3.5 text-finance-warning" />}
            totalClass="text-finance-warning"
            negative
          />

          {Object.keys(despesasOutras).length > 0 && (
            <DRESection
              title="(-) OUTRAS DESPESAS"
              items={despesasOutras}
              total={totalDespesasOutras}
              icon={<Minus className="h-3.5 w-3.5 text-muted-foreground" />}
              totalClass="text-muted-foreground"
              negative
            />
          )}

          <Divider thick />

          {/* RESULTADO LÍQUIDO */}
          <div className={`flex items-center justify-between py-3 font-display font-bold text-base ${resultadoLiquido >= 0 ? "text-finance-positive" : "text-finance-negative"}`}>
            <span>= RESULTADO LÍQUIDO DO {viewLabel}</span>
            <span>{resultadoLiquido >= 0 ? "+" : ""}{fmt(resultadoLiquido)}</span>
          </div>

          <Divider />

          {/* 7 Financial Indicators */}
          <div className="pt-3">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
              Indicadores Financeiros
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <IndicatorCard
                label="Comprometimento da Renda"
                value={`${comprometimentoRenda.toFixed(1)}%`}
                status={getStatus(comprometimentoRenda, [70, 80], "asc")}
                tooltip="Percentual da renda consumido por despesas. Ideal: até 70%"
              />
              <IndicatorCard
                label="Taxa de Poupança"
                value={`${taxaPoupanca.toFixed(1)}%`}
                status={getStatus(taxaPoupanca, [10, 0], "desc")}
                tooltip="Capacidade de acumulação. Ideal: acima de 15%"
              />
              <IndicatorCard
                label="Índice Desp. Fixas"
                value={`${indiceDespFixas.toFixed(1)}%`}
                status={getStatus(indiceDespFixas, [50, 65], "asc")}
                tooltip="Rigidez do orçamento. Ideal: até 50%"
              />
              <IndicatorCard
                label="Índice Desp. Variáveis"
                value={`${indiceDespVariaveis.toFixed(1)}%`}
                status={getStatus(indiceDespVariaveis, [20, 30], "asc")}
                tooltip="Margem de manobra. Ideal: até 20%"
              />
              {liquidezTotal > 0 && (
                <IndicatorCard
                  label="Cobertura de Emergência"
                  value={`${coberturaEmergencia.toFixed(1)} meses`}
                  status={getStatus(coberturaEmergencia, [3, 1], "desc")}
                  tooltip="Meses que a reserva cobre as despesas fixas. Ideal: 6+ meses"
                />
              )}
              {ativosTotal > 0 && (
                <IndicatorCard
                  label="Índice de Endividamento"
                  value={`${indiceEndividamento.toFixed(1)}%`}
                  status={getStatus(indiceEndividamento, [30, 50], "asc")}
                  tooltip="Relação entre passivos e ativos. Ideal: até 30%"
                />
              )}
              <IndicatorCard
                label="Capacidade de Pagamento"
                value={fmt(capacidadePagamento)}
                status={capacidadePagamento > 0 ? "ok" : "danger"}
                tooltip="Margem livre mensal após despesas fixas e parcelas de dívidas"
              />
            </div>
          </div>

          {periodEntries.length === 0 && (
            <p className="text-center text-muted-foreground text-xs py-6">
              Nenhum lançamento registrado neste período.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

/* Helper: determine status based on thresholds */
function getStatus(value: number, thresholds: [number, number], direction: "asc" | "desc"): "ok" | "warning" | "danger" {
  if (direction === "asc") {
    // Higher is worse (e.g. comprometimento)
    if (value <= thresholds[0]) return "ok";
    if (value <= thresholds[1]) return "warning";
    return "danger";
  }
  // Lower is worse (e.g. taxa poupança)
  if (value >= thresholds[0]) return "ok";
  if (value >= thresholds[1]) return "warning";
  return "danger";
}

/* Sub-components */

const DRESection = ({ title, items, total, icon, totalClass, negative = false }: {
  title: string; items: Record<string, number>; total: number;
  icon: React.ReactNode; totalClass: string; negative?: boolean;
}) => (
  <div className="space-y-0.5">
    <div className="flex items-center gap-1.5 pt-3 pb-1">
      {icon}
      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{title}</span>
    </div>
    {Object.entries(items).map(([cat, val]) => (
      <div key={cat} className="flex justify-between pl-5 py-0.5">
        <span className="text-muted-foreground">{cat}</span>
        <span>{negative ? "−" : "+"}{fmt(val)}</span>
      </div>
    ))}
    <div className={`flex justify-between pl-5 py-1 font-semibold ${totalClass}`}>
      <span>Subtotal</span>
      <span>{negative ? "−" : "+"}{fmt(total)}</span>
    </div>
  </div>
);

const ResultRow = ({ label, value }: { label: string; value: number }) => (
  <div className={`flex justify-between py-2 font-display font-semibold text-sm ${value >= 0 ? "text-finance-positive" : "text-finance-negative"}`}>
    <span>{label}</span>
    <span>{value >= 0 ? "+" : ""}{fmt(value)}</span>
  </div>
);

const Divider = ({ thick = false }: { thick?: boolean }) => (
  <div className={`border-t ${thick ? "border-foreground/20 border-2" : "border-border"}`} />
);

const IndicatorCard = ({ label, value, status, tooltip }: {
  label: string; value: string; status: "ok" | "warning" | "danger"; tooltip?: string;
}) => {
  const colors = {
    ok: "bg-finance-positive/10 text-finance-positive border-finance-positive/30",
    warning: "bg-finance-warning/10 text-finance-warning border-finance-warning/30",
    danger: "bg-finance-negative/10 text-finance-negative border-finance-negative/30",
  };
  return (
    <TooltipProvider>
      <UITooltip>
        <TooltipTrigger asChild>
          <div className={`rounded-lg border p-3 text-center cursor-help ${colors[status]}`}>
            <p className="text-[10px] font-body uppercase tracking-wide opacity-80 leading-tight">{label}</p>
            <p className="text-lg font-display font-bold mt-1">{value}</p>
          </div>
        </TooltipTrigger>
        {tooltip && (
          <TooltipContent className="font-body text-xs max-w-[200px]">
            {tooltip}
          </TooltipContent>
        )}
      </UITooltip>
    </TooltipProvider>
  );
};

export default DREReport;
