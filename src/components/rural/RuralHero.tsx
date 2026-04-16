import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import ruralBg from "@/assets/rural-hero.jpg";
import ruralBgWebp from "@/assets/rural-hero.webp";
import ruralBgAvif from "@/assets/rural-hero.avif";

const RuralHero = () => {
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
      {/* Parallax background */}
      <motion.div
        aria-hidden="true"
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 will-change-transform"
      >
        <picture>
          <source type="image/avif" srcSet={ruralBgAvif} />
          <source type="image/webp" srcSet={ruralBgWebp} />
          <img
            src={ruralBg}
            alt=""
            className="w-full h-full object-cover object-center"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      </motion.div>

      {/* Navy gradient — keeps Melazzo identity */}
      <div className="absolute inset-0 bg-gradient-navy opacity-75" />
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--navy))] via-[hsl(var(--navy)/0.55)] to-transparent" />

      {/* Subtle linen overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
        }}
      />

      {/* Gold corners */}
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
              Frente Rural · Melazzo Consultoria
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground leading-[1.05] mb-6 tracking-tight"
          >
            Soluções financeiras{" "}
            <span className="italic text-gradient-gold">inteligentes</span>{" "}
            para quem move o agronegócio.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="font-body text-lg text-primary-foreground/80 max-w-2xl leading-relaxed font-light mb-10"
          >
            Conectamos sua propriedade rural ou agroindústria às melhores oportunidades
            de crédito do mercado. Atendimento consultivo, técnico e estratégico —
            pensado por quem entende do campo e do balanço.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="https://wa.me/5534992282778"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-gold text-primary font-body font-semibold text-xs tracking-[0.2em] uppercase transition-all hover:opacity-90 hover:shadow-xl hover:shadow-accent/20"
            >
              Falar com um especialista
            </a>
            <a
              href="#solucoes"
              className="inline-flex items-center justify-center px-8 py-4 border border-gold/30 text-primary-foreground font-body font-medium text-xs tracking-[0.2em] uppercase transition-all hover:border-gold hover:bg-gold/10"
            >
              Ver soluções rurais
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <a
          href="#prova"
          className="flex flex-col items-center gap-2 text-primary-foreground/50 hover:text-gold transition-colors"
        >
          <span className="font-body text-[10px] uppercase tracking-[0.3em]">Explore</span>
          <ArrowDown size={18} className="animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
};

export default RuralHero;
