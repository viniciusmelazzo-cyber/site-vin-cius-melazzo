import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, CreditCard, AlertCircle } from "lucide-react";
import type { OnboardingData, CartaoOnboarding } from "./types";

interface Props {
  data: OnboardingData;
  onChange: (data: Partial<OnboardingData>) => void;
}

const BANDEIRAS = ["Visa", "Mastercard", "Elo", "Amex", "Hipercard", "Outra"];
const BANCOS = ["Nubank", "Itaú", "Bradesco", "Santander", "Banco do Brasil", "Caixa", "Inter", "C6 Bank", "BTG", "Sicredi", "Sicoob", "Outro"];
const FORMAS_PAGAMENTO = ["Débito/Pix/Boleto", "Cartão de Crédito"];

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

  // Helper to get card label
  const getCartaoLabel = (c: CartaoOnboarding) =>
    [c.banco, c.bandeira].filter(Boolean).join(" — ") || `Cartão ${cartoes.indexOf(c) + 1}`;

  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl font-display">Etapa 4 — Vida Cotidiana e Despesas Pessoais</CardTitle>
        <p className="text-sm text-muted-foreground font-body">Mapeamento dos gastos do dia a dia.</p>
      </CardHeader>
      <CardContent className="space-y-5">

        {/* ═══════════════ CARTÕES PRIMEIRO ═══════════════ */}
        <Section title="Cartões de Crédito">
          <p className="text-xs text-muted-foreground font-body mb-3">
            Cadastre seus cartões primeiro — nas despesas abaixo você poderá indicar se o pagamento é feito por cartão.
          </p>

          {cartoes.length === 0 && (
            <p className="text-sm text-muted-foreground font-body mb-3 italic">Nenhum cartão cadastrado.</p>
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
                      <SelectContent>{BANCOS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-xs">Bandeira</Label>
                    <Select value={cartao.bandeira} onValueChange={(v) => updateCartao(cartao.id, "bandeira", v)}>
                      <SelectTrigger className="font-body h-9 text-sm"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>{BANDEIRAS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
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
                    <Input value={cartao.parcelamentos_ativos} onChange={(e) => updateCartao(cartao.id, "parcelamentos_ativos", e.target.value)} placeholder="Ex: 3 parcelas, total R$ 2.500" className="font-body h-9 text-sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" size="sm" onClick={addCartao} className="mt-3 font-body text-xs gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Adicionar Cartão
          </Button>
        </Section>

        {/* Aviso sobre duplicidade */}
        {cartoes.length > 0 && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/10 border border-accent/20">
            <AlertCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground font-body">
              Nas despesas abaixo, indique a forma de pagamento. Gastos pagos no <strong>cartão de crédito</strong> serão
              registrados como referência e <strong>não serão somados separadamente</strong> (já estão na fatura do cartão).
            </p>
          </div>
        )}

        {/* ═══════════════ DESPESAS ═══════════════ */}

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ExpenseField label="Combustível" field="combustivel" d={d} update={update} cartoes={cartoes} getCartaoLabel={getCartaoLabel} />
              <ExpenseField label="Seguro Veicular (mensal)" field="seguro_veicular" d={d} update={update} cartoes={cartoes} getCartaoLabel={getCartaoLabel} />
              <ExpenseField label="IPVA (mensal)" field="ipva" d={d} update={update} cartoes={cartoes} getCartaoLabel={getCartaoLabel} />
              <ExpenseField label="Manutenção / Revisão" field="manutencao_veiculo" d={d} update={update} cartoes={cartoes} getCartaoLabel={getCartaoLabel} />
            </div>
          ) : d.possui_veiculo === "Não" ? (
            <ExpenseField label="Transporte público / Aplicativos" field="transporte_publico" d={d} update={update} cartoes={cartoes} getCartaoLabel={getCartaoLabel} />
          ) : null}
          {d.possui_veiculo === "Sim" && (
            <Textarea value={d.veiculos_detalhes || ""} onChange={(e) => update("veiculos_detalhes", e.target.value)}
              placeholder="Detalhes dos veículos: marca/modelo/ano, se financiado (parcela, saldo, banco)" className="font-body mt-2" rows={3} />
          )}
        </Section>

        {/* Alimentação */}
        <Section title="Alimentação">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ExpenseField label="Supermercado / Feira" field="supermercado" d={d} update={update} cartoes={cartoes} getCartaoLabel={getCartaoLabel} />
            <ExpenseField label="Restaurantes / Delivery" field="restaurantes" d={d} update={update} cartoes={cartoes} getCartaoLabel={getCartaoLabel} />
          </div>
        </Section>

        {/* Saúde */}
        <Section title="Saúde">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ExpenseField label="Plano de Saúde" field="plano_saude" d={d} update={update} cartoes={cartoes} getCartaoLabel={getCartaoLabel} />
            <ExpenseField label="Plano Odontológico" field="plano_odontologico" d={d} update={update} cartoes={cartoes} getCartaoLabel={getCartaoLabel} />
            <ExpenseField label="Medicamentos" field="medicamentos" d={d} update={update} cartoes={cartoes} getCartaoLabel={getCartaoLabel} />
            <ExpenseField label="Academia / Atividade Física" field="academia" d={d} update={update} cartoes={cartoes} getCartaoLabel={getCartaoLabel} />
          </div>
        </Section>

        {/* Educação */}
        <Section title="Educação">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {temFilhos && (
              <ExpenseField label="Escola dos Filhos" field="escola_filhos" d={d} update={update} cartoes={cartoes} getCartaoLabel={getCartaoLabel} />
            )}
            <ExpenseField label="Faculdade" field="faculdade" d={d} update={update} cartoes={cartoes} getCartaoLabel={getCartaoLabel} />
            <ExpenseField label="Cursos / Especializações" field="cursos" d={d} update={update} cartoes={cartoes} getCartaoLabel={getCartaoLabel} />
          </div>
        </Section>

        {/* Telecom & Lazer */}
        <Section title="Telecomunicações e Lazer">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ExpenseField label="Celular" field="celular" d={d} update={update} cartoes={cartoes} getCartaoLabel={getCartaoLabel} />
            <ExpenseField label="Streaming / Assinaturas" field="streaming" d={d} update={update} cartoes={cartoes} getCartaoLabel={getCartaoLabel} />
            <ExpenseField label="Vestuário" field="vestuario" d={d} update={update} cartoes={cartoes} getCartaoLabel={getCartaoLabel} />
            <ExpenseField label="Lazer / Hobbies" field="lazer" d={d} update={update} cartoes={cartoes} getCartaoLabel={getCartaoLabel} />
            <ExpenseField label="Viagens (média mensal)" field="viagens" d={d} update={update} cartoes={cartoes} getCartaoLabel={getCartaoLabel} />
          </div>
        </Section>

        {/* Dependentes & Pets */}
        <Section title="Dependentes e Outros">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ExpenseField label="Pensão Alimentícia" field="pensao_alimenticia" d={d} update={update} cartoes={cartoes} getCartaoLabel={getCartaoLabel} />
            <ExpenseField label="Ajuda a Familiares" field="ajuda_familiares" d={d} update={update} cartoes={cartoes} getCartaoLabel={getCartaoLabel} />
            <ExpenseField label="Animais de Estimação" field="animais_estimacao" d={d} update={update} cartoes={cartoes} getCartaoLabel={getCartaoLabel} />
          </div>
        </Section>
      </CardContent>
    </>
  );
};

