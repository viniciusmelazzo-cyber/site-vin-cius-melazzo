import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ClientLayout from "@/components/ClientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, TrendingDown, PlusCircle, Upload, ChevronLeft, ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import DREReport from "@/components/DREReport";
import TemporalVision from "@/components/dashboard/TemporalVision";
import EvolutionTimeline from "@/components/dashboard/EvolutionTimeline";
import { calcPatrimonio, getRendaLiquida, getParcelasDividas } from "@/lib/onboarding-finance";

const ClientDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<any[]>([]);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [debtsData, setDebtsData] = useState<any[]>([]);
  const [onboardingFinance, setOnboardingFinance] = useState<{
    liquidezTotal: number; passivosTotal: number; ativosTotal: number;
    rendaLiquida: number; parcelasDividas: number;
  }>({ liquidezTotal: 0, passivosTotal: 0, ativosTotal: 0, rendaLiquida: 0, parcelasDividas: 0 });
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  useEffect(() => {
    if (profile && !profile.onboarding_completed) {
      navigate("/cliente/onboarding", { replace: true });
    }
  }, [profile, navigate]);

  useEffect(() => {
    if (!user) return;
    // Load entries and onboarding data in parallel
    Promise.all([
      supabase.from("financial_entries").select("*").eq("user_id", user.id).order("date", { ascending: false }),
      supabase.from("onboarding_data").select("*").eq("user_id", user.id).single(),
      supabase.from("client_debts").select("*").eq("user_id", user.id),
    ]).then(([entriesRes, onbRes, debtsRes]) => {
      setEntries(entriesRes.data || []);
      if (onbRes.data) {
        const p = calcPatrimonio(onbRes.data, debtsRes.data || []);
        setOnboardingFinance({
          liquidezTotal: p.liquidez_alta,
          passivosTotal: p.passivos.total,
          ativosTotal: p.liquidez.total + p.imobilizado.total,
          rendaLiquida: getRendaLiquida(onbRes.data),
          parcelasDividas: getParcelasDividas(debtsRes.data || []),
        });
      }
    });
  }, [user]);

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    entries.forEach((e) => {
      const d = new Date(e.date);
      months.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    });
    const now = new Date();
    months.add(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
    return Array.from(months).sort().reverse();
  }, [entries]);

  const monthEntries = useMemo(() => {
    return entries.filter((e) => {
      const d = new Date(e.date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` === selectedMonth;
    });
  }, [entries, selectedMonth]);

  const monthLabel = useMemo(() => {
    const [y, m] = selectedMonth.split("-");
    return new Date(Number(y), Number(m) - 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  }, [selectedMonth]);

  const navigateMonth = (dir: number) => {
    const idx = availableMonths.indexOf(selectedMonth);
    const next = idx - dir;
    if (next >= 0 && next < availableMonths.length) setSelectedMonth(availableMonths[next]);
  };

  const totalReceitas = monthEntries.filter((e) => e.type === "receita").reduce((s, e) => s + Number(e.amount), 0);
  const totalDespesas = monthEntries.filter((e) => e.type === "despesa").reduce((s, e) => s + Number(e.amount), 0);
  const saldo = totalReceitas - totalDespesas;

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const categoryMap: Record<string, number> = {};
  monthEntries.filter((e) => e.type === "despesa").forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + Number(e.amount);
  });
  const chartData = Object.entries(categoryMap).map(([name, value]) => ({ name, valor: value }));

  const summaryCards = [
    { label: "Saldo do Mês", value: fmt(saldo), icon: DollarSign, positive: saldo >= 0 },
    { label: "Receitas", value: fmt(totalReceitas), icon: TrendingUp, positive: true },
    { label: "Despesas", value: fmt(totalDespesas), icon: TrendingDown, positive: false },
  ];

  return (
    <ClientLayout role="client">
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground font-body text-sm mt-1">Resumo financeiro</p>
          </div>
        </div>

        {/* Temporal Vision - Period Selector & Trend Chart */}
        <TemporalVision entries={entries} selectedMonth={selectedMonth} />

        {/* Month Navigation */}
        <div className="flex items-center justify-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)} disabled={availableMonths.indexOf(selectedMonth) === availableMonths.length - 1}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-display font-bold capitalize min-w-[200px] text-center">{monthLabel}</h2>
          <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)} disabled={availableMonths.indexOf(selectedMonth) === 0}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {summaryCards.map((card) => (
            <Card key={card.label} className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-body text-muted-foreground">{card.label}</span>
                  <div className="p-2 rounded-lg bg-secondary">
                    <card.icon className="h-4 w-4 text-accent" />
                  </div>
                </div>
                <p className="text-2xl font-display font-bold text-foreground">{card.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-display">Despesas por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fontFamily: "Montserrat" }} className="stroke-muted-foreground" />
                    <YAxis tick={{ fontSize: 12, fontFamily: "Montserrat" }} className="stroke-muted-foreground" />
                    <Tooltip contentStyle={{ fontFamily: "Montserrat", fontSize: 12, borderRadius: 6 }} formatter={(v: number) => fmt(v)} />
                    <Bar dataKey="valor" name="Valor" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* DRE */}
        <DREReport
          entries={entries}
          selectedMonth={selectedMonth}
          showMonthNav={false}
          liquidezTotal={onboardingFinance.liquidezTotal}
          passivosTotal={onboardingFinance.passivosTotal}
          ativosTotal={onboardingFinance.ativosTotal}
          rendaLiquida={onboardingFinance.rendaLiquida}
          parcelasDividas={onboardingFinance.parcelasDividas}
        />

        {monthEntries.length === 0 && (
          <Card className="border-border shadow-sm">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground font-body text-sm mb-4">
                Nenhum lançamento neste mês. Adicione suas receitas e despesas.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button className="font-body gap-2 bg-gradient-gold text-primary hover:opacity-90" onClick={() => navigate("/cliente/lancamentos")}>
            <PlusCircle className="h-4 w-4" /> Novo Lançamento
          </Button>
          <Button variant="outline" className="font-body gap-2" onClick={() => navigate("/cliente/documentos")}>
            <Upload className="h-4 w-4" /> Upload de Documento
          </Button>
        </div>

        {/* Timeline - Month History */}
        {availableMonths.length > 1 && (
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-display">Histórico Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {availableMonths.map((m) => {
                  const [y, mo] = m.split("-");
                  const label = new Date(Number(y), Number(mo) - 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
                  const mEntries = entries.filter((e) => {
                    const d = new Date(e.date);
                    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` === m;
                  });
                  const rec = mEntries.filter((e) => e.type === "receita").reduce((s, e) => s + Number(e.amount), 0);
                  const desp = mEntries.filter((e) => e.type === "despesa").reduce((s, e) => s + Number(e.amount), 0);
                  const isSelected = m === selectedMonth;

                  return (
                    <button
                      key={m}
                      onClick={() => setSelectedMonth(m)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${isSelected ? "bg-accent/10 border border-accent/30" : "bg-secondary/50 hover:bg-secondary"}`}
                    >
                      <span className="font-body text-sm font-medium capitalize">{label}</span>
                      <div className="flex gap-4 text-xs font-body">
                        <span className="text-finance-positive">+{fmt(rec)}</span>
                        <span className="text-finance-negative">−{fmt(desp)}</span>
                        <span className={`font-semibold ${rec - desp >= 0 ? "text-finance-positive" : "text-finance-negative"}`}>
                          {fmt(rec - desp)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ClientLayout>
  );
};

export default ClientDashboard;
