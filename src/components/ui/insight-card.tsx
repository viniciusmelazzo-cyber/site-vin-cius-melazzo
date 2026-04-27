import { ReactNode } from "react";
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type InsightTone = "positive" | "warning" | "critical" | "neutral";

interface InsightCardProps {
  tone?: InsightTone;
  badge?: string;
  title: string;
  description: string;
  metric?: string;
  metricLabel?: string;
  cta?: string;
  onClick?: () => void;
  icon?: ReactNode;
  className?: string;
}

const toneConfig: Record<InsightTone, { icon: ReactNode; color: string; border: string }> = {
  positive: {
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: "text-positive",
    border: "border-l-finance-positive",
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4" />,
    color: "text-warning",
    border: "border-l-finance-warning",
  },
  critical: {
    icon: <AlertTriangle className="h-4 w-4" />,
    color: "text-negative",
    border: "border-l-finance-negative",
  },
  neutral: {
    icon: <TrendingUp className="h-4 w-4" />,
    color: "text-gold-dark",
    border: "border-l-gold",
  },
};

/**
 * Insight card for "Melazzo IA" branded recommendations.
 * Used across all products to surface contextual narratives.
 */
export function InsightCard({
  tone = "neutral",
  badge = "Insight Melazzo IA",
  title,
  description,
  metric,
  metricLabel,
  cta,
  onClick,
  icon,
  className,
}: InsightCardProps) {
  const c = toneConfig[tone];

  const interactive = !!onClick;
  const handleKey = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!onClick) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <article
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? onClick : undefined}
      onKeyDown={interactive ? handleKey : undefined}
      aria-label={interactive ? `${title} · ver evidências` : undefined}
      className={cn(
        "melazzo-card p-5 border-l-4 transition-all hover:shadow-lg group",
        c.border,
        interactive &&
          "cursor-pointer hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    >
      <div className="flex items-start gap-3 mb-2">
        <div className={cn("p-1.5 rounded bg-gold/10", c.color)}>
          {icon || <Sparkles className="h-4 w-4 text-gold-dark" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[9px] uppercase tracking-[0.18em] text-gold-dark font-semibold">
              {badge}
            </span>
            <span className={cn("flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider", c.color)}>
              {c.icon}
            </span>
          </div>
          <h3 className="font-display text-base font-semibold text-navy leading-tight mt-1">
            {title}
          </h3>
        </div>
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed pl-9">{description}</p>
      {(metric || cta) && (
        <div className="mt-3 pt-3 pl-9 border-t border-border/50 flex items-center justify-between gap-3">
          {metric && (
            <div>
              {metricLabel && (
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {metricLabel}
                </p>
              )}
              <p className={cn("font-display text-lg font-bold tabular", c.color)}>{metric}</p>
            </div>
          )}
          {(cta || interactive) && (
            <span
              className="ml-auto flex items-center gap-1.5 text-xs font-medium text-navy group-hover:text-gold-dark transition-colors"
            >
              {cta ?? "Ver evidências"}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          )}
        </div>
      )}
      {interactive && !metric && !cta && (
        <div className="mt-3 pt-3 pl-9 border-t border-border/50 flex items-center justify-end">
          <span className="flex items-center gap-1.5 text-xs font-medium text-navy group-hover:text-gold-dark transition-colors">
            Ver evidências
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      )}
    </article>
  );
}
