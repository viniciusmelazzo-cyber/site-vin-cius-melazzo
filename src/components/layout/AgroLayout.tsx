import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AgroSidebar } from "./AgroSidebar";
import { Menu } from "lucide-react";
import { fazenda } from "@/data/mockAgro";
import { BackToShowroom } from "@/components/shared/BackToShowroom";

export function AgroLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-linen-paper">
        <AgroSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center justify-between border-b border-border/60 px-6 shrink-0 bg-background/90 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-muted-foreground hover:text-navy transition-colors">
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              <div className="hidden md:block">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gold-dark font-medium">
                  Showroom · Gestão Agro & Pecuária
                </p>
                <p className="font-display text-sm text-navy font-semibold leading-tight">
                  {fazenda.nome}
                </p>
              </div>
              <span className="hidden md:inline text-border">|</span>
              <p className="hidden md:block text-xs text-muted-foreground">
                {fazenda.segmento} · {fazenda.cidade}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden md:inline text-[10px] uppercase tracking-[0.2em] text-gold-dark font-medium">
                Demo · Sem dados reais
              </span>
              <BackToShowroom />
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6 md:p-8 bg-linen-paper">
            <div className="max-w-[1400px] mx-auto">{children}</div>
          </main>

          <footer className="border-t border-border/60 px-6 py-3 text-center bg-background/60">
            <p className="text-[10px] text-muted-foreground tracking-wider">
              Melazzo Consultoria · Hub Agro & Pecuária ·{" "}
              <span className="text-gold-dark font-medium">Versão Demonstrativa</span>
            </p>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
