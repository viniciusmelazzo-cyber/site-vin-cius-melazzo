import { useMemo, useState } from "react";
import ClientLayout from "@/components/ClientLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CalendarClock, DollarSign, FolderKanban, LayoutDashboard, Plus, Users } from "lucide-react";
import { useCrmV2 } from "@/hooks/useCrmV2";
import {
  CRM_CATEGORIAS,
  CRM_MODELO_COBRANCA_OPTIONS,
  CRM_PRIORIDADE_OPTIONS,
  CRM_RISCO_OPTIONS,
  CRM_STATUS_LABELS,
  CRM_STATUS_OPTIONS,
  CRM_TIPO_PESSOA_OPTIONS,
  CRM_RECEBIVEL_STATUS_LABELS,
  CRM_RECEBIVEL_TIPO_LABELS,
  formatCurrency,
  formatDate,
  formatDateTime,
  getProdutosByCategoria,
  getStatusBadgeClasses,
  getSubprodutos,
  type CrmClienteMaster,
  type CrmCompromisso,
  type CrmOperacao,
} from "@/lib/crm-v2";

const emptyCliente: Partial<CrmClienteMaster> = {
  tipo_pessoa: "pf",
  nome: "",
  telefone_principal: "",
  email_principal: "",
  cidade: "",
  estado: "",
  perfil_renda: "",
  empresas_relacionadas: "",
  patrimonio_resumo: "",
  estrategia_resumo: "",
  riscos_observacoes: "",
  origem_canal: "",
  origem_parceiro: "",
};

const emptyOperacao: Partial<CrmOperacao> = {
  titulo: "",
  categoria_produto: "Consultoria Financeira",
  produto: "Consultoria Financeira PF",
  subproduto: "Diagnóstico",
  status: "lead_novo",
  prioridade: "media",
  risco: "moderado",
  modelo_cobranca: "honorarios_mensalidade",
  valor_objetivo: 0,
  valor_aprovado: 0,
  honorarios_iniciais: 0,
  mensalidade_valor: 0,
  mensalidade_quantidade: 1,
  parcelas_fixas_quantidade: 1,
  parcelas_fixas_valor: 0,
  fee_sucesso_tipo: "percentual",
  fee_sucesso_percentual: 0,
};

const emptyCompromisso: Partial<CrmCompromisso> = {
  titulo: "",
  tipo: "follow_up",
  status: "agendado",
  data_hora: "",
  descricao: "",
};

