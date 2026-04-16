import { useEffect } from "react";
import RuralNavbar from "@/components/rural/RuralNavbar";
import AboutSection from "@/components/AboutSection";
import MethodologySection from "@/components/MethodologySection";
import ServicesSection from "@/components/ServicesSection";
import ResultsSection from "@/components/ResultsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import InsightsSection from "@/components/InsightsSection";
import ContactSection from "@/components/ContactSection";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import empresarialBg from "@/assets/empresarial-hero.jpg";

const EmpresarialHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <motion.div
        aria-hidden="true"
        style={{
          backgroundImage: `url(${empresarialBg})`,
          y: bgY,
          scale: bgScale,
        }}
        className="absolute inset-0 bg-cover bg-center will-change-transform"
      />

      <div className="absolute inset-0 bg-gradient-navy opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--navy))] via-[hsl(var(--navy)/0.55)] to-transparent" />

      <div className="absolute top-8 left-8 w-24 h-24 border-t-2 border-l-2 border-gold/25" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-b-2 border-r-2 border-gold/25" />

      <div className="container relative z-10 mx-auto px-6 lg:px-12 pt-24 pb-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4 flex items-center gap-3"
          >
            <div className="w-10 h-px bg-gold" />
            <span className="text-gold font-body text-xs tracking-[0.35em] uppercase font-semibold">
              Frente Empresarial · Melazzo Consultoria
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground leading-[1.05] mb-6 tracking-tight"
          >
            Estratégia, performance e{" "}
            <span className="italic text-gradient-gold">governança</span> para empresas
            que querem crescer.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="font-body text-lg text-primary-foreground/80 max-w-2xl leading-relaxed font-light mb-10"
          >
            Transformamos dados financeiros, jurídicos e operacionais em decisões claras —
            para empresários que precisam crescer com previsibilidade e blindagem.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#contato"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-gold text-primary font-body font-semibold text-xs tracking-[0.2em] uppercase transition-all hover:opacity-90 hover:shadow-xl hover:shadow-accent/20"
            >
              Agende sua análise estratégica
            </a>
            <a
              href="#metodologia"
              className="inline-flex items-center justify-center px-8 py-4 border border-gold/30 text-primary-foreground font-body font-medium text-xs tracking-[0.2em] uppercase transition-all hover:border-gold hover:bg-gold/10"
            >
              Conheça a metodologia
            </a>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <a
          href="#sobre"
          className="flex flex-col items-center gap-2 text-primary-foreground/50 hover:text-gold transition-colors"
        >
          <span className="font-body text-[10px] uppercase tracking-[0.3em]">Explore</span>
          <ArrowDown size={18} className="animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
};

const Empresarial = () => {
  useEffect(() => {
    const prev = document.title;
    document.title = "Melazzo Consultoria · Frente Empresarial | Estratégia & Performance";
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="min-h-screen">
      <a href="#inicio" className="skip-to-content">
        Pular para o conteúdo
      </a>
      <RuralNavbar variant="empresarial" />
      <EmpresarialHero />
      <AboutSection />
      <MethodologySection />
      <ServicesSection />
      <ResultsSection />
      <TestimonialsSection />
      <InsightsSection />
      <ContactSection />
      <WhatsAppFloat />
    </div>
  );
};

export default Empresarial;
