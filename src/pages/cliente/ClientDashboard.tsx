import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ClientLayout from "@/components/ClientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, TrendingDown, PlusCircle, Upload } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const ClientDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<any[]>([]);

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (profile && !profile.onboarding_completed) {
      navigate("/cliente/onboarding", { replace: true });
    }
  }, [profile, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("financial_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .then(({ data }) => setEntries(data || []));
  }, [user]);

  // Compute summary from entries
  const totalReceitas = entries.filter((e) => e.type === "receita").reduce((s, e) => s + Number(e.amount), 0);
  const totalDespesas = entries.filter((e) => e.type === "despesa").reduce((s, e) => s + Number(e.amount), 0);
  const saldo = totalReceitas - totalDespesas;

  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // Group expenses by category for chart
  const categoryMap: Record<string, number> = {};
  entries
    .filter((e) => e.type === "despesa")
    .forEach((e) => {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + Number(e.amount);
    });
  const chartData = Object.entries(categoryMap).map(([name, value]) => ({ name, valor: value }));

  const summaryCards = [
    { label: "Saldo Atual", value: fmt(saldo), icon: DollarSign, positive: saldo >= 0 },
    { label: "Receitas (total)", value: fmt(totalReceitas), icon: TrendingUp, positive: true },
    { label: "Despesas (total)", value: fmt(totalDespesas), icon: TrendingDown, positive: false },
  ];

  return (
    <ClientLayout role="client">
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground font-body text-sm mt-1">
            Resumo financeiro da sua empresa
          </p>
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
                    <Tooltip
                      contentStyle={{ fontFamily: "Montserrat", fontSize: 12, borderRadius: 6 }}
                      formatter={(v: number) => fmt(v)}
                    />
                    <Bar dataKey="valor" name="Valor" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {entries.length === 0 && (
          <Card className="border-border shadow-sm">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground font-body text-sm mb-4">
                Nenhum lançamento financeiro ainda. Comece adicionando suas receitas e despesas.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button className="font-body gap-2 bg-gradient-gold text-primary hover:opacity-90" onClick={() => navigate("/cliente/lancamentos")}>
            <PlusCircle className="h-4 w-4" />
            Novo Lançamento
          </Button>
          <Button variant="outline" className="font-body gap-2" onClick={() => navigate("/cliente/documentos")}>
            <Upload className="h-4 w-4" />
            Upload de Documento
          </Button>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientDashboard;
