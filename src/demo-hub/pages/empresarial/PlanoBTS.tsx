import { motion } from "framer-motion";
import {
  Compass, Wrench, FileCheck, TrendingUp, Trophy,
  CheckCircle2, Circle, Clock, Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { KpiCard } from "@/components/ui/kpi-card";
import { InsightCard } from "@/components/ui/insight-card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { planoBTS, type BtsAcao } from "@/data/mockData";

const faseIcons = [Compass, Wrench, FileCheck, TrendingUp, Trophy];

const statusBadge: Record<BtsAcao["status"], { label: string; className: string; icon: typeof CheckCircle2 }> = {
  concluido: { label: "Concluído", className: "bg-positive/15 text-positive border-positive/30", icon: CheckCircle2 },
  andamento: { label: "Em andamento", className: "bg-gold/15 text-gold-dark border-gold/30", icon: Clock },
  pendente: { label: "Pendente", className: "bg-muted text-muted-foreground border-border", icon: Circle },
};

export default function PlanoBTS() {
  const progressoMedio = Math.round(planoBTS.reduce((s, f) => s + f.progresso, 0) / planoBTS.length);
  const concluidas = planoBTS.filter((f) => f.progresso === 100).length;
  const totalAcoes = planoBTS.flatMap((f) => f.acoes).length;
  const acoesConcluidas = planoBTS.flatMap((f) => f.acoes).filter((a) => a.status === "concluido").length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Estratégia · Empresarial"
        title="Plano BTS — Build to Sell"
        description="Roadmap em 5 fases para transformar a empresa: do diagnóstico à liquidez. Atualizado mensalmente pela Melazzo."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Progresso Geral" value={`${progressoMedio}%`} icon={<TrendingUp className="h-4 w-4" />} highlight />
        <KpiCard label="Fases Concluídas" value={`${concluidas}/${planoBTS.length}`} icon={<CheckCircle2 className="h-4 w-4" />} />
        <KpiCard label="Ações Concluídas" value={`${acoesConcluidas}/${totalAcoes}`} icon={<FileCheck className="h-4 w-4" />} />
        <KpiCard label="Próximo marco" value="Set/25 · Compliance" icon={<Compass className="h-4 w-4" />} />
      </div>

      <div className="space-y-4">
        {planoBTS.map((fase, idx) => {
          const Icon = faseIcons[idx];
          const ativa = fase.progresso > 0 && fase.progresso < 100;
          return (
            <motion.div
              key={fase.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
            >
              <SectionCard className={ativa ? "border-l-4 border-l-gold" : ""}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`h-12 w-12 rounded-full grid place-items-center shrink-0 ${
                    fase.progresso === 100 ? "bg-positive/15 text-positive" :
                    ativa ? "bg-gold/15 text-gold-dark" : "bg-muted text-muted-foreground"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
                        Fase {fase.id}
                      </span>
                      <Badge variant="outline" className="text-[10px]">{fase.prazo}</Badge>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-navy mt-0.5">{fase.nome}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{fase.resumo}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display text-2xl font-bold text-navy tabular">{fase.progresso}%</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Concluído</p>
                  </div>
                </div>

                <Progress value={fase.progresso} className="h-1.5 mb-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {fase.acoes.map((acao) => {
                    const s = statusBadge[acao.status];
                    const SIcon = s.icon;
                    return (
                      <div
                        key={acao.id}
                        className="flex items-center gap-2.5 p-2.5 rounded border border-border/60 bg-card/50"
                      >
                        <SIcon className={`h-4 w-4 shrink-0 ${
                          acao.status === "concluido" ? "text-positive" :
                          acao.status === "andamento" ? "text-gold-dark" : "text-muted-foreground"
                        }`} />
                        <span className={`text-[12.5px] flex-1 ${
                          acao.status === "concluido" ? "line-through text-muted-foreground" : "text-navy"
                        }`}>
                          {acao.titulo}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </SectionCard>
            </motion.div>
          );
        })}
      </div>

      <InsightCard
        tone="neutral"
        title="Próximo passo crítico"
        description="A Fase 3 (Formalização) precisa avançar nos próximos 60 dias para destravar a captação BNDES da Fase 4. Recomendamos priorizar a política LGPD e a padronização de contratos comerciais."
        metric="45%"
        metricLabel="Progresso atual da Fase 3"
      />
    </div>
  );
}
