import { Link } from "react-router-dom";
import { ArrowRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  to: string;
  available?: boolean;
  badge?: string;
  icon: LucideIcon;
  name: string;
  tagline: string;
  features: string[];
  metrics: string;
  image: string;
  accent?: "gold" | "agro" | "warning";
  delay?: number;
}

const accentMap = {
  gold: { glow: "hover:shadow-[0_8px_40px_-12px_hsl(var(--gold)/0.4)]", icon: "text-gold-dark", border: "hover:border-gold/60" },
  agro: { glow: "hover:shadow-[0_8px_40px_-12px_hsl(146_50%_36%/0.35)]", icon: "text-finance-positive", border: "hover:border-finance-positive/50" },
  warning: { glow: "hover:shadow-[0_8px_40px_-12px_hsl(25_100%_40%/0.35)]", icon: "text-finance-warning", border: "hover:border-finance-warning/50" },
};

export function ProductCard({
  to,
  available = true,
  badge,
  icon: Icon,
  name,
  tagline,
  features,
  metrics,
  image,
  accent = "gold",
  delay = 0,
}: ProductCardProps) {
  const a = accentMap[accent];
  const Wrapper: any = available ? Link : "div";
  const wrapperProps = available ? { to } : {};

  return (
    <Wrapper
      {...wrapperProps}
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        "group relative flex flex-col bg-card border border-border rounded overflow-hidden",
        "transition-all duration-500 animate-fade-up opacity-0",
        available ? cn("cursor-pointer hover:-translate-y-1", a.glow, a.border) : "opacity-70 cursor-default",
      )}
    >
      {/* Imagem hero do card */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,hsl(var(--gold)/0.18),transparent_60%)]" />

        {/* Badge */}
        {badge && (
          <span className="absolute top-3 right-3 badge-gold backdrop-blur">
            {badge}
          </span>
        )}

        {/* Ícone */}
        <div className="absolute bottom-4 left-5">
          <div className={cn("inline-flex items-center justify-center w-12 h-12 rounded bg-linen/95 backdrop-blur-sm shadow-lg", a.icon)}>
            <Icon className="h-6 w-6" strokeWidth={1.6} />
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col p-6">
        <h3 className="font-display text-2xl font-semibold text-navy leading-tight">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{tagline}</p>

        <div className="ornament-line my-5" />

        <ul className="space-y-2 mb-5">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-foreground">
              <span className="mt-1 inline-block w-1 h-1 rounded-full bg-gold shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <p className="text-[11px] uppercase tracking-[0.16em] text-gold-dark font-semibold mb-4">
          {metrics}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/60">
          {available ? (
            <>
              <span className="text-sm font-medium text-navy">Explorar demonstração</span>
              <ArrowRight className="h-5 w-5 text-gold-dark transition-transform group-hover:translate-x-1" />
            </>
          ) : (
            <span className="text-xs text-muted-foreground italic">Em breve</span>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
