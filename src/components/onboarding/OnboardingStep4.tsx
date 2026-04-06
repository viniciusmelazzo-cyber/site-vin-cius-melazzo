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

const OnboardingStep4 = ({ data, onChange }: Props) => {
  const d = data.expenses_data;
  const update = (field: string, value: string) => {
    onChange({ expenses_data: { ...d, [field]: value } });
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl font-display">Etapa 4 — Vida Cotidiana e Despesas Pessoais</CardTitle>
        <p className="text-sm text-muted-foreground font-body">Mapeamento dos gastos do dia a dia.</p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Transporte */}
        <Section title="Transporte">
          <div className="space-y-2 mb-3">
            <Label className="font-body text-sm">Possui veículo próprio?</Label>
            <Select value={d.possui_veiculo || ""} onValueChange={(v) => update("possui_veiculo", v)}>
              <SelectTrigger className="font-body"><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Sim">Sim</SelectItem>
                <SelectItem value="Não">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {d.possui_veiculo === "Sim" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <F label="Combustível" value={d.combustivel} onChange={(v) => update("combustivel", v)} />
              <F label="Seguro Veicular (mensal)" value={d.seguro_veicular} onChange={(v) => update("seguro_veicular", v)} />
              <F label="IPVA (mensal)" value={d.ipva} onChange={(v) => update("ipva", v)} />
              <F label="Manutenção / Revisão" value={d.manutencao_veiculo} onChange={(v) => update("manutencao_veiculo", v)} />
            </div>
          ) : d.possui_veiculo === "Não" ? (
            <F label="Transporte público / Aplicativos" value={d.transporte_publico} onChange={(v) => update("transporte_publico", v)} />
          ) : null}
          {d.possui_veiculo === "Sim" && (
            <Textarea value={d.veiculos_detalhes || ""} onChange={(e) => update("veiculos_detalhes", e.target.value)}
              placeholder="Detalhes dos veículos: marca/modelo/ano, se financiado (parcela, saldo, banco)" className="font-body mt-2" rows={3} />
          )}
        </Section>

        {/* Alimentação */}
        <Section title="Alimentação">
          <div className="grid grid-cols-2 gap-3">
            <F label="Supermercado / Feira" value={d.supermercado} onChange={(v) => update("supermercado", v)} />
            <F label="Restaurantes / Delivery" value={d.restaurantes} onChange={(v) => update("restaurantes", v)} />
          </div>
        </Section>

        {/* Saúde */}
        <Section title="Saúde">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <F label="Plano de Saúde" value={d.plano_saude} onChange={(v) => update("plano_saude", v)} />
            <F label="Plano Odontológico" value={d.plano_odontologico} onChange={(v) => update("plano_odontologico", v)} />
            <F label="Medicamentos" value={d.medicamentos} onChange={(v) => update("medicamentos", v)} />
            <F label="Academia / Atividade Física" value={d.academia} onChange={(v) => update("academia", v)} />
          </div>
        </Section>

        {/* Educação */}
        <Section title="Educação">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <F label="Escola dos Filhos" value={d.escola_filhos} onChange={(v) => update("escola_filhos", v)} />
            <F label="Faculdade" value={d.faculdade} onChange={(v) => update("faculdade", v)} />
            <F label="Cursos / Especializações" value={d.cursos} onChange={(v) => update("cursos", v)} />
          </div>
        </Section>

        {/* Telecom & Lazer */}
        <Section title="Telecomunicações e Lazer">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <F label="Celular" value={d.celular} onChange={(v) => update("celular", v)} />
            <F label="Streaming / Assinaturas" value={d.streaming} onChange={(v) => update("streaming", v)} />
            <F label="Vestuário" value={d.vestuario} onChange={(v) => update("vestuario", v)} />
            <F label="Lazer / Hobbies" value={d.lazer} onChange={(v) => update("lazer", v)} />
            <F label="Viagens (média mensal)" value={d.viagens} onChange={(v) => update("viagens", v)} />
          </div>
        </Section>

        {/* Cartões */}
        <Section title="Cartões de Crédito">
          <F label="Quantos cartões possui?" value={d.qtd_cartoes} onChange={(v) => update("qtd_cartoes", v)} />
          {d.qtd_cartoes && parseInt(d.qtd_cartoes) > 0 && (
            <Textarea value={d.cartoes_detalhes || ""} onChange={(e) => update("cartoes_detalhes", e.target.value)}
              placeholder="Para cada cartão: bandeira/banco, limite, fatura média, paga integral? Parcelamentos ativos?" className="font-body mt-2" rows={4} />
          )}
        </Section>

        {/* Dependentes & Pets */}
        <Section title="Dependentes e Outros">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <F label="Pensão Alimentícia" value={d.pensao_alimenticia} onChange={(v) => update("pensao_alimenticia", v)} />
            <F label="Ajuda a Familiares" value={d.ajuda_familiares} onChange={(v) => update("ajuda_familiares", v)} />
            <F label="Animais de Estimação" value={d.animais_estimacao} onChange={(v) => update("animais_estimacao", v)} />
          </div>
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

const F = ({ label, value, onChange }: { label: string; value?: string; onChange: (v: string) => void }) => (
  <div className="space-y-1.5">
    <Label className="font-body text-xs">{label}</Label>
    <Input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="R$ 0,00" className="font-body h-9 text-sm" />
  </div>
);

export default OnboardingStep4;
