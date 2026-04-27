import { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-8 flex items-end justify-between gap-6 flex-wrap animate-fade-up">
      <div>
        {eyebrow && <p className="section-label mb-2">{eyebrow}</p>}
        <h1 className="font-display text-3xl md:text-4xl text-navy font-semibold leading-tight">
          {title}
        </h1>
        <div className="ornament-line mt-3" />
        {description && (
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
