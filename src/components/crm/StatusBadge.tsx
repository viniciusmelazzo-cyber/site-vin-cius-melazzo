import { getStatusConfig, type CrmPipelineStatus } from "@/lib/crm-constants";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: CrmPipelineStatus;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = getStatusConfig(status);
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", config.bg, config.color, className)}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
