import { motion } from "framer-motion";
import { FileSignature, TrendingDown, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RTooltip, Cell,
} from "recharts";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { KpiCard } from "@/components/ui/kpi-card";
import { InsightCard } from "@/components/ui/insight-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { contratosIntermediacao, type StatusContrato } from "@/data/mockData";
import { cn } from "@/lib/utils";

const fmt = (v: number) => `R$ ${v.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`;

const statusTone: Record<StatusContrato, string> = {
  "Em dia": "bg-positive/10 text-positive border-positive/30",
  "Atraso leve": "bg-amber-100 text-amber-800 border-amber-300",
  "Renegociar": "bg-negative/10 text-negative border-negative/30",
  "Quitado": "bg-secondary text-muted-foreground border-border",
};

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--gold) / 0.3)",
  borderRadius: 4,
  fontSize: 12,
  color: "hsl(var(--navy))",
};

export default function RastreioContratos() {
  const ativos = contratosIntermediacao.filter((c) => c.status !== "Quitado");
  const saldoTotal = ativos.reduce((s, c) => s + c.saldoAtual, 0);
  const parcelaMensal = ativos.reduce((s, c) => s + c.parcelaMes, 0);
  const aRenegociar = contratosIntermediacao.filter((c) => c.status === "Renegociar").length;
  const quitados = contratosIntermediacao.filter((c) => c.status === "Quitado").length;

  const dataChart = ativos.map((c) => ({
    nome: `${c.banco} · ${c.modalidade.split(" ")[0]}`,
    saldo: c.saldoAtual,
    fill:
      c.status === "Renegociar" ? "hsl(var(--negative))" :
      c.status === "Atraso leve" ? "hsl(38 92% 50%)" :
      "hsl(var(--gold))",
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Governança · Empresarial"
        title="Rastreio de Contratos"
        description="Visão consolidada de todos os contratos bancários intermediados pela Melazzo — saldo, parcelas, taxas e status mensal."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Saldo total ativo" value={fmt(saldoTotal)} icon={<TrendingDown className="h-4 w-4" />} highlight />
        <KpiCard label="Parcela mensal" value={fmt(parcelaMensal)} icon={<Clock className="h-4 w-4" />} />
        <KpiCard label="A renegociar" value={String(aRenegociar)} icon={<AlertCircle className="h-4 w-4" />} />
        <KpiCard label="Quitados" value={String(quitados)} icon={<CheckCircle2 className="h-4 w-4" />} />
      </div>

      <SectionCard title="Distribuição de Saldo por Contrato Ativo" subtitle="Vermelho = renegociar · Âmbar = atraso · Dourado = em dia">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={dataChart} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis type="number" tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="nome" tick={{ fill: "hsl(var(--navy))", fontSize: 10 }} axisLine={false} tickLine={false} width={170} />
            <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(v)} />
            <Bar dataKey="saldo" radius={[0, 3, 3, 0]}>
              {dataChart.map((d, i) => (
                <Cell key={i} fill={d.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard title="Carteira Completa" subtitle={`${contratosIntermediacao.length} contratos rastreados (ativos + quitados)`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Banco · Modalidade</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Saldo</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Parcela/mês</th>
                <th className="text-right py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Taxa a.m.</th>
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Andamento</th>
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Status</th>
                <th className="text-left py-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Última ação</th>
              </tr>
            </thead>
            <tbody>
              {contratosIntermediacao.map((c, idx) => {
                const pct = c.parcelasTotais > 0 ? (c.parcelasPagas / c.parcelasTotais) * 100 : 0;
                return (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className="border-b border-border/40 hover:bg-secondary/40"
                  >
                    <td className="py-3 px-3">
                      <p className="text-sm font-semibold text-navy flex items-center gap-1.5">
                        <FileSignature className="h-3.5 w-3.5 text-gold-dark" />
                        {c.banco}
                      </p>
                      <p className="text-xs text-muted-foreground">{c.modalidade}</p>
                    </td>
                    <td className="py-3 px-3 text-right tabular font-semibold text-navy">{fmt(c.saldoAtual)}</td>
                    <td className="py-3 px-3 text-right tabular text-foreground">
                      {c.parcelaMes > 0 ? fmt(c.parcelaMes) : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="py-3 px-3 text-right tabular text-foreground">{c.taxaMes.toFixed(2)}%</td>
                    <td className="py-3 px-3 min-w-[140px]">
                      {c.parcelasTotais > 0 ? (
                        <div>
                          <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5">
                            <span>{c.parcelasPagas}/{c.parcelasTotais}</span>
                            <span className="tabular">{pct.toFixed(0)}%</span>
                          </div>
                          <Progress value={pct} className="h-1" />
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">{c.vencimento}</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <Badge className={cn("text-[10px] border", statusTone[c.status])}>{c.status}</Badge>
                    </td>
                    <td className="py-3 px-3 text-xs text-muted-foreground">{c.ultimaAcao}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <InsightCard
        title="Sinal Melazzo IA"
        description={`${aRenegociar} contrato(s) em modalidade rotativa cara estão drenando margem. Renegociar ou substituir por linha estruturada pode liberar ~R$ 2,8k/mês de caixa em 60 dias.`}
      />
    </div>
  );
}
