import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { OnboardingData } from "./types";

interface Props {
  data: OnboardingData;
  onChange: (data: Partial<OnboardingData>) => void;
}

const ATIVIDADES = [
  { group: "CLT", options: ["Funcionário Público", "Funcionário Privado", "Militar", "Aposentado/Pensionista"] },
  { group: "Empresário", options: ["Comércio", "Prestação de Serviços", "Indústria", "Alimentação", "Saúde", "Construção Civil", "Tecnologia", "Educação"] },
  { group: "Produtor Rural", options: ["Agricultura (Grãos)", "Pecuária (Corte)", "Pecuária (Leite)", "Avicultura", "Suinocultura", "Atividade Mista"] },
  { group: "Profissional Liberal", options: ["Advogado", "Médico", "Dentista", "Engenheiro", "Contador", "Arquiteto"] },
  { group: "Autônomo", options: ["Representante Comercial", "Corretor de Imóveis", "Consultor", "Motorista de Aplicativo"] },
];

const ESTADOS_CIVIS = ["Solteiro(a)", "Casado(a)", "União Estável", "Divorciado(a)", "Viúvo(a)"];
const REGIMES = ["Comunhão Parcial", "Comunhão Universal", "Separação Total", "Participação Final nos Aquestos"];

const OnboardingStep1 = ({ data, onChange }: Props) => {
  const p = data.personal_data;
  const update = (field: string, value: string) => {
    onChange({ personal_data: { ...p, [field]: value } });
  };

  const setActivity = (value: string) => {
    // Determine activity_type from selection
    const found = ATIVIDADES.find((a) => a.options.includes(value));
    onChange({
      personal_data: { ...p, atividade_principal: value },
      activity_type: found?.group || "Outro",
    });
  };

  const showRegime = p.estado_civil === "Casado(a)" || p.estado_civil === "União Estável";

  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl font-display">Etapa 1 — Dados Pessoais e Perfil</CardTitle>
        <p className="text-sm text-muted-foreground font-body">
          Identificar quem é você e qual caminho o onboarding deve seguir.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nome Completo" value={p.full_name} onChange={(v) => update("full_name", v)} placeholder="Conforme documento" />
          <Field label="CPF" value={p.cpf} onChange={(v) => update("cpf", v)} placeholder="000.000.000-00" />
          <Field label="Data de Nascimento" value={p.date_of_birth} onChange={(v) => update("date_of_birth", v)} placeholder="DD/MM/AAAA" />
          <div className="space-y-2">
            <Label className="font-body text-sm">Estado Civil</Label>
            <Select value={p.estado_civil || ""} onValueChange={(v) => update("estado_civil", v)}>
              <SelectTrigger className="font-body"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {ESTADOS_CIVIS.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {showRegime && (
            <>
              <div className="space-y-2">
                <Label className="font-body text-sm">Regime de Bens</Label>
                <Select value={p.regime_bens || ""} onValueChange={(v) => update("regime_bens", v)}>
                  <SelectTrigger className="font-body"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {REGIMES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Field label="Nome do Cônjuge" value={p.conjuge_nome} onChange={(v) => update("conjuge_nome", v)} placeholder="Nome completo" />
            </>
          )}
          <Field label="Quantidade de Dependentes" value={p.dependentes} onChange={(v) => update("dependentes", v)} placeholder="0" />
          <Field label="Cidade" value={p.cidade} onChange={(v) => update("cidade", v)} placeholder="Onde reside" />
          <div className="space-y-2">
            <Label className="font-body text-sm">Estado (UF)</Label>
            <Select value={p.estado_uf || ""} onValueChange={(v) => update("estado_uf", v)}>
              <SelectTrigger className="font-body"><SelectValue placeholder="UF" /></SelectTrigger>
              <SelectContent>
                {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map(
                  (uf) => <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <Field label="E-mail" value={p.email} onChange={(v) => update("email", v)} placeholder="email@exemplo.com" />
          <Field label="Telefone / WhatsApp" value={p.telefone} onChange={(v) => update("telefone", v)} placeholder="(00) 00000-0000" />
        </div>

        <div className="border-t border-border pt-4 mt-4">
          <h3 className="font-display text-base font-semibold mb-3">Perfil de Atividade</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-body text-sm">Atividade Principal</Label>
              <Select value={p.atividade_principal || ""} onValueChange={setActivity}>
                <SelectTrigger className="font-body"><SelectValue placeholder="Selecione sua atividade" /></SelectTrigger>
                <SelectContent>
                  {ATIVIDADES.map((group) => (
                    <div key={group.group}>
                      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">{group.group}</div>
                      {group.options.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </div>
                  ))}
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Field label="Tempo na Atividade Atual (anos)" value={p.tempo_atividade} onChange={(v) => update("tempo_atividade", v)} placeholder="Ex: 5" />
          </div>
        </div>
      </CardContent>
    </>
  );
};

const Field = ({ label, value, onChange, placeholder }: { label: string; value?: string; onChange: (v: string) => void; placeholder?: string }) => (
  <div className="space-y-2">
    <Label className="font-body text-sm">{label}</Label>
    <Input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="font-body" />
  </div>
);

export default OnboardingStep1;
