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

const OnboardingStep5 = ({ data, onChange }: Props) => {
  const d = data.assets_liabilities_data;
  const update = (field: string, value: string) => {
    onChange({ assets_liabilities_data: { ...d, [field]: value } });
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl font-display">Etapa 5 — Patrimônio e Compromissos Financeiros</CardTitle>
        <p className="text-sm text-muted-foreground font-body">Bens, investimentos e dívidas — o lastro patrimonial.</p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Imóveis */}
        <Section title="Imóveis">
          <F label="Quantidade de imóveis" value={d.imoveis_qtd} onChange={(v) => update("imoveis_qtd", v)} placeholder="0" />
          {d.imoveis_qtd && parseInt(d.imoveis_qtd) > 0 && (
            <Textarea value={d.imoveis_detalhes || ""} onChange={(e) => update("imoveis_detalhes", e.target.value)}
              placeholder="Para cada imóvel: tipo (casa/apto/terreno/fazenda), localização, valor de mercado, situação (quitado/financiado), finalidade (moradia/aluguel/comercial), possui ônus?" className="font-body mt-2" rows={4} />
          )}
        </Section>

        {/* Veículos */}
        <Section title="Veículos">
          <F label="Quantidade de veículos" value={d.veiculos_patrimonio_qtd} onChange={(v) => update("veiculos_patrimonio_qtd", v)} placeholder="0" />
          {d.veiculos_patrimonio_qtd && parseInt(d.veiculos_patrimonio_qtd) > 0 && (
            <Textarea value={d.veiculos_patrimonio_detalhes || ""} onChange={(e) => update("veiculos_patrimonio_detalhes", e.target.value)}
              placeholder="Para cada veículo: tipo, marca/modelo/ano, valor FIPE, situação (quitado/financiado/consórcio)" className="font-body mt-2" rows={3} />
          )}
        </Section>

        {/* Investimentos */}
        <Section title="Investimentos e Aplicações">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <F label="Poupança" value={d.poupanca} onChange={(v) => update("poupanca", v)} />
            <F label="CDB / LCI / LCA" value={d.cdb_lci_lca} onChange={(v) => update("cdb_lci_lca", v)} />
            <F label="Tesouro Direto" value={d.tesouro_direto} onChange={(v) => update("tesouro_direto", v)} />
            <F label="Ações / Fundos" value={d.acoes_fundos} onChange={(v) => update("acoes_fundos", v)} />
            <F label="Previdência Privada" value={d.previdencia_privada} onChange={(v) => update("previdencia_privada", v)} />
            <F label="Criptomoedas" value={d.criptomoedas} onChange={(v) => update("criptomoedas", v)} />
            <F label="Outros Investimentos" value={d.outros_investimentos} onChange={(v) => update("outros_investimentos", v)} />
            <F label="FGTS (saldo)" value={d.fgts} onChange={(v) => update("fgts", v)} />
          </div>
        </Section>

        {/* Outros bens */}
        <Section title="Outros Bens de Valor">
          <div className="grid grid-cols-2 gap-3">
            <F label="Joias / Relógios" value={d.joias_relogios} onChange={(v) => update("joias_relogios", v)} />
            <F label="Equipamentos / Maquinário" value={d.equipamentos} onChange={(v) => update("equipamentos", v)} />
            <F label="Estoque de Mercadorias" value={d.estoque} onChange={(v) => update("estoque", v)} />
            <F label="Gado / Rebanho" value={d.gado} onChange={(v) => update("gado", v)} />
          </div>
          <Textarea value={d.outros_bens || ""} onChange={(e) => update("outros_bens", e.target.value)}
            placeholder="Outros bens de valor: descrição e valor estimado" className="font-body mt-2" rows={2} />
        </Section>

        {/* Passivos */}
        <Section title="Compromissos Financeiros (Passivos)">
          <Textarea value={d.financiamentos_ativos || ""} onChange={(e) => update("financiamentos_ativos", e.target.value)}
            placeholder="Financiamentos ativos: tipo (imobiliário/veicular/pessoal/rural), banco, parcela, saldo devedor, parcelas restantes, taxa de juros" className="font-body" rows={3} />
          <Textarea value={d.emprestimos_ativos || ""} onChange={(e) => update("emprestimos_ativos", e.target.value)}
            placeholder="Empréstimos ativos: tipo (pessoal/consignado/cheque especial), banco, parcela, saldo devedor" className="font-body mt-2" rows={3} />
          <Textarea value={d.consorcios_ativos || ""} onChange={(e) => update("consorcios_ativos", e.target.value)}
            placeholder="Consórcios ativos: tipo (imóvel/veículo/máquina), administradora, parcela, já contemplado?" className="font-body mt-2" rows={2} />
        </Section>

        {/* Dívidas em atraso */}
        <Section title="Dívidas em Atraso">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <SelectToggle label="Possui dívidas em atraso?" value={d.dividas_atraso} onChange={(v) => update("dividas_atraso", v)} />
            <SelectToggle label="Nome negativado (SPC/Serasa)?" value={d.nome_negativado} onChange={(v) => update("nome_negativado", v)} />
          </div>
          {d.dividas_atraso === "Sim" && (
            <Textarea value={d.dividas_detalhes || ""} onChange={(e) => update("dividas_detalhes", e.target.value)}
              placeholder="Para cada dívida: credor, valor original, valor atualizado, tempo de atraso" className="font-body mt-2" rows={3} />
          )}
        </Section>

        {/* Seguros */}
        <Section title="Seguros Ativos">
          <Textarea value={d.seguros_ativos || ""} onChange={(e) => update("seguros_ativos", e.target.value)}
            placeholder="Seguros ativos: tipo (vida/residencial/veicular/empresarial/rural), valor mensal, cobertura" className="font-body" rows={3} />
        </Section>
      </CardContent>
    </>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border-b border-border pb-4 last:border-0 last:pb-0">
    <h3 className="font-display text-base font-semibold mb-3">{title}</h3>
    {children}
  </div>
);

const F = ({ label, value, onChange, placeholder }: { label: string; value?: string; onChange: (v: string) => void; placeholder?: string }) => (
  <div className="space-y-1.5">
    <Label className="font-body text-xs">{label}</Label>
    <Input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder || "R$ 0,00"} className="font-body h-9 text-sm" />
  </div>
);

const SelectToggle = ({ label, value, onChange }: { label: string; value?: string; onChange: (v: string) => void }) => (
  <div className="space-y-2">
    <Label className="font-body text-sm">{label}</Label>
    <Select value={value || ""} onValueChange={onChange}>
      <SelectTrigger className="font-body"><SelectValue placeholder="—" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="Sim">Sim</SelectItem>
        <SelectItem value="Não">Não</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

export default OnboardingStep5;
