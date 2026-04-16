import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import logoVM from "@/assets/logo-vm.webp";

const links = [
  { href: "#inicio", label: "Início" },
  { href: "#pilares", label: "Diferenciais" },
  { href: "#solucoes", label: "Soluções" },
  { href: "#quem-somos", label: "Quem Somos" },
];

interface RuralNavbarProps {
  variant?: "rural" | "empresarial";
}

const RuralNavbar = ({ variant = "rural" }: RuralNavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleLinkClick = useCallback(() => setOpen(false), []);
  const eyebrow = variant === "rural" ? "Frente Rural" : "Frente Empresarial";

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      aria-label="Navegação principal"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-primary/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3" aria-label="Voltar à home Melazzo">
          <img src={logoVM} alt="" className="w-8 h-8 object-contain" aria-hidden="true" />
          <div className="flex flex-col leading-tight">
            <span className="font-display text-base font-semibold text-primary-foreground tracking-wide">
              Melazzo Consultoria
            </span>
            <span className="text-gold font-body text-[9px] tracking-[0.3em] uppercase font-semibold">
              {eyebrow}
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-body text-[11px] tracking-[0.1em] uppercase text-primary-foreground/60 hover:text-gold transition-colors px-1"
            >
              {l.label}
            </a>
          ))}

          <Link
            to="/"
            className="ml-1 inline-flex items-center gap-1.5 px-4 py-2 border border-gold/40 text-gold font-body font-medium text-[11px] tracking-[0.1em] uppercase transition-all hover:bg-gold/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar
          </Link>

          <a
            href="https://wa.me/5534992282778"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 inline-flex items-center justify-center px-5 py-2 bg-gradient-gold text-primary font-body font-semibold text-[11px] tracking-[0.15em] uppercase transition-all hover:opacity-90 hover:shadow-lg"
          >
            Falar com Especialista
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-primary-foreground p-2"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-primary/95 backdrop-blur-md overflow-hidden"
          >
            <div className="px-6 py-6 space-y-1">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={handleLinkClick}
                  className="block py-3 px-3 font-body text-xs tracking-[0.1em] uppercase text-primary-foreground/60 hover:text-gold transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <Link
                to="/"
                onClick={handleLinkClick}
                className="block mt-4 text-center px-6 py-3 border border-gold/40 text-gold font-body font-medium text-xs tracking-[0.15em] uppercase"
              >
                Voltar para a Home
              </Link>
              <a
                href="https://wa.me/5534992282778"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                className="block mt-2 text-center px-6 py-3 bg-gradient-gold text-primary font-body font-semibold text-xs tracking-[0.15em] uppercase"
              >
                Falar com Especialista
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default RuralNavbar;
