import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ClientLayout from "@/components/ClientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, Briefcase, CalendarDays, DollarSign, Clock, Plus, CheckCircle } from "lucide-react";
import { useCompromissos } from "@/hooks/useCompromissos";
import { usePjClientes } from "@/hooks/usePjClientes";
import { useCrmClientes } from "@/hooks/useCrmClientes";
import CompromissoForm from "@/components/pj/CompromissoForm";
import { formatCurrency } from "@/lib/pj-constants";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { compromissos, compromissosHoje, compromissosAmanha, createCompromisso, updateCompromisso } = useCompromissos();
  const { clientes: clientesPj } = usePjClientes();
  const { clientes: clientesCrm } = useCrmClientes();
  const [clientesPf, setClientesPf] = useState<any[]>([]);
  const [compromissoFormOpen, setCompromissoFormOpen] = useState(false);

  // Recebimentos do mês
  const [recebimentosMes, setRecebimentosMes] = useState<number>(0);

  useEffect(() => {
    fetchPfClients();
    fetchRecebimentosMes();
  }, []);

  const fetchPfClients = async () => {
    const { data } = await supabase.from("profiles").select("id").order("created_at", { ascending: false });
    setClientesPf(data || []);
  };

  const fetchRecebimentosMes = async () => {
    const now = new Date();
    const startOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const endStr = `${endOfMonth.getFullYear()}-${String(endOfMonth.getMonth() + 1).padStart(2, "0")}-${String(endOfMonth.getDate()).padStart(2, "0")}`;

    const { data } = await supabase
      .from("pj_recebimentos")
      .select("valor, status")
      .gte("data_vencimento", startOfMonth)
      .lte("data_vencimento", endStr) as any;

    const total = (data || []).filter((r: any) => r.status !== 'cancelado').reduce((s: number, r: any) => s + Number(r.valor), 0);
    setRecebimentosMes(total);
  };

  // Product breakdown for CRM
  const crmByProduto = clientesCrm.reduce((acc: Record<string, number>, c) => {
    const key = c.produto || "Sem produto";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const pjBySegmento = clientesPj.reduce((acc: Record<string, number>, c) => {
    const key = c.segmento || "Sem segmento";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const formatTime = (dateStr: string) => {
    try { return new Date(dateStr).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }); }
    catch { return "—"; }
  };

  const handleConcluir = async (id: string) => {
    await updateCompromisso(id, { status: 'concluido' });
  };

  return (
    <ClientLayout role="admin">
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Dashboard Geral</h1>
            <p className="text-muted-foreground font-body text-sm mt-1">Visão consolidada da sua operação</p>
          </div>
          <Button onClick={() => setCompromissoFormOpen(true)} className="font-body gap-2 bg-gradient-gold text-primary hover:opacity-90">
            <Plus className="h-4 w-4" /> Compromisso
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Clientes PF", value: String(clientesPf.length), icon: Users, onClick: () => navigate("/cliente/admin/pf") },
            { label: "Clientes PJ", value: String(clientesPj.length), icon: Building2, onClick: () => navigate("/cliente/admin/pj") },
            { label: "CRM Crédito", value: String(clientesCrm.length), icon: Briefcase, onClick: () => navigate("/cliente/admin/crm") },
            { label: "Recebimentos do Mês", value: formatCurrency(recebimentosMes), icon: DollarSign },
          ].map((s) => (
            <Card key={s.label} className="border-border shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={s.onClick}>
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

        {/* Two columns: Compromissos + Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compromissos */}
          <div className="space-y-4">
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-display flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-accent" /> Compromissos de Hoje
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {compromissosHoje.length === 0 && <p className="text-sm text-muted-foreground font-body text-center py-4">Nenhum compromisso para hoje</p>}
                {compromissosHoje.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-body">
                        <Clock className="h-3.5 w-3.5" /> {formatTime(c.data_hora)}
                      </div>
                      <div>
                        <p className="text-sm font-body font-medium">{c.titulo}</p>
                        <Badge variant="outline" className="text-[9px] font-body capitalize">{c.tipo}</Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleConcluir(c.id)}>
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-display flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" /> Amanhã
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {compromissosAmanha.length === 0 && <p className="text-sm text-muted-foreground font-body text-center py-4">Nenhum compromisso para amanhã</p>}
                {compromissosAmanha.map(c => (
                  <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-body">
                      <Clock className="h-3.5 w-3.5" /> {formatTime(c.data_hora)}
                    </div>
                    <div>
                      <p className="text-sm font-body font-medium">{c.titulo}</p>
                      <Badge variant="outline" className="text-[9px] font-body capitalize">{c.tipo}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Breakdown por produto */}
          <div className="space-y-4">
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-display">Clientes por Produto (CRM)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.keys(crmByProduto).length === 0 && <p className="text-sm text-muted-foreground font-body text-center py-4">Nenhum cliente no CRM</p>}
                {Object.entries(crmByProduto).sort((a, b) => b[1] - a[1]).map(([produto, count]) => (
                  <div key={produto} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                    <span className="text-sm font-body">{produto}</span>
                    <Badge variant="default" className="font-body text-xs">{count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-display">Clientes PJ por Segmento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.keys(pjBySegmento).length === 0 && <p className="text-sm text-muted-foreground font-body text-center py-4">Nenhum cliente PJ</p>}
                {Object.entries(pjBySegmento).sort((a, b) => b[1] - a[1]).map(([seg, count]) => (
                  <div key={seg} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                    <span className="text-sm font-body">{seg}</span>
                    <Badge variant="default" className="font-body text-xs">{count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CompromissoForm open={compromissoFormOpen} onClose={() => setCompromissoFormOpen(false)} onSave={createCompromisso} clientes={clientesPj} />
    </ClientLayout>
  );
};

export default AdminDashboard;