/* ══════════ Sub-components ══════════ */

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border-b border-border pb-4 last:border-0 last:pb-0">
    <h3 className="font-display text-base font-semibold mb-3">{title}</h3>
    {children}
  </div>
);

/** Expense field with value + payment method + optional card selector */
const ExpenseField = ({
  label, field, d, update, cartoes, getCartaoLabel,
}: {
  label: string;
  field: string;
  d: OnboardingData["expenses_data"];
  update: (field: string, value: string) => void;
  cartoes: CartaoOnboarding[];
  getCartaoLabel: (c: CartaoOnboarding) => string;
}) => {
  const valor = (d as any)[field] || "";
  const pagamento = (d as any)[`${field}_pagamento`] || "";
  const cartaoId = (d as any)[`${field}_cartao`] || "";
  const isCartao = pagamento === "Cartão de Crédito";

  return (
    <div className="space-y-1.5 rounded-md border border-border/50 p-2.5 bg-background">
      <Label className="font-body text-xs font-medium">{label}</Label>
      <Input value={valor} onChange={(e) => update(field, e.target.value)} placeholder="R$ 0,00" className="font-body h-8 text-sm" />

      <div className="flex items-center gap-2">
        <Select value={pagamento} onValueChange={(v) => update(`${field}_pagamento`, v)}>
          <SelectTrigger className="font-body h-7 text-[11px] flex-1">
            <SelectValue placeholder="Pago como?" />
          </SelectTrigger>
          <SelectContent>
            {FORMAS_PAGAMENTO.map((f) => <SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>)}
          </SelectContent>
        </Select>

        {isCartao && cartoes.length > 0 && (
          <Select value={cartaoId} onValueChange={(v) => update(`${field}_cartao`, v)}>
            <SelectTrigger className="font-body h-7 text-[11px] flex-1">
              <SelectValue placeholder="Qual cartão?" />
            </SelectTrigger>
            <SelectContent>
              {cartoes.map((c) => (
                <SelectItem key={c.id} value={c.id} className="text-xs">{getCartaoLabel(c)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {isCartao && (
        <p className="text-[10px] text-accent font-body">✓ Já incluso na fatura do cartão — não será contado em duplicidade.</p>
      )}
    </div>
  );
};

export default OnboardingStep4;
