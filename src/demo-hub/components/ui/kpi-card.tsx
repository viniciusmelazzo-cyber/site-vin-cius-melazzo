import { ReactNode, KeyboardEvent } from "react";
import { TrendingUp, TrendingDown, Minus, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  delta?: number; // % vs anterior
  inverse?: boolean; // se true, queda é bom (ex: dívida)
  icon?: ReactNode;
  highlight?: boolean;
  /** When provided, the card becomes interactive and opens drill-down */
  onClick?: () => void;
  /** CTA microcopy at the bottom (default: "Ver detalhes") */
  drillLabel?: string;
}

export function KpiCard({
  label,
  value,
  delta,
  inverse,
  icon,
  highlight,
  onClick,
  drillLabel = "Ver detalhes",
}: KpiCardProps) {
  const positive = delta !== undefined && (inverse ? delta < 0 : delta > 0);
  const negative = delta !== undefined && (inverse ? delta > 0 : delta < 0);

  const interactive = !!onClick;

  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKey}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? `Ver detalhes de ${label}` : undefined}
      className={cn(
        "p-5 group relative",
        highlight ? "melazzo-card-highlight" : "melazzo-card",
        interactive &&
          "cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="kpi-label">{label}</p>
        {icon && <div className="text-gold-dark opacity-70">{icon}</div>}
      </div>
      <p className="kpi-value">{value}</p>
      {delta !== undefined && (
        <div className="mt-3 flex items-center gap-1.5">
          {positive && <TrendingUp className="h-3.5 w-3.5 text-positive" />}
          {negative && <TrendingDown className="h-3.5 w-3.5 text-negative" />}
          {delta === 0 && <Minus className="h-3.5 w-3.5 text-muted-foreground" />}
          <span
            className={cn(
              "text-xs font-medium tabular",
              positive && "text-positive",
              negative && "text-negative",
              delta === 0 && "text-muted-foreground"
            )}
          >
            {delta > 0 ? "+" : ""}
            {delta.toFixed(1)}%
          </span>
          <span className="text-[10px] text-muted-foreground">vs mês anterior</span>
        </div>
      )}
      {interactive && (
        <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.16em] text-gold-dark font-semibold opacity-70 group-hover:opacity-100 transition-opacity">
            {drillLabel}
          </span>
          <ChevronRight className="h-3.5 w-3.5 text-gold-dark opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </div>
      )}
    </div>
  );
}
