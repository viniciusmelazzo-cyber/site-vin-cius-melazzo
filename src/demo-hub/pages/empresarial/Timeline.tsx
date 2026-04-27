import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar, Filter, ArrowDownCircle, ArrowUpCircle, AlertTriangle, Trophy, Users, Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { KpiCard } from "@/components/ui/kpi-card";
import { InsightCard } from "@/components/ui/insight-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { timelineEventos, type EventoTipo } from "@/data/mockData";

const tipoConfig: Record<EventoTipo, { label: string; icon: typeof Calendar; color: string; bg: string }> = {
  lancamento: { label: "Lançamento", icon: ArrowDownCircle, color: "text-positive", bg: "bg-positive/10" },
  ajuste: { label: "Ajuste", icon: ArrowUpCircle, color: "text-gold-dark", bg: "bg-gold/10" },
  marco: { label: "Marco", icon: Trophy, color: "text-navy", bg: "bg-navy/10" },
  alerta: { label: "Alerta", icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
  reuniao: { label: "Reunião", icon: Users, color: "text-cobranca", bg: "bg-cobranca/10" },
};

const todosTipos: EventoTipo[] = ["lancamento", "ajuste", "marco", "alerta", "reuniao"];

function formatarData(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function diaChave(iso: string) {
  return iso;
}

export default function Timeline() {
  const [filtro, setFiltro] = useState<EventoTipo | "todos">("todos");

  const filtrados = useMemo(
    () => (filtro === "todos" ? timelineEventos : timelineEventos.filter((e) => e.tipo === filtro)),
    [filtro],
  );

  const agrupados = useMemo(() => {
    const map = new Map<string, typeof timelineEventos>();
    filtrados.forEach((ev) => {
      const k = diaChave(ev.data);
      const arr = map.get(k) ?? [];
      arr.push(ev);
      map.set(k, arr);
    });
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtrados]);

  const contagens = useMemo(() => {
    const c: Record<EventoTipo, number> = { lancamento: 0, ajuste: 0, marco: 0, alerta: 0, reuniao: 0 };
    timelineEventos.forEach((e) => { c[e.tipo]++; });
    return c;
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Estratégia · Empresarial"
        title="Timeline de Eventos"
        description="Feed cronológico de tudo que aconteceu na operação nos últimos 60 dias — lançamentos, ajustes, marcos e alertas."
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {todosTipos.map((t) => {
          const c = tipoConfig[t];
          const Ic = c.icon;
          return (
            <KpiCard
              key={t}
              label={c.label + "s"}
              value={String(contagens[t])}
              icon={<Ic className="h-4 w-4" />}
            />
          );
        })}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5" /> Filtrar:
        </span>
        <Button
          size="sm"
          variant={filtro === "todos" ? "default" : "outline"}
          onClick={() => setFiltro("todos")}
          className="text-xs h-7"
        >
          Todos ({timelineEventos.length})
        </Button>
        {todosTipos.map((t) => (
          <Button
            key={t}
            size="sm"
            variant={filtro === t ? "default" : "outline"}
            onClick={() => setFiltro(t)}
            className="text-xs h-7"
          >
            {tipoConfig[t].label} ({contagens[t]})
          </Button>
        ))}
      </div>

      <SectionCard>
        {agrupados.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Nenhum evento neste filtro.
          </p>
        ) : (
          <div className="space-y-6">
            {agrupados.map(([dia, evs], gi) => (
              <div key={dia}>
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="h-3.5 w-3.5 text-gold-dark" />
                  <p className="text-[11px] uppercase tracking-[0.18em] text-navy font-semibold">
                    {formatarData(dia)}
                  </p>
                  <div className="flex-1 h-px bg-border" />
                  <Badge variant="outline" className="text-[10px]">
                    {evs.length} {evs.length === 1 ? "evento" : "eventos"}
                  </Badge>
                </div>
                <ol className="relative border-l-2 border-border/60 ml-1.5 space-y-3">
                  {evs.map((ev, i) => {
                    const c = tipoConfig[ev.tipo];
                    const Ic = c.icon;
                    return (
                      <motion.li
                        key={ev.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: gi * 0.05 + i * 0.04, duration: 0.3 }}
                        className="ml-4 relative"
                      >
                        <span className={`absolute -left-[26px] top-2 h-5 w-5 rounded-full grid place-items-center ring-2 ring-background ${c.bg}`}>
                          <Ic className={`h-3 w-3 ${c.color}`} />
                        </span>
                        <div className="rounded border border-border/60 bg-card/60 p-3 hover:border-gold/40 transition-colors">
                          <div className="flex items-start justify-between gap-2 mb-1 flex-wrap">
                            <h4 className="text-[13px] font-semibold text-navy leading-tight">
                              {ev.titulo}
                            </h4>
                            <Badge variant="outline" className={`text-[10px] ${c.color} border-current/30`}>
                              {c.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-foreground/75 leading-relaxed">{ev.descricao}</p>
                          <p className="text-[10px] text-muted-foreground mt-1.5">por {ev.autor}</p>
                        </div>
                      </motion.li>
                    );
                  })}
                </ol>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <InsightCard
        tone="neutral"
        title="Padrões identificados pela IA"
        description={`Nos últimos 60 dias, a operação teve ${contagens.marco} marcos importantes (média esperada: 2-3) e apenas ${contagens.alerta} alertas — abaixo da média do setor. Sinal de operação madura e em ritmo de execução.`}
        metric={`${timelineEventos.length}`}
        metricLabel="Eventos no período"
      />
    </div>
  );
}
