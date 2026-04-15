import ClientLayout from "@/components/ClientLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, CalendarDays, DollarSign, FolderKanban, TriangleAlert, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCrmV2 } from "@/hooks/useCrmV2";
import { CRM_STATUS_LABELS, formatCurrency, formatDate, formatDateTime, getStatusBadgeClasses } from "@/lib/crm-v2";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { loading, clientesMap, operacoesAtivas, agendaHoje, agendaAmanha, dashboardMetrics, produtosAtivos, recebiveis } = useCrmV2();

  const vencimentosProximos = recebiveis
    .filter((item) => item.status !== "pago" && item.status !== "cancelado")
    .slice(0, 8);

  const operacoesCriticas = operacoesAtivas
    .filter((item) => item.prioridade === "critica" || item.risco === "alto")
    .slice(0, 8);

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
      <div className="space-y-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Dashboard Geral</h1>
            <p className="mt-1 text-sm font-body text-muted-foreground">
              Resumo executivo da operação com clientes ativos, agenda, carteira e recebíveis do escritório.
            </p>
          </div>
          <Button onClick={() => navigate("/cliente/admin/crm")} className="gap-2 font-body bg-gradient-gold text-primary hover:opacity-90">
            Abrir CRM <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
          {[
            { label: "Clientes ativos", value: String(dashboardMetrics.clientesAtivos), icon: Users },
            { label: "Operações", value: String(dashboardMetrics.operacoesAndamento), icon: FolderKanban },
            { label: "A receber", value: formatCurrency(dashboardMetrics.aReceberMes), icon: DollarSign },
            { label: "Recebido", value: formatCurrency(dashboardMetrics.recebidoMes), icon: DollarSign },
            { label: "Em atraso", value: formatCurrency(dashboardMetrics.emAtraso), icon: TriangleAlert },
            { label: "Agenda amanhã", value: String(dashboardMetrics.compromissosAmanha), icon: CalendarDays },
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

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-base">O que tenho marcado para o próximo ciclo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-body uppercase tracking-wide text-muted-foreground">Hoje</p>
                <div className="space-y-2">
                  {agendaHoje.length === 0 && <p className="text-sm font-body text-muted-foreground">Nenhum compromisso hoje.</p>}
                  {agendaHoje.map((item) => (
                    <div key={item.id} className="rounded-xl border border-border p-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-body text-sm font-medium text-foreground">{item.titulo}</p>
                        <Badge variant="outline" className="font-body capitalize">{item.tipo}</Badge>
                      </div>
                      <p className="mt-2 text-xs font-body text-muted-foreground">{formatDateTime(item.data_hora)}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-body uppercase tracking-wide text-muted-foreground">Amanhã</p>
                <div className="space-y-2">
                  {agendaAmanha.length === 0 && <p className="text-sm font-body text-muted-foreground">Nenhum compromisso amanhã.</p>}
                  {agendaAmanha.map((item) => (
                    <div key={item.id} className="rounded-xl border border-border p-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-body text-sm font-medium text-foreground">{item.titulo}</p>
                        <Badge variant="outline" className="font-body capitalize">{item.tipo}</Badge>
                      </div>
                      <p className="mt-2 text-xs font-body text-muted-foreground">{formatDateTime(item.data_hora)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-base">Quais produtos têm clientes ativos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {produtosAtivos.length === 0 && <p className="text-sm font-body text-muted-foreground">Nenhum produto ativo.</p>}
              {produtosAtivos.map((item) => (
                <div key={item.produto} className="flex items-center justify-between rounded-xl border border-border p-4">
                  <div>
                    <p className="font-body text-sm font-medium text-foreground">{item.produto}</p>
                    <p className="text-xs font-body text-muted-foreground">
                      {item.clientes} cliente(s) ativos • {item.operacoes} operação(ões)
                    </p>
                  </div>
                  <Badge variant="outline" className="font-body">{formatCurrency(item.valor)}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-base">Projetos em andamento com atenção</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Operação</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Próxima ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {operacoesCriticas.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-body text-sm font-medium text-foreground">{item.titulo}</p>
                          <p className="text-xs font-body text-muted-foreground">{item.produto}</p>
                        </div>
                      </TableCell>
                      <TableCell>{clientesMap[item.cliente_id]?.nome || "—"}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusBadgeClasses(item.status)} border-0 font-body`}>
                          {CRM_STATUS_LABELS[item.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-body text-sm">{item.proxima_acao || "—"}</p>
                          <p className="text-xs font-body text-muted-foreground">{formatDateTime(item.proxima_acao_data)}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {operacoesCriticas.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center text-sm font-body text-muted-foreground">
                        Nenhuma operação crítica identificada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-base">Fluxo de recebimento a partir dos cards</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vencimentosProximos.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-body text-sm font-medium text-foreground">{item.descricao || "Recebível"}</p>
                          <p className="text-xs font-body text-muted-foreground">{item.evento_gatilho || "manual"}</p>
                        </div>
                      </TableCell>
                      <TableCell>{clientesMap[item.cliente_id]?.nome || "—"}</TableCell>
                      <TableCell>{formatDate(item.data_vencimento)}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusBadgeClasses(item.status)} border-0 font-body`}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(item.valor)}</TableCell>
                    </TableRow>
                  ))}
                  {vencimentosProximos.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-sm font-body text-muted-foreground">
                        Nenhum recebível previsto no momento.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClientLayout>
  );
};

export default AdminDashboard;