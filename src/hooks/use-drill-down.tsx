import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from "react";

export type DrillKpi = {
  label: string;
  value: string;
  hint?: string;
};

export type DrillColumn<Row = Record<string, unknown>> = {
  key: keyof Row | string;
  label: string;
  align?: "left" | "right" | "center";
  format?: (value: unknown, row: Row) => ReactNode;
  className?: string;
};

export type DrillTone = "navy" | "gold" | "agro" | "cobranca" | "positive" | "warning" | "negative";

export type DrillPayload<Row = Record<string, unknown>> = {
  /** Eyebrow label (e.g. "Análise detalhada · Cobrança") */
  eyebrow?: string;
  /** Main title shown in the sheet header */
  title: string;
  /** Optional subtitle / description */
  subtitle?: string;
  /** Color tone for accents */
  tone?: DrillTone;
  /** Mini KPIs at the top of the sheet */
  kpis?: DrillKpi[];
  /** Optional intro narrative (Melazzo IA voice) */
  narrative?: string;
  /** Table columns */
  columns?: DrillColumn<Row>[];
  /** Table rows */
  rows?: Row[];
  /** Optional empty state message */
  emptyMessage?: string;
  /** Optional href to the full analytical page */
  fullPageHref?: string;
  /** Optional CSV export filename (without extension) — auto-builds from rows/columns */
  exportFilename?: string;
  /** Optional custom render slot inside the sheet body (between KPIs and table) */
  renderExtra?: () => ReactNode;
  /** Footer note (e.g. "Última atualização: ..." ) */
  footerNote?: string;
};

type DrillCtx = {
  open: boolean;
  payload: DrillPayload | null;
  openDrill: <R extends Record<string, unknown> = Record<string, unknown>>(p: DrillPayload<R>) => void;
  closeDrill: () => void;
};

const Ctx = createContext<DrillCtx | null>(null);

export function DrillDownProvider({ children }: { children: ReactNode }) {
  const [payload, setPayload] = useState<DrillPayload | null>(null);
  const [open, setOpen] = useState(false);

  const openDrill = useCallback(<R extends Record<string, unknown>>(p: DrillPayload<R>) => {
    setPayload(p as unknown as DrillPayload);
    setOpen(true);
  }, []);

  const closeDrill = useCallback(() => {
    setOpen(false);
  }, []);

  const value = useMemo<DrillCtx>(
    () => ({ open, payload, openDrill, closeDrill }),
    [open, payload, openDrill, closeDrill],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDrillDown() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    // Fail silent in dev: return a noop so cards still render outside provider.
    return {
      open: false,
      payload: null,
      openDrill: () => {
        if (typeof console !== "undefined") {
          console.warn("[useDrillDown] called outside <DrillDownProvider>");
        }
      },
      closeDrill: () => {},
    } as DrillCtx;
  }
  return ctx;
}
