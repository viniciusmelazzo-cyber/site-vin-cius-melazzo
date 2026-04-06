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

const TIPOS_MORADIA = ["Casa", "Apartamento", "Chácara/Sítio", "Fazenda"];
const SITUACOES = ["Própria Quitada", "Própria Financiada", "Alugada", "Cedida/Emprestada", "Mora com Familiares"];

const OnboardingStep3 = ({ data, onChange }: Props) => {
  const d = data.housing_data;
  const update = (field: string, value: string) => {
    onChange({ housing_data: { ...d, [field]: value } });
  };

  const isFinanciada = d.situacao_moradia === "Própria Financiada";
  const isAlugada = d.situacao_moradia === "Alugada";

  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl font-display">Etapa 3 — Moradia e Custos Residenciais</CardTitle>
        <p className="text-sm text-muted-foreground font-body">Situação habitacional e custos associados.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField label="Tipo de Moradia" value={d.tipo_moradia} onChange={(v) => update("tipo_moradia", v)} options={TIPOS_MORADIA} />
          <SelectField label="Situação" value={d.situacao_moradia} onChange={(v) => update("situacao_moradia", v)} options={SITUACOES} />
        </div>

        {isFinanciada && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-secondary/50 rounded-lg">
            <F label="Parcela do Financiamento" value={d.financiamento_parcela} onChange={(v) => update("financiamento_parcela", v)} placeholder="R$ 0,00" />
            <F label="Banco" value={d.financiamento_banco} onChange={(v) => update("financiamento_banco", v)} placeholder="Instituição" />
            <F label="Saldo Devedor" value={d.financiamento_saldo} onChange={(v) => update("financiamento_saldo", v)} placeholder="R$ 0,00" />
            <F label="Prazo Restante (meses)" value={d.financiamento_prazo} onChange={(v) => update("financiamento_prazo", v)} placeholder="Ex: 240" />
          </div>
        )}

        {isAlugada && (
          <div className="p-3 bg-secondary/50 rounded-lg">
            <F label="Valor do Aluguel" value={d.aluguel_valor} onChange={(v) => update("aluguel_valor", v)} placeholder="R$ 0,00" />
          </div>
        )}

        <F label="Valor Estimado do Imóvel (mercado)" value={d.valor_imovel} onChange={(v) => update("valor_imovel", v)} placeholder="R$ 0,00" />

        <div className="border-t border-border pt-4">
          <h3 className="font-display text-base font-semibold mb-3">Custos Fixos da Moradia (mensal)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { key: "condominio", label: "Condomínio" },
              { key: "energia", label: "Energia Elétrica" },
              { key: "agua", label: "Água e Esgoto" },
              { key: "gas", label: "Gás" },
              { key: "internet", label: "Internet / TV" },
              { key: "iptu", label: "IPTU (mensal)" },
              { key: "seguro_residencial", label: "Seguro Residencial" },
              { key: "funcionario_domestico", label: "Doméstica / Diarista" },
              { key: "manutencao", label: "Manutenção" },
            ].map(({ key, label }) => (
              <F key={key} label={label} value={(d as any)[key]} onChange={(v) => update(key, v)} placeholder="R$ 0,00" />
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <div className="space-y-2">
            <Label className="font-body text-sm">Possui outros imóveis?</Label>
            <Select value={d.outros_imoveis || ""} onValueChange={(v) => update("outros_imoveis", v)}>
              <SelectTrigger className="font-body"><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Sim">Sim</SelectItem>
                <SelectItem value="Não">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {d.outros_imoveis === "Sim" && (
            <Textarea value={d.outros_imoveis_detalhes || ""} onChange={(e) => update("outros_imoveis_detalhes", e.target.value)} placeholder="Descreva: tipo, localização, finalidade (moradia/aluguel/comercial) e custos mensais de cada" className="font-body mt-2" rows={4} />
          )}
        </div>
      </CardContent>
    </>
  );
};

const F = ({ label, value, onChange, placeholder }: { label: string; value?: string; onChange: (v: string) => void; placeholder?: string }) => (
  <div className="space-y-1.5">
    <Label className="font-body text-xs">{label}</Label>
    <Input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="font-body h-9 text-sm" />
  </div>
);

const SelectField = ({ label, value, onChange, options }: { label: string; value?: string; onChange: (v: string) => void; options: string[] }) => (
  <div className="space-y-2">
    <Label className="font-body text-sm">{label}</Label>
    <Select value={value || ""} onValueChange={onChange}>
      <SelectTrigger className="font-body"><SelectValue placeholder="Selecione" /></SelectTrigger>
      <SelectContent>
        {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
      </SelectContent>
    </Select>
  </div>
);

export default OnboardingStep3;
