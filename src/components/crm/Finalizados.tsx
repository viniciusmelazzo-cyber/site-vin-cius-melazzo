import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle2, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDate, type CrmCliente } from "@/lib/crm-constants";

interface FinalizadosProps {
  clientes: CrmCliente[];
  onView: (c: CrmCliente) => void;
}

const Finalizados = ({ clientes, onView }: FinalizadosProps) => {
  const concluidos = clientes.filter((c) => c.status === "concluido");
  const cancelados = clientes.filter((c) => c.status === "cancelado");

  const renderList = (items: CrmCliente[], empty: string) =>
    items.length === 0 ? (
      <p className="text-center text-muted-foreground py-8">{empty}</p>
    ) : (
      <div className="space-y-3">
        {items.map((c) => (
          <Card key={c.id} className="border-border">
            <CardContent className="py-4 flex items-center justify-between">
              <div>
                <p className="font-medium font-body">{c.nome}</p>
                <p className="text-sm text-muted-foreground">
                  {c.produto || "—"} • {formatCurrency(c.valor)} • {formatDate(c.updated_at)}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onView(c)}>
                <Eye className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-display font-bold">Finalizados</h2>
      <Tabs defaultValue="concluidos">
        <TabsList>
          <TabsTrigger value="concluidos" className="gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" /> Concluídos ({concluidos.length})
          </TabsTrigger>
          <TabsTrigger value="cancelados" className="gap-2">
            <XCircle className="h-4 w-4 text-red-600" /> Cancelados ({cancelados.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="concluidos" className="mt-4">
          {renderList(concluidos, "Nenhum cliente concluído.")}
        </TabsContent>
        <TabsContent value="cancelados" className="mt-4">
          {renderList(cancelados, "Nenhum cliente cancelado.")}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finalizados;
