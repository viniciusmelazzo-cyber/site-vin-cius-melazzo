import {
  LayoutDashboard, Landmark, TrendingDown, Wallet, Sprout,
  Beef, LineChart, ShieldAlert, Calendar, FileText,
  ChevronRight, ArrowLeft, LucideIcon, Calculator, Users, MapPin, Banknote,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Sidebar, SidebarContent, SidebarMenu,
  SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import logoMelazzo from "@/assets/logo-melazzo-mark.webp";

interface SubItem { title: string; url: string; icon: LucideIcon; }
interface NavSection {
  title: string; icon: LucideIcon; url?: string;
  children?: SubItem[]; prefix?: string;
}

const BASE = "/restrito/demonstracoes/agro";

const navStructure: NavSection[] = [
  { title: "Visão Executiva", icon: LayoutDashboard, url: `${BASE}/visao-executiva` },
  {
    title: "Patrimônio & Crédito",
    icon: Landmark,
    prefix: `${BASE}/patrimonio-credito`,
    children: [
      { title: "Lastro Patrimonial", url: `${BASE}/lastro-patrimonial`, icon: Landmark },
      { title: "Fazendas", url: `${BASE}/fazendas`, icon: MapPin },
      { title: "Endividamento", url: `${BASE}/endividamento`, icon: TrendingDown },
      { title: "Capacidade de Pagamento", url: `${BASE}/capacidade-pagamento`, icon: Wallet },
      { title: "Estrutura Societária", url: `${BASE}/estrutura-societaria`, icon: Users },
    ],
  },
  {
    title: "Operação Agro",
    icon: Sprout,
    prefix: `${BASE}/operacao`,
    children: [
      { title: "Custeio de Safra", url: `${BASE}/custeio-safra`, icon: Sprout },
      { title: "Pecuária", url: `${BASE}/pecuaria`, icon: Beef },
      { title: "Central Financeira PJ", url: `${BASE}/central-financeira`, icon: Banknote },
      { title: "Simulador de Engorda", url: `${BASE}/simulador-engorda`, icon: Calculator },
    ],
  },
  { title: "Mercado & Cotações", icon: LineChart, url: `${BASE}/mercado-cotacoes` },
  { title: "Risco de Crédito", icon: ShieldAlert, url: `${BASE}/risco-credito` },
  { title: "Fluxo Projetado", icon: Calendar, url: `${BASE}/fluxo-projetado` },
  { title: "Dossiê Executivo", icon: FileText, url: `${BASE}/dossie` },
];

function CollapsibleNavGroup({
  section, collapsed, pathname,
}: { section: NavSection; collapsed: boolean; pathname: string; }) {
  const children = section.children!;
  const isChildActive = children.some((c) => pathname === c.url);
  const shouldBeOpen = isChildActive;

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <SidebarMenuItem>
            <SidebarMenuButton
              className={cn(
                "rounded transition-colors",
                shouldBeOpen
                  ? "sidebar-active text-linen font-medium"
                  : "hover:bg-sidebar-accent text-sidebar-foreground"
              )}
            >
              <section.icon className={cn("h-4 w-4 shrink-0", shouldBeOpen && "text-gold")} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">{section.title}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Collapsible defaultOpen={shouldBeOpen}>
      <CollapsibleTrigger className="flex items-center gap-2 w-full px-3 py-2 rounded text-sm transition-colors hover:bg-sidebar-accent group/trigger text-sidebar-foreground">
        <section.icon className={cn("h-4 w-4 shrink-0", shouldBeOpen && "text-gold")} />
        <span className={cn("flex-1 text-left text-[13px]", shouldBeOpen && "font-medium text-linen")}>
          {section.title}
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-sidebar-foreground/50 transition-transform duration-200 group-data-[state=open]/trigger:rotate-90" />
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden">
        <SidebarMenu className="ml-4 mt-0.5 border-l border-sidebar-border pl-2 space-y-0.5">
          {children.map((child) => {
            const isActive = pathname === child.url;
            return (
              <SidebarMenuItem key={child.url}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <NavLink
                    to={child.url}
                    end
                    className={cn(
                      "rounded transition-colors text-[12.5px]",
                      isActive
                        ? "sidebar-active text-linen font-medium"
                        : "hover:bg-sidebar-accent text-sidebar-foreground hover:text-linen"
                    )}
                    activeClassName=""
                  >
                    <child.icon className={cn("h-3.5 w-3.5 shrink-0", isActive && "text-gold")} />
                    <span>{child.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </CollapsibleContent>
    </Collapsible>
  );
}

function DirectNavItem({
  section, collapsed, pathname,
}: { section: NavSection; collapsed: boolean; pathname: string; }) {
  const isActive = pathname === section.url;
  const content = (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <NavLink
          to={section.url!}
          end
          className={cn(
            "rounded transition-colors",
            isActive
              ? "sidebar-active text-linen font-medium"
              : "hover:bg-sidebar-accent text-sidebar-foreground hover:text-linen"
          )}
          activeClassName=""
        >
          <section.icon className={cn("h-4 w-4 shrink-0", isActive && "text-gold")} />
          {!collapsed && <span className="text-[13px]">{section.title}</span>}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="text-xs">{section.title}</TooltipContent>
      </Tooltip>
    );
  }
  return content;
}

function ShowroomFooterButton({ collapsed }: { collapsed: boolean }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/")}
      className="flex items-center gap-2 w-full px-3 py-2 rounded text-sidebar-foreground hover:text-gold hover:bg-sidebar-accent transition-colors text-sm group"
      title="Voltar ao Showroom"
    >
      <ArrowLeft className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />
      {!collapsed && (
        <div className="flex flex-col items-start overflow-hidden">
          <span className="text-[12px] truncate max-w-[140px] text-linen">Voltar ao Showroom</span>
          <span className="text-[10px] text-sidebar-foreground/60">Trocar de produto</span>
        </div>
      )}
    </button>
  );
}

export function AgroSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent className="pt-0 bg-sidebar">
        <button
          onClick={() => navigate("/")}
          className="group w-full shrink-0 transition-all duration-300"
          title="Voltar ao Showroom"
        >
          {collapsed ? (
            <div className="w-full flex items-center justify-center py-3">
              <img src={logoMelazzo} alt="Melazzo" className="w-7 h-7 rounded object-cover" />
            </div>
          ) : (
            <div className="relative px-5 py-5 overflow-hidden border-b border-sidebar-border">
              <div className="flex items-center gap-3">
                <img
                  src={logoMelazzo}
                  alt="Melazzo Consultoria"
                  className="w-9 h-9 rounded object-cover ring-1 ring-gold/30"
                />
                <div className="flex flex-col items-start min-w-0">
                  <span className="text-[13px] font-display font-semibold text-linen tracking-tight leading-tight">
                    Melazzo
                  </span>
                  <span className="text-[10px] text-sidebar-foreground/70 tracking-[0.18em] uppercase">
                    Agro & Pecuária
                  </span>
                </div>
              </div>
            </div>
          )}
        </button>

        <div className="px-2 space-y-0.5 mt-3">
          <SidebarMenu>
            {navStructure.map((section) =>
              section.children ? (
                <CollapsibleNavGroup
                  key={section.title}
                  section={section}
                  collapsed={collapsed}
                  pathname={location.pathname}
                />
              ) : (
                <DirectNavItem
                  key={section.title}
                  section={section}
                  collapsed={collapsed}
                  pathname={location.pathname}
                />
              )
            )}
          </SidebarMenu>
        </div>

        <div className="mt-auto px-4 pb-4">
          <div className="divider-gold mb-3" />
          <ShowroomFooterButton collapsed={collapsed} />
          {!collapsed && (
            <div className="text-center mt-3">
              <p className="text-[9px] text-sidebar-foreground/40 tracking-[0.2em] uppercase">
                Versão Demo
              </p>
              <p className="text-[10px] text-gradient-gold font-display font-semibold tracking-wide">
                Gestão Agro & Pecuária
              </p>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
