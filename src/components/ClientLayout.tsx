import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, Users, FileText, Settings, LogOut, Menu, X, PlusCircle, Upload, Landmark, Wallet, BookOpen, Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logoVM from "@/assets/logo-vm.webp";

interface ClientLayoutProps {
  children: React.ReactNode;
  role?: "client" | "admin";
}

const clientLinks = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/cliente/dashboard" },
  { label: "Lançamentos", icon: PlusCircle, href: "/cliente/lancamentos" },
  { label: "Patrimônio", icon: Landmark, href: "/cliente/patrimonio" },
  { label: "Orçamento", icon: Wallet, href: "/cliente/orcamento" },
  { label: "Documentos", icon: Upload, href: "/cliente/documentos" },
  { label: "Guia de Uso", icon: BookOpen, href: "/cliente/guia" },
  { label: "Configurações", icon: Settings, href: "/cliente/configuracoes" },
];

const adminLinks = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/cliente/admin" },
  { label: "Clientes", icon: Users, href: "/cliente/admin", tab: "clientes" },
  { label: "CRM Crédito", icon: Briefcase, href: "/cliente/admin/crm" },
  { label: "Convites", icon: FileText, href: "/cliente/admin", tab: "convites" },
  { label: "Configurações", icon: Settings, href: "/cliente/admin", tab: "configuracoes" },
];

const ClientLayout = ({ children, role = "client" }: ClientLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, profile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const links = role === "admin" ? adminLinks : clientLinks;

  const handleLogout = async () => {
    await signOut();
    navigate("/cliente/login");
  };

  const initials = (profile?.full_name || "U").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-gradient-navy flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoVM} alt="" className="w-7 h-7 object-contain" />
            <div>
              <h1 className="text-lg font-display font-bold text-primary-foreground">Melazzo</h1>
              <p className="text-primary-foreground/40 text-[10px] tracking-widest uppercase font-body">
                {role === "admin" ? "Painel do Consultor" : "Gestão Financeira"}
              </p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-primary-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-4">
          {links.map((link) => {
            const isActive = location.pathname === link.href ||
              (link.href !== "/cliente/admin" && location.pathname.startsWith(link.href));
            return (
              <button
                key={link.label}
                onClick={() => { navigate(link.href); setSidebarOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-body transition-colors",
                  isActive
                    ? "bg-accent/20 text-gold"
                    : "text-primary-foreground/60 hover:bg-primary-foreground/5 hover:text-primary-foreground"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </button>
            );
          })}
        </nav>

        <div className="p-3 space-y-1">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-body text-primary-foreground/40 hover:text-primary-foreground hover:bg-primary-foreground/5 transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            Voltar ao Site
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-body text-primary-foreground/40 hover:text-primary-foreground hover:bg-primary-foreground/5 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <span className="text-sm font-body text-muted-foreground hidden sm:block">
              {profile?.full_name || ""} <span className="text-xs">({role === "admin" ? "Consultor" : "Cliente"})</span>
            </span>
            <div className="h-8 w-8 rounded-full bg-gradient-gold flex items-center justify-center">
              <span className="text-primary text-xs font-bold font-body">{initials}</span>
            </div>
          </div>
        </header>
        <div className="flex-1 p-6 lg:p-8 overflow-auto bg-linen-texture">{children}</div>
      </main>
    </div>
  );
};

export default ClientLayout;
