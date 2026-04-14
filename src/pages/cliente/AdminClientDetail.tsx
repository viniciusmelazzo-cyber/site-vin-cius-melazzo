import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ClientLayout from "@/components/ClientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft, User, DollarSign, Home, ShoppingCart, Briefcase, PiggyBank, CreditCard, FileText, BarChart3, Activity, MessageSquare,
} from "lucide-react";
import DREReport from "@/components/DREReport";
import HealthScoreBadge from "@/components/dashboard/HealthScoreBadge";
import ConsultantNotes from "@/components/dashboard/ConsultantNotes";
import { calculateHealthScore, type HealthScoreBreakdown } from "@/lib/health-score";
import { calcPatrimonio, getRendaLiquida, getParcelasDividas } from "@/lib/onboarding-finance";

const AdminClientDetail = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<any>(null);
  const [onboarding, setOnboarding] = useState<any>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [docs, setDocs] = useState<any[]>([]);
  const [debts, setDebts] = useState<any[]>([]);
  const [healthScore, setHealthScore] = useState<HealthScoreBreakdown | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) return;
    const fetchData = async () => {
      const [profileRes, onbRes, entriesRes, docsRes, debtsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", clientId).single(),
        supabase.from("onboarding_data").select("*").eq("user_id", clientId).single(),
        supabase.from("financial_entries").select("*").eq("user_id", clientId).order("date", { ascending: false }),
        supabase.from("client_documents").select("*").eq("user_id", clientId),
        supabase.from("client_debts").select("*").eq("user_id", clientId),
      ]);
      setClient(profileRes.data);
      setOnboarding(onbRes.data);
      setEntries(entriesRes.data || []);
      setDocs(docsRes.data || []);
      setDebts(debtsRes.data || []);

      // Calculate health score
      if (onbRes.data) {
        const patrimonio = calcPatrimonio(onbRes.data, debtsRes.data || []);
        const rendaLiquida = getRendaLiquida(onbRes.data);
        const allEntries = entriesRes.data || [];
        const now = new Date();
        const curMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        const monthEntries = allEntries.filter((e: any) => {
          const d = new Date(e.date);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` === curMonth;
        });
        const totalReceitas = monthEntries.filter((e: any) => e.type === "receita").reduce((s: number, e: any) => s + Number(e.amount), 0);
        const totalDespesas = monthEntries.filter((e: any) => e.type === "despesa").reduce((s: number, e: any) => s + Number(e.amount), 0);
        const DESP_FIXA_CATS = ["Moradia", "Transporte", "Saúde", "Educação", "Cartão de Crédito"];
        const despFixas = monthEntries
          .filter((e: any) => e.type === "despesa" && DESP_FIXA_CATS.includes(e.category))
          .reduce((s: number, e: any) => s + Number(e.amount), 0);

        setHealthScore(calculateHealthScore({
          despesasFixas: despFixas,
          rendaLiquida,
          resultadoLiquido: totalReceitas - totalDespesas,
          totalReceitas,
          liquidezAlta: patrimonio.liquidez_alta,
          passivosTotal: patrimonio.passivos.total,
          ativosTotal: patrimonio.liquidez.total + patrimonio.imobilizado.total,
        }));
      }

      setLoading(false);
    };
    fetchData();
  }, [clientId]);

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  if (loading) {
    return (
      <ClientLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </ClientLayout>
    );
  }

  if (!client) {
    return (
      <ClientLayout role="admin">
        <div className="text-center py-16">
          <p className="text-muted-foreground font-body">Cliente não encontrado.</p>
          <Button variant="outline" className="mt-4 font-body" onClick={() => navigate("/cliente/admin")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
        </div>
      </ClientLayout>
    );
  }

  const p = onboarding?.personal_data || {};
  const income = onboarding?.income_data || {};
  const housing = onboarding?.housing_data || {};
  const expenses = onboarding?.expenses_data || {};
  const assets = onboarding?.assets_liabilities_data || {};
  const profileMod = onboarding?.profile_module_data || {};
  const cartoes = expenses.cartoes || [];

  const totalReceitas = entries.filter((e) => e.type === "receita").reduce((s, e) => s + Number(e.amount), 0);
  const totalDespesas = entries.filter((e) => e.type === "despesa").reduce((s, e) => s + Number(e.amount), 0);

  return (
    <ClientLayout role="admin">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/cliente/admin")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-display font-bold text-foreground">{client.full_name || "Cliente"}</h1>
            <p className="text-sm text-muted-foreground font-body">
              {client.sector || "—"} • {client.company_name || "—"} • CPF: {client.cpf || "—"}
            </p>
          </div>
          {healthScore && <HealthScoreBadge score={healthScore} size="md" />}
          <Badge variant={client.onboarding_completed ? "default" : "secondary"} className="font-body">
            {client.onboarding_completed ? "Onboarding Completo" : "Onboarding Pendente"}
          </Badge>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Receitas", value: fmt(totalReceitas), icon: DollarSign },
            { label: "Despesas", value: fmt(totalDespesas), icon: ShoppingCart },
            { label: "Saldo", value: fmt(totalReceitas - totalDespesas), icon: PiggyBank },
            { label: "Documentos", value: String(docs.length), icon: FileText },
          ].map((k) => (
            <Card key={k.label} className="border-border shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary">
                  <k.icon className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-body">{k.label}</p>
                  <p className="text-base font-display font-bold">{k.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!onboarding ? (
          <Card className="border-border">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground font-body">Este cliente ainda não preencheu o onboarding.</p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="score" className="w-full">
            <TabsList className="flex flex-wrap h-auto gap-1">
              <TabsTrigger value="score" className="text-xs font-body gap-1"><Activity className="h-3 w-3" /> Health Score</TabsTrigger>
              <TabsTrigger value="pessoal" className="text-xs font-body gap-1"><User className="h-3 w-3" /> Pessoal</TabsTrigger>
              <TabsTrigger value="renda" className="text-xs font-body gap-1"><DollarSign className="h-3 w-3" /> Renda</TabsTrigger>
              <TabsTrigger value="moradia" className="text-xs font-body gap-1"><Home className="h-3 w-3" /> Moradia</TabsTrigger>
              <TabsTrigger value="despesas" className="text-xs font-body gap-1"><ShoppingCart className="h-3 w-3" /> Despesas</TabsTrigger>
              <TabsTrigger value="patrimonio" className="text-xs font-body gap-1"><PiggyBank className="h-3 w-3" /> Patrimônio</TabsTrigger>
              <TabsTrigger value="perfil" className="text-xs font-body gap-1"><Briefcase className="h-3 w-3" /> Perfil Prof.</TabsTrigger>
              <TabsTrigger value="dre" className="text-xs font-body gap-1"><BarChart3 className="h-3 w-3" /> DRE</TabsTrigger>
              <TabsTrigger value="docs" className="text-xs font-body gap-1"><FileText className="h-3 w-3" /> Documentos</TabsTrigger>
              <TabsTrigger value="notas" className="text-xs font-body gap-1"><MessageSquare className="h-3 w-3" /> Notas</TabsTrigger>
            </TabsList>

            {/* Health Score */}
            <TabsContent value="score" className="mt-4">
              {healthScore ? (
                <HealthScoreBadge score={healthScore} showBreakdown />
              ) : (
                <Card className="border-border">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground font-body text-sm">
                      Dados insuficientes para calcular o Health Score. O cliente precisa concluir o onboarding e registrar lançamentos.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Pessoal */}
            <TabsContent value="pessoal" className="mt-4">
              <Card className="border-border">
                <CardHeader><CardTitle className="text-base font-display">Dados Pessoais</CardTitle></CardHeader>
                <CardContent>
                  <DataGrid items={[
                    ["Nome Completo", p.full_name],
                    ["CPF", p.cpf],
                    ["Data de Nascimento", p.date_of_birth],
                    ["Estado Civil", p.estado_civil],
                    ["Regime de Bens", p.regime_bens],
                    ["Cônjuge", p.conjuge_nome],
                    ["Tem Filhos?", p.tem_filhos],
                    ["Qtd. Filhos", p.qtd_filhos],
                    ["Detalhes Filhos", p.filhos_detalhes],
                    ["Dependentes", p.dependentes],
                    ["Cidade/UF", [p.cidade, p.estado_uf].filter(Boolean).join(" / ")],
                    ["E-mail", p.email],
                    ["Telefone", p.telefone],
                    ["Atividade Principal", p.atividade_principal],
                    ["Tipo de Atividade", onboarding.activity_type],
                    ["Tempo na Atividade", p.tempo_atividade],
                  ]} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Renda */}
            <TabsContent value="renda" className="mt-4">
              <Card className="border-border">
                <CardHeader><CardTitle className="text-base font-display">Renda e Receitas</CardTitle></CardHeader>
                <CardContent>
                  <DataGrid items={[
                    ["Renda Bruta", income.renda_bruta],
                    ["Renda Líquida", income.renda_liquida],
                    ["Tipo de Renda", income.tipo_renda],
                    ["Renda Variável (média)", income.renda_variavel_media],
                    ["Aluguel Recebido", income.renda_aluguel_valor],
                    ["Investimentos", income.renda_investimentos_valor],
                    ["Participação em Empresas", income.renda_participacao_valor],
                    ["Pensão", income.renda_pensao_valor],
                    ["Renda Informal", income.renda_informal_valor],
                    ["Renda do Cônjuge", income.conjuge_renda_valor],
                  ]} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Moradia */}
            <TabsContent value="moradia" className="mt-4">
              <Card className="border-border">
                <CardHeader><CardTitle className="text-base font-display">Moradia e Custos Residenciais</CardTitle></CardHeader>
                <CardContent>
                  <DataGrid items={[
                    ["Tipo de Moradia", housing.tipo_moradia],
                    ["Situação", housing.situacao_moradia],
                    ["Financiamento (parcela)", housing.financiamento_parcela],
                    ["Financiamento (banco)", housing.financiamento_banco],
                    ["Saldo Devedor", housing.financiamento_saldo],
                    ["Aluguel", housing.aluguel_valor],
                    ["Valor do Imóvel", housing.valor_imovel],
                    ["Condomínio", housing.condominio],
                    ["Energia", housing.energia],
                    ["Água", housing.agua],
                    ["Gás", housing.gas],
                    ["Internet", housing.internet],
                    ["IPTU", housing.iptu],
                    ["Seguro Residencial", housing.seguro_residencial],
                    ["Doméstica/Diarista", housing.funcionario_domestico],
                    ["Manutenção", housing.manutencao],
                    ["Outros Imóveis", housing.outros_imoveis_detalhes],
                  ]} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Despesas */}
            <TabsContent value="despesas" className="mt-4 space-y-4">
              {/* Cartões */}
              {cartoes.length > 0 && (
                <Card className="border-border">
                  <CardHeader><CardTitle className="text-base font-display flex items-center gap-2"><CreditCard className="h-4 w-4" /> Cartões de Crédito</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {cartoes.map((c: any, i: number) => (
                      <div key={c.id || i} className="p-3 rounded-lg bg-secondary/50 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-body">
                        <div><span className="text-muted-foreground">Banco:</span> {c.banco}</div>
                        <div><span className="text-muted-foreground">Bandeira:</span> {c.bandeira}</div>
                        <div><span className="text-muted-foreground">Limite:</span> {c.limite}</div>
                        <div><span className="text-muted-foreground">Fatura Média:</span> {c.fatura_media}</div>
                        <div><span className="text-muted-foreground">Vencimento:</span> Dia {c.dia_vencimento}</div>
                        <div><span className="text-muted-foreground">Paga Integral:</span> {c.paga_integral}</div>
                        <div className="col-span-2"><span className="text-muted-foreground">Parcelamentos:</span> {c.parcelamentos_ativos || "—"}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              <Card className="border-border">
                <CardHeader><CardTitle className="text-base font-display">Despesas do Dia a Dia</CardTitle></CardHeader>
                <CardContent>
                  <DataGrid items={[
                    ["Veículo Próprio", expenses.possui_veiculo],
                    ["Combustível", expenses.combustivel, expenses.combustivel_pagamento],
                    ["Seguro Veicular", expenses.seguro_veicular, expenses.seguro_veicular_pagamento],
                    ["Transporte Público", expenses.transporte_publico, expenses.transporte_publico_pagamento],
                    ["Supermercado", expenses.supermercado, expenses.supermercado_pagamento],
                    ["Restaurantes", expenses.restaurantes, expenses.restaurantes_pagamento],
                    ["Plano de Saúde", expenses.plano_saude, expenses.plano_saude_pagamento],
                    ["Plano Odontológico", expenses.plano_odontologico, expenses.plano_odontologico_pagamento],
                    ["Medicamentos", expenses.medicamentos, expenses.medicamentos_pagamento],
                    ["Academia", expenses.academia, expenses.academia_pagamento],
                    ["Escola dos Filhos", expenses.escola_filhos, expenses.escola_filhos_pagamento],
                    ["Faculdade", expenses.faculdade, expenses.faculdade_pagamento],
                    ["Cursos", expenses.cursos, expenses.cursos_pagamento],
                    ["Celular", expenses.celular, expenses.celular_pagamento],
                    ["Streaming", expenses.streaming, expenses.streaming_pagamento],
                    ["Vestuário", expenses.vestuario, expenses.vestuario_pagamento],
                    ["Lazer", expenses.lazer, expenses.lazer_pagamento],
                    ["Viagens", expenses.viagens, expenses.viagens_pagamento],
                    ["Pensão Alimentícia", expenses.pensao_alimenticia],
                    ["Ajuda a Familiares", expenses.ajuda_familiares],
                    ["Animais de Estimação", expenses.animais_estimacao],
                  ]} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Patrimônio */}
            <TabsContent value="patrimonio" className="mt-4">
              <Card className="border-border">
                <CardHeader><CardTitle className="text-base font-display">Ativos e Passivos</CardTitle></CardHeader>
                <CardContent>
                  <DataGrid items={[
                    ["Imóveis (qtd)", assets.imoveis_qtd],
                    ["Imóveis (detalhes)", assets.imoveis_detalhes],
                    ["Veículos (qtd)", assets.veiculos_patrimonio_qtd],
                    ["Veículos (detalhes)", assets.veiculos_patrimonio_detalhes],
                    ["Poupança", assets.poupanca],
                    ["CDB/LCI/LCA", assets.cdb_lci_lca],
                    ["Tesouro Direto", assets.tesouro_direto],
                    ["Ações/Fundos", assets.acoes_fundos],
                    ["Previdência Privada", assets.previdencia_privada],
                    ["Criptomoedas", assets.criptomoedas],
                    ["FGTS", assets.fgts],
                    ["Financiamentos Ativos", assets.financiamentos_ativos],
                    ["Empréstimos Ativos", assets.emprestimos_ativos],
                    ["Consórcios", assets.consorcios_ativos],
                    ["Dívidas em Atraso", assets.dividas_atraso],
                    ["Nome Negativado", assets.nome_negativado],
                    ["Detalhes Dívidas", assets.dividas_detalhes],
                    ["Seguros Ativos", assets.seguros_ativos],
                  ]} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Perfil Profissional */}
            <TabsContent value="perfil" className="mt-4">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-base font-display">
                    Perfil Profissional — {onboarding.activity_type || "Não definido"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DataGrid items={Object.entries(profileMod).map(([k, v]) => [
                    k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
                    v as string,
                  ])} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* DRE */}
            <TabsContent value="dre" className="mt-4">
              <DREReport
                entries={entries}
                liquidezTotal={onboarding ? calcPatrimonio(onboarding, debts).liquidez_alta : 0}
                passivosTotal={onboarding ? calcPatrimonio(onboarding, debts).passivos.total : 0}
                ativosTotal={onboarding ? calcPatrimonio(onboarding, debts).liquidez.total + calcPatrimonio(onboarding, debts).imobilizado.total : 0}
                rendaLiquida={onboarding ? getRendaLiquida(onboarding) : 0}
                parcelasDividas={getParcelasDividas(debts)}
              />
            </TabsContent>

            {/* Documentos */}
            <TabsContent value="docs" className="mt-4">
              <Card className="border-border">
                <CardHeader><CardTitle className="text-base font-display">Documentos</CardTitle></CardHeader>
                <CardContent>
                  {docs.length > 0 ? (
                    <div className="space-y-2">
                      {docs.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-accent" />
                            <span className="text-sm font-body">{doc.doc_name}</span>
                          </div>
                          <Badge variant="default" className="text-[10px] font-body capitalize">{doc.status}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground font-body text-center py-4">Nenhum documento enviado.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notas do Consultor */}
            <TabsContent value="notas" className="mt-4">
              {clientId && <ConsultantNotes clientId={clientId} />}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </ClientLayout>
  );
};

/** Reusable data grid for displaying key-value pairs */
const DataGrid = ({ items }: { items: [string, string | undefined, string?][] }) => {
  const filtered = items.filter(([, v]) => v && v !== "—");
  if (filtered.length === 0) return <p className="text-sm text-muted-foreground font-body text-center py-4">Nenhum dado informado.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
      {filtered.map(([label, value, pagamento]) => (
        <div key={label} className="flex items-baseline justify-between py-1.5 border-b border-border/50 last:border-0">
          <span className="text-xs text-muted-foreground font-body">{label}</span>
          <div className="text-right">
            <span className="text-sm font-body font-medium">{value}</span>
            {pagamento && (
              <span className="text-[10px] text-accent font-body ml-2">({pagamento})</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminClientDetail;
