import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  highlight?: boolean;
  navy?: boolean;
}

export function SectionCard({
  title,
  subtitle,
  icon,
  actions,
  children,
  className,
  highlight,
  navy,
}: SectionCardProps) {
  return (
    <section
      className={cn(
        navy ? "navy-card" : highlight ? "melazzo-card-highlight" : "melazzo-card",
        "p-6",
        className
      )}
    >
      {(title || actions) && (
        <header className="flex items-start justify-between mb-5 gap-4">
          <div>
            {title && (
              <h2
                className={cn(
                  "font-display text-lg font-semibold flex items-center gap-2",
                  navy ? "text-linen" : "text-navy"
                )}
              >
                {icon && <span className={navy ? "text-gold" : "text-gold-dark"}>{icon}</span>}
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className={cn(
                  "text-xs mt-1",
                  navy ? "text-linen/60" : "text-muted-foreground"
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}
