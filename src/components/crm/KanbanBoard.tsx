import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { KANBAN_STATUSES, getStatusConfig, formatCurrency, type CrmCliente, type CrmPipelineStatus } from "@/lib/crm-constants";

interface KanbanBoardProps {
  clientes: CrmCliente[];
  onStatusChange: (id: string, newStatus: CrmPipelineStatus, oldStatus: CrmPipelineStatus) => void;
  onView: (c: CrmCliente) => void;
}

const KanbanBoard = ({ clientes, onStatusChange, onView }: KanbanBoardProps) => {
  const columns = KANBAN_STATUSES.map((status) => ({
    status,
    config: getStatusConfig(status),
    items: clientes.filter((c) => c.status === status),
  }));

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as CrmPipelineStatus;
    const cliente = clientes.find((c) => c.id === draggableId);
    if (!cliente || cliente.status === newStatus) return;
    onStatusChange(cliente.id, newStatus, cliente.status);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[500px]">
        {columns.map((col) => (
          <div key={col.status} className="flex-shrink-0 w-72">
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className={`w-3 h-3 rounded-full ${col.config.bg}`} />
              <h3 className="text-sm font-semibold font-body">{col.config.label}</h3>
              <span className="text-xs text-muted-foreground ml-auto">{col.items.length}</span>
            </div>
            <Droppable droppableId={col.status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-2 min-h-[400px] p-2 rounded-lg border border-dashed transition-colors ${
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
                          className={`p-3 border-border transition-shadow ${
                            snapshot.isDragging ? "shadow-lg" : ""
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <p className="text-sm font-medium font-body leading-tight">{c.nome}</p>
                              <Button variant="ghost" size="icon" className="h-6 w-6 -mr-1 -mt-1" onClick={() => onView(c)}>
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                            {c.produto && <p className="text-xs text-muted-foreground">{c.produto}</p>}
                            {c.valor != null && c.valor > 0 && (
                              <p className="text-xs font-semibold text-emerald-600">{formatCurrency(c.valor)}</p>
                            )}
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
  );
};

export default KanbanBoard;
