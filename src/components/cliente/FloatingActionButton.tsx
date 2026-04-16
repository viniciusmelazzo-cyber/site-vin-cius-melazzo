import { PlusCircle, Camera, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import ReceiptCaptureDialog from "./ReceiptCaptureDialog";
import QuickEntryDialog from "./QuickEntryDialog";

/**
 * Floating Action Button visible on every client page.
 * Mobile-first: bottom-right, thumb-reachable. Expands to show quick actions.
 */
const FloatingActionButton = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [photoOpen, setPhotoOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 print:hidden">
        {/* Expanded actions */}
        <div
          className={cn(
            "flex flex-col items-end gap-2 transition-all duration-200",
            open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none",
          )}
        >
          <button
            onClick={() => { setOpen(false); setQuickOpen(true); }}
            className="flex items-center gap-2 rounded-full bg-card border border-border shadow-lg px-4 py-2.5 text-sm font-body font-medium hover:bg-secondary"
          >
            <Sparkles className="h-4 w-4 text-accent" />
            Lançamento por IA
          </button>
          <button
            onClick={() => { setOpen(false); setPhotoOpen(true); }}
            className="flex items-center gap-2 rounded-full bg-card border border-border shadow-lg px-4 py-2.5 text-sm font-body font-medium hover:bg-secondary"
          >
            <Camera className="h-4 w-4 text-accent" />
            Foto do recibo
          </button>
          <button
            onClick={() => { setOpen(false); navigate("/cliente/lancamentos"); }}
            className="flex items-center gap-2 rounded-full bg-card border border-border shadow-lg px-4 py-2.5 text-sm font-body font-medium hover:bg-secondary"
          >
            <PlusCircle className="h-4 w-4 text-accent" />
            Lançamento manual
          </button>
        </div>

        {/* Main FAB */}
        <button
          onClick={() => setOpen((p) => !p)}
          className={cn(
            "h-14 w-14 rounded-full bg-gradient-gold text-primary shadow-xl flex items-center justify-center transition-transform",
            open && "rotate-45",
          )}
          aria-label="Lançamento rápido"
        >
          {open ? <X className="h-6 w-6" /> : <PlusCircle className="h-6 w-6" />}
        </button>
      </div>

      <ReceiptCaptureDialog open={photoOpen} onOpenChange={setPhotoOpen} />
      <QuickEntryDialog open={quickOpen} onOpenChange={setQuickOpen} />
    </>
  );
};

export default FloatingActionButton;
