import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STEP_LABELS = [
  "Dados Pessoais",
  "Renda",
  "Moradia",
  "Despesas",
  "Patrimônio",
  "Perfil Específico",
];

interface OnboardingProgressProps {
  currentStep: number; // 0-based, 0=welcome, 1-6=steps, 7=summary
}

const OnboardingProgress = ({ currentStep }: OnboardingProgressProps) => {
  // Map internal step to visual step (0=welcome doesn't count, 7=summary)
  const activeStep = currentStep - 1; // -1=welcome, 0-5=steps, 6=summary

  return (
    <div className="w-full px-2">
      {/* Mobile: compact */}
      <div className="flex items-center justify-between md:hidden mb-2">
        <span className="text-xs font-body text-muted-foreground">
          {activeStep >= 0 && activeStep < 6
            ? `Etapa ${activeStep + 1} de 6 — ${STEP_LABELS[activeStep]}`
            : activeStep >= 6
            ? "Resumo Final"
            : "Bem-vindo"}
        </span>
        <span className="text-xs font-body font-semibold text-accent">
          {Math.min(Math.max(Math.round(((activeStep + 1) / 6) * 100), 0), 100)}%
        </span>
      </div>
      <div className="md:hidden w-full bg-secondary rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent to-gold-light rounded-full transition-all duration-500"
          style={{ width: `${Math.min(Math.max(((activeStep + 1) / 6) * 100, 0), 100)}%` }}
        />
      </div>

      {/* Desktop: step indicators */}
      <div className="hidden md:flex items-center justify-between gap-1">
        {STEP_LABELS.map((label, i) => {
          const isDone = activeStep > i;
          const isCurrent = activeStep === i;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="flex items-center w-full">
                {i > 0 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 transition-colors duration-300",
                      isDone || isCurrent ? "bg-accent" : "bg-secondary"
                    )}
                  />
                )}
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-body font-semibold transition-all duration-300 shrink-0",
                    isDone
                      ? "bg-accent text-primary-foreground"
                      : isCurrent
                      ? "bg-primary text-primary-foreground ring-2 ring-accent ring-offset-2 ring-offset-background"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {isDone ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 transition-colors duration-300",
                      isDone ? "bg-accent" : "bg-secondary"
                    )}
                  />
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-body text-center leading-tight",
                  isCurrent ? "text-accent font-semibold" : isDone ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OnboardingProgress;
