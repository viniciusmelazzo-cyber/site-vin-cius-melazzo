import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type Period = "month" | "3m" | "6m" | "12m" | "ytd";

interface TemporalVisionProps {
  entries: any[];
  selectedMonth: string;
}

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "month", label: "Mês Atual" },
  { value: "3m", label: "3 meses" },
  { value: "6m", label: "6 meses" },
  { value: "12m", label: "12 meses" },
  { value: "ytd", label: "Ano (YTD)" },
];

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const fmtShort = (v: number) => {
  if (Math.abs(v) >= 1000) return `R$ ${(v / 1000).toFixed(1)}k`;
  return fmt(v);
};

function getMonthsForPeriod(period: Period, refMonth: string): string[] {
  const [refY, refM] = refMonth.split("-").map(Number);
  const ref = new Date(refY, refM - 1, 1);
  let count: number;

  if (period === "month") return [refMonth];

  if (period === "ytd") {
    count = refM; // Jan to current month
  } else {
    count = parseInt(period);
  }

  const months: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(refY, refM - 1 - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return months;
}

function getEntryMonth(entry: any): string {
  const d = new Date(entry.date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(m: string): string {
  const [y, mo] = m.split("-").map(Number);
  return new Date(y, mo - 1).toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
}

const TemporalVision = ({ entries, selectedMonth }: TemporalVisionProps) => {
  const [period, setPeriod] = useState<Period>("3m");

  const months = useMemo(() => getMonthsForPeriod(period, selectedMonth), [period, selectedMonth]);

  const chartData = useMemo(() => {
    return months.map((m) => {
      const mEntries = entries.filter((e) => getEntryMonth(e) === m);
      const receitas = mEntries.filter((e) => e.type === "receita").reduce((s: number, e: any) => s + Number(e.amount), 0);
      const despesas = mEntries.filter((e) => e.type === "despesa").reduce((s: number, e: any) => s + Number(e.amount), 0);
      return {
        month: m,
        label: monthLabel(m),
        receitas,
        despesas,
        resultado: receitas - despesas,
      };
    });
  }, [entries, months]);

  // Compare current period vs previous period
  const comparison = useMemo(() => {
    if (period === "month" || chartData.length < 2) return null;

    const currentTotal = {
      receitas: chartData.reduce((s, d) => s + d.receitas, 0),
      despesas: chartData.reduce((s, d) => s + d.despesas, 0),
      resultado: chartData.reduce((s, d) => s + d.resultado, 0),
    };

    // Get previous period months
    const count = months.length;
    const [refY, refM] = selectedMonth.split("-").map(Number);
    const prevMonths: string[] = [];
    for (let i = count * 2 - 1; i >= count; i--) {
      const d = new Date(refY, refM - 1 - i, 1);
      prevMonths.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }

    const prevTotal = {
      receitas: 0,
      despesas: 0,
      resultado: 0,
    };
    entries.forEach((e) => {
      const em = getEntryMonth(e);
      if (prevMonths.includes(em)) {
        const amt = Number(e.amount);
        if (e.type === "receita") prevTotal.receitas += amt;
        else prevTotal.despesas += amt;
      }
    });
    prevTotal.resultado = prevTotal.receitas - prevTotal.despesas;

    const pct = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return ((curr - prev) / prev) * 100;
    };

    return {
      receitas: { value: currentTotal.receitas, change: pct(currentTotal.receitas, prevTotal.receitas) },
      despesas: { value: currentTotal.despesas, change: pct(currentTotal.despesas, prevTotal.despesas) },
      resultado: { value: currentTotal.resultado, change: pct(currentTotal.resultado, prevTotal.resultado) },
    };
  }, [chartData, entries, months, period, selectedMonth]);

  if (period === "month") {
    return (
      <div className="flex flex-wrap gap-2">
        {PERIOD_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            variant={period === opt.value ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod(opt.value)}
            className={`font-body text-xs ${period === opt.value ? "bg-accent text-accent-foreground" : ""}`}
          >
            {opt.label}
          </Button>
        ))}
      </div>
    );
  }

  const ChangeIcon = ({ value }: { value: number }) => {
    if (value > 0) return <TrendingUp className="h-3.5 w-3.5" />;
    if (value < 0) return <TrendingDown className="h-3.5 w-3.5" />;
    return <Minus className="h-3.5 w-3.5" />;
  };

  return (
    <div className="space-y-4">
      {/* Period Selector */}
      <div className="flex flex-wrap gap-2">
        {PERIOD_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            variant={period === opt.value ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod(opt.value)}
            className={`font-body text-xs ${period === opt.value ? "bg-accent text-accent-foreground" : ""}`}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {/* Trend Chart */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-display">Evolução Financeira</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradReceitas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(146, 50%, 36%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(146, 50%, 36%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradDespesas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0, 100%, 25%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(0, 100%, 25%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradResultado" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(39, 50%, 57%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(39, 50%, 57%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fontFamily: "Montserrat" }}
                  className="stroke-muted-foreground"
                />
                <YAxis
                  tick={{ fontSize: 11, fontFamily: "Montserrat" }}
                  className="stroke-muted-foreground"
                  tickFormatter={(v) => fmtShort(v)}
                />
                <Tooltip
                  contentStyle={{
                    fontFamily: "Montserrat",
                    fontSize: 12,
                    borderRadius: 6,
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                  }}
                  formatter={(v: number, name: string) => [fmt(v), name]}
                />
                <Legend
                  wrapperStyle={{ fontFamily: "Montserrat", fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="receitas"
                  name="Receitas"
                  stroke="hsl(146, 50%, 36%)"
                  strokeWidth={2}
                  fill="url(#gradReceitas)"
                  dot={{ r: 3 }}
                />
                <Area
                  type="monotone"
                  dataKey="despesas"
                  name="Despesas"
                  stroke="hsl(0, 100%, 25%)"
                  strokeWidth={2}
                  fill="url(#gradDespesas)"
                  dot={{ r: 3 }}
                />
                <Area
                  type="monotone"
                  dataKey="resultado"
                  name="Resultado"
                  stroke="hsl(39, 50%, 57%)"
                  strokeWidth={2.5}
                  fill="url(#gradResultado)"
                  dot={{ r: 3 }}
                  strokeDasharray="5 3"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Cards */}
      {comparison && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Receitas", data: comparison.receitas, colorClass: "text-finance-positive" },
            { label: "Despesas", data: comparison.despesas, colorClass: "text-finance-negative" },
            { label: "Resultado", data: comparison.resultado, colorClass: comparison.resultado.value >= 0 ? "text-finance-positive" : "text-finance-negative" },
          ].map((item) => (
            <Card key={item.label} className="border-border shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs font-body text-muted-foreground mb-1">{item.label} no período</p>
                <p className={`text-xl font-display font-bold ${item.colorClass}`}>
                  {fmt(item.data.value)}
                </p>
                <div className={`flex items-center gap-1 mt-1 text-xs font-body ${
                  item.data.change > 0 ? "text-finance-positive" : item.data.change < 0 ? "text-finance-negative" : "text-muted-foreground"
                }`}>
                  <ChangeIcon value={item.data.change} />
                  <span>
                    {item.data.change > 0 ? "+" : ""}
                    {item.data.change.toFixed(1)}% vs período anterior
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemporalVision;
