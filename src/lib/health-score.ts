/**
 * Health Score Algorithm — Weighted average of 4 financial pillars.
 * P1: Income Commitment (40%) — lower is better
 * P2: Savings Rate (30%) — higher is better
 * P3: Emergency Reserve Coverage (20%) — higher is better
 * P4: Debt Ratio (10%) — lower is better
 */

export interface HealthScoreBreakdown {
  p1: { raw: number; score: number; label: string };
  p2: { raw: number; score: number; label: string };
  p3: { raw: number; score: number; label: string };
  p4: { raw: number; score: number; label: string };
  total: number;
  classification: "excellent" | "moderate" | "critical";
}

function scoreP1(comprometimento: number): number {
  if (comprometimento <= 50) return 100;
  if (comprometimento <= 70) return 70;
  if (comprometimento <= 90) return 30;
  return 0;
}

function scoreP2(taxaPoupanca: number): number {
  if (taxaPoupanca >= 20) return 100;
  if (taxaPoupanca >= 10) return 70;
  if (taxaPoupanca >= 1) return 40;
  return 0;
}

function scoreP3(mesesCobertura: number): number {
  if (mesesCobertura >= 6) return 100;
  if (mesesCobertura >= 3) return 70;
  if (mesesCobertura >= 1) return 30;
  return 0;
}

function scoreP4(endividamento: number): number {
  if (endividamento <= 30) return 100;
  if (endividamento <= 50) return 70;
  if (endividamento <= 80) return 30;
  return 0;
}

function classify(score: number): "excellent" | "moderate" | "critical" {
  if (score >= 80) return "excellent";
  if (score >= 50) return "moderate";
  return "critical";
}

export function calculateHealthScore(params: {
  /** Total despesas fixas do mês */
  despesasFixas: number;
  /** Renda líquida mensal */
  rendaLiquida: number;
  /** Resultado líquido do mês (receitas - despesas) */
  resultadoLiquido: number;
  /** Total receitas do mês */
  totalReceitas: number;
  /** Liquidez de alta liquidez (poupanca + cdb + tesouro) */
  liquidezAlta: number;
  /** Total de passivos */
  passivosTotal: number;
  /** Total de ativos */
  ativosTotal: number;
}): HealthScoreBreakdown {
  const renda = params.rendaLiquida > 0 ? params.rendaLiquida : params.totalReceitas;

  // P1: Income Commitment
  const p1Raw = renda > 0 ? (params.despesasFixas / renda) * 100 : 100;
  const p1Score = scoreP1(p1Raw);

  // P2: Savings Rate
  const p2Raw = renda > 0 ? (params.resultadoLiquido / renda) * 100 : 0;
  const p2Score = scoreP2(p2Raw);

  // P3: Emergency Reserve Coverage (months)
  const p3Raw = params.despesasFixas > 0 ? params.liquidezAlta / params.despesasFixas : 0;
  const p3Score = scoreP3(p3Raw);

  // P4: Debt Ratio
  const p4Raw = params.ativosTotal > 0 ? (params.passivosTotal / params.ativosTotal) * 100 : 0;
  const p4Score = scoreP4(p4Raw);

  const total = p1Score * 0.4 + p2Score * 0.3 + p3Score * 0.2 + p4Score * 0.1;

  return {
    p1: { raw: p1Raw, score: p1Score, label: "Comprometimento da Renda" },
    p2: { raw: p2Raw, score: p2Score, label: "Taxa de Poupança" },
    p3: { raw: p3Raw, score: p3Score, label: "Cobertura de Emergência" },
    p4: { raw: p4Raw, score: p4Score, label: "Nível de Endividamento" },
    total: Math.round(total),
    classification: classify(total),
  };
}

export function getScoreColor(classification: "excellent" | "moderate" | "critical"): string {
  switch (classification) {
    case "excellent": return "text-finance-positive";
    case "moderate": return "text-finance-warning";
    case "critical": return "text-finance-negative";
  }
}

export function getScoreBgColor(classification: "excellent" | "moderate" | "critical"): string {
  switch (classification) {
    case "excellent": return "bg-finance-positive/10 border-finance-positive/30";
    case "moderate": return "bg-finance-warning/10 border-finance-warning/30";
    case "critical": return "bg-finance-negative/10 border-finance-negative/30";
  }
}

export function getScoreLabel(classification: "excellent" | "moderate" | "critical"): string {
  switch (classification) {
    case "excellent": return "Excelente";
    case "moderate": return "Moderada";
    case "critical": return "Crítica";
  }
}
