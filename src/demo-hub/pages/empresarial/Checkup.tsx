import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, Clock, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { KpiCard } from "@/components/ui/kpi-card";
import { InsightCard } from "@/components/ui/insight-card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { checkupBlocos, type CheckupStatus } from "@/data/mockData";
import { cn } from "@/lib/utils";

const statusMeta: Record<CheckupStatus, { label: string; tone: string; icon: typeof CheckCircle2 }> = {
  ok: { label: "OK", tone: "bg-positive/10 text-positive border-positive/30", icon: CheckCircle2 },
  atencao: { label: "Atenção", tone: "bg-amber-100 text-amber-800 border-amber-300", icon: AlertTriangle },
  critico: { label: "Crítico", tone: "bg-negative/10 text-negative border-negative/30", icon: XCircle },
  pendente: { label: "Pendente", tone: "bg-secondary text-muted-foreground border-border", icon: Clock },
};

export default function Checkup() {
  const todosItens = checkupBlocos.flatMap((b) => b.itens);
  const counts = {
    ok: todosItens.filter((i) => i.status === "ok").length,
    atencao: todosItens.filter((i) => i.status === "atencao").length,
    critico: todosItens.filter((i) => i.status === "critico").length,
    pendente: todosItens.filter((i) => i.status === "pendente").length,
  };
  const score = Math.round((counts.ok / todosItens.length) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Governança · Empresarial"
        title="Checkup de Governança"
        description="Diagnóstico estrutural em 6 frentes — fiscal, trabalhista, societário, financeiro, operacional e compliance."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Itens em conformidade" value={`${counts.ok}/${todosItens.length}`} icon={<CheckCircle2 className="h-4 w-4" />} highlight />
        <KpiCard label="Em atenção" value={String(counts.atencao)} icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="Críticos" value={String(counts.critico)} icon={<XCircle className="h-4 w-4" />} />
        <KpiCard label="Pendentes" value={String(counts.pendente)} icon={<Clock className="h-4 w-4" />} />
      </div>

      <SectionCard title="Score Geral de Governança" subtitle={`${score}% dos itens em plena conformidade`}>
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--secondary))" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke="hsl(var(--gold))" strokeWidth="3" strokeLinecap="round"
                strokeDasharray={`${score}, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-2xl font-bold text-navy tabular">{score}</span>
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground">score</span>
            </div>
          </div>
          <div className="flex-1">
            <Progress value={score} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground">
              Quanto mais itens marcados como <strong className="text-positive">OK</strong>, mais robusta a governança. Resolva os <strong className="text-negative">críticos</strong> primeiro para reduzir risco regulatório.
            </p>
          </div>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {checkupBlocos.map((bloco, idx) => {
          const blocoOk = bloco.itens.filter((i) => i.status === "ok").length;
          const blocoPct = Math.round((blocoOk / bloco.itens.length) * 100);
          return (
            <motion.div
              key={bloco.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <SectionCard title={bloco.titulo} subtitle={bloco.descricao}>
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border/50">
                  <ShieldCheck className="h-4 w-4 text-gold" />
                  <span className="text-xs text-muted-foreground">Conformidade do bloco</span>
                  <span className="ml-auto text-sm font-semibold text-navy tabular">{blocoPct}%</span>
                </div>
                <ul className="space-y-3">
                  {bloco.itens.map((item) => {
                    const meta = statusMeta[item.status];
                    const Icon = meta.icon;
                    return (
                      <li key={item.id} className="flex items-start gap-3">
                        <Icon className={cn(
                          "h-4 w-4 shrink-0 mt-0.5",
                          item.status === "ok" && "text-positive",
                          item.status === "atencao" && "text-amber-600",
                          item.status === "critico" && "text-negative",
                          item.status === "pendente" && "text-muted-foreground",
                        )} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <p className="text-sm font-medium text-navy">{item.titulo}</p>
                            <Badge className={cn("text-[10px] border", meta.tone)}>{meta.label}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.descricao}</p>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mt-1">
                            Resp.: {item.responsavel}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </SectionCard>
            </motion.div>
          );
        })}
      </div>

      <InsightCard
        title="Diagnóstico Melazzo IA"
        description={`Score atual de ${score}% indica governança ${score >= 75 ? "sólida" : score >= 50 ? "em evolução" : "frágil"}. Foco imediato: resolver ${counts.critico} item(ns) crítico(s) e formalizar ${counts.pendente} pendência(s) para subir o score 12-18 pts em 60 dias.`}
      />
    </div>
  );
}
