import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import viniciusPhoto from "@/assets/vinicius-photo.jpg";

import manhattanSkyline from "@/assets/manhattan-skyline.jpg";

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Subtle parallax: skyline moves slower than scroll, with a soft scale
  const skylineY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const skylineScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);

  return (
    <section ref={sectionRef} id="inicio" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background skyline with parallax + Ken Burns zoom */}
      <motion.div
        aria-hidden="true"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1.18 }}
        transition={{ duration: 18, ease: "easeOut" }}
        style={{
          backgroundImage: `url(${manhattanSkyline})`,
          y: skylineY,
        }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
      />

      {/* Navy gradient overlay to keep brand mood and ensure text contrast */}
      <div className="absolute inset-0 bg-gradient-navy opacity-80" />

      {/* Bottom-up navy fade for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--navy))] via-[hsl(var(--navy)/0.55)] to-transparent" />

      {/* Subtle linen overlay on dark */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`
      }} />

      {/* Classic gold corner accents */}
      <div className="absolute top-8 left-8 w-24 h-24 border-t-2 border-l-2 border-gold/20" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-b-2 border-r-2 border-gold/20" />

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-primary-foreground order-2 lg:order-1">
            

            <div className="mb-4">
              <span className="text-gold font-body text-xs tracking-[0.35em] uppercase font-semibold">
                Estratégia & Performance Empresarial
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-2 tracking-tight">
              <span className="font-impact text-gradient-gold tracking-[0.05em] text-5xl md:text-6xl lg:text-7xl">MELAZZO</span>
              <br />
              <span className="text-3xl md:text-4xl lg:text-5xl">Consultoria</span>
            </h1>

            <div className="flex items-center gap-3 my-5 opacity-60">
              <div className="w-10 h-px bg-gold" />
              <span className="font-body text-[11px] tracking-[0.2em] uppercase text-gold font-medium">
                Sua Teia de Informações para o Crescimento Sustentável
              </span>
              <div className="w-10 h-px bg-gold" />
            </div>

            <p className="font-body text-base md:text-lg leading-relaxed opacity-75 mb-10 max-w-lg font-light">
              Transformamos dados complexos em decisões claras e resultados financeiros 
              sólidos para empresários e produtores rurais.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#contato"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-gold text-primary font-body font-semibold text-xs tracking-[0.2em] uppercase transition-all hover:opacity-90 hover:shadow-xl hover:shadow-accent/20">
                Agende sua Análise Estratégica Gratuita
              </a>
              <a
                href="#metodologia"
                className="inline-flex items-center justify-center px-8 py-4 border border-gold/30 text-primary-foreground font-body font-medium text-xs tracking-[0.2em] uppercase transition-all hover:border-gold hover:bg-gold/10">
                Conheça a metodologia
              </a>
            </div>
          </motion.div>

          {/* Right: Photo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end">
            
            <div className="relative">
              {/* Classic double frame */}
              <div className="absolute -inset-4 border border-gold/15" />
              <div className="absolute -inset-1 border border-gold/10" />
              
              {/* Gold corner ornaments */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-gold/40" />
              <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-gold/40" />
              <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-gold/40" />
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-gold/40" />
              
              <img
                src={viniciusPhoto}
                alt="Vinícius Melazzo"
                className="relative w-80 lg:w-96 h-[28rem] lg:h-[32rem] object-cover object-top shadow-2xl" />
              
            </div>
          </motion.div>
        </div>
      </div>
    </section>);

};

export default HeroSection;