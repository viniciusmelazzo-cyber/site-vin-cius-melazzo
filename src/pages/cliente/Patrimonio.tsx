import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ClientLayout from "@/components/ClientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { TrendingUp, TrendingDown, Landmark } from "lucide-react";
import { calcPatrimonio, type PatrimonioBreakdown } from "@/lib/onboarding-finance";

const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const COLORS = {
  liquidez: "hsl(146, 50%, 36%)",
  imobilizado: "hsl(215, 65%, 35%)",
  passivos: "hsl(0, 100%, 25%)",
};

const Patrimonio = () => {
  const { user } = useAuth();
  const [patrimonio, setPatrimonio] = useState<PatrimonioBreakdown | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [{ data: onboarding }, { data: debts }] = await Promise.all([
        supabase.from("onboarding_data").select("*").eq("user_id", user.id).single(),
        supabase.from("client_debts").select("*").eq("user_id", user.id),
      ]);
      if (onboarding) {
        setPatrimonio(calcPatrimonio(onboarding, debts || []));
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const donutData = useMemo(() => {
    if (!patrimonio) return [];
    return [
      { name: "Liquidez e Investimentos", value: patrimonio.liquidez.total, color: COLORS.liquidez },
      { name: "Imobilizado", value: patrimonio.imobilizado.total, color: COLORS.imobilizado },
      { name: "Passivos (Dívidas)", value: patrimonio.passivos.total, color: COLORS.passivos },
    ].filter((d) => d.value > 0);
  }, [patrimonio]);

  if (loading) {
    return (
      <ClientLayout role="client">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </ClientLayout>
    );
  }

  if (!patrimonio) {
    return (
      <ClientLayout role="client">
        <div className="text-center py-20">
          <p className="text-muted-foreground font-body">Complete o onboarding para visualizar seu patrimônio.</p>
        </div>
      </ClientLayout>
    );
  }

  const isPositive = patrimonio.patrimonio_liquido >= 0;

  return (
    <ClientLayout role="client">
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Meu Patrimônio</h1>
          <p className="text-muted-foreground font-body text-sm mt-1">Balanço patrimonial pessoal</p>
        </div>

        {/* Net Worth Card */}
        <Card className="border-accent/30 shadow-md bg-gradient-to-br from-card to-accent/5">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Landmark className="h-5 w-5 text-accent" />
              <span className="text-sm font-body text-muted-foreground uppercase tracking-wide">Patrimônio Líquido</span>
            </div>
            <p className={`text-4xl font-display font-bold ${isPositive ? "text-finance-positive" : "text-finance-negative"}`}>
              {fmt(patrimonio.patrimonio_liquido)}
            </p>
            <div className="flex items-center justify-center gap-1 mt-2">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-finance-positive" />
              ) : (
                <TrendingDown className="h-4 w-4 text-finance-negative" />
              )}
              <span className={`text-xs font-body ${isPositive ? "text-finance-positive" : "text-finance-negative"}`}>
                {isPositive ? "Patrimônio positivo" : "Patrimônio negativo — passivos superam ativos"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard
            label="Liquidez e Investimentos"
            value={patrimonio.liquidez.total}
            colorClass="text-finance-positive"
            bgClass="bg-finance-positive/10 border-finance-positive/20"
          />
          <SummaryCard
            label="Ativos Imobilizados"
            value={patrimonio.imobilizado.total}
            colorClass="text-primary"
            bgClass="bg-primary/5 border-primary/20"
          />
          <SummaryCard
            label="Passivos (Dívidas)"
            value={patrimonio.passivos.total}
            colorClass="text-finance-negative"
            bgClass="bg-finance-negative/10 border-finance-negative/20"
          />
        </div>

        {/* Donut Chart */}
        {donutData.length > 0 && (
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-display">Composição Patrimonial</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      dataKey="value"
                      stroke="hsl(var(--card))"
                      strokeWidth={3}
                    >
                      {donutData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: number) => fmt(v)}
                      contentStyle={{
                        fontFamily: "Montserrat",
                        fontSize: 12,
                        borderRadius: 6,
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontFamily: "Montserrat", fontSize: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Liquidez */}
          <DetailTable
            title="Liquidez e Investimentos"
            items={[
              { label: "Poupança", value: patrimonio.liquidez.poupanca },
              { label: "CDB / LCI / LCA", value: patrimonio.liquidez.cdb_lci_lca },
              { label: "Tesouro Direto", value: patrimonio.liquidez.tesouro_direto },
              { label: "Ações e Fundos", value: patrimonio.liquidez.acoes_fundos },
              { label: "Previdência Privada", value: patrimonio.liquidez.previdencia_privada },
              { label: "Criptomoedas", value: patrimonio.liquidez.criptomoedas },
              { label: "FGTS", value: patrimonio.liquidez.fgts },
              { label: "Outros Investimentos", value: patrimonio.liquidez.outros_investimentos },
            ]}
            total={patrimonio.liquidez.total}
            colorClass="text-finance-positive"
          />

          {/* Imobilizado */}
          <DetailTable
            title="Ativos Imobilizados"
            items={[
              { label: "Imóvel Principal", value: patrimonio.imobilizado.imovel_principal },
              { label: "Outros Imóveis", value: patrimonio.imobilizado.outros_imoveis },
              { label: "Veículos", value: patrimonio.imobilizado.veiculos },
              { label: "Joias e Relógios", value: patrimonio.imobilizado.joias_relogios },
              { label: "Equipamentos", value: patrimonio.imobilizado.equipamentos },
              { label: "Estoque", value: patrimonio.imobilizado.estoque },
              { label: "Gado", value: patrimonio.imobilizado.gado },
              { label: "Outros Bens", value: patrimonio.imobilizado.outros_bens },
            ]}
            total={patrimonio.imobilizado.total}
            colorClass="text-primary"
          />

          {/* Passivos */}
          <DetailTable
            title="Passivos (Dívidas)"
            items={[
              { label: "Financiamentos Ativos", value: patrimonio.passivos.financiamentos },
              { label: "Empréstimos Ativos", value: patrimonio.passivos.emprestimos },
              { label: "Consórcios Ativos", value: patrimonio.passivos.consorcios },
              { label: "Dívidas em Atraso", value: patrimonio.passivos.dividas_atraso },
              { label: "Saldo Financiamento Imóvel", value: patrimonio.passivos.financiamento_saldo },
              { label: "Dívidas Parceladas", value: patrimonio.passivos.debts_saldo },
            ]}
            total={patrimonio.passivos.total}
            colorClass="text-finance-negative"
          />
        </div>
      </div>
    </ClientLayout>
  );
};

const SummaryCard = ({ label, value, colorClass, bgClass }: {
  label: string; value: number; colorClass: string; bgClass: string;
}) => (
  <Card className={`border shadow-sm ${bgClass}`}>
    <CardContent className="p-5">
      <p className="text-xs font-body text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-display font-bold ${colorClass}`}>{fmt(value)}</p>
    </CardContent>
  </Card>
);

const DetailTable = ({ title, items, total, colorClass }: {
  title: string;
  items: { label: string; value: number }[];
  total: number;
  colorClass: string;
}) => {
  const filtered = items.filter((i) => i.value > 0);
  if (filtered.length === 0 && total === 0) return null;

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-display">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 text-sm font-body">
          {filtered.map((item) => (
            <div key={item.label} className="flex justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-medium">{fmt(item.value)}</span>
            </div>
          ))}
          <div className={`flex justify-between py-2 font-semibold ${colorClass}`}>
            <span>Total</span>
            <span>{fmt(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Patrimonio;
