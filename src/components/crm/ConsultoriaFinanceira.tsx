import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { CONSULTORIA_STATUSES, getStatusConfig, formatCurrency, type CrmCliente, type CrmPipelineStatus } from "@/lib/crm-constants";

interface ConsultoriaFinanceiraProps {
  clientes: CrmCliente[];
  onStatusChange: (id: string, newStatus: CrmPipelineStatus, oldStatus: CrmPipelineStatus) => void;
  onView: (c: CrmCliente) => void;
}

const ConsultoriaFinanceira = ({ clientes, onStatusChange, onView }: ConsultoriaFinanceiraProps) => {
  const consultoriaClientes = clientes.filter((c) =>
    c.produto === "Consultoria Financeira" || CONSULTORIA_STATUSES.some((s) => s.value === c.status)
  );

  const columns = CONSULTORIA_STATUSES.map((s) => ({
    ...s,
    config: getStatusConfig(s.value),
    items: consultoriaClientes.filter((c) => c.status === s.value),
  }));

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newStatus = result.destination.droppableId as CrmPipelineStatus;
    const cliente = consultoriaClientes.find((c) => c.id === result.draggableId);
    if (!cliente || cliente.status === newStatus) return;
    onStatusChange(cliente.id, newStatus, cliente.status);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-display font-bold">Consultoria Financeira</h2>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 min-h-[400px]">
          {columns.map((col) => (
            <div key={col.value} className="flex-shrink-0 w-72">
              <div className="flex items-center gap-2 mb-3 px-1">
                <span className={`w-3 h-3 rounded-full ${col.config.bg}`} />
                <h3 className="text-sm font-semibold font-body">{col.label}</h3>
                <span className="text-xs text-muted-foreground ml-auto">{col.items.length}</span>
              </div>
              <Droppable droppableId={col.value}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-2 min-h-[300px] p-2 rounded-lg border border-dashed transition-colors ${
                      snapshot.isDraggingOver ? "border-accent bg-accent/5" : "border-border"
                    }`}
                  >
                    {col.items.map((c, index) => (
                      <Draggable key={c.id} draggableId={c.id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 border-border ${snapshot.isDragging ? "shadow-lg" : ""}`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-sm font-medium font-body">{c.nome}</p>
                                {c.valor != null && c.valor > 0 && (
                                  <p className="text-xs text-emerald-600 mt-1">{formatCurrency(c.valor)}</p>
                                )}
                              </div>
                              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onView(c)}>
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default ConsultoriaFinanceira;
