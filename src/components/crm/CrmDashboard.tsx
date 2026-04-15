import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, FileCheck } from "lucide-react";
import { formatCurrency, PIPELINE_STATUSES, getStatusConfig, type CrmCliente } from "@/lib/crm-constants";

interface CrmDashboardProps {
  clientes: CrmCliente[];
}

const CrmDashboard = ({ clientes }: CrmDashboardProps) => {
  const stats = useMemo(() => {
    const total = clientes.length;
    const valorTotal = clientes.reduce((sum, c) => sum + (c.valor || 0), 0);
    const emAndamento = clientes.filter(c => !['concluido', 'cancelado'].includes(c.status)).length;
    const contratosAssinados = clientes.filter(c => c.status === 'contrato_assinado').length;

    const byStatus = PIPELINE_STATUSES.map(s => ({
      ...s,
      count: clientes.filter(c => c.status === s.value).length,
      valor: clientes.filter(c => c.status === s.value).reduce((sum, c) => sum + (c.valor || 0), 0),
    }));

    const byProduto = clientes.reduce((acc, c) => {
      const prod = c.produto || 'Não definido';
      if (!acc[prod]) acc[prod] = { count: 0, valor: 0 };
      acc[prod].count++;
      acc[prod].valor += c.valor || 0;
      return acc;
    }, {} as Record<string, { count: number; valor: number }>);

    return { total, valorTotal, emAndamento, contratosAssinados, byStatus, byProduto };
  }, [clientes]);

  const cards = [
    { title: "Total de Clientes", value: stats.total, icon: Users, color: "text-blue-600" },
    { title: "Valor Total", value: formatCurrency(stats.valorTotal), icon: DollarSign, color: "text-emerald-600" },
    { title: "Em Andamento", value: stats.emAndamento, icon: TrendingUp, color: "text-amber-600" },
    { title: "Contratos Assinados", value: stats.contratosAssinados, icon: FileCheck, color: "text-teal-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.title} className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-body">{card.title}</p>
                  <p className="text-2xl font-bold font-display mt-1">{card.value}</p>
                </div>
                <card.icon className={`h-8 w-8 ${card.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline by Status */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base font-display">Pipeline por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.byStatus.filter(s => s.count > 0).map((s) => {
                const cfg = getStatusConfig(s.value);
                return (
                  <div key={s.value} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block w-3 h-3 rounded-full ${cfg.bg}`} />
                      <span className="text-sm font-body">{s.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold">{s.count}</span>
                      <span className="text-xs text-muted-foreground ml-2">{formatCurrency(s.valor)}</span>
                    </div>
                  </div>
                );
              })}
              {stats.byStatus.every(s => s.count === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhum cliente cadastrado</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* By Produto */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base font-display">Por Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.byProduto).map(([prod, data]) => (
                <div key={prod} className="flex items-center justify-between">
                  <span className="text-sm font-body">{prod}</span>
                  <div className="text-right">
                    <span className="text-sm font-semibold">{data.count}</span>
                    <span className="text-xs text-muted-foreground ml-2">{formatCurrency(data.valor)}</span>
                  </div>
                </div>
              ))}
              {Object.keys(stats.byProduto).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhum produto registrado</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrmDashboard;
