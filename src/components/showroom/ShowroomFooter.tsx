import { forwardRef } from "react";
import logoMelazzo from "@/assets/logo-melazzo-mark.webp";

export const ShowroomFooter = forwardRef<HTMLElement>(function ShowroomFooter(_, ref) {
  return (
    <footer ref={ref} className="bg-navy text-linen/80 px-6 py-10 border-t border-gold/20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src={logoMelazzo} alt="Melazzo" className="h-8 w-8 rounded ring-1 ring-gold/30" />
          <div>
            <p className="font-display text-sm font-semibold text-linen">Melazzo Consultoria</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold">
              Gestão Financeira Estratégica
            </p>
          </div>
        </div>

        <p className="text-[11px] text-linen/50 tracking-wider text-center">
          © {new Date().getFullYear()} Melazzo Consultoria · Plataforma demonstrativa com dados fictícios
        </p>
      </div>
    </footer>
  );
});
