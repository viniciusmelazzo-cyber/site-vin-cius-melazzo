import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ClientLayout from "@/components/ClientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Users, Search, Eye, X, DollarSign, FileText, AlertTriangle,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from "recharts";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [clientOnboarding, setClientOnboarding] = useState<any | null>(null);
  const [clientEntries, setClientEntries] = useState<any[]>([]);
  const [clientDocs, setClientDocs] = useState<any[]>([]);

  useEffect(() => {
    // Fetch all client profiles (admin RLS allows this)
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setClients(data || []));
  }, []);

  const filtered = clients.filter((c) =>
    (c.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.company_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectClient = async (client: any) => {
    setSelectedClient(client);
    const [onboardingRes, entriesRes, docsRes] = await Promise.all([
      supabase.from("onboarding_data").select("*").eq("user_id", client.id).single(),
      supabase.from("financial_entries").select("*").eq("user_id", client.id).order("date", { ascending: false }).limit(50),
      supabase.from("client_documents").select("*").eq("user_id", client.id),
    ]);
    setClientOnboarding(onboardingRes.data);
    setClientEntries(entriesRes.data || []);
    setClientDocs(docsRes.data || []);
  };

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // Stats
  const totalClients = clients.length;
  const completedOnboarding = clients.filter((c) => c.onboarding_completed).length;
  const pendingOnboarding = totalClients - completedOnboarding;

  // Selected client entries summary
  const clientReceitas = clientEntries.filter((e) => e.type === "receita").reduce((s, e) => s + Number(e.amount), 0);
  const clientDespesas = clientEntries.filter((e) => e.type === "despesa").reduce((s, e) => s + Number(e.amount), 0);

  return (
    <ClientLayout role="admin">
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Painel do Consultor</h1>
          <p className="text-muted-foreground font-body text-sm mt-1">
            Visão gerencial de todos os clientes
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "Clientes Ativos", value: String(totalClients), icon: Users },
            { label: "Onboarding Completo", value: String(completedOnboarding), icon: DollarSign },
            { label: "Pendências", value: String(pendingOnboarding), icon: AlertTriangle },
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
            <CardContent className="p-0">
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
                    <p className="text-xs text-muted-foreground font-body capitalize">{selectedClient.sector || ""} — {selectedClient.company_name || ""}</p>
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
      </div>
    </ClientLayout>
  );
};

export default AdminDashboard;
