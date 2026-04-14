/**
 * Utility to parse onboarding financial data from JSONB string fields to numbers.
 * All monetary fields in onboarding_data are stored as strings (e.g. "R$ 15.000,00" or "15000").
 */

/** Sanitize a monetary string to a number */
export function parseMonetary(value: string | undefined | null): number {
  if (!value || value.trim() === "") return 0;
  // Remove "R$", spaces, dots (thousands separator), then replace comma with dot
  const cleaned = value
    .replace(/R\$\s*/gi, "")
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/** Sum multiple monetary string fields */
export function sumMonetary(...values: (string | undefined | null)[]): number {
  return values.reduce((sum: number, v) => sum + parseMonetary(v), 0);
}

export interface PatrimonioBreakdown {
  liquidez: {
    poupanca: number;
    cdb_lci_lca: number;
    tesouro_direto: number;
    acoes_fundos: number;
    previdencia_privada: number;
    criptomoedas: number;
    fgts: number;
    outros_investimentos: number;
    total: number;
  };
  imobilizado: {
    imovel_principal: number;
    outros_imoveis: number;
    veiculos: number;
    joias_relogios: number;
    equipamentos: number;
    estoque: number;
    gado: number;
    outros_bens: number;
    total: number;
  };
  passivos: {
    financiamentos: number;
    emprestimos: number;
    consorcios: number;
    dividas_atraso: number;
    financiamento_saldo: number;
    debts_saldo: number;
    total: number;
  };
  patrimonio_liquido: number;
  /** High-liquidity assets only (poupanca + cdb + tesouro) */
  liquidez_alta: number;
}

export function calcPatrimonio(
  onboarding: any,
  debts: any[] = []
): PatrimonioBreakdown {
  const assets = onboarding?.assets_liabilities_data || {};
  const housing = onboarding?.housing_data || {};

  const liquidez = {
    poupanca: parseMonetary(assets.poupanca),
    cdb_lci_lca: parseMonetary(assets.cdb_lci_lca),
    tesouro_direto: parseMonetary(assets.tesouro_direto),
    acoes_fundos: parseMonetary(assets.acoes_fundos),
    previdencia_privada: parseMonetary(assets.previdencia_privada),
    criptomoedas: parseMonetary(assets.criptomoedas),
    fgts: parseMonetary(assets.fgts),
    outros_investimentos: parseMonetary(assets.outros_investimentos),
    total: 0,
  };
  liquidez.total = Object.values(liquidez).reduce((s, v) => s + (typeof v === "number" ? v : 0), 0);

  const imobilizado = {
    imovel_principal: parseMonetary(housing.valor_imovel),
    outros_imoveis: parseMonetary(assets.imoveis_detalhes),
    veiculos: parseMonetary(assets.veiculos_patrimonio_detalhes),
    joias_relogios: parseMonetary(assets.joias_relogios),
    equipamentos: parseMonetary(assets.equipamentos),
    estoque: parseMonetary(assets.estoque),
    gado: parseMonetary(assets.gado),
    outros_bens: parseMonetary(assets.outros_bens),
    total: 0,
  };
  imobilizado.total = Object.values(imobilizado).reduce((s, v) => s + (typeof v === "number" ? v : 0), 0);

  const debtsSaldo = debts.reduce((s, d) => {
    return s + (Number(d.monthly_payment) * (Number(d.total_installments) - Number(d.paid_installments)));
  }, 0);

  const passivos = {
    financiamentos: parseMonetary(assets.financiamentos_ativos),
    emprestimos: parseMonetary(assets.emprestimos_ativos),
    consorcios: parseMonetary(assets.consorcios_ativos),
    dividas_atraso: parseMonetary(assets.dividas_atraso),
    financiamento_saldo: parseMonetary(housing.financiamento_saldo),
    debts_saldo: debtsSaldo,
    total: 0,
  };
  passivos.total = Object.values(passivos).reduce((s, v) => s + (typeof v === "number" ? v : 0), 0);

  const liquidez_alta = liquidez.poupanca + liquidez.cdb_lci_lca + liquidez.tesouro_direto;

  return {
    liquidez,
    imobilizado,
    passivos,
    patrimonio_liquido: (liquidez.total + imobilizado.total) - passivos.total,
    liquidez_alta,
  };
}

export function getRendaLiquida(onboarding: any): number {
  return parseMonetary(onboarding?.income_data?.renda_liquida);
}

export function getParcelasDividas(debts: any[] = []): number {
  return debts.reduce((s, d) => s + Number(d.monthly_payment || 0), 0);
}
