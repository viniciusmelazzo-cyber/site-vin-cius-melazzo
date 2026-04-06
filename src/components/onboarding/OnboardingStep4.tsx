import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, CreditCard } from "lucide-react";
import type { OnboardingData, CartaoOnboarding } from "./types";

interface Props {
  data: OnboardingData;
  onChange: (data: Partial<OnboardingData>) => void;
}

const BANDEIRAS = ["Visa", "Mastercard", "Elo", "Amex", "Hipercard", "Outra"];
const BANCOS = ["Nubank", "Itaú", "Bradesco", "Santander", "Banco do Brasil", "Caixa", "Inter", "C6 Bank", "BTG", "Sicredi", "Sicoob", "Outro"];

const OnboardingStep4 = ({ data, onChange }: Props) => {
  const d = data.expenses_data;
  const temFilhos = data.personal_data.tem_filhos === "Sim";
  const cartoes = d.cartoes || [];

  const update = (field: string, value: string) => {
    onChange({ expenses_data: { ...d, [field]: value } });
  };

  const updateCartoes = (newCartoes: CartaoOnboarding[]) => {
    onChange({ expenses_data: { ...d, cartoes: newCartoes } });
  };

  const addCartao = () => {
    const novo: CartaoOnboarding = {
      id: crypto.randomUUID(),
      banco: "",
      bandeira: "",
      limite: "",
      fatura_media: "",
      paga_integral: "",
      dia_vencimento: "",
      parcelamentos_ativos: "",
    };
    updateCartoes([...cartoes, novo]);
  };

  const updateCartao = (id: string, field: keyof CartaoOnboarding, value: string) => {
    updateCartoes(cartoes.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const removeCartao = (id: string) => {
    updateCartoes(cartoes.filter((c) => c.id !== id));
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

        {/* Educação — condicional a filhos */}
        <Section title="Educação">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {temFilhos && (
              <F label="Escola dos Filhos" value={d.escola_filhos} onChange={(v) => update("escola_filhos", v)} />
            )}
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

        {/* Cartões de Crédito — estruturado */}
        <Section title="Cartões de Crédito">
          {cartoes.length === 0 && (
            <p className="text-sm text-muted-foreground font-body mb-3">Nenhum cartão cadastrado. Clique abaixo para adicionar.</p>
          )}

          <div className="space-y-4">
            {cartoes.map((cartao, idx) => (
              <div key={cartao.id} className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    <span className="font-display text-sm font-semibold">Cartão {idx + 1}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeCartao(cartao.id)} className="text-destructive hover:text-destructive h-7 w-7 p-0">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="space-y-1.5">
                    <Label className="font-body text-xs">Banco</Label>
                    <Select value={cartao.banco} onValueChange={(v) => updateCartao(cartao.id, "banco", v)}>
                      <SelectTrigger className="font-body h-9 text-sm"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {BANCOS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-xs">Bandeira</Label>
                    <Select value={cartao.bandeira} onValueChange={(v) => updateCartao(cartao.id, "bandeira", v)}>
                      <SelectTrigger className="font-body h-9 text-sm"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {BANDEIRAS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-xs">Limite</Label>
                    <Input value={cartao.limite} onChange={(e) => updateCartao(cartao.id, "limite", e.target.value)} placeholder="R$ 0,00" className="font-body h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-xs">Fatura Média</Label>
                    <Input value={cartao.fatura_media} onChange={(e) => updateCartao(cartao.id, "fatura_media", e.target.value)} placeholder="R$ 0,00" className="font-body h-9 text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="font-body text-xs">Dia do Vencimento</Label>
                    <Input value={cartao.dia_vencimento} onChange={(e) => updateCartao(cartao.id, "dia_vencimento", e.target.value)} placeholder="Ex: 10" className="font-body h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-xs">Paga integral?</Label>
                    <Select value={cartao.paga_integral} onValueChange={(v) => updateCartao(cartao.id, "paga_integral", v)}>
                      <SelectTrigger className="font-body h-9 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sim">Sim, sempre</SelectItem>
                        <SelectItem value="Parcial">Parcial</SelectItem>
                        <SelectItem value="Mínimo">Só o mínimo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5 col-span-2 md:col-span-1">
                    <Label className="font-body text-xs">Parcelamentos ativos</Label>
                    <Input value={cartao.parcelamentos_ativos} onChange={(e) => updateCartao(cartao.id, "parcelamentos_ativos", e.target.value)} placeholder="Ex: 3 parcelas abertas, total R$ 2.500" className="font-body h-9 text-sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" size="sm" onClick={addCartao} className="mt-3 font-body text-xs gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Adicionar Cartão
          </Button>
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
