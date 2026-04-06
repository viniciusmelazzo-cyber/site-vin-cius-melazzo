import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { OnboardingData } from "./types";

interface Props {
  data: OnboardingData;
  onChange: (data: Partial<OnboardingData>) => void;
}

const OnboardingStep6 = ({ data, onChange }: Props) => {
  const d = data.profile_module_data;
  const actType = data.activity_type;
  const update = (field: string, value: string) => {
    onChange({ profile_module_data: { ...d, [field]: value } });
  };

  const isCLT = actType === "CLT";
  const isEmpresario = actType === "Empresário";
  const isProdutorRural = actType === "Produtor Rural";
  const isOther = !isCLT && !isEmpresario && !isProdutorRural;

  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl font-display">
          Etapa 6 — {isCLT ? "Módulo CLT" : isEmpresario ? "Módulo Empresário" : isProdutorRural ? "Módulo Produtor Rural" : "Módulo Específico"}
        </CardTitle>
        <p className="text-sm text-muted-foreground font-body">
          {isCLT && "Estabilidade do emprego e benefícios que impactam sua vida financeira."}
          {isEmpresario && "Operação da empresa, custos e relação entre pessoa física e jurídica."}
          {isProdutorRural && "Operação rural, custos de produção, sazonalidade e riscos."}
          {isOther && "Informações adicionais sobre sua atividade profissional."}
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {isCLT && <CLTModule data={d} update={update} />}
        {isEmpresario && <EmpresarioModule data={d} update={update} />}
        {isProdutorRural && <ProdutorRuralModule data={d} update={update} />}
        {isOther && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground font-body">
              Descreva detalhes relevantes sobre sua atividade profissional, renda, custos e particularidades:
            </p>
            <Textarea value={d.ramo_atividade || ""} onChange={(e) => update("ramo_atividade", e.target.value)}
              placeholder="Descreva sua atividade, principais clientes, sazonalidade, custos operacionais..." className="font-body" rows={6} />
          </div>
        )}
      </CardContent>
    </>
  );
};

const CLTModule = ({ data, update }: { data: any; update: (k: string, v: string) => void }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <F label="Empresa" value={data.empresa} onChange={(v) => update("empresa", v)} placeholder="Nome da empresa" />
      <F label="Cargo / Função" value={data.cargo} onChange={(v) => update("cargo", v)} placeholder="Cargo atual" />
      <F label="Tempo na empresa (anos)" value={data.tempo_empresa} onChange={(v) => update("tempo_empresa", v)} placeholder="Ex: 3" />
      <Sel label="Tipo de Contrato" value={data.tipo_contrato} onChange={(v) => update("tipo_contrato", v)} options={["Efetivo", "Temporário", "Terceirizado"]} />
      <Sel label="Setor" value={data.setor_trabalho} onChange={(v) => update("setor_trabalho", v)} options={["Público", "Privado", "Misto"]} />
    </div>
    <div className="border-t border-border pt-4 mt-2">
      <h4 className="font-display text-sm font-semibold mb-3">Benefícios e Descontos</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <F label="13º Salário (valor)" value={data.decimo_terceiro} onChange={(v) => update("decimo_terceiro", v)} />
        <F label="PLR (valor)" value={data.plr} onChange={(v) => update("plr", v)} />
        <F label="Vale Alimentação/Refeição" value={data.vale_alimentacao} onChange={(v) => update("vale_alimentacao", v)} />
        <F label="Plano de Saúde (empresa)" value={data.plano_saude_empresa} onChange={(v) => update("plano_saude_empresa", v)} />
        <F label="Consignado (parcela)" value={data.consignado} onChange={(v) => update("consignado", v)} />
        <F label="Margem Consignável" value={data.margem_consignavel} onChange={(v) => update("margem_consignavel", v)} />
        <F label="INSS (desconto)" value={data.inss} onChange={(v) => update("inss", v)} />
        <F label="IRRF (desconto)" value={data.irrf} onChange={(v) => update("irrf", v)} />
      </div>
    </div>
  </>
);

