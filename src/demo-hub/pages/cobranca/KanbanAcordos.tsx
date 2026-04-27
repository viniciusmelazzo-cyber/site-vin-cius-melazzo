import { PageHeader } from "@/components/ui/page-header";
import { kanbanAcordos, fmtK } from "@/data/mockCobranca";
import { Plus, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const colunaConfig: Record<string, { color: string; bar: string }> = {
  "Triagem": { color: "text-finance-neutral", bar: "bg-finance-neutral" },
  "Negociação": { color: "text-gold-dark", bar: "bg-gold" },
  "Proposta enviada": { color: "text-cobranca", bar: "bg-cobranca" },
  "Acordo fechado": { color: "text-finance-positive", bar: "bg-finance-positive" },
};

export default function KanbanAcordos() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Operação"
        title="Kanban de Acordos"
        description="Pipeline visual da negociação · da triagem à formalização do acordo."
        actions={
          <Button size="sm" className="text-xs bg-cobranca hover:bg-cobranca/90 text-white">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Novo acordo
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {Object.entries(kanbanAcordos).map(([coluna, cards]) => {
          const cfg = colunaConfig[coluna];
          const total = cards.reduce((s, c) => s + c.valor, 0);
          return (
            <div key={coluna} className="bg-card border border-border rounded p-3 flex flex-col min-h-[500px]">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className={cn("w-1 h-5 rounded-sm", cfg.bar)} />
                  <h3 className={cn("font-display font-semibold text-sm", cfg.color)}>{coluna}</h3>
                  <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                    {cards.length}
                  </span>
                </div>
                <span className="text-[10px] tabular text-muted-foreground font-medium">{fmtK(total)}</span>
              </div>

              <div className="space-y-2 flex-1">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className="group bg-background border border-border rounded p-3 hover:border-cobranca/40 hover:shadow-sm transition-all cursor-grab"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-mono text-[10px] text-muted-foreground">{card.id}</span>
                      <GripVertical className="h-3 w-3 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <p className="text-sm font-medium text-navy leading-tight mb-2">{card.cliente}</p>

                    <p className="font-display text-lg font-semibold text-navy tabular">{fmtK(card.valor)}</p>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-navy text-linen text-[9px] font-semibold flex items-center justify-center">
                          {card.operador}
                        </div>
                        {card.atraso > 0 && (
                          <span className="text-[10px] text-cobranca font-medium">{card.atraso}d</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <div className="w-12 h-1 rounded-full bg-secondary overflow-hidden">
                          <div
                            className={cn(
                              "h-full",
                              card.prob >= 80 ? "bg-finance-positive" :
                              card.prob >= 60 ? "bg-gold" : "bg-cobranca"
                            )}
                            style={{ width: `${card.prob}%` }}
                          />
                        </div>
                        <span className="text-[10px] tabular text-muted-foreground font-medium">{card.prob}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
