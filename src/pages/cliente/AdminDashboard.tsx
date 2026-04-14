import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ClientLayout from "@/components/ClientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users, Search, Eye, X, DollarSign, FileText, AlertTriangle, Mail, Copy, Plus, Activity,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { calculateHealthScore, getScoreColor, getScoreLabel, type HealthScoreBreakdown } from "@/lib/health-score";
import { calcPatrimonio, getRendaLiquida } from "@/lib/onboarding-finance";
import HealthScoreBadge from "@/components/dashboard/HealthScoreBadge";

const AdminDashboard = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("clientes");
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState<any[]>([]);
  const [clientScores, setClientScores] = useState<Record<string, HealthScoreBreakdown>>({});
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [clientOnboarding, setClientOnboarding] = useState<any | null>(null);
  const [clientEntries, setClientEntries] = useState<any[]>([]);
  const [clientDocs, setClientDocs] = useState<any[]>([]);

  // Invites
  const [invites, setInvites] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchClients();
    fetchInvites();
  }, []);

  const fetchClients = async () => {
    const [{ data: profiles }, { data: allOnboarding }, { data: allEntries }, { data: allDebts }] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("onboarding_data").select("*"),
      supabase.from("financial_entries").select("*"),
      supabase.from("client_debts").select("*"),
    ]);
    setClients(profiles || []);

    // Calculate health scores for each client
    const scores: Record<string, HealthScoreBreakdown> = {};
    (profiles || []).forEach((client) => {
      const onb = (allOnboarding || []).find((o: any) => o.user_id === client.id);
      if (!onb) return;
      const clientEntries = (allEntries || []).filter((e: any) => e.user_id === client.id);
      const clientDebts = (allDebts || []).filter((d: any) => d.user_id === client.id);
      const patrimonio = calcPatrimonio(onb, clientDebts);
      const rendaLiquida = getRendaLiquida(onb);

      // Current month entries
      const now = new Date();
      const curMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      const monthEntries = clientEntries.filter((e: any) => {
        const d = new Date(e.date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` === curMonth;
      });

      const totalReceitas = monthEntries.filter((e: any) => e.type === "receita").reduce((s: number, e: any) => s + Number(e.amount), 0);
      const totalDespesas = monthEntries.filter((e: any) => e.type === "despesa").reduce((s: number, e: any) => s + Number(e.amount), 0);
      const DESP_FIXA_CATS = ["Moradia", "Transporte", "Saúde", "Educação", "Cartão de Crédito"];
      const despFixas = monthEntries
        .filter((e: any) => e.type === "despesa" && DESP_FIXA_CATS.includes(e.category))
        .reduce((s: number, e: any) => s + Number(e.amount), 0);

      scores[client.id] = calculateHealthScore({
        despesasFixas: despFixas,
        rendaLiquida,
        resultadoLiquido: totalReceitas - totalDespesas,
        totalReceitas,
        liquidezAlta: patrimonio.liquidez_alta,
        passivosTotal: patrimonio.passivos.total,
        ativosTotal: patrimonio.liquidez.total + patrimonio.imobilizado.total,
      });
    });
    setClientScores(scores);
  };

  const fetchInvites = async () => {
    const { data } = await supabase.functions.invoke("admin-users", {
      body: { action: "list_invites" },
    });
    setInvites(data?.invites || []);
  };

  const handleCreateInvite = async () => {
    if (!inviteEmail) return;
    setInviteLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-users", {
        body: { action: "create_invite", email: inviteEmail },
      });
      if (error || data?.error) throw new Error(data?.error || error?.message);

      const inviteUrl = `${window.location.origin}/cliente/login?invite=${data.invite.token}`;
      await navigator.clipboard.writeText(inviteUrl);

      toast({
        title: "Convite criado!",
        description: "O link de convite foi copiado para a área de transferência.",
      });
      setInviteEmail("");
      setDialogOpen(false);
      fetchInvites();
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setInviteLoading(false);
    }
  };

  const copyInviteLink = (token: string) => {
    const url = `${window.location.origin}/cliente/login?invite=${token}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link copiado!" });
  };

  const filtered = clients.filter((c) =>
    (c.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.company_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectClient = (client: any) => {
    navigate(`/cliente/admin/cliente/${client.id}`);
  };

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const totalClients = clients.length;
  const completedOnboarding = clients.filter((c) => c.onboarding_completed).length;
  const pendingInvites = invites.filter((i: any) => i.status === "pending").length;
  const clientsAtRisk = Object.values(clientScores).filter((s) => s.total < 50).length;
  const avgScore = Object.values(clientScores).length > 0
    ? Math.round(Object.values(clientScores).reduce((s, sc) => s + sc.total, 0) / Object.values(clientScores).length)
    : 0;

  const clientReceitas = clientEntries.filter((e) => e.type === "receita").reduce((s, e) => s + Number(e.amount), 0);
  const clientDespesas = clientEntries.filter((e) => e.type === "despesa").reduce((s, e) => s + Number(e.amount), 0);

  return (
    <ClientLayout role="admin">
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Painel do Consultor</h1>
            <p className="text-muted-foreground font-body text-sm mt-1">Gestão completa de clientes e convites</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="font-body gap-2 bg-gradient-gold text-primary hover:opacity-90">
                <Plus className="h-4 w-4" /> Convidar Cliente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">Convidar Novo Cliente</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label className="font-body text-sm">E-mail do Cliente</Label>
                  <Input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="cliente@email.com"
                    className="font-body"
                  />
                </div>
                <p className="text-xs text-muted-foreground font-body">
                  Um link de convite será gerado e copiado para sua área de transferência. Envie ao cliente para que ele crie sua conta.
                </p>
                <Button
                  onClick={handleCreateInvite}
                  disabled={inviteLoading || !inviteEmail}
                  className="w-full font-body bg-gradient-gold text-primary hover:opacity-90"
                >
                  {inviteLoading ? "Criando..." : "Gerar Convite e Copiar Link"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Clientes Ativos", value: String(totalClients), icon: Users },
            { label: "Score Médio", value: avgScore > 0 ? String(avgScore) : "—", icon: Activity },
            { label: "Em Risco (< 50)", value: String(clientsAtRisk), icon: AlertTriangle },
            { label: "Convites Pendentes", value: String(pendingInvites), icon: Mail },
          ].map((s) => (
            <Card key={s.label} className="border-border shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-secondary">
                  <s.icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-body">{s.label}</p>
                  <p className="text-xl font-display font-bold text-foreground">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="clientes" className="font-body">Clientes</TabsTrigger>
            <TabsTrigger value="convites" className="font-body">Convites</TabsTrigger>
          </TabsList>

          <TabsContent value="clientes" className="mt-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Client List */}
              <Card className="xl:col-span-2 border-border shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-display">Clientes</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar cliente..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 font-body text-sm"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-body text-xs">Nome</TableHead>
                        <TableHead className="font-body text-xs">Empresa</TableHead>
                        <TableHead className="font-body text-xs">Setor</TableHead>
                        <TableHead className="font-body text-xs">Status</TableHead>
                        <TableHead className="font-body text-xs w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((client) => (
                        <TableRow key={client.id} className="cursor-pointer hover:bg-secondary/50">
                          <TableCell className="font-body text-sm font-medium">{client.full_name || "—"}</TableCell>
                          <TableCell className="font-body text-sm">{client.company_name || "—"}</TableCell>
                          <TableCell className="font-body text-sm capitalize">{client.sector || "—"}</TableCell>
                          <TableCell>
                            <Badge
                              variant={client.onboarding_completed ? "default" : "secondary"}
                              className="font-body text-[10px]"
                            >
                              {client.onboarding_completed ? "Completo" : "Pendente"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => handleSelectClient(client)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filtered.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground font-body text-sm">
                            Nenhum cliente encontrado
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Client Detail */}
              <Card className="border-border shadow-sm">
                {selectedClient ? (
                  <>
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                      <div>
                        <CardTitle className="text-base font-display">{selectedClient.full_name || "Cliente"}</CardTitle>
                        <p className="text-xs text-muted-foreground font-body capitalize">
                          {selectedClient.sector || ""} — {selectedClient.company_name || ""}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedClient(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Tabs defaultValue="financeiro" className="w-full">
                        <TabsList className="w-full grid grid-cols-3">
                          <TabsTrigger value="financeiro" className="text-xs font-body">Financeiro</TabsTrigger>
                          <TabsTrigger value="documentos" className="text-xs font-body">Docs</TabsTrigger>
                          <TabsTrigger value="analise" className="text-xs font-body">Análise</TabsTrigger>
                        </TabsList>
                        <TabsContent value="financeiro" className="space-y-4 mt-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-lg bg-secondary">
                              <p className="text-[10px] text-muted-foreground font-body">Receitas</p>
                              <p className="text-sm font-display font-bold">{fmt(clientReceitas)}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-secondary">
                              <p className="text-[10px] text-muted-foreground font-body">Despesas</p>
                              <p className="text-sm font-display font-bold">{fmt(clientDespesas)}</p>
                            </div>
                          </div>
                          {clientOnboarding && (
                            <div className="space-y-2 text-xs font-body">
                              <p><span className="text-muted-foreground">Faturamento:</span> {clientOnboarding.monthly_revenue || "—"}</p>
                              <p><span className="text-muted-foreground">Reservas:</span> {clientOnboarding.financial_reserves || "—"}</p>
                              <p><span className="text-muted-foreground">Dívidas:</span> {clientOnboarding.total_debt || "—"}</p>
                            </div>
                          )}
                        </TabsContent>
                        <TabsContent value="documentos" className="mt-4">
                          <div className="space-y-2">
                            {clientDocs.length > 0 ? clientDocs.map((doc) => (
                              <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-accent" />
                                  <span className="text-sm font-body">{doc.doc_name}</span>
                                </div>
                                <Badge variant="default" className="text-[10px] font-body capitalize">{doc.status}</Badge>
                              </div>
                            )) : (
                              <p className="text-sm text-muted-foreground font-body text-center py-4">Nenhum documento enviado</p>
                            )}
                          </div>
                        </TabsContent>
                        <TabsContent value="analise" className="mt-4 space-y-3">
                          {clientOnboarding ? (
                            <>
                              <div className="p-3 rounded-lg bg-secondary">
                                <p className="text-[10px] text-muted-foreground font-body">Objetivos</p>
                                <p className="text-sm font-body mt-1">{clientOnboarding.goals || "Não informado"}</p>
                              </div>
                              <div className="p-3 rounded-lg bg-secondary">
                                <p className="text-[10px] text-muted-foreground font-body">Patrimônio - Imóveis</p>
                                <p className="text-sm font-display font-bold">{clientOnboarding.assets_realestate || "—"}</p>
                              </div>
                              <div className="p-3 rounded-lg bg-secondary">
                                <p className="text-[10px] text-muted-foreground font-body">Patrimônio - Investimentos</p>
                                <p className="text-sm font-display font-bold">{clientOnboarding.assets_investments || "—"}</p>
                              </div>
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground font-body text-center py-4">Onboarding não concluído</p>
                          )}
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </>
                ) : (
                  <>
                    <CardHeader>
                      <CardTitle className="text-base font-display">Visão Geral</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground font-body text-center py-8">
                        Selecione um cliente para ver detalhes
                      </p>
                    </CardContent>
                  </>
                )}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="convites" className="mt-6">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-display">Convites Enviados</CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-body text-xs">E-mail</TableHead>
                      <TableHead className="font-body text-xs">Status</TableHead>
                      <TableHead className="font-body text-xs">Criado em</TableHead>
                      <TableHead className="font-body text-xs">Expira em</TableHead>
                      <TableHead className="font-body text-xs w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invites.map((inv: any) => (
                      <TableRow key={inv.id}>
                        <TableCell className="font-body text-sm">{inv.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={inv.status === "accepted" ? "default" : inv.status === "expired" ? "destructive" : "secondary"}
                            className="font-body text-[10px] capitalize"
                          >
                            {inv.status === "pending" ? "Pendente" : inv.status === "accepted" ? "Aceito" : "Expirado"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-body text-xs text-muted-foreground">
                          {new Date(inv.created_at).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="font-body text-xs text-muted-foreground">
                          {new Date(inv.expires_at).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          {inv.status === "pending" && (
                            <Button variant="ghost" size="icon" onClick={() => copyInviteLink(inv.token)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {invites.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground font-body text-sm">
                          Nenhum convite enviado ainda
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
    </ClientLayout>
  );
};

export default AdminDashboard;