const EmpresarioModule = ({ data, update }: { data: any; update: (k: string, v: string) => void }) => (
  <>
    <h4 className="font-display text-sm font-semibold">Dados da Empresa</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <F label="Razão Social" value={data.razao_social} onChange={(v) => update("razao_social", v)} />
      <F label="CNPJ" value={data.cnpj} onChange={(v) => update("cnpj", v)} placeholder="00.000.000/0000-00" />
      <F label="Nome Fantasia" value={data.nome_fantasia} onChange={(v) => update("nome_fantasia", v)} />
      <Sel label="Tipo Societário" value={data.tipo_societario} onChange={(v) => update("tipo_societario", v)} options={["MEI", "ME", "EPP", "LTDA", "S/A", "EIRELI", "SLU"]} />
      <Sel label="Regime Tributário" value={data.regime_tributario} onChange={(v) => update("regime_tributario", v)} options={["Simples Nacional", "Lucro Presumido", "Lucro Real"]} />
      <F label="Ramo de Atividade" value={data.ramo_atividade} onChange={(v) => update("ramo_atividade", v)} />
      <F label="Tempo de Existência (anos)" value={data.tempo_empresa_pj} onChange={(v) => update("tempo_empresa_pj", v)} />
      <F label="Qtd de Sócios" value={data.qtd_socios} onChange={(v) => update("qtd_socios", v)} />
      <F label="Sua Participação (%)" value={data.participacao_pct} onChange={(v) => update("participacao_pct", v)} />
      <F label="Qtd de Funcionários" value={data.qtd_funcionarios} onChange={(v) => update("qtd_funcionarios", v)} />
    </div>
    <div className="border-t border-border pt-4 mt-2">
      <h4 className="font-display text-sm font-semibold mb-3">Faturamento e Custos</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <F label="Faturamento Mensal Médio" value={data.faturamento_mensal} onChange={(v) => update("faturamento_mensal", v)} />
        <F label="Melhor Mês" value={data.faturamento_melhor} onChange={(v) => update("faturamento_melhor", v)} />
        <F label="Pior Mês" value={data.faturamento_pior} onChange={(v) => update("faturamento_pior", v)} />
      </div>
      <Textarea value={data.custos_operacionais || ""} onChange={(e) => update("custos_operacionais", e.target.value)}
        placeholder="Custos operacionais: folha de pagamento, aluguel, impostos, contabilidade, estoque, marketing, taxas de cartão..." className="font-body mt-3" rows={5} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
        <F label="Contas a Receber (30 dias)" value={data.contas_receber} onChange={(v) => update("contas_receber", v)} />
        <F label="Contas a Pagar (30 dias)" value={data.contas_pagar} onChange={(v) => update("contas_pagar", v)} />
      </div>
    </div>
  </>
);

