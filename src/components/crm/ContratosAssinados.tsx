import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { formatCurrency, formatDate, type CrmCliente } from "@/lib/crm-constants";

interface ContratosAssinadosProps {
  clientes: CrmCliente[];
  onView: (c: CrmCliente) => void;
}

const ContratosAssinados = ({ clientes, onView }: ContratosAssinadosProps) => {
  const contratos = clientes.filter((c) => c.status === "contrato_assinado");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-bold">Contratos Assinados</h2>
        <span className="text-sm text-muted-foreground">{contratos.length} contrato(s)</span>
      </div>

      {contratos.length === 0 ? (
        <Card className="border-border">
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhum contrato assinado até o momento.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contratos.map((c) => (
            <Card key={c.id} className="border-border hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-display">{c.nome}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Produto</span>
                  <span className="font-medium">{c.produto || "—"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Valor</span>
                  <span className="font-semibold text-emerald-600">{formatCurrency(c.valor)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Banco</span>
                  <span>{c.banco || "—"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Entrada</span>
                  <span>{formatDate(c.data_entrada)}</span>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => onView(c)}>
                  <Eye className="h-4 w-4 mr-2" /> Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContratosAssinados;
