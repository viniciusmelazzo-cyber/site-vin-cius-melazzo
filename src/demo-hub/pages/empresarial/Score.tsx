import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { scoreSaude } from "@/data/mockData";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis,
} from "recharts";
import { ShieldCheck, AlertCircle, ChevronRight } from "lucide-react";

const prioridadeBadge = {
  alta: "badge-negative",
  media: "badge-warning",
  baixa: "badge-positive",
} as const;

export default function Score() {
  const radarData = scoreSaude.pilares.map((p) => ({ pilar: p.nome, score: p.score, full: 100 }));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Diagnóstico Melazzo"
        title="Score de Saúde Financeira"
        description="Avaliação consolidada baseada em quatro pilares fundamentais da gestão financeira."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard navy className="lg:col-span-1" title="Score Consolidado" icon={<ShieldCheck className="h-5 w-5" />}>
          <div className="text-center py-4">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-48 h-48 -rotate-90">
                <circle cx="96" cy="96" r="80" stroke="hsl(var(--linen) / 0.1)" strokeWidth="10" fill="none" />
                <circle
                  cx="96" cy="96" r="80"
                  stroke="hsl(var(--gold))"
                  strokeWidth="10" fill="none" strokeLinecap="round"
                  strokeDasharray={`${(scoreSaude.score / 100) * 502} 502`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-7xl font-bold text-linen tabular leading-none">{scoreSaude.score}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-gold mt-2">{scoreSaude.classificacao}</span>
              </div>
            </div>
            <div className="divider-gold my-5" />
            <p className="text-xs text-linen/70 leading-relaxed px-4">
              Acima de 75 indica saúde financeira sólida com baixo risco operacional. Continue monitorando os pilares de menor pontuação.
            </p>
          </div>
        </SectionCard>

        <SectionCard className="lg:col-span-2" title="Distribuição por Pilar" subtitle="Cada pilar tem peso de 25% no score consolidado">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="pilar" tick={{ fill: "hsl(var(--navy))", fontSize: 12, fontWeight: 600 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
              <Radar name="Score" dataKey="score" stroke="hsl(var(--gold))" fill="hsl(var(--gold))" fillOpacity={0.4} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {scoreSaude.pilares.map((p) => (
          <SectionCard key={p.nome} title={p.nome} subtitle={p.descricao}>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold text-navy tabular">{p.score}</span>
              <span className="text-sm text-muted-foreground">/ 100</span>
            </div>
            <div className="mt-3 h-2 bg-secondary rounded-sm overflow-hidden">
              <div
                className="h-full rounded-sm transition-all duration-700"
                style={{
                  width: `${p.score}%`,
                  background: p.score >= 80 ? "hsl(var(--finance-positive))" : p.score >= 60 ? "hsl(var(--gold))" : "hsl(var(--finance-warning))",
                }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wider">Peso · {p.peso}%</p>
          </SectionCard>
        ))}
      </div>

      <SectionCard title="Plano de Ação Recomendado" subtitle="Ações priorizadas para elevar seu score" icon={<AlertCircle className="h-5 w-5" />}>
        <div className="space-y-3">
          {scoreSaude.recomendacoes.map((r, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded border border-border bg-secondary/40 hover:border-gold/40 transition-colors">
              <div className="shrink-0">
                <span className={prioridadeBadge[r.prioridade as keyof typeof prioridadeBadge]}>{r.prioridade}</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-navy">{r.titulo}</p>
                <p className="text-xs text-positive font-semibold mt-0.5">{r.impacto}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gold-dark" />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
