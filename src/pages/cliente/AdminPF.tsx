import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ClientLayout from "@/components/ClientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, Activity } from "lucide-react";
import { calculateHealthScore, type HealthScoreBreakdown } from "@/lib/health-score";
import { calcPatrimonio, getRendaLiquida } from "@/lib/onboarding-finance";
import HealthScoreBadge from "@/components/dashboard/HealthScoreBadge";

const AdminPF = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState<any[]>([]);
  const [clientScores, setClientScores] = useState<Record<string, HealthScoreBreakdown>>({});

  useEffect(() => { fetchClients(); }, []);

  const fetchClients = async () => {
    const [{ data: profiles }, { data: allOnboarding }, { data: allEntries }, { data: allDebts }] = await Promise.all([
      supabase.from("profiles").select("*").order("full_name", { ascending: true }),
      supabase.from("onboarding_data").select("*"),
      supabase.from("financial_entries").select("*"),
      supabase.from("client_debts").select("*"),
    ]);
    setClients(profiles || []);

    const scores: Record<string, HealthScoreBreakdown> = {};
    (profiles || []).forEach((client) => {
      const onb = (allOnboarding || []).find((o: any) => o.user_id === client.id);
      if (!onb) return;
      const clientEntries = (allEntries || []).filter((e: any) => e.user_id === client.id);
      const clientDebts = (allDebts || []).filter((d: any) => d.user_id === client.id);
      const patrimonio = calcPatrimonio(onb, clientDebts);
      const rendaLiquida = getRendaLiquida(onb);
      const now = new Date();
      const curMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      const monthEntries = clientEntries.filter((e: any) => {
        const d = new Date(e.date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` === curMonth;
      });
      const totalReceitas = monthEntries.filter((e: any) => e.type === "receita").reduce((s: number, e: any) => s + Number(e.amount), 0);
      const totalDespesas = monthEntries.filter((e: any) => e.type === "despesa").reduce((s: number, e: any) => s + Number(e.amount), 0);
      const DESP_FIXA_CATS = ["Moradia", "Transporte", "Saúde", "Educação", "Cartão de Crédito"];
      const despFixas = monthEntries.filter((e: any) => e.type === "despesa" && DESP_FIXA_CATS.includes(e.category)).reduce((s: number, e: any) => s + Number(e.amount), 0);
      scores[client.id] = calculateHealthScore({
        despesasFixas: despFixas, rendaLiquida, resultadoLiquido: totalReceitas - totalDespesas,
        totalReceitas, liquidezAlta: patrimonio.liquidez_alta, passivosTotal: patrimonio.passivos.total,
        ativosTotal: patrimonio.liquidez.total + patrimonio.imobilizado.total,
      });
    });
    setClientScores(scores);
  };

  const filtered = clients.filter((c) =>
    (c.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.company_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ClientLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Clientes Gestão Financeira PF</h1>
          <p className="text-muted-foreground font-body text-sm mt-1">
            {clients.length} cliente{clients.length !== 1 ? "s" : ""} na plataforma
          </p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por nome..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 font-body text-sm" />
        </div>

        <Card className="border-border shadow-sm">
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-body text-xs">Nome</TableHead>
                  <TableHead className="font-body text-xs">Setor</TableHead>
                  <TableHead className="font-body text-xs">Score</TableHead>
                  <TableHead className="font-body text-xs">Status</TableHead>
                  <TableHead className="font-body text-xs w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((client) => {
                  const score = clientScores[client.id];
                  return (
                    <TableRow key={client.id} className="cursor-pointer hover:bg-secondary/50" onClick={() => navigate(`/cliente/admin/cliente/${client.id}`)}>
                      <TableCell className="font-body text-sm font-medium">{client.full_name || "—"}</TableCell>
                      <TableCell className="font-body text-sm capitalize">{client.sector || "—"}</TableCell>
                      <TableCell>{score ? <HealthScoreBadge score={score} size="sm" /> : <span className="text-xs text-muted-foreground font-body">—</span>}</TableCell>
                      <TableCell>
                        <Badge variant={client.onboarding_completed ? "default" : "secondary"} className="font-body text-[10px]">
                          {client.onboarding_completed ? "Completo" : "Pendente"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground font-body text-sm">Nenhum cliente encontrado</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default AdminPF;
