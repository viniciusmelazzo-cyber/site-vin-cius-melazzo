import { forwardRef, ReactNode, KeyboardEvent } from "react";
import { Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClickableCardProps {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  /** Hide the corner Maximize2 icon (useful when card has its own action visuals) */
  hideHint?: boolean;
  /** Disable the affordance entirely (still renders children) */
  disabled?: boolean;
}

/**
 * Wraps any card content with a consistent "clickable / drill-down" affordance.
 * Adds: cursor pointer, hover lift, focus ring, keyboard support, corner Maximize2 hint.
 */
export const ClickableCard = forwardRef<HTMLDivElement, ClickableCardProps>(
  ({ onClick, children, className, ariaLabel, hideHint, disabled }, ref) => {
    if (!onClick || disabled) {
      return (
        <div ref={ref} className={className}>
          {children}
        </div>
      );
    }

    const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    };

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel ?? "Abrir detalhamento"}
        onClick={onClick}
        onKeyDown={handleKey}
        className={cn(
          "relative cursor-pointer transition-all duration-200",
          "hover:-translate-y-0.5 hover:shadow-lg",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg",
          "group/clickable",
          className,
        )}
      >
        {!hideHint && (
          <div
            aria-hidden
            className="absolute top-2 right-2 z-10 h-6 w-6 rounded-full grid place-items-center bg-gold/10 text-gold-dark opacity-0 group-hover/clickable:opacity-100 group-focus-visible/clickable:opacity-100 transition-opacity pointer-events-none"
          >
            <Maximize2 className="h-3 w-3" />
          </div>
        )}
        {children}
      </div>
    );
  },
);
ClickableCard.displayName = "ClickableCard";
