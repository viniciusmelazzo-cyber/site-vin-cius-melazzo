import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, ArrowLeft, ArrowRight, Upload, Sparkles } from "lucide-react";
import logoVM from "@/assets/logo-vm.webp";

const TOTAL_STEPS = 9;

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Profile fields
  const [cpf, setCpf] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [sector, setSector] = useState("");
  const [phone, setPhone] = useState("");

  // Financial fields
  const [monthlyRevenue, setMonthlyRevenue] = useState("");
  const [revenueSources, setRevenueSources] = useState("");
  const [financialReserves, setFinancialReserves] = useState("");
  const [fixedCostsDetail, setFixedCostsDetail] = useState("");
  const [fixedCostsTotal, setFixedCostsTotal] = useState("");
  const [variableCostsDetail, setVariableCostsDetail] = useState("");
  const [variableCostsTotal, setVariableCostsTotal] = useState("");
  const [totalDebt, setTotalDebt] = useState("");
  const [assetsRealestate, setAssetsRealestate] = useState("");
  const [assetsVehicles, setAssetsVehicles] = useState("");
  const [assetsInvestments, setAssetsInvestments] = useState("");
  const [assetsOther, setAssetsOther] = useState("");
  const [goals, setGoals] = useState("");

  const progress = (step / (TOTAL_STEPS - 1)) * 100;
  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleComplete = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // Update profile
      await supabase.from("profiles").update({
        cpf, company_name: companyName, cnpj, sector, phone, onboarding_completed: true,
        updated_at: new Date().toISOString(),
      }).eq("id", user.id);

      // Save onboarding data
      await supabase.from("onboarding_data").upsert({
        user_id: user.id,
        monthly_revenue: monthlyRevenue,
        revenue_sources: revenueSources,
        financial_reserves: financialReserves,
        fixed_costs_detail: fixedCostsDetail,
        fixed_costs_total: fixedCostsTotal,
        variable_costs_detail: variableCostsDetail,
        variable_costs_total: variableCostsTotal,
        total_debt: totalDebt,
        assets_realestate: assetsRealestate,
        assets_vehicles: assetsVehicles,
        assets_investments: assetsInvestments,
        assets_other: assetsOther,
        goals,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

      toast({ title: "Onboarding concluído!" });
      navigate("/cliente/dashboard");
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const stepContent: Record<number, React.ReactNode> = {
    0: (
      <>
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 p-4 rounded-full bg-accent/10">
            <Sparkles className="h-8 w-8 text-gold" />
          </div>
          <CardTitle className="text-2xl font-display">Bem-vindo à sua plataforma</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground font-body text-sm max-w-md mx-auto">
            Para construirmos juntos um futuro financeiro sólido, precisamos entender seu cenário atual.
            Suas respostas nos ajudarão a criar a <strong className="text-gold">"teia de informações"</strong> que
            transformará seus dados em decisões inteligentes.
          </p>
          <Button onClick={next} className="font-body gap-2 bg-gradient-gold text-primary hover:opacity-90">
            Começar Onboarding <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </>
    ),
    1: (
      <>
        <CardHeader>
          <CardTitle className="text-xl font-display">Dados Cadastrais</CardTitle>
          <p className="text-sm text-muted-foreground font-body">Informações básicas de identificação</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-body text-sm">CPF</Label>
              <Input value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" className="font-body" />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Nome da Empresa / Propriedade</Label>
              <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Ex: Fazenda São José" className="font-body" />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">CNPJ</Label>
              <Input value={cnpj} onChange={(e) => setCnpj(e.target.value)} placeholder="00.000.000/0000-00" className="font-body" />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Setor de Atuação</Label>
              <Select value={sector} onValueChange={setSector}>
                <SelectTrigger className="font-body"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="urbano">Urbano</SelectItem>
                  <SelectItem value="rural">Rural</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Telefone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(00) 00000-0000" className="font-body" />
            </div>
          </div>
        </CardContent>
      </>
    ),
    2: (
      <>
        <CardHeader>
          <CardTitle className="text-xl font-display">Cenário Financeiro</CardTitle>
          <p className="text-sm text-muted-foreground font-body">Receitas e reservas atuais</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="font-body text-sm">Faturamento Médio Mensal (últimos 12 meses)</Label>
            <Input value={monthlyRevenue} onChange={(e) => setMonthlyRevenue(e.target.value)} placeholder="R$ 0,00" className="font-body" />
          </div>
          <div className="space-y-2">
            <Label className="font-body text-sm">3 Maiores Fontes de Receita</Label>
            <Textarea value={revenueSources} onChange={(e) => setRevenueSources(e.target.value)} placeholder="Ex: Vendas de soja, Aluguel de maquinário, Consultoria" className="font-body" rows={3} />
          </div>
          <div className="space-y-2">
            <Label className="font-body text-sm">Reservas Financeiras (valor aproximado)</Label>
            <Input value={financialReserves} onChange={(e) => setFinancialReserves(e.target.value)} placeholder="R$ 0,00" className="font-body" />
          </div>
        </CardContent>
      </>
    ),
    3: (
      <>
        <CardHeader>
          <CardTitle className="text-xl font-display">Custos Fixos e Variáveis</CardTitle>
          <p className="text-sm text-muted-foreground font-body">Detalhamento de despesas mensais</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="font-body text-sm">5 Maiores Custos Fixos Mensais</Label>
            <Textarea value={fixedCostsDetail} onChange={(e) => setFixedCostsDetail(e.target.value)} placeholder="Ex: Aluguel, Folha de pagamento, Energia, Internet, Contador" className="font-body" rows={3} />
          </div>
          <div className="space-y-2">
            <Label className="font-body text-sm">Valor Total de Custos Fixos Mensais</Label>
            <Input value={fixedCostsTotal} onChange={(e) => setFixedCostsTotal(e.target.value)} placeholder="R$ 0,00" className="font-body" />
          </div>
          <div className="space-y-2">
            <Label className="font-body text-sm">3 Maiores Custos Variáveis Mensais</Label>
            <Textarea value={variableCostsDetail} onChange={(e) => setVariableCostsDetail(e.target.value)} placeholder="Ex: Matéria-prima, Comissões, Combustível" className="font-body" rows={3} />
          </div>
          <div className="space-y-2">
            <Label className="font-body text-sm">Valor Total de Custos Variáveis Mensais</Label>
            <Input value={variableCostsTotal} onChange={(e) => setVariableCostsTotal(e.target.value)} placeholder="R$ 0,00" className="font-body" />
          </div>
        </CardContent>
      </>
    ),
    4: (
      <>
        <CardHeader>
          <CardTitle className="text-xl font-display">Parcelamentos e Dívidas</CardTitle>
          <p className="text-sm text-muted-foreground font-body">Detalhes de compromissos financeiros</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground font-body">
            Informe o valor total aproximado das suas dívidas. Você poderá detalhar cada parcelamento no dashboard.
          </p>
          <div className="space-y-2">
            <Label className="font-body text-sm">Valor Total Aproximado das Dívidas</Label>
            <Input value={totalDebt} onChange={(e) => setTotalDebt(e.target.value)} placeholder="R$ 0,00" className="font-body" />
          </div>
        </CardContent>
      </>
    ),
    5: (
      <>
        <CardHeader>
          <CardTitle className="text-xl font-display">Lastro Patrimonial</CardTitle>
          <p className="text-sm text-muted-foreground font-body">Bens e investimentos</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="font-body text-sm">Imóveis (valor de mercado)</Label>
            <Input value={assetsRealestate} onChange={(e) => setAssetsRealestate(e.target.value)} placeholder="R$ 0,00" className="font-body" />
          </div>
          <div className="space-y-2">
            <Label className="font-body text-sm">Veículos (valor de mercado)</Label>
            <Input value={assetsVehicles} onChange={(e) => setAssetsVehicles(e.target.value)} placeholder="R$ 0,00" className="font-body" />
          </div>
          <div className="space-y-2">
            <Label className="font-body text-sm">Investimentos (poupança, ações, fundos)</Label>
            <Input value={assetsInvestments} onChange={(e) => setAssetsInvestments(e.target.value)} placeholder="R$ 0,00" className="font-body" />
          </div>
          <div className="space-y-2">
            <Label className="font-body text-sm">Outros Bens de Valor</Label>
            <Textarea value={assetsOther} onChange={(e) => setAssetsOther(e.target.value)} placeholder="Descreva outros bens e seus valores aproximados" className="font-body" rows={3} />
          </div>
        </CardContent>
      </>
    ),
    6: (
      <>
        <CardHeader>
          <CardTitle className="text-xl font-display">Documentação</CardTitle>
          <p className="text-sm text-muted-foreground font-body">Documentos necessários para análise</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground font-body">
            Você pode enviar os documentos agora ou posteriormente na área de documentos do dashboard.
          </p>
          {[
            "RG/CNH e CPF", "Comprovante de Residência", "Contrato Social/Estatuto (PJ)",
            "IRPF (último exercício)", "Extratos Bancários (3 meses)", "Balanço/DRE (PJ, 3 anos)",
            "Matrículas de Imóveis", "Faturas de Cartão de Crédito", "Contratos de Empréstimos",
          ].map((doc) => (
            <div key={doc} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
              <span className="text-sm font-body">{doc}</span>
              <Button variant="ghost" size="sm" className="font-body text-xs gap-1 text-accent hover:text-accent">
                <Upload className="h-3 w-3" /> Enviar
              </Button>
            </div>
          ))}
        </CardContent>
      </>
    ),
    7: (
      <>
        <CardHeader>
          <CardTitle className="text-xl font-display">Expectativas</CardTitle>
          <p className="text-sm text-muted-foreground font-body">Qual seu principal objetivo?</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="Ex: Captar crédito para expansão, organizar finanças da empresa, planejar investimentos, proteger patrimônio..."
            className="font-body"
            rows={6}
          />
        </CardContent>
      </>
    ),
    8: (
      <>
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 p-4 rounded-full bg-accent/10">
            <CheckCircle2 className="h-8 w-8 text-gold" />
          </div>
          <CardTitle className="text-2xl font-display">Onboarding Concluído!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground font-body text-sm max-w-md mx-auto">
            Obrigado por compartilhar suas informações. Nossa equipe já está analisando seus dados
            para construir sua teia de informações personalizada.
          </p>
          <Button
            onClick={handleComplete}
            disabled={saving}
            className="font-body gap-2 bg-gradient-gold text-primary hover:opacity-90"
          >
            {saving ? "Salvando..." : "Ir para o Dashboard"} <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </>
    ),
  };

  return (
    <div className="min-h-screen bg-linen-texture flex flex-col">
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logoVM} alt="" className="w-7 h-7 object-contain" />
          <div>
            <h1 className="text-lg font-display font-bold text-primary">Melazzo</h1>
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase font-body">Onboarding</p>
          </div>
        </div>
        <span className="text-xs font-body text-muted-foreground">
          Etapa {Math.min(step, TOTAL_STEPS - 2) + 1} de {TOTAL_STEPS - 1}
        </span>
      </header>

      <div className="px-6 pt-4">
        <Progress value={progress} className="h-1.5" />
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl border-border shadow-lg animate-fade-in">
          {stepContent[step]}

          {step > 0 && step < 8 && (
            <div className="px-6 pb-6 flex justify-between">
              <Button variant="ghost" onClick={back} className="font-body gap-2">
                <ArrowLeft className="h-4 w-4" /> Voltar
              </Button>
              <Button onClick={next} className="font-body gap-2 bg-gradient-gold text-primary hover:opacity-90">
                Próximo <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
