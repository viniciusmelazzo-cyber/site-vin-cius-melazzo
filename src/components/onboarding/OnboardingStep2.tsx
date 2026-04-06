import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { OnboardingData } from "./types";

interface Props {
  data: OnboardingData;
  onChange: (data: Partial<OnboardingData>) => void;
}

const OnboardingStep2 = ({ data, onChange }: Props) => {
  const d = data.income_data;
  const update = (field: string, value: string) => {
    onChange({ income_data: { ...d, [field]: value } });
  };

  const isVariavel = d.tipo_renda === "Variável" || d.tipo_renda === "Mista";

  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl font-display">Etapa 2 — Renda e Fontes de Receita</CardTitle>
        <p className="text-sm text-muted-foreground font-body">
          Entender de onde vem seu dinheiro, quanto entra e com qual frequência.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <h3 className="font-display text-base font-semibold">Renda Principal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <F label="Renda Mensal Bruta" value={d.renda_bruta} onChange={(v) => update("renda_bruta", v)} placeholder="R$ 0,00" />
          <F label="Renda Mensal Líquida" value={d.renda_liquida} onChange={(v) => update("renda_liquida", v)} placeholder="R$ 0,00" />
          <div className="space-y-2">
            <Label className="font-body text-sm">Tipo de Renda</Label>
            <Select value={d.tipo_renda || ""} onValueChange={(v) => update("tipo_renda", v)}>
              <SelectTrigger className="font-body"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Fixa">Fixa</SelectItem>
                <SelectItem value="Variável">Variável</SelectItem>
                <SelectItem value="Mista">Mista</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isVariavel && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-secondary rounded-lg">
            <F label="Média últimos 6 meses" value={d.renda_variavel_media} onChange={(v) => update("renda_variavel_media", v)} placeholder="R$ 0,00" />
            <F label="Mês de maior faturamento" value={d.renda_variavel_maior} onChange={(v) => update("renda_variavel_maior", v)} placeholder="R$ 0,00" />
            <F label="Mês de menor faturamento" value={d.renda_variavel_menor} onChange={(v) => update("renda_variavel_menor", v)} placeholder="R$ 0,00" />
          </div>
        )}

        <div className="border-t border-border pt-4">
          <h3 className="font-display text-base font-semibold mb-3">Outras Fontes de Renda</h3>
          <p className="text-xs text-muted-foreground font-body mb-3">
            Informe as fontes adicionais. Quanto mais completo, melhor conseguimos construir sua teia de informações.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ToggleField label="Renda de aluguel?" value={d.renda_aluguel} onToggle={(v) => update("renda_aluguel", v)} amountValue={d.renda_aluguel_valor} onAmount={(v) => update("renda_aluguel_valor", v)} />
            <ToggleField label="Investimentos com rendimento?" value={d.renda_investimentos} onToggle={(v) => update("renda_investimentos", v)} amountValue={d.renda_investimentos_valor} onAmount={(v) => update("renda_investimentos_valor", v)} />
            <ToggleField label="Participação em empresas?" value={d.renda_participacao_empresas} onToggle={(v) => update("renda_participacao_empresas", v)} amountValue={d.renda_participacao_valor} onAmount={(v) => update("renda_participacao_valor", v)} />
            <ToggleField label="Pensão ou benefício?" value={d.renda_pensao} onToggle={(v) => update("renda_pensao", v)} amountValue={d.renda_pensao_valor} onAmount={(v) => update("renda_pensao_valor", v)} />
            <ToggleField label="Renda informal ou eventual?" value={d.renda_informal} onToggle={(v) => update("renda_informal", v)} amountValue={d.renda_informal_valor} onAmount={(v) => update("renda_informal_valor", v)} />
            <ToggleField label="Cônjuge possui renda?" value={d.conjuge_renda} onToggle={(v) => update("conjuge_renda", v)} amountValue={d.conjuge_renda_valor} onAmount={(v) => update("conjuge_renda_valor", v)} />
          </div>
        </div>
      </CardContent>
    </>
  );
};

const F = ({ label, value, onChange, placeholder }: { label: string; value?: string; onChange: (v: string) => void; placeholder?: string }) => (
  <div className="space-y-2">
    <Label className="font-body text-sm">{label}</Label>
    <Input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="font-body" />
  </div>
);

const ToggleField = ({ label, value, onToggle, amountValue, onAmount }: {
  label: string; value?: string; onToggle: (v: string) => void; amountValue?: string; onAmount: (v: string) => void;
}) => (
  <div className="space-y-2 p-3 bg-secondary/50 rounded-lg">
    <div className="flex items-center justify-between">
      <Label className="font-body text-sm">{label}</Label>
      <Select value={value || ""} onValueChange={onToggle}>
        <SelectTrigger className="w-20 h-8 font-body text-xs"><SelectValue placeholder="—" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="Sim">Sim</SelectItem>
          <SelectItem value="Não">Não</SelectItem>
        </SelectContent>
      </Select>
    </div>
    {value === "Sim" && (
      <Input value={amountValue || ""} onChange={(e) => onAmount(e.target.value)} placeholder="Valor mensal (R$)" className="font-body h-8 text-sm" />
    )}
  </div>
);

export default OnboardingStep2;