const ProdutorRuralModule = ({ data, update }: { data: any; update: (k: string, v: string) => void }) => (
  <>
    <h4 className="font-display text-sm font-semibold">Dados da Propriedade</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <F label="Nome da Propriedade" value={data.nome_propriedade} onChange={(v) => update("nome_propriedade", v)} />
      <F label="Localização (Município/UF)" value={data.localizacao} onChange={(v) => update("localizacao", v)} />
      <F label="Área Total (hectares)" value={data.area_total} onChange={(v) => update("area_total", v)} />
      <F label="Área Produtiva (hectares)" value={data.area_produtiva} onChange={(v) => update("area_produtiva", v)} />
      <F label="Área de Reserva Legal" value={data.area_reserva} onChange={(v) => update("area_reserva", v)} />
      <Sel label="Situação da Terra" value={data.situacao_terra} onChange={(v) => update("situacao_terra", v)} options={["Própria", "Arrendada", "Parceria", "Mista"]} />
      {data.situacao_terra === "Arrendada" && <F label="Valor do Arrendamento" value={data.arrendamento_valor} onChange={(v) => update("arrendamento_valor", v)} />}
      <Sel label="Possui CAR?" value={data.possui_car} onChange={(v) => update("possui_car", v)} options={["Sim", "Não"]} />
      <Sel label="ITR em dia?" value={data.itr_dia} onChange={(v) => update("itr_dia", v)} options={["Sim", "Não"]} />
      <F label="Valor Estimado da Propriedade" value={data.valor_propriedade} onChange={(v) => update("valor_propriedade", v)} />
    </div>
    <div className="border-t border-border pt-4 mt-2">
      <h4 className="font-display text-sm font-semibold mb-3">Atividade Produtiva</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Sel label="Cultura Principal" value={data.cultura_principal} onChange={(v) => update("cultura_principal", v)}
          options={["Soja", "Milho", "Café", "Cana", "Algodão", "Arroz", "Feijão", "Trigo", "Outro"]} />
        <F label="Cultura Secundária (safrinha)" value={data.cultura_secundaria} onChange={(v) => update("cultura_secundaria", v)} />
        <F label="Produtividade (sacas/ha)" value={data.produtividade} onChange={(v) => update("produtividade", v)} />
        <F label="Produção Total (ton)" value={data.producao_total} onChange={(v) => update("producao_total", v)} />
        <F label="Preço Médio de Venda" value={data.preco_venda} onChange={(v) => update("preco_venda", v)} />
        <F label="Receita Bruta Última Safra" value={data.receita_safra} onChange={(v) => update("receita_safra", v)} />
      </div>
      <div className="mt-3">
        <Sel label="Possui Pecuária?" value={data.possui_pecuaria} onChange={(v) => update("possui_pecuaria", v)} options={["Sim", "Não"]} />
        {data.possui_pecuaria === "Sim" && (
          <Textarea value={data.pecuaria_detalhes || ""} onChange={(e) => update("pecuaria_detalhes", e.target.value)}
            placeholder="Qtd cabeças, tipo (corte/leite/confinamento), receita mensal" className="font-body mt-2" rows={3} />
        )}
      </div>
    </div>
    <div className="border-t border-border pt-4 mt-2">
      <h4 className="font-display text-sm font-semibold mb-3">Custos, Máquinas e Sazonalidade</h4>
      <Textarea value={data.custos_producao || ""} onChange={(e) => update("custos_producao", e.target.value)}
        placeholder="Custos de produção: sementes, fertilizantes, defensivos, combustível, mão de obra, frete, armazenagem, seguro rural, Funrural, crédito rural..." className="font-body" rows={5} />
      <Textarea value={data.maquinas_detalhes || ""} onChange={(e) => update("maquinas_detalhes", e.target.value)}
        placeholder="Máquinas/equipamentos: tipo, marca/modelo/ano, valor, se financiado (parcela e saldo)" className="font-body mt-2" rows={3} />
      <Textarea value={data.sazonalidade || ""} onChange={(e) => update("sazonalidade", e.target.value)}
        placeholder="Meses de maior gasto (plantio), meses de receita (colheita), quebra de safra, hedge de commodities, contratos de venda antecipada" className="font-body mt-2" rows={3} />
    </div>
  </>
);

const F = ({ label, value, onChange, placeholder }: { label: string; value?: string; onChange: (v: string) => void; placeholder?: string }) => (
  <div className="space-y-1.5">
    <Label className="font-body text-xs">{label}</Label>
    <Input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder || "R$ 0,00"} className="font-body h-9 text-sm" />
  </div>
);

const Sel = ({ label, value, onChange, options }: { label: string; value?: string; onChange: (v: string) => void; options: string[] }) => (
  <div className="space-y-1.5">
    <Label className="font-body text-xs">{label}</Label>
    <Select value={value || ""} onValueChange={onChange}>
      <SelectTrigger className="font-body h-9 text-sm"><SelectValue placeholder="Selecione" /></SelectTrigger>
      <SelectContent>
        {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
      </SelectContent>
    </Select>
  </div>
);

export default OnboardingStep6;
