import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Download, Share2, Sparkles, X } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useDrillDown, DrillTone } from "@/hooks/use-drill-down";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const toneRing: Record<DrillTone, string> = {
  navy: "from-navy/15 to-transparent",
  gold: "from-gold/20 to-transparent",
  agro: "from-agro/15 to-transparent",
  cobranca: "from-cobranca/15 to-transparent",
  positive: "from-finance-positive/15 to-transparent",
  warning: "from-finance-warning/15 to-transparent",
  negative: "from-finance-negative/15 to-transparent",
};

const toneText: Record<DrillTone, string> = {
  navy: "text-navy",
  gold: "text-gold-dark",
  agro: "text-agro",
  cobranca: "text-cobranca",
  positive: "text-positive",
  warning: "text-warning",
  negative: "text-negative",
};

function buildCsv(columns: { key: string; label: string }[], rows: Record<string, unknown>[]) {
  const header = columns.map((c) => `"${c.label.replace(/"/g, '""')}"`).join(",");
  const body = rows
    .map((r) =>
      columns
        .map((c) => {
          const v = r[c.key];
          if (v === null || v === undefined) return "";
          const s = typeof v === "number" ? String(v) : String(v).replace(/"/g, '""');
          return `"${s}"`;
        })
        .join(","),
    )
    .join("\n");
  return `${header}\n${body}`;
}

export function DrillDownSheet() {
  const { open, payload, closeDrill } = useDrillDown();
  const { pathname } = useLocation();

  const tone: DrillTone = payload?.tone ?? "navy";
  const showFullPageBtn =
    !!payload?.fullPageHref && payload.fullPageHref !== pathname;

  const handleExport = () => {
    if (!payload?.columns?.length || !payload?.rows?.length) {
      toast({ title: "Nada para exportar", description: "Sem linhas analíticas neste recorte." });
      return;
    }
    const csv = buildCsv(
      payload.columns.map((c) => ({ key: String(c.key), label: c.label })),
      payload.rows as Record<string, unknown>[],
    );
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${payload.exportFilename ?? "drill"}-melazzo.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Exportado", description: "Arquivo CSV gerado com sucesso." });
  };

  const handleShare = () => {
    toast({
      title: "Link copiado (demo)",
      description: "Em produção, gera um link assinado para esta visão.",
    });
  };

  // Pre-format cells once
  const renderedRows = useMemo(() => {
    if (!payload?.rows || !payload?.columns) return [];
    return payload.rows.map((row, i) => ({
      _i: i,
      cells: payload.columns!.map((col) => {
        const raw = (row as Record<string, unknown>)[col.key as string];
        const node = col.format ? col.format(raw, row as never) : (raw as React.ReactNode);
        return { node, align: col.align ?? "left", className: col.className };
      }),
    }));
  }, [payload]);

  return (
    <Sheet open={open} onOpenChange={(o) => !o && closeDrill()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl lg:max-w-3xl p-0 flex flex-col bg-linen border-l-2 border-l-gold/40"
        // Hide default close (we render our own)
      >
        {/* Decorative gradient header */}
        <div
          className={cn(
            "relative px-6 pt-6 pb-5 bg-gradient-to-br border-b border-border/60",
            toneRing[tone],
          )}
        >
          <button
            onClick={closeDrill}
            aria-label="Fechar"
            className="absolute top-4 right-4 h-8 w-8 rounded-full grid place-items-center bg-linen/60 hover:bg-linen text-navy transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {payload?.eyebrow && (
            <p className={cn("text-[10px] uppercase tracking-[0.22em] font-semibold", toneText[tone])}>
              {payload.eyebrow}
            </p>
          )}
          <h2 className="font-display text-2xl text-navy font-semibold mt-1 leading-tight pr-10">
            {payload?.title ?? "Análise detalhada"}
          </h2>
          {payload?.subtitle && (
            <p className="text-sm text-muted-foreground mt-1.5">{payload.subtitle}</p>
          )}

          {payload?.kpis && payload.kpis.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
              {payload.kpis.map((k) => (
                <div
                  key={k.label}
                  className="rounded-md bg-linen/70 border border-border/50 px-3 py-2"
                >
                  <p className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground font-medium">
                    {k.label}
                  </p>
                  <p className="font-display text-base font-bold text-navy tabular mt-0.5">
                    {k.value}
                  </p>
                  {k.hint && (
                    <p className="text-[10px] text-muted-foreground mt-0.5">{k.hint}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {payload?.narrative && (
            <div className="flex gap-3 rounded-md border border-gold/30 bg-gold/5 p-3">
              <Sparkles className="h-4 w-4 text-gold-dark shrink-0 mt-0.5" />
              <div>
                <p className="text-[9px] uppercase tracking-[0.18em] text-gold-dark font-semibold">
                  Leitura Melazzo IA
                </p>
                <p className="text-sm text-foreground/80 mt-1 leading-relaxed">
                  {payload.narrative}
                </p>
              </div>
            </div>
          )}

          {payload?.renderExtra?.()}

          {payload?.columns && payload?.rows && payload.rows.length > 0 ? (
            <div className="rounded-md border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50">
                    <tr>
                      {payload.columns.map((col) => (
                        <th
                          key={String(col.key)}
                          className={cn(
                            "text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-semibold px-3 py-2.5",
                            col.align === "right" && "text-right",
                            col.align === "center" && "text-center",
                            (!col.align || col.align === "left") && "text-left",
                          )}
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {renderedRows.map((r) => (
                      <tr
                        key={r._i}
                        className="border-t border-border/60 hover:bg-secondary/30 transition-colors animate-fade-in"
                        style={{ animationDelay: `${Math.min(r._i, 12) * 25}ms`, animationFillMode: "both" }}
                      >
                        {r.cells.map((c, ci) => (
                          <td
                            key={ci}
                            className={cn(
                              "px-3 py-2.5 text-navy/90",
                              c.align === "right" && "text-right tabular",
                              c.align === "center" && "text-center",
                              c.className,
                            )}
                          >
                            {c.node as React.ReactNode}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : payload?.columns ? (
            <div className="rounded-md border border-dashed border-border p-8 text-center">
              <p className="text-sm text-muted-foreground">
                {payload.emptyMessage ?? "Sem registros para este recorte."}
              </p>
            </div>
          ) : null}

          {payload?.footerNote && (
            <p className="text-[11px] text-muted-foreground italic">{payload.footerNote}</p>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border/60 px-6 py-3 flex flex-wrap items-center gap-2 bg-secondary/30">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExport}
            className="text-xs text-navy hover:text-gold-dark"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Exportar CSV
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-xs text-navy hover:text-gold-dark"
          >
            <Share2 className="h-3.5 w-3.5 mr-1.5" />
            Compartilhar
          </Button>
          <div className="flex-1" />
          {showFullPageBtn && (
            <Button
              asChild
              size="sm"
              className="bg-navy text-linen hover:bg-navy-medium text-xs"
              onClick={closeDrill}
            >
              <Link to={payload!.fullPageHref!}>
                Abrir página completa
                <ArrowUpRight className="h-3.5 w-3.5 ml-1.5" />
              </Link>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
