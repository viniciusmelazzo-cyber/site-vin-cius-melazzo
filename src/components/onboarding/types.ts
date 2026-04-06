export interface OnboardingData {
  // Step 1 - Personal
  personal_data: {
    full_name?: string;
    cpf?: string;
    date_of_birth?: string;
    estado_civil?: string;
    regime_bens?: string;
    conjuge_nome?: string;
    tem_filhos?: string;
    qtd_filhos?: string;
    filhos_detalhes?: string; // idades, nomes
    dependentes?: string;
    cidade?: string;
    estado_uf?: string;
    email?: string;
    telefone?: string;
    atividade_principal?: string;
    atividade_secundaria?: string;
    tempo_atividade?: string;
  };
  activity_type: string;

  // Step 2 - Income
  income_data: {
    renda_bruta?: string;
    renda_liquida?: string;
    tipo_renda?: string;
    renda_variavel_media?: string;
    renda_variavel_maior?: string;
    renda_variavel_menor?: string;
    renda_aluguel?: string;
    renda_aluguel_valor?: string;
    renda_investimentos?: string;
    renda_investimentos_valor?: string;
    renda_participacao_empresas?: string;
    renda_participacao_valor?: string;
    renda_pensao?: string;
    renda_pensao_valor?: string;
    renda_informal?: string;
    renda_informal_valor?: string;
    conjuge_renda?: string;
    conjuge_renda_valor?: string;
  };

  // Step 3 - Housing
  housing_data: {
    tipo_moradia?: string;
    situacao_moradia?: string;
    financiamento_parcela?: string;
    financiamento_banco?: string;
    financiamento_saldo?: string;
    financiamento_prazo?: string;
    aluguel_valor?: string;
    valor_imovel?: string;
    condominio?: string;
    energia?: string;
    agua?: string;
    gas?: string;
    internet?: string;
    iptu?: string;
    seguro_residencial?: string;
    funcionario_domestico?: string;
    manutencao?: string;
    outros_imoveis?: string;
    outros_imoveis_detalhes?: string;
  };

  // Step 4 - Expenses
  expenses_data: {
    possui_veiculo?: string;
    veiculos_detalhes?: string;
    combustivel?: string;
    seguro_veicular?: string;
    ipva?: string;
    manutencao_veiculo?: string;
    transporte_publico?: string;
    supermercado?: string;
    restaurantes?: string;
    plano_saude?: string;
    plano_odontologico?: string;
    medicamentos?: string;
    academia?: string;
    escola_filhos?: string;
    faculdade?: string;
    cursos?: string;
    celular?: string;
    streaming?: string;
    vestuario?: string;
    lazer?: string;
    viagens?: string;
    cartoes?: CartaoOnboarding[];
    pensao_alimenticia?: string;
    ajuda_familiares?: string;
    animais_estimacao?: string;
  };

  // Step 5 - Assets & Liabilities
  assets_liabilities_data: {
    imoveis_qtd?: string;
    imoveis_detalhes?: string;
    veiculos_patrimonio_qtd?: string;
    veiculos_patrimonio_detalhes?: string;
    poupanca?: string;
    cdb_lci_lca?: string;
    tesouro_direto?: string;
    acoes_fundos?: string;
    previdencia_privada?: string;
    criptomoedas?: string;
    outros_investimentos?: string;
    fgts?: string;
    joias_relogios?: string;
    equipamentos?: string;
    estoque?: string;
    gado?: string;
    outros_bens?: string;
    financiamentos_ativos?: string;
    emprestimos_ativos?: string;
    consorcios_ativos?: string;
    dividas_atraso?: string;
    nome_negativado?: string;
    dividas_detalhes?: string;
    seguros_ativos?: string;
  };

  // Step 6 - Profile-specific
  profile_module_data: {
    // CLT
    empresa?: string;
    cargo?: string;
    tempo_empresa?: string;
    tipo_contrato?: string;
    setor_trabalho?: string;
    decimo_terceiro?: string;
    plr?: string;
    vale_alimentacao?: string;
    plano_saude_empresa?: string;
    consignado?: string;
    margem_consignavel?: string;
    inss?: string;
    irrf?: string;
    // Empresário
    razao_social?: string;
    cnpj?: string;
    nome_fantasia?: string;
    tipo_societario?: string;
    regime_tributario?: string;
    ramo_atividade?: string;
    tempo_empresa_pj?: string;
    qtd_socios?: string;
    participacao_pct?: string;
    qtd_funcionarios?: string;
    faturamento_mensal?: string;
    faturamento_melhor?: string;
    faturamento_pior?: string;
    custos_operacionais?: string;
    contas_receber?: string;
    contas_pagar?: string;
    // Produtor Rural
    nome_propriedade?: string;
    localizacao?: string;
    area_total?: string;
    area_produtiva?: string;
    area_reserva?: string;
    situacao_terra?: string;
    arrendamento_valor?: string;
    possui_car?: string;
    itr_dia?: string;
    valor_propriedade?: string;
    cultura_principal?: string;
    cultura_secundaria?: string;
    produtividade?: string;
    producao_total?: string;
    preco_venda?: string;
    receita_safra?: string;
    possui_pecuaria?: string;
    pecuaria_detalhes?: string;
    custos_producao?: string;
    maquinas_detalhes?: string;
    sazonalidade?: string;
  };
}

export const defaultOnboardingData: OnboardingData = {
  personal_data: {},
  activity_type: "",
  income_data: {},
  housing_data: {},
  expenses_data: {},
  assets_liabilities_data: {},
  profile_module_data: {},
};
