import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  ComposedChart, Bar, Area,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { calculateHealthScore } from "@/lib/health-score";
import { calcPatrimonio, getRendaLiquida } from "@/lib/onboarding-finance";
import { TrendingUp, TrendingDown, Minus, Camera } from "lucide-react";
import { toast } from "sonner";

interface EvolutionTimelineProps {
  userId: string;
  entries: any[];
  onboardingData: any;
  debts: any[];
  /** If true, show the "save snapshot" button */
  canSaveSnapshot?: boolean;
}

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const fmtShort = (v: number) => {
  if (Math.abs(v) >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1000) return `R$ ${(v / 1000).toFixed(0)}k`;
  return fmt(v);
};

function getEntryMonth(entry: any): string {
  const d = new Date(entry.date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(m: string): string {
  const [y, mo] = m.split("-").map(Number);
  return new Date(y, mo - 1).toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
}

const EvolutionTimeline = ({ userId, entries, onboardingData, debts, canSaveSnapshot }: EvolutionTimelineProps) => {
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  // Load existing snapshots
  useEffect(() => {
    supabase
      .from("client_monthly_snapshots")
      .select("*")
      .eq("user_id", userId)
      .order("month", { ascending: true })
      .then(({ data }) => setSnapshots(data || []));
  }, [userId]);

  // Compute current month data from entries + onboarding
  const computeMonthSnapshot = (month: string) => {
    const mEntries = entries.filter((e) => getEntryMonth(e) === month);
    const receitas = mEntries.filter((e) => e.type === "receita").reduce((s: number, e: any) => s + Number(e.amount), 0);
    const despesas = mEntries.filter((e) => e.type === "despesa").reduce((s: number, e: any) => s + Number(e.amount), 0);
    const resultado = receitas - despesas;

    let patrimonioLiquido = 0;
    let healthScore = 0;

    if (onboardingData) {
      const p = calcPatrimonio(onboardingData, debts);
      const ativosTotal = p.liquidez.total + p.imobilizado.total;
      patrimonioLiquido = ativosTotal - p.passivos.total;

      const rendaLiquida = getRendaLiquida(onboardingData);
      const DESP_FIXA_CATS = ["Moradia", "Transporte", "Saúde", "Educação", "Cartão de Crédito"];
      const despFixas = mEntries
        .filter((e: any) => e.type === "despesa" && DESP_FIXA_CATS.includes(e.category))
        .reduce((s: number, e: any) => s + Number(e.amount), 0);

      const hs = calculateHealthScore({
        despesasFixas: despFixas,
        rendaLiquida,
        resultadoLiquido: resultado,
        totalReceitas: receitas,
        liquidezAlta: p.liquidez_alta,
        passivosTotal: p.passivos.total,
        ativosTotal,
      });
      healthScore = hs.total;
    }

    return { receitas, despesas, resultado, patrimonio_liquido: patrimonioLiquido, health_score: healthScore };
  };

  // Build merged timeline: snapshots + computed months that don't have a snapshot
  const timeline = useMemo(() => {
    // Collect all months from entries
    const entryMonths = new Set<string>();
    entries.forEach((e) => entryMonths.add(getEntryMonth(e)));

    // Snapshot months
    const snapshotMap = new Map<string, any>();
    snapshots.forEach((s) => snapshotMap.set(s.month, s));

    // All months sorted
    const allMonths = new Set([...entryMonths, ...snapshots.map((s) => s.month)]);
    const sorted = Array.from(allMonths).sort();

    return sorted.map((m) => {
      if (snapshotMap.has(m)) {
        const s = snapshotMap.get(m);
        return {
          month: m,
          label: monthLabel(m),
          patrimonio: Number(s.patrimonio_liquido),
          healthScore: Number(s.health_score),
          receitas: Number(s.receitas),
          despesas: Number(s.despesas),
          resultado: Number(s.resultado),
          isSaved: true,
        };
      }
      const computed = computeMonthSnapshot(m);
      return {
        month: m,
        label: monthLabel(m),
        patrimonio: computed.patrimonio_liquido,
        healthScore: computed.health_score,
        receitas: computed.receitas,
        despesas: computed.despesas,
        resultado: computed.resultado,
        isSaved: false,
      };
    });
  }, [entries, snapshots, onboardingData, debts]);

  // Save current month snapshot
  const saveCurrentSnapshot = async () => {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const data = computeMonthSnapshot(month);

    setSaving(true);
    const { error } = await supabase.from("client_monthly_snapshots").upsert({
      user_id: userId,
      month,
      patrimonio_liquido: data.patrimonio_liquido,
      health_score: data.health_score,
      receitas: data.receitas,
      despesas: data.despesas,
      resultado: data.resultado,
    }, { onConflict: "user_id,month" });

    if (error) {
      toast.error("Erro ao salvar snapshot");
    } else {
      toast.success("Snapshot do mês salvo com sucesso!");
      // Reload snapshots
      const { data: updated } = await supabase
        .from("client_monthly_snapshots")
        .select("*")
        .eq("user_id", userId)
        .order("month", { ascending: true });
      setSnapshots(updated || []);
    }
    setSaving(false);
  };

  // Trends
  const trend = useMemo(() => {
    if (timeline.length < 2) return null;
    const last = timeline[timeline.length - 1];
    const prev = timeline[timeline.length - 2];
    const pctChange = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return ((curr - prev) / Math.abs(prev)) * 100;
    };
    return {
      patrimonio: pctChange(last.patrimonio, prev.patrimonio),
      healthScore: last.healthScore - prev.healthScore,
      resultado: pctChange(last.resultado, prev.resultado),
    };
  }, [timeline]);

  const TrendIcon = ({ value }: { value: number }) => {
    if (value > 0) return <TrendingUp className="h-3.5 w-3.5 text-finance-positive" />;
    if (value < 0) return <TrendingDown className="h-3.5 w-3.5 text-finance-negative" />;
    return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
  };

  if (timeline.length === 0) {
    return (
      <Card className="border-border">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground font-body text-sm">
            Nenhum dado histórico disponível. Registre lançamentos e salve snapshots mensais para visualizar a evolução.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with save button */}
      {canSaveSnapshot && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            className="font-body gap-2 text-xs"
            onClick={saveCurrentSnapshot}
            disabled={saving}
          >
            <Camera className="h-3.5 w-3.5" />
            {saving ? "Salvando..." : "Salvar Snapshot do Mês"}
          </Button>
        </div>
      )}

      {/* Trend summary cards */}
      {trend && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs font-body text-muted-foreground mb-1">Patrimônio Líquido</p>
              <p className="text-xl font-display font-bold">{fmtShort(timeline[timeline.length - 1].patrimonio)}</p>
              <div className="flex items-center gap-1 mt-1 text-xs font-body">
                <TrendIcon value={trend.patrimonio} />
                <span className={trend.patrimonio >= 0 ? "text-finance-positive" : "text-finance-negative"}>
                  {trend.patrimonio > 0 ? "+" : ""}{trend.patrimonio.toFixed(1)}% vs mês anterior
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs font-body text-muted-foreground mb-1">Health Score</p>
              <p className="text-xl font-display font-bold">{timeline[timeline.length - 1].healthScore}<span className="text-sm text-muted-foreground">/100</span></p>
              <div className="flex items-center gap-1 mt-1 text-xs font-body">
                <TrendIcon value={trend.healthScore} />
                <span className={trend.healthScore >= 0 ? "text-finance-positive" : "text-finance-negative"}>
                  {trend.healthScore > 0 ? "+" : ""}{trend.healthScore.toFixed(0)} pts vs mês anterior
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs font-body text-muted-foreground mb-1">Resultado Mensal</p>
              <p className={`text-xl font-display font-bold ${timeline[timeline.length - 1].resultado >= 0 ? "text-finance-positive" : "text-finance-negative"}`}>
                {fmtShort(timeline[timeline.length - 1].resultado)}
              </p>
              <div className="flex items-center gap-1 mt-1 text-xs font-body">
                <TrendIcon value={trend.resultado} />
                <span className={trend.resultado >= 0 ? "text-finance-positive" : "text-finance-negative"}>
                  {trend.resultado > 0 ? "+" : ""}{trend.resultado.toFixed(1)}% vs mês anterior
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Patrimônio Evolution Chart */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-display">Evolução do Patrimônio Líquido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={timeline} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradPatrimonio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(39, 50%, 57%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(39, 50%, 57%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fontFamily: "Montserrat" }} />
                <YAxis tick={{ fontSize: 11, fontFamily: "Montserrat" }} tickFormatter={fmtShort} />
                <Tooltip
                  contentStyle={{
                    fontFamily: "Montserrat", fontSize: 12, borderRadius: 6,
                    backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))",
                  }}
                  formatter={(v: number, name: string) => [fmt(v), name]}
                />
                <Legend wrapperStyle={{ fontFamily: "Montserrat", fontSize: 12 }} />
                <Area
                  type="monotone" dataKey="patrimonio" name="Patrimônio Líquido"
                  stroke="hsl(39, 50%, 57%)" strokeWidth={2.5} fill="url(#gradPatrimonio)" dot={{ r: 3 }}
                />
                <Bar dataKey="resultado" name="Resultado" fill="hsl(146, 50%, 36%)" radius={[3, 3, 0, 0]} opacity={0.6} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Health Score Evolution Chart */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-display">Evolução do Health Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeline} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fontFamily: "Montserrat" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fontFamily: "Montserrat" }} />
                <Tooltip
                  contentStyle={{
                    fontFamily: "Montserrat", fontSize: 12, borderRadius: 6,
                    backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))",
                  }}
                  formatter={(v: number) => [`${v} pts`, "Health Score"]}
                />
                {/* Reference bands */}
                <Line
                  type="monotone" dataKey="healthScore" name="Health Score"
                  stroke="hsl(39, 50%, 57%)" strokeWidth={3} dot={{ r: 4, fill: "hsl(39, 50%, 57%)" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Score zones legend */}
          <div className="flex justify-center gap-6 mt-3 text-xs font-body">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-finance-positive/60" />
              <span className="text-muted-foreground">Excelente (80-100)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-finance-warning/60" />
              <span className="text-muted-foreground">Moderado (50-79)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-finance-negative/60" />
              <span className="text-muted-foreground">Crítico (0-49)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Snapshot status badges */}
      <div className="flex flex-wrap gap-2">
        {timeline.map((t) => (
          <Badge
            key={t.month}
            variant={t.isSaved ? "default" : "secondary"}
            className="font-body text-[10px]"
          >
            {t.label} {t.isSaved ? "✓" : "(calculado)"}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default EvolutionTimeline;
