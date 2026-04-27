import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackToShowroomProps {
  className?: string;
  variant?: "default" | "subtle";
}

export function BackToShowroom({ className, variant = "default" }: BackToShowroomProps) {
  if (variant === "subtle") {
    return (
      <Link
        to="/restrito/demonstracoes"
        className={cn(
          "inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-navy transition-colors group",
          className
        )}
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        Voltar ao Showroom
      </Link>
    );
  }

  return (
    <Link
      to="/restrito/demonstracoes"
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded border border-border bg-card hover:border-gold/50 hover:text-navy transition-all text-xs font-medium text-muted-foreground group",
        className
      )}
    >
      <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 text-gold-dark" />
      Showroom
    </Link>
  );
}
