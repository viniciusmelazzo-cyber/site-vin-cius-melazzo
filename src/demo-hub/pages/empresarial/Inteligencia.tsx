import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { insights, fmt } from "@/data/mockData";
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";

const config = {
  oportunidade: {
    icon: <CheckCircle2 className="h-5 w-5" />,
    color: "text-positive",
    bg: "bg-finance-positive/10",
    border: "border-finance-positive/30",
    label: "Oportunidade",
  },
  alerta: {
    icon: <AlertTriangle className="h-5 w-5" />,
    color: "text-warning",
    bg: "bg-finance-warning/10",
    border: "border-finance-warning/30",
    label: "Atenção",
  },
  tendencia: {
    icon: <TrendingUp className="h-5 w-5" />,
    color: "text-gold-dark",
    bg: "bg-gold/10",
    border: "border-gold/30",
    label: "Tendência",
  },
};

export default function Inteligencia() {
  const oportunidades = insights.filter((i) => i.tipo === "oportunidade");
  const economiaPotencial = oportunidades.reduce((s, i) => s + (i.valor || 0), 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Análise Avançada"
        title="Inteligência Financeira"
        description="Insights estratégicos gerados a partir do cruzamento dos dados financeiros — metodologia Melazzo."
      />

      <SectionCard navy className="text-center" icon={<Sparkles className="h-5 w-5" />} title="Diagnóstico do Mês">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold mb-2">Insights Gerados</p>
            <p className="font-display text-4xl font-bold text-linen tabular">{insights.length}</p>
          </div>
          <div className="md:border-x border-gold/20">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold mb-2">Oportunidades Mapeadas</p>
            <p className="font-display text-4xl font-bold text-linen tabular">{oportunidades.length}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold mb-2">Economia Potencial</p>
            <p className="font-display text-4xl font-bold text-gradient-gold tabular">{fmt(economiaPotencial)}</p>
          </div>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {insights.map((ins, i) => {
          const c = config[ins.tipo as keyof typeof config];
          return (
            <article
              key={i}
              className={`melazzo-card p-6 hover:shadow-lg transition-all border-l-4 ${c.border} animate-fade-up`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`p-2 rounded ${c.bg} ${c.color}`}>{c.icon}</div>
                <div className="flex-1">
                  <p className={`text-[10px] uppercase tracking-wider font-semibold ${c.color}`}>{c.label}</p>
                  <h3 className="font-display text-lg font-semibold text-navy leading-tight mt-0.5">
                    {ins.titulo}
                  </h3>
                </div>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{ins.descricao}</p>
              {ins.valor !== null && (
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    {ins.tipo === "oportunidade" ? "Economia / ganho potencial" : "Valor envolvido"}
                  </span>
                  <span className={`font-display text-xl font-bold tabular ${ins.tipo === "oportunidade" ? "text-positive" : "text-warning"}`}>
                    {ins.tipo === "oportunidade" ? "+" : ""}{fmt(ins.valor!)}
                  </span>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <SectionCard title="Próximo Passo" subtitle="Como destravar mais valor da sua operação">
        <div className="flex items-center gap-4 p-4 rounded bg-gradient-navy text-linen">
          <div className="flex-1">
            <p className="font-display text-lg font-semibold mb-1">Quer ir além desta análise?</p>
            <p className="text-sm text-linen/80">
              Esta é uma versão demonstrativa. Em uma consultoria completa, geramos insights personalizados
              continuamente, com acompanhamento mensal e plano de ação executivo.
            </p>
          </div>
          <button className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-gold text-navy font-semibold text-sm rounded hover:bg-gold-light transition-colors">
            Falar com a Melazzo
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </SectionCard>
    </div>
  );
}
