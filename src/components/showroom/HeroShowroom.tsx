import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import logoMelazzo from "@/assets/logo-melazzo-mark.webp";
import skylineDesktop from "@/assets/manhattan-skyline.webp";
import skylineMobile from "@/assets/manhattan-skyline-mobile.webp";

export function HeroShowroom() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleScroll = () => {
    document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-navy text-linen">
      {/* Background skyline com parallax */}
      <picture
        className="absolute inset-0"
        style={{ transform: `translateY(${scrollY * 0.25}px)` }}
      >
        <source media="(min-width: 768px)" srcSet={skylineDesktop} />
        <img
          src={skylineMobile}
          alt=""
          className="absolute inset-0 w-full h-[120%] object-cover opacity-30"
          loading="eager"
        />
      </picture>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy/90 to-navy" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,hsl(var(--gold)/0.12),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--gold)/0.08),transparent_50%)]" />

      {/* Grão sutil */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M0 0h1v1H0zM4 4h1v1H4zM8 8h1v1H8zM12 12h1v1h-1zM16 16h1v1h-1zM20 20h1v1h-1zM24 24h1v1h-1zM28 28h1v1h-1zM32 32h1v1h-1z'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      {/* Conteúdo */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <div className="flex justify-center mb-8 animate-fade-up opacity-0" style={{ animationDelay: "100ms" }}>
          <img
            src={logoMelazzo}
            alt="Melazzo Consultoria"
            className="h-16 w-16 rounded shadow-2xl ring-1 ring-gold/30"
          />
        </div>

        <p
          className="text-[11px] md:text-xs uppercase tracking-[0.4em] text-gold mb-6 animate-fade-up opacity-0"
          style={{ animationDelay: "300ms" }}
        >
          Melazzo Consultoria · Showroom de Produtos
        </p>

        <h1
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6 animate-fade-up opacity-0"
          style={{ animationDelay: "500ms" }}
        >
          Soluções financeiras
          <br />
          <span className="text-gradient-gold italic">sob medida</span> para o seu negócio.
        </h1>

        <div
          className="ornament-line mx-auto mb-6 animate-fade-up opacity-0"
          style={{ animationDelay: "700ms" }}
        />

        <p
          className="text-base md:text-lg text-linen/75 max-w-2xl mx-auto leading-relaxed animate-fade-up opacity-0"
          style={{ animationDelay: "900ms" }}
        >
          Escolha a demonstração que faz sentido para a sua operação. Cada produto reflete a metodologia
          Melazzo aplicada a um segmento específico.
        </p>

        <button
          onClick={handleScroll}
          className="mt-12 inline-flex flex-col items-center gap-2 text-linen/60 hover:text-gold transition-colors animate-fade-up opacity-0"
          style={{ animationDelay: "1100ms" }}
          aria-label="Ver produtos"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">Conheça os produtos</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </button>
      </div>
    </section>
  );
}
