import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, UserCircle } from "lucide-react";
import logoVM from "@/assets/logo-vm.webp";

const links = [
  { href: "#inicio", label: "Início" },
  { href: "#sobre", label: "Quem Somos" },
  { href: "#metodologia", label: "Metodologia" },
  { href: "#servicos", label: "Serviços" },
  { href: "#resultados", label: "Resultados" },
  { href: "#insights", label: "Insights" },
  { href: "#contato", label: "Contato" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleLinkClick = useCallback(() => setOpen(false), []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      aria-label="Navegação principal"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-primary/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
        {/* Brand */}
        <a href="#inicio" className="flex items-center gap-3" aria-label="Melazzo Consultoria — Voltar ao início">
          <img src={logoVM} alt="" className="w-8 h-8 object-contain" aria-hidden="true" />
          <span className="font-display text-base font-semibold text-primary-foreground tracking-wide">
            Melazzo Consultoria
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden xl:flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-body text-[11px] tracking-[0.1em] uppercase text-primary-foreground/60 hover:text-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-sm px-1"
            >
              {l.label}
            </a>
          ))}

          {/* Área do Cliente */}
          <a
            href="/cliente/login"
            className="ml-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-gold/40 text-gold font-body font-medium text-[11px] tracking-[0.1em] uppercase transition-all hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            <UserCircle className="w-3.5 h-3.5" />
            Área do Cliente
          </a>

          {/* CTA */}
          <a
            href="#contato"
            className="ml-1 inline-flex items-center justify-center px-5 py-2 bg-gradient-gold text-primary font-body font-semibold text-[11px] tracking-[0.15em] uppercase transition-all hover:opacity-90 hover:shadow-lg hover:shadow-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            Agende sua Análise Gratuita
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="xl:hidden text-primary-foreground p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="xl:hidden bg-primary/95 backdrop-blur-md overflow-hidden"
            role="menu"
          >
            <div className="px-6 py-6 space-y-1">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={handleLinkClick}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  role="menuitem"
                  className="block py-3 px-3 font-body text-xs tracking-[0.1em] uppercase text-primary-foreground/60 hover:text-gold hover:bg-primary-foreground/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
                >
                  {l.label}
                </motion.a>
              ))}

              {/* Área do Cliente - Mobile */}
              <a
                href="/cliente/login"
                onClick={handleLinkClick}
                role="menuitem"
                className="block mt-4 text-center px-6 py-3 border border-gold/40 text-gold font-body font-medium text-xs tracking-[0.15em] uppercase transition-all hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <UserCircle className="w-4 h-4 inline mr-2" />
                Área do Cliente
              </a>

              {/* Mobile CTA */}
              <a
                href="#contato"
                onClick={handleLinkClick}
                role="menuitem"
                className="block mt-2 text-center px-6 py-3 bg-gradient-gold text-primary font-body font-semibold text-xs tracking-[0.15em] uppercase transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                Agende sua Análise Estratégica Gratuita
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
