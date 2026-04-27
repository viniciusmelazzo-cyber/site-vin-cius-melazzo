import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { SectionCard } from "@/components/ui/section-card";
import { InsightCard } from "@/components/ui/insight-card";
import { riscoCredito, fmtK } from "@/data/mockAgro";
import { ShieldAlert, TrendingUp, AlertTriangle, CheckCircle2, CloudRain, LineChart as LineIcon, Banknote } from "lucide-react";

const alertaIcon = {
  clima: CloudRain,
  mercado: LineIcon,
  credito: Banknote,
};

const alertaTone = {
  alta: "critical" as const,
  media: "warning" as const,
  baixa: "neutral" as const,
  positivo: "positive" as const,
};

export default function RiscoCredito() {
  const ratingCor = riscoCredito.rating.startsWith("A")
    ? "text-positive"
    : riscoCredito.rating.startsWith("B")
    ? "text-gold-dark"
    : "text-negative";

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Análise de Risco"
        title="Risco de Crédito"
        description="Indicadores de risco, exposição bancária, alertas climáticos, de mercado e diagnóstico de crédito da operação."
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Score Serasa" value={`${riscoCredito.scoreSerasa}`} icon={<ShieldAlert className="h-4 w-4" />} highlight />
        <KpiCard label="Rating Interno" value={riscoCredito.rating} icon={<TrendingUp className="h-4 w-4" />} />
        <KpiCard label="Exposição Atual" value={fmtK(riscoCredito.exposicaoTotal)} icon={<Banknote className="h-4 w-4" />} />
        <KpiCard label="Utilização do Limite" value={`${riscoCredito.utilizacao}%`} icon={<LineIcon className="h-4 w-4" />} />
      </div>

      {/* Score destaque */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="navy-card p-8 text-center lg:col-span-2">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold mb-3">Diagnóstico Melazzo de Crédito</p>
          <div className="flex items-center justify-center gap-12">
            <div>
              <p className="font-display text-7xl font-bold text-linen tabular">{riscoCredito.scoreSerasa}</p>
              <p className="text-[10px] text-linen/60 uppercase tracking-wider mt-1">Score Serasa</p>
            </div>
            <div className="h-24 w-px bg-gold/30" />
            <div>
              <p className={`font-display text-7xl font-bold tabular ${ratingCor.replace("text-", "text-gold")}`} style={{ color: "hsl(var(--gold))" }}>
                {riscoCredito.rating}
              </p>
              <p className="text-[10px] text-linen/60 uppercase tracking-wider mt-1">Rating Interno</p>
            </div>
          </div>
          <div className="divider-gold w-32 mx-auto my-4" />
          <p className="text-sm text-linen/80">{riscoCredito.classificacao}</p>
        </div>

        <SectionCard title="Capacidade de Crédito" subtitle="Limite aprovado vs utilizado">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Utilizado</span>
                <span className="tabular font-semibold text-navy">{fmtK(riscoCredito.exposicaoTotal)}</span>
              </div>
              <div className="h-3 bg-secondary rounded overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-agro to-gold transition-all"
                  style={{ width: `${riscoCredito.utilizacao}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">{riscoCredito.utilizacao}% do limite aprovado</p>
            </div>
            <div className="pt-3 border-t border-border">
              <p className="kpi-label">Limite total</p>
              <p className="font-display text-2xl font-bold text-navy tabular mt-1">{fmtK(riscoCredito.limiteAprovado)}</p>
              <p className="text-xs text-positive mt-1">Folga de {fmtK(riscoCredito.limiteAprovado - riscoCredito.exposicaoTotal)} disponível</p>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Alertas */}
      <div>
        <div className="mb-4">
          <p className="section-label">Sinais de Risco</p>
          <h2 className="font-display text-2xl text-navy font-semibold mt-1">Alertas Ativos</h2>
          <div className="ornament-line mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {riscoCredito.alertas.map((a) => {
            const Icon = alertaIcon[a.tipo as keyof typeof alertaIcon] || AlertTriangle;
            return (
              <InsightCard
                key={a.titulo}
                tone={alertaTone[a.severidade as keyof typeof alertaTone]}
                badge={`Alerta · ${a.tipo}`}
                title={a.titulo}
                description={a.descricao}
                icon={<Icon className="h-4 w-4" />}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
