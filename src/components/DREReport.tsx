import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Entry {
  id: string;
  type: string;
  category: string;
  description: string;
  amount: number;
  date: string;
}

interface DREReportProps {
  entries: Entry[];
  onboardingExpenses?: any;
  showMonthNav?: boolean;
}

const RECEITA_CATEGORIES = ["Salário", "Freelance", "Investimentos", "Aluguel"];
const DESPESA_FIXA_CATEGORIES = ["Moradia", "Transporte", "Saúde", "Educação", "Cartão de Crédito"];
const DESPESA_VARIAVEL_CATEGORIES = ["Alimentação", "Lazer", "Vestuário"];

const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const DREReport = ({ entries, showMonthNav = true }: DREReportProps) => {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    entries.forEach((e) => {
      const d = new Date(e.date);
      months.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    });
    // Always include current month
    const now = new Date();
    months.add(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
    return Array.from(months).sort().reverse();
  }, [entries]);

  const navigateMonth = (dir: number) => {
    const idx = availableMonths.indexOf(selectedMonth);
    const next = idx - dir; // reversed because sorted desc
    if (next >= 0 && next < availableMonths.length) {
      setSelectedMonth(availableMonths[next]);
    }
  };

  const monthEntries = useMemo(() => {
    return entries.filter((e) => {
      const d = new Date(e.date);
      const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      return m === selectedMonth;
    });
  }, [entries, selectedMonth]);

  const monthLabel = useMemo(() => {
    const [y, m] = selectedMonth.split("-");
    const date = new Date(Number(y), Number(m) - 1);
    return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  }, [selectedMonth]);

  // Aggregate by category
  const groupByCategory = (items: Entry[]) => {
    const map: Record<string, number> = {};
    items.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + Number(e.amount);
    });
    return map;
  };

  const receitas = monthEntries.filter((e) => e.type === "receita");
  const despesas = monthEntries.filter((e) => e.type === "despesa");

  const receitasByCategory = groupByCategory(receitas);
  const despesasByCategory = groupByCategory(despesas);

  const totalReceitas = receitas.reduce((s, e) => s + Number(e.amount), 0);

  // Split despesas into fixed and variable
  const despesasFixas: Record<string, number> = {};
  const despesasVariaveis: Record<string, number> = {};
  const despesasOutras: Record<string, number> = {};

  Object.entries(despesasByCategory).forEach(([cat, val]) => {
    if (DESPESA_FIXA_CATEGORIES.includes(cat)) {
      despesasFixas[cat] = val;
    } else if (DESPESA_VARIAVEL_CATEGORIES.includes(cat)) {
      despesasVariaveis[cat] = val;
    } else {
      despesasOutras[cat] = val;
    }
  });

  const totalDespesasFixas = Object.values(despesasFixas).reduce((s, v) => s + v, 0);
  const totalDespesasVariaveis = Object.values(despesasVariaveis).reduce((s, v) => s + v, 0);
  const totalDespesasOutras = Object.values(despesasOutras).reduce((s, v) => s + v, 0);
  const totalDespesas = totalDespesasFixas + totalDespesasVariaveis + totalDespesasOutras;

  const resultadoOperacional = totalReceitas - totalDespesasFixas;
  const resultadoLiquido = totalReceitas - totalDespesas;

  const comprometimentoRenda = totalReceitas > 0 ? (totalDespesas / totalReceitas) * 100 : 0;
  const taxaPoupanca = totalReceitas > 0 ? (resultadoLiquido / totalReceitas) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Month Navigation */}
      {showMonthNav && (
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)} disabled={availableMonths.indexOf(selectedMonth) === availableMonths.length - 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-display font-bold capitalize">{monthLabel}</h2>
          <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)} disabled={availableMonths.indexOf(selectedMonth) === 0}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* DRE Card */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-display flex items-center gap-2">
            Demonstrativo de Resultados — Pessoa Física
          </CardTitle>
          <p className="text-xs text-muted-foreground font-body capitalize">{monthLabel}</p>
        </CardHeader>
        <CardContent className="space-y-1 text-sm font-body">
          {/* RECEITAS */}
          <DRESection
            title="RECEITAS BRUTAS"
            items={receitasByCategory}
            total={totalReceitas}
            icon={<TrendingUp className="h-3.5 w-3.5 text-green-600" />}
            totalClass="text-green-700"
          />

          <Divider />

          {/* DESPESAS FIXAS */}
          <DRESection
            title="(-) DESPESAS FIXAS"
            items={despesasFixas}
            total={totalDespesasFixas}
            icon={<Minus className="h-3.5 w-3.5 text-destructive" />}
            totalClass="text-destructive"
            negative
          />

          {/* Resultado Operacional */}
          <ResultRow label="= RESULTADO APÓS FIXAS" value={resultadoOperacional} />

          <Divider />

          {/* DESPESAS VARIÁVEIS */}
          <DRESection
            title="(-) DESPESAS VARIÁVEIS"
            items={despesasVariaveis}
            total={totalDespesasVariaveis}
            icon={<Minus className="h-3.5 w-3.5 text-orange-500" />}
            totalClass="text-orange-600"
            negative
          />

          {/* OUTRAS DESPESAS */}
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
          <div className={`flex items-center justify-between py-3 font-display font-bold text-base ${resultadoLiquido >= 0 ? "text-green-700" : "text-destructive"}`}>
            <span>= RESULTADO LÍQUIDO DO MÊS</span>
            <span>{resultadoLiquido >= 0 ? "+" : ""}{fmt(resultadoLiquido)}</span>
          </div>

          <Divider />

          {/* Indicators */}
          <div className="grid grid-cols-2 gap-4 pt-3">
            <IndicatorCard
              label="Comprometimento da Renda"
              value={`${comprometimentoRenda.toFixed(1)}%`}
              status={comprometimentoRenda > 80 ? "danger" : comprometimentoRenda > 60 ? "warning" : "ok"}
            />
            <IndicatorCard
              label="Taxa de Poupança"
              value={`${taxaPoupanca.toFixed(1)}%`}
              status={taxaPoupanca < 0 ? "danger" : taxaPoupanca < 10 ? "warning" : "ok"}
            />
          </div>

          {monthEntries.length === 0 && (
            <p className="text-center text-muted-foreground text-xs py-6">
              Nenhum lançamento registrado neste mês.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

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
  <div className={`flex justify-between py-2 font-display font-semibold text-sm ${value >= 0 ? "text-green-700" : "text-destructive"}`}>
    <span>{label}</span>
    <span>{value >= 0 ? "+" : ""}{fmt(value)}</span>
  </div>
);

const Divider = ({ thick = false }: { thick?: boolean }) => (
  <div className={`border-t ${thick ? "border-foreground/20 border-2" : "border-border"}`} />
);

const IndicatorCard = ({ label, value, status }: { label: string; value: string; status: "ok" | "warning" | "danger" }) => {
  const colors = { ok: "bg-green-50 text-green-700 border-green-200", warning: "bg-yellow-50 text-yellow-700 border-yellow-200", danger: "bg-red-50 text-red-700 border-red-200" };
  return (
    <div className={`rounded-lg border p-3 text-center ${colors[status]}`}>
      <p className="text-[10px] font-body uppercase tracking-wide opacity-70">{label}</p>
      <p className="text-lg font-display font-bold">{value}</p>
    </div>
  );
};

export default DREReport;