const AdminCRM = () => {
  const {
    loading,
    clientes,
    clientesMap,
    operacoes,
    recebiveis,
    eventos,
    compromissos,
    agendaHoje,
    agendaAmanha,
    dashboardMetrics,
    produtosAtivos,
    pipeline,
    createCliente,
    updateCliente,
    createOperacao,
    updateOperacao,
    updateOperacaoStatus,
    createCompromisso,
    updateCompromisso,
    updateRecebivel,
  } = useCrmV2();

  const [tab, setTab] = useState("visao-geral");
  const [search, setSearch] = useState("");
  const [clienteDialogOpen, setClienteDialogOpen] = useState(false);
  const [operacaoDialogOpen, setOperacaoDialogOpen] = useState(false);
  const [agendaDialogOpen, setAgendaDialogOpen] = useState(false);
  const [clienteForm, setClienteForm] = useState<Partial<CrmClienteMaster>>(emptyCliente);
  const [operacaoForm, setOperacaoForm] = useState<Partial<CrmOperacao>>(emptyOperacao);
  const [compromissoForm, setCompromissoForm] = useState<Partial<CrmCompromisso>>(emptyCompromisso);
  const [editingClienteId, setEditingClienteId] = useState<string | null>(null);
  const [editingOperacaoId, setEditingOperacaoId] = useState<string | null>(null);

  const filteredClientes = useMemo(() => {
    const normalized = search.toLowerCase();
    return clientes.filter((cliente) => {
      const haystack = [
        cliente.nome,
        cliente.cpf,
        cliente.cnpj,
        cliente.email_principal,
        cliente.cidade,
        cliente.origem_parceiro,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [clientes, search]);

  const filteredOperacoes = useMemo(() => {
    const normalized = search.toLowerCase();
    return operacoes.filter((operacao) => {
      const cliente = clientesMap[operacao.cliente_id];
      const haystack = [
        operacao.titulo,
        operacao.produto,
        operacao.subproduto,
        operacao.status,
        cliente?.nome,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [clientesMap, operacoes, search]);

  const selectedProducts = getProdutosByCategoria(operacaoForm.categoria_produto || "Consultoria Financeira");
  const selectedSubproducts = getSubprodutos(operacaoForm.categoria_produto || "Consultoria Financeira", operacaoForm.produto || selectedProducts[0]);

  const topEventos = eventos.slice(0, 8);
  const openRecebiveis = recebiveis.filter((item) => item.status !== "pago" && item.status !== "cancelado");

  const resetClienteForm = () => {
    setEditingClienteId(null);
    setClienteForm(emptyCliente);
    setClienteDialogOpen(false);
  };

  const resetOperacaoForm = () => {
    setEditingOperacaoId(null);
    setOperacaoForm(emptyOperacao);
    setOperacaoDialogOpen(false);
  };

  const resetAgendaForm = () => {
    setCompromissoForm(emptyCompromisso);
    setAgendaDialogOpen(false);
  };

  const openEditCliente = (cliente: CrmClienteMaster) => {
    setEditingClienteId(cliente.id);
    setClienteForm(cliente);
    setClienteDialogOpen(true);
  };

  const openEditOperacao = (operacao: CrmOperacao) => {
    setEditingOperacaoId(operacao.id);
    setOperacaoForm(operacao);
    setOperacaoDialogOpen(true);
  };

  const handleClienteInput = (field: keyof CrmClienteMaster, value: unknown) => {
    setClienteForm((current) => ({ ...current, [field]: value }));
  };

  const handleOperacaoInput = (field: keyof CrmOperacao, value: unknown) => {
    setOperacaoForm((current) => ({ ...current, [field]: value }));
  };

  const handleCompromissoInput = (field: keyof CrmCompromisso, value: unknown) => {
    setCompromissoForm((current) => ({ ...current, [field]: value }));
  };

  const handleSaveCliente = async () => {
    if (!clienteForm.nome?.trim()) return;
    if (editingClienteId) {
      await updateCliente(editingClienteId, clienteForm);
    } else {
      await createCliente(clienteForm);
    }
    resetClienteForm();
  };

  const handleSaveOperacao = async () => {
    if (!operacaoForm.titulo?.trim() || !operacaoForm.cliente_id) return;
    const payload = {
      ...operacaoForm,
      valor_objetivo: Number(operacaoForm.valor_objetivo || 0),
      valor_aprovado: Number(operacaoForm.valor_aprovado || 0),
      honorarios_iniciais: Number(operacaoForm.honorarios_iniciais || 0),
      mensalidade_valor: Number(operacaoForm.mensalidade_valor || 0),
      mensalidade_quantidade: Number(operacaoForm.mensalidade_quantidade || 0),
      parcelas_fixas_quantidade: Number(operacaoForm.parcelas_fixas_quantidade || 0),
      parcelas_fixas_valor: Number(operacaoForm.parcelas_fixas_valor || 0),
      fee_sucesso_valor: Number(operacaoForm.fee_sucesso_valor || 0),
      fee_sucesso_percentual: Number(operacaoForm.fee_sucesso_percentual || 0),
    };

    if (editingOperacaoId) {
      await updateOperacao(editingOperacaoId, payload);
    } else {
      await createOperacao(payload);
    }
    resetOperacaoForm();
  };

  const handleSaveCompromisso = async () => {
    if (!compromissoForm.titulo?.trim() || !compromissoForm.data_hora) return;
    await createCompromisso(compromissoForm);
    resetAgendaForm();
  };

  const markRecebivelAsPaid = async (id: string) => {
    await updateRecebivel(id, { status: "pago", data_pagamento: new Date().toISOString() });
  };

  const markCompromissoAsDone = async (id: string) => {
    await updateCompromisso(id, { status: "concluido" });
  };

  if (loading) {
    return (
      <ClientLayout role="admin">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-accent" />
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">CRM Melazzo</h1>
            <p className="mt-1 text-sm font-body text-muted-foreground">
              Centro operacional para cadastro mestre, operações, agenda, histórico e fluxo financeiro por card.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setAgendaDialogOpen(true)} className="gap-2 font-body">
              <CalendarClock className="h-4 w-4" /> Novo compromisso
            </Button>
            <Button variant="outline" onClick={() => setClienteDialogOpen(true)} className="gap-2 font-body">
              <Users className="h-4 w-4" /> Novo cliente
            </Button>
            <Button onClick={() => setOperacaoDialogOpen(true)} className="gap-2 font-body bg-gradient-gold text-primary hover:opacity-90">
              <Plus className="h-4 w-4" /> Nova operação
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
          {[
            { label: "Clientes ativos", value: String(dashboardMetrics.clientesAtivos), icon: Users },
            { label: "Operações em andamento", value: String(dashboardMetrics.operacoesAndamento), icon: FolderKanban },
            { label: "A receber no mês", value: formatCurrency(dashboardMetrics.aReceberMes), icon: DollarSign },
            { label: "Recebido no mês", value: formatCurrency(dashboardMetrics.recebidoMes), icon: DollarSign },
            { label: "Em atraso", value: formatCurrency(dashboardMetrics.emAtraso), icon: DollarSign },
            { label: "Projetos críticos", value: String(dashboardMetrics.projetosCriticos), icon: LayoutDashboard },
          ].map((item) => (
            <Card key={item.label} className="border-border shadow-sm">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="rounded-xl bg-secondary p-3">
                  <item.icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-body text-muted-foreground">{item.label}</p>
                  <p className="text-lg font-display font-bold text-foreground">{item.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por cliente, operação, produto ou documento..."
            className="max-w-xl font-body"
          />
        </div>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="flex h-auto flex-wrap gap-1">
            <TabsTrigger value="visao-geral" className="gap-2">
              <LayoutDashboard className="h-4 w-4" /> Visão geral
            </TabsTrigger>
            <TabsTrigger value="clientes" className="gap-2">
              <Users className="h-4 w-4" /> Clientes
            </TabsTrigger>
            <TabsTrigger value="operacoes" className="gap-2">
              <FolderKanban className="h-4 w-4" /> Operações
            </TabsTrigger>
            <TabsTrigger value="financeiro" className="gap-2">
              <DollarSign className="h-4 w-4" /> Financeiro
            </TabsTrigger>
            <TabsTrigger value="agenda" className="gap-2">
              <CalendarClock className="h-4 w-4" /> Agenda
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visao-geral" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <Card className="xl:col-span-2">
                <CardHeader>
                  <CardTitle className="font-display text-base">Pipeline de operações ativas</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {CRM_STATUS_OPTIONS.filter((item) => pipeline[item.value]).map((item) => (
                    <div key={item.value} className="rounded-xl border border-border bg-secondary/50 p-4">
                      <p className="text-xs font-body uppercase tracking-wide text-muted-foreground">{item.label}</p>
                      <p className="mt-2 text-2xl font-display font-bold text-foreground">{pipeline[item.value] || 0}</p>
                    </div>
                  ))}
                  {Object.keys(pipeline).length === 0 && (
                    <p className="col-span-full py-6 text-center text-sm font-body text-muted-foreground">
                      Nenhuma operação ativa encontrada.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-base">Agenda imediata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="mb-2 text-xs font-body uppercase tracking-wide text-muted-foreground">Hoje</p>
                    <div className="space-y-2">
                      {agendaHoje.length === 0 && <p className="text-sm font-body text-muted-foreground">Nenhum compromisso hoje.</p>}
                      {agendaHoje.map((item) => (
                        <div key={item.id} className="rounded-lg border border-border p-3">
                          <p className="font-body text-sm font-medium text-foreground">{item.titulo}</p>
                          <p className="text-xs font-body text-muted-foreground">{formatDateTime(item.data_hora)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-body uppercase tracking-wide text-muted-foreground">Amanhã</p>
                    <div className="space-y-2">
                      {agendaAmanha.length === 0 && <p className="text-sm font-body text-muted-foreground">Nenhum compromisso amanhã.</p>}
                      {agendaAmanha.map((item) => (
                        <div key={item.id} className="rounded-lg border border-border p-3">
                          <p className="font-body text-sm font-medium text-foreground">{item.titulo}</p>
                          <p className="text-xs font-body text-muted-foreground">{formatDateTime(item.data_hora)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-base">Produtos com clientes ativos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {produtosAtivos.length === 0 && <p className="text-sm font-body text-muted-foreground">Nenhum produto ativo no momento.</p>}
                  {produtosAtivos.map((item) => (
                    <div key={item.produto} className="flex items-center justify-between rounded-xl border border-border p-4">
                      <div>
                        <p className="font-body text-sm font-medium text-foreground">{item.produto}</p>
                        <p className="text-xs font-body text-muted-foreground">
                          {item.clientes} cliente(s) ativos • {item.operacoes} operação(ões)
                        </p>
                      </div>
                      <Badge variant="outline" className="font-body">
                        {formatCurrency(item.valor)}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-base">Últimos eventos operacionais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {topEventos.length === 0 && <p className="text-sm font-body text-muted-foreground">Sem eventos recentes.</p>}
                  {topEventos.map((item) => (
                    <div key={item.id} className="rounded-xl border border-border p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-body text-sm font-medium text-foreground">{item.titulo}</p>
                        <Badge variant="outline" className="font-body capitalize">{item.tipo}</Badge>
                      </div>
                      {item.descricao && <p className="mt-2 text-sm font-body text-muted-foreground">{item.descricao}</p>}
                      <p className="mt-2 text-xs font-body text-muted-foreground">{formatDateTime(item.created_at)}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="clientes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-base">Cadastro mestre de clientes</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Cidade</TableHead>
                      <TableHead>Origem</TableHead>
                      <TableHead>Estratégia</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClientes.map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell>
                          <div>
                            <p className="font-body text-sm font-medium text-foreground">{cliente.nome}</p>
                            <p className="text-xs font-body text-muted-foreground">{cliente.cpf || cliente.cnpj || "Sem documento"}</p>
                          </div>
                        </TableCell>
                        <TableCell>{cliente.tipo_pessoa === "pf" ? "Pessoa física" : "Pessoa jurídica"}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-body text-sm">{cliente.telefone_principal || "—"}</p>
                            <p className="text-xs font-body text-muted-foreground">{cliente.email_principal || "—"}</p>
                          </div>
                        </TableCell>
                        <TableCell>{[cliente.cidade, cliente.estado].filter(Boolean).join("/") || "—"}</TableCell>
                        <TableCell>{cliente.origem_parceiro || cliente.origem_canal || "—"}</TableCell>
                        <TableCell className="max-w-[260px] truncate">{cliente.estrategia_resumo || "—"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => openEditCliente(cliente)}>
                            Editar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredClientes.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="py-8 text-center text-sm font-body text-muted-foreground">
                          Nenhum cliente encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="operacoes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-base">Operações e cards do CRM</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Operação</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Próxima ação</TableHead>
                      <TableHead>Financeiro</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOperacoes.map((operacao) => (
                      <TableRow key={operacao.id}>
                        <TableCell>
                          <div>
                            <p className="font-body text-sm font-medium text-foreground">{operacao.titulo}</p>
                            <p className="text-xs font-body text-muted-foreground">{operacao.categoria_produto}</p>
                          </div>
                        </TableCell>
                        <TableCell>{clientesMap[operacao.cliente_id]?.nome || "—"}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-body text-sm">{operacao.produto}</p>
                            <p className="text-xs font-body text-muted-foreground">{operacao.subproduto || "—"}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusBadgeClasses(operacao.status)} border-0 font-body`}>
                            {CRM_STATUS_LABELS[operacao.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-body text-sm">{operacao.proxima_acao || "—"}</p>
                            <p className="text-xs font-body text-muted-foreground">{formatDateTime(operacao.proxima_acao_data)}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-body text-sm">Objetivo: {formatCurrency(operacao.valor_objetivo)}</p>
                            <p className="text-xs font-body text-muted-foreground">Aprovado: {formatCurrency(operacao.valor_aprovado)}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Select value={operacao.status} onValueChange={(value) => updateOperacaoStatus(operacao.id, value as CrmOperacao["status"])}>
                              <SelectTrigger className="h-8 w-[160px] font-body text-xs">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                {CRM_STATUS_OPTIONS.map((item) => (
                                  <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button variant="ghost" size="sm" onClick={() => openEditOperacao(operacao)}>
                              Editar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredOperacoes.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="py-8 text-center text-sm font-body text-muted-foreground">
                          Nenhuma operação encontrada.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financeiro" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-base">Recebíveis derivados dos cards</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {openRecebiveis.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-body text-sm font-medium text-foreground">{item.descricao || "Recebível"}</p>
                            <p className="text-xs font-body text-muted-foreground">{operacoes.find((operacao) => operacao.id === item.operacao_id)?.titulo || "—"}</p>
                          </div>
                        </TableCell>
                        <TableCell>{clientesMap[item.cliente_id]?.nome || "—"}</TableCell>
                        <TableCell>{CRM_RECEBIVEL_TIPO_LABELS[item.tipo]}</TableCell>
                        <TableCell>{formatDate(item.data_vencimento)}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusBadgeClasses(item.status === "cancelado" ? "cancelado_recebivel" : item.status)} border-0 font-body`}>
                            {CRM_RECEBIVEL_STATUS_LABELS[item.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatCurrency(item.valor)}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" onClick={() => markRecebivelAsPaid(item.id)}>
                            Marcar pago
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {openRecebiveis.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="py-8 text-center text-sm font-body text-muted-foreground">
                          Nenhum recebível aberto encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agenda" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-base">Agenda operacional</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Operação</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {compromissos.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.titulo}</TableCell>
                        <TableCell>{item.tipo}</TableCell>
                        <TableCell>{(item.cliente_id && clientesMap[item.cliente_id]?.nome) || "—"}</TableCell>
                        <TableCell>{(item.operacao_id && operacoes.find((operacao) => operacao.id === item.operacao_id)?.titulo) || "—"}</TableCell>
                        <TableCell>{formatDateTime(item.data_hora)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-body capitalize">{item.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" onClick={() => markCompromissoAsDone(item.id)}>
                            Concluir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {compromissos.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="py-8 text-center text-sm font-body text-muted-foreground">
                          Nenhum compromisso cadastrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={clienteDialogOpen} onOpenChange={(open) => !open && resetClienteForm()}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editingClienteId ? "Editar cliente" : "Novo cliente mestre"}</DialogTitle>
            <DialogDescription>
              Estruture o cadastro base do cliente com informações suficientes para análise documental, financeira e comercial.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Tipo de pessoa</Label>
                <Select value={clienteForm.tipo_pessoa || "pf"} onValueChange={(value) => handleClienteInput("tipo_pessoa", value)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CRM_TIPO_PESSOA_OPTIONS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Nome</Label>
                <Input value={clienteForm.nome || ""} onChange={(e) => handleClienteInput("nome", e.target.value)} />
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>CPF</Label>
                  <Input value={clienteForm.cpf || ""} onChange={(e) => handleClienteInput("cpf", e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>CNPJ</Label>
                  <Input value={clienteForm.cnpj || ""} onChange={(e) => handleClienteInput("cnpj", e.target.value)} />
                </div>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Telefone principal</Label>
                  <Input value={clienteForm.telefone_principal || ""} onChange={(e) => handleClienteInput("telefone_principal", e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>E-mail principal</Label>
                  <Input value={clienteForm.email_principal || ""} onChange={(e) => handleClienteInput("email_principal", e.target.value)} />
                </div>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Cidade</Label>
                  <Input value={clienteForm.cidade || ""} onChange={(e) => handleClienteInput("cidade", e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>Estado</Label>
                  <Input value={clienteForm.estado || ""} onChange={(e) => handleClienteInput("estado", e.target.value)} />
                </div>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Perfil de renda</Label>
                  <Input value={clienteForm.perfil_renda || ""} onChange={(e) => handleClienteInput("perfil_renda", e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>Formalização da renda</Label>
                  <Input value={clienteForm.formalizacao_renda || ""} onChange={(e) => handleClienteInput("formalizacao_renda", e.target.value)} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Empresas relacionadas</Label>
                <Textarea value={clienteForm.empresas_relacionadas || ""} onChange={(e) => handleClienteInput("empresas_relacionadas", e.target.value)} rows={3} />
              </div>
              <div className="grid gap-2">
                <Label>Patrimônio e garantias</Label>
                <Textarea value={clienteForm.patrimonio_resumo || ""} onChange={(e) => handleClienteInput("patrimonio_resumo", e.target.value)} rows={3} />
              </div>
              <div className="grid gap-2">
                <Label>Estratégia do caso</Label>
                <Textarea value={clienteForm.estrategia_resumo || ""} onChange={(e) => handleClienteInput("estrategia_resumo", e.target.value)} rows={3} />
              </div>
              <div className="grid gap-2">
                <Label>Riscos e observações</Label>
                <Textarea value={clienteForm.riscos_observacoes || ""} onChange={(e) => handleClienteInput("riscos_observacoes", e.target.value)} rows={3} />
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Origem do canal</Label>
                  <Input value={clienteForm.origem_canal || ""} onChange={(e) => handleClienteInput("origem_canal", e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>Origem / parceiro</Label>
                  <Input value={clienteForm.origem_parceiro || ""} onChange={(e) => handleClienteInput("origem_parceiro", e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={resetClienteForm}>Cancelar</Button>
            <Button onClick={handleSaveCliente}>Salvar cliente</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={operacaoDialogOpen} onOpenChange={(open) => !open && resetOperacaoForm()}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>{editingOperacaoId ? "Editar operação" : "Nova operação"}</DialogTitle>
            <DialogDescription>
              Cada operação representa um card do CRM com produto, status, próxima ação e lógica financeira própria.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Cliente</Label>
                <Select value={operacaoForm.cliente_id || ""} onValueChange={(value) => handleOperacaoInput("cliente_id", value)}>
                  <SelectTrigger><SelectValue placeholder="Selecione o cliente" /></SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>{cliente.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Título da operação</Label>
                <Input value={operacaoForm.titulo || ""} onChange={(e) => handleOperacaoInput("titulo", e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Descrição</Label>
                <Textarea value={operacaoForm.descricao || ""} onChange={(e) => handleOperacaoInput("descricao", e.target.value)} rows={3} />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label>Categoria</Label>
                  <Select
                    value={operacaoForm.categoria_produto || "Consultoria Financeira"}
                    onValueChange={(value) => {
                      const products = getProdutosByCategoria(value);
                      const product = products[0] || "";
                      const subproducts = getSubprodutos(value, product);
                      setOperacaoForm((current) => ({
                        ...current,
                        categoria_produto: value,
                        produto: product,
                        subproduto: subproducts[0] || "",
                      }));
                    }}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CRM_CATEGORIAS.map((item) => (
                        <SelectItem key={item} value={item}>{item}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Produto</Label>
                  <Select
                    value={operacaoForm.produto || selectedProducts[0] || ""}
                    onValueChange={(value) => {
                      const subproducts = getSubprodutos(operacaoForm.categoria_produto || "Consultoria Financeira", value);
                      setOperacaoForm((current) => ({ ...current, produto: value, subproduto: subproducts[0] || "" }));
                    }}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {selectedProducts.map((item) => (
                        <SelectItem key={item} value={item}>{item}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Subproduto</Label>
                  <Select value={operacaoForm.subproduto || selectedSubproducts[0] || ""} onValueChange={(value) => handleOperacaoInput("subproduto", value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {selectedSubproducts.map((item) => (
                        <SelectItem key={item} value={item}>{item}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select value={operacaoForm.status || "lead_novo"} onValueChange={(value) => handleOperacaoInput("status", value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CRM_STATUS_OPTIONS.map((item) => (
                        <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Prioridade</Label>
                  <Select value={operacaoForm.prioridade || "media"} onValueChange={(value) => handleOperacaoInput("prioridade", value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CRM_PRIORIDADE_OPTIONS.map((item) => (
                        <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Risco</Label>
                  <Select value={operacaoForm.risco || "moderado"} onValueChange={(value) => handleOperacaoInput("risco", value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CRM_RISCO_OPTIONS.map((item) => (
                        <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Valor objetivo</Label>
                  <Input type="number" value={Number(operacaoForm.valor_objetivo || 0)} onChange={(e) => handleOperacaoInput("valor_objetivo", e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>Valor aprovado</Label>
                  <Input type="number" value={Number(operacaoForm.valor_aprovado || 0)} onChange={(e) => handleOperacaoInput("valor_aprovado", e.target.value)} />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Próxima ação</Label>
                  <Input value={operacaoForm.proxima_acao || ""} onChange={(e) => handleOperacaoInput("proxima_acao", e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>Data da próxima ação</Label>
                  <Input type="datetime-local" value={operacaoForm.proxima_acao_data || ""} onChange={(e) => handleOperacaoInput("proxima_acao_data", e.target.value)} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Modelo de cobrança</Label>
                <Select value={operacaoForm.modelo_cobranca || "honorarios_mensalidade"} onValueChange={(value) => handleOperacaoInput("modelo_cobranca", value)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CRM_MODELO_COBRANCA_OPTIONS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Honorários iniciais</Label>
                  <Input type="number" value={Number(operacaoForm.honorarios_iniciais || 0)} onChange={(e) => handleOperacaoInput("honorarios_iniciais", e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>Vencimento do inicial</Label>
                  <Input type="date" value={operacaoForm.honorarios_data_vencimento || ""} onChange={(e) => handleOperacaoInput("honorarios_data_vencimento", e.target.value)} />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label>Mensalidade</Label>
                  <Input type="number" value={Number(operacaoForm.mensalidade_valor || 0)} onChange={(e) => handleOperacaoInput("mensalidade_valor", e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>Início mensalidade</Label>
                  <Input type="date" value={operacaoForm.mensalidade_inicio || ""} onChange={(e) => handleOperacaoInput("mensalidade_inicio", e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>Qtd. mensalidades</Label>
                  <Input type="number" value={Number(operacaoForm.mensalidade_quantidade || 0)} onChange={(e) => handleOperacaoInput("mensalidade_quantidade", e.target.value)} />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Fee sucesso (%)</Label>
                  <Input type="number" value={Number(operacaoForm.fee_sucesso_percentual || 0)} onChange={(e) => handleOperacaoInput("fee_sucesso_percentual", e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>Fee sucesso fixo</Label>
                  <Input type="number" value={Number(operacaoForm.fee_sucesso_valor || 0)} onChange={(e) => handleOperacaoInput("fee_sucesso_valor", e.target.value)} />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Qtd. parcelas fixas</Label>
                  <Input type="number" value={Number(operacaoForm.parcelas_fixas_quantidade || 0)} onChange={(e) => handleOperacaoInput("parcelas_fixas_quantidade", e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>Valor parcela fixa</Label>
                  <Input type="number" value={Number(operacaoForm.parcelas_fixas_valor || 0)} onChange={(e) => handleOperacaoInput("parcelas_fixas_valor", e.target.value)} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Observações internas</Label>
                <Textarea value={operacaoForm.observacoes_internas || ""} onChange={(e) => handleOperacaoInput("observacoes_internas", e.target.value)} rows={4} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={resetOperacaoForm}>Cancelar</Button>
            <Button onClick={handleSaveOperacao}>Salvar operação</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={agendaDialogOpen} onOpenChange={(open) => !open && resetAgendaForm()}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo compromisso</DialogTitle>
            <DialogDescription>
              Vincule o compromisso ao cliente e, se necessário, à operação correspondente para destacar a próxima ação no painel.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Título</Label>
              <Input value={compromissoForm.titulo || ""} onChange={(e) => handleCompromissoInput("titulo", e.target.value)} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Tipo</Label>
                <Input value={compromissoForm.tipo || "follow_up"} onChange={(e) => handleCompromissoInput("tipo", e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Data e hora</Label>
                <Input type="datetime-local" value={compromissoForm.data_hora || ""} onChange={(e) => handleCompromissoInput("data_hora", e.target.value)} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Cliente</Label>
                <Select value={compromissoForm.cliente_id || ""} onValueChange={(value) => handleCompromissoInput("cliente_id", value)}>
                  <SelectTrigger><SelectValue placeholder="Opcional" /></SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>{cliente.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Operação</Label>
                <Select value={compromissoForm.operacao_id || ""} onValueChange={(value) => handleCompromissoInput("operacao_id", value)}>
                  <SelectTrigger><SelectValue placeholder="Opcional" /></SelectTrigger>
                  <SelectContent>
                    {operacoes.map((operacao) => (
                      <SelectItem key={operacao.id} value={operacao.id}>{operacao.titulo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Descrição</Label>
              <Textarea value={compromissoForm.descricao || ""} onChange={(e) => handleCompromissoInput("descricao", e.target.value)} rows={3} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={resetAgendaForm}>Cancelar</Button>
            <Button onClick={handleSaveCompromisso}>Salvar compromisso</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ClientLayout>
  );
};

export default AdminCRM;