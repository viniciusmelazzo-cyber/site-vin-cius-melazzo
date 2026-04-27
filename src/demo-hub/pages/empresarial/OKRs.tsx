import { motion } from "framer-motion";
import { Target, TrendingUp, Wallet, Users, Briefcase, Sparkles } from "lucide-react";
import {
  PieChart, Pie, Cell as RCell, ResponsiveContainer, Tooltip as RTooltip,
} from "recharts";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { KpiCard } from "@/components/ui/kpi-card";
import { InsightCard } from "@/components/ui/insight-card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { objetivosOKR, type Okr } from "@/data/mockData";

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--gold) / 0.3)",
  borderRadius: 4,
  fontSize: 12,
  color: "hsl(var(--navy))",
};

const areaIcon: Record<Okr["area"], typeof Target> = {
  Financeiro: Wallet,
  Comercial: TrendingUp,
  Operacional: Briefcase,
  Pessoas: Users,
};

const areaTone: Record<Okr["area"], string> = {
  Financeiro: "hsl(var(--gold))",
  Comercial: "hsl(var(--navy))",
  Operacional: "hsl(var(--agro))",
  Pessoas: "hsl(var(--cobranca))",
};

function calcAreaProgress(okr: Okr) {
  return Math.round(okr.krs.reduce((s, k) => s + k.progresso, 0) / okr.krs.length);
}

export default function OKRs() {
  const progressoTotal = Math.round(
    objetivosOKR.reduce((s, o) => s + calcAreaProgress(o), 0) / objetivosOKR.length,
  );
  const krsTotais = objetivosOKR.flatMap((o) => o.krs).length;
  const krsAcima70 = objetivosOKR.flatMap((o) => o.krs).filter((k) => k.progresso >= 70).length;

  const donutData = objetivosOKR.map((o) => ({
    name: o.area,
    value: calcAreaProgress(o),
    fill: areaTone[o.area],
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Estratégia · Empresarial"
        title="OKRs do Trimestre"
        description="Objetivos e Key Results acompanhados em tempo real, por área e responsável."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Cumprimento Geral" value={`${progressoTotal}%`} icon={<Target className="h-4 w-4" />} highlight />
        <KpiCard label="Objetivos Ativos" value={`${objetivosOKR.length}`} icon={<Briefcase className="h-4 w-4" />} />
        <KpiCard label="KRs no Verde" value={`${krsAcima70}/${krsTotais}`} icon={<TrendingUp className="h-4 w-4" />} />
        <KpiCard label="Trimestre" value="Q2 / 2025" icon={<Sparkles className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SectionCard title="Cumprimento por área" subtitle="Distribuição do progresso entre os 4 objetivos" icon={<Target className="h-4 w-4" />}>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={donutData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={88} paddingAngle={3}>
                {donutData.map((d, i) => (
                  <RCell key={i} fill={d.fill} />
                ))}
              </Pie>
              <RTooltip contentStyle={tooltipStyle} formatter={(v: number, n: string) => [`${v}%`, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {donutData.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-[11px]">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: d.fill }} />
                <span className="text-navy/80">{d.name}</span>
                <span className="tabular text-navy font-semibold ml-auto">{d.value}%</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="lg:col-span-2 space-y-4">
          {objetivosOKR.map((okr, idx) => {
            const Icon = areaIcon[okr.area];
            const progresso = calcAreaProgress(okr);
            return (
              <motion.div
                key={okr.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07, duration: 0.35 }}
              >
                <SectionCard>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full grid place-items-center shrink-0" style={{ background: `${areaTone[okr.area]}20`, color: areaTone[okr.area] }}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-[10px]">{okr.area}</Badge>
                        <span className="text-[10px] text-muted-foreground">· {okr.responsavel} · {okr.trimestre}</span>
                      </div>
                      <h3 className="font-display text-base font-semibold text-navy mt-1 leading-tight">{okr.objetivo}</h3>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-display text-xl font-bold text-navy tabular">{progresso}%</p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {okr.krs.map((kr, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between text-[12.5px]">
                          <span className="text-navy/90">{kr.titulo}</span>
                          <span className="tabular text-muted-foreground">
                            <span className="text-navy font-medium">{kr.atual}</span> · meta {kr.meta}
                          </span>
                        </div>
                        <Progress value={kr.progresso} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </motion.div>
            );
          })}
        </div>
      </div>

      <InsightCard
        tone="positive"
        title="Trimestre acima da média histórica"
        description="O cumprimento geral de OKRs em Q2/2025 (76%) supera a média dos últimos 4 trimestres (61%). O destaque é o objetivo financeiro, com 70% de progresso na meta de saída do estresse de caixa."
        metric={`${progressoTotal}%`}
        metricLabel="Cumprimento Q2"
      />
    </div>
  );
}
