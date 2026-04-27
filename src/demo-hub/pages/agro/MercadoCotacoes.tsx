import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { cotacoes } from "@/data/mockAgro";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, TrendingDown, Beef, Wheat, Sprout, DollarSign } from "lucide-react";

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--gold) / 0.3)",
  borderRadius: 4,
  fontSize: 12,
  color: "hsl(var(--navy))",
};

const cards = [
  { key: "boiGordo", label: "Boi Gordo", icon: Beef, color: "hsl(var(--gold-dark))", gradId: "gBoi" },
  { key: "soja", label: "Soja", icon: Sprout, color: "hsl(var(--agro))", gradId: "gSoja" },
  { key: "milho", label: "Milho", icon: Wheat, color: "hsl(var(--finance-warning))", gradId: "gMilho" },
  { key: "dolar", label: "Dólar", icon: DollarSign, color: "hsl(var(--navy))", gradId: "gDolar" },
] as const;

export default function MercadoCotacoes() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Mercado & Cotações"
        title="Cotações de Mercado"
        description="Acompanhamento dos principais indicadores de preço para suporte à tomada de decisão de comercialização e hedge."
      />

      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ key, label, icon: Icon, color }) => {
          const c = cotacoes[key];
          const delta = ((c.atual - c.anterior) / c.anterior) * 100;
          const up = delta >= 0;
          return (
            <div key={key} className="melazzo-card p-5 group hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-3">
                <Icon className="h-6 w-6" style={{ color }} />
                <span className={`flex items-center gap-1 text-xs font-bold tabular ${up ? "text-positive" : "text-negative"}`}>
                  {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  {Math.abs(delta).toFixed(1)}%
                </span>
              </div>
              <p className="kpi-label">{label}</p>
              <p className="font-display text-3xl font-bold text-navy tabular mt-1">
                {key === "dolar" ? "R$ " : ""}{c.atual.toLocaleString("pt-BR", { minimumFractionDigits: key === "dolar" ? 2 : 0 })}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">{c.unidade}</p>
              <p className="text-[10px] text-muted-foreground mt-2">Anterior: {key === "dolar" ? "R$ " : ""}{c.anterior.toFixed(key === "dolar" ? 2 : 0)}</p>
            </div>
          );
        })}
      </div>

      {/* Gráficos de evolução */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {cards.map(({ key, label, color, gradId }) => {
          const c = cotacoes[key];
          return (
            <SectionCard key={key} title={`${label} · Evolução 7 meses`} subtitle={c.unidade}>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={c.historico}>
                  <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={0.45} />
                      <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} domain={["dataMin - 5", "dataMax + 5"]} />
                  <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => `${key === "dolar" ? "R$ " : ""}${v.toFixed(key === "dolar" ? 2 : 0)} ${c.unidade.replace("R$/", "/")}`} />
                  <Area type="monotone" dataKey="valor" stroke={color} strokeWidth={2.5} fill={`url(#${gradId})`} />
                </AreaChart>
              </ResponsiveContainer>
            </SectionCard>
          );
        })}
      </div>

      {/* Análise comparativa */}
      <SectionCard title="Análise Comparativa Out/24 → Abr/25" subtitle="Variação acumulada nos últimos 7 meses">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Commodity</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Out/24</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Atual</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Variação</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Tendência</th>
              </tr>
            </thead>
            <tbody>
              {cards.map(({ key, label }) => {
                const c = cotacoes[key];
                const inicial = c.historico[0].valor;
                const variacao = ((c.atual - inicial) / inicial) * 100;
                const up = variacao >= 0;
                return (
                  <tr key={key} className="border-b border-border/40 hover:bg-secondary/30">
                    <td className="py-2.5 px-3 font-medium text-navy">{label}</td>
                    <td className="py-2.5 px-3 text-right tabular text-foreground">{key === "dolar" ? "R$ " : ""}{inicial.toFixed(key === "dolar" ? 2 : 0)}</td>
                    <td className="py-2.5 px-3 text-right tabular font-semibold text-navy">{key === "dolar" ? "R$ " : ""}{c.atual.toFixed(key === "dolar" ? 2 : 0)}</td>
                    <td className={`py-2.5 px-3 text-right tabular font-semibold ${up ? "text-positive" : "text-negative"}`}>
                      {up ? "+" : ""}{variacao.toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={up ? "badge-positive" : "badge-negative"}>
                        {up ? "Alta" : "Baixa"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
