import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  type HealthScoreBreakdown,
  getScoreColor,
  getScoreBgColor,
  getScoreLabel,
} from "@/lib/health-score";
import { Activity } from "lucide-react";

interface HealthScoreBadgeProps {
  score: HealthScoreBreakdown;
  size?: "sm" | "md" | "lg";
  showBreakdown?: boolean;
}

const HealthScoreBadge = ({ score, size = "md", showBreakdown = false }: HealthScoreBadgeProps) => {
  const colorClass = getScoreColor(score.classification);
  const bgClass = getScoreBgColor(score.classification);
  const label = getScoreLabel(score.classification);

  const sizeClasses = {
    sm: "h-10 w-10 text-sm",
    md: "h-14 w-14 text-lg",
    lg: "h-20 w-20 text-2xl",
  };

  const badge = (
    <div className={`rounded-full border-2 ${bgClass} ${sizeClasses[size]} flex items-center justify-center font-display font-bold ${colorClass} cursor-help`}>
      {score.total}
    </div>
  );

  if (!showBreakdown) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{badge}</TooltipTrigger>
          <TooltipContent className="font-body text-xs">
            <p className="font-semibold">Saúde Financeira: {label}</p>
            <p>Score: {score.total}/100</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Card className={`border ${bgClass}`}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className={`rounded-full border-2 ${bgClass} h-16 w-16 flex items-center justify-center font-display font-bold text-xl ${colorClass}`}>
            {score.total}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <Activity className={`h-4 w-4 ${colorClass}`} />
              <span className={`text-sm font-display font-bold ${colorClass}`}>Saúde Financeira {label}</span>
            </div>
            <p className="text-xs font-body text-muted-foreground mt-0.5">Score {score.total} de 100</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[score.p1, score.p2, score.p3, score.p4].map((p, idx) => (
            <div key={idx} className="p-2 rounded bg-background/50 text-xs font-body">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground truncate">{p.label}</span>
                <span className="font-bold ml-1">{p.score}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-border mt-1 overflow-hidden">
                <div
                  className={`h-full rounded-full ${p.score >= 70 ? "bg-finance-positive" : p.score >= 40 ? "bg-finance-warning" : "bg-finance-negative"}`}
                  style={{ width: `${p.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="text-[10px] font-body text-muted-foreground text-center">
          Pesos: P1 (40%) • P2 (30%) • P3 (20%) • P4 (10%)
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthScoreBadge;
