import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AlertOctagon, AlertTriangle, Info, Filter } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { KpiCard } from "@/components/ui/kpi-card";
import { InsightCard } from "@/components/ui/insight-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { inconsistencias, type Severidade } from "@/data/mockData";
import { cn } from "@/lib/utils";

const sevMeta: Record<Severidade, { label: string; tone: string; icon: typeof AlertOctagon }> = {
  alta: { label: "Alta", tone: "bg-negative/10 text-negative border-negative/30", icon: AlertOctagon },
  media: { label: "Média", tone: "bg-amber-100 text-amber-800 border-amber-300", icon: AlertTriangle },
  baixa: { label: "Baixa", tone: "bg-secondary text-muted-foreground border-border", icon: Info },
};

const sevOrder: Severidade[] = ["alta", "media", "baixa"];

export default function Inconsistencias() {
  const [filtro, setFiltro] = useState<Severidade | "todas">("todas");

  const filtradas = useMemo(
    () => filtro === "todas" ? inconsistencias : inconsistencias.filter((i) => i.severidade === filtro),
    [filtro],
  );

  const counts = {
    alta: inconsistencias.filter((i) => i.severidade === "alta").length,
    media: inconsistencias.filter((i) => i.severidade === "media").length,
    baixa: inconsistencias.filter((i) => i.severidade === "baixa").length,
  };

  const modulosAfetados = new Set(inconsistencias.map((i) => i.modulo)).size;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Governança · Empresarial"
        title="Inconsistências de Dados"
        description="Pontos de atenção identificados pelo motor de validação Melazzo. Resolva por severidade para manter a base limpa."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Total ativas" value={String(inconsistencias.length)} icon={<AlertOctagon className="h-4 w-4" />} highlight />
        <KpiCard label="Alta severidade" value={String(counts.alta)} icon={<AlertOctagon className="h-4 w-4" />} />
        <KpiCard label="Média" value={String(counts.media)} icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="Módulos afetados" value={String(modulosAfetados)} icon={<Info className="h-4 w-4" />} />
      </div>

      <SectionCard title="Lista de Inconsistências" subtitle={`${filtradas.length} de ${inconsistencias.length} exibidas`}>
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Filtrar:</span>
          {(["todas", ...sevOrder] as const).map((opt) => (
            <Button
              key={opt}
              size="sm"
              variant={filtro === opt ? "default" : "outline"}
              className="h-7 text-xs capitalize"
              onClick={() => setFiltro(opt)}
            >
              {opt === "todas" ? "Todas" : sevMeta[opt].label}
            </Button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Severidade</th>
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Módulo</th>
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Inconsistência</th>
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Detectada</th>
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Ação sugerida</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((i, idx) => {
                const meta = sevMeta[i.severidade];
                const Icon = meta.icon;
                return (
                  <motion.tr
                    key={i.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className="border-b border-border/40 hover:bg-secondary/40 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <Badge className={cn("text-[10px] border gap-1", meta.tone)}>
                        <Icon className="h-3 w-3" /> {meta.label}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-xs font-medium text-navy">{i.modulo}</td>
                    <td className="py-3 px-3">
                      <p className="text-sm font-medium text-navy">{i.titulo}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{i.impacto}</p>
                    </td>
                    <td className="py-3 px-3 text-xs tabular text-foreground">
                      {new Date(i.detectadoEm).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-3 px-3 text-xs text-foreground max-w-[260px]">{i.acaoSugerida}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <InsightCard
        title="Recomendação Melazzo IA"
        description={`Priorize as ${counts.alta} inconsistência(s) de alta severidade — elas afetam diretamente DRE, conciliação e risco trabalhista. Estimativa: 3-4 horas de revisão eliminam 80% dos pontos.`}
      />
    </div>
  );
}
