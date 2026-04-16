import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Building2, Wheat, ArrowRight } from "lucide-react";
import empresarialImg from "@/assets/empresarial-hero.jpg";
import ruralImg from "@/assets/rural-hero.jpg";

const fronts = [
  {
    to: "/empresarial",
    icon: Building2,
    eyebrow: "Frente Urbana",
    title: "Consultoria Empresarial",
    description:
      "Estratégia, performance financeira e governança para empresas que querem crescer com previsibilidade e segurança jurídica.",
    bullets: ["Performance Financeira", "Captação de Crédito", "Estruturação Societária"],
    image: empresarialImg,
  },
  {
    to: "/rural",
    icon: Wheat,
    eyebrow: "Frente Rural",
    title: "Consultoria do Agronegócio",
    description:
      "Hub completo de soluções de crédito, blindagem patrimonial e planejamento financeiro para produtores rurais e agroindústrias.",
    bullets: ["Crédito Rural Estruturado", "Reestruturação de Dívidas", "Planejamento Sucessório"],
    image: ruralImg,
  },
];

const BusinessFrontsSection = () => {
  return (
    <section id="frentes" className="py-24 lg:py-32 bg-linen-texture relative overflow-hidden">
      <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-gold/25" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-gold/25" />

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gold font-body text-xs tracking-[0.35em] uppercase font-semibold"
          >
            Duas Frentes, Uma Mesma Excelência
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold text-primary mt-4 mb-6 tracking-tight"
          >
            Para qual{" "}
            <span className="italic">universo</span> sua decisão pertence?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body text-base text-graphite/80 leading-relaxed font-light"
          >
            Atuamos com profundidade em duas frentes complementares: o ambiente empresarial urbano
            e o agronegócio. Escolha a porta que conversa com o seu momento.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {fronts.map((front, i) => (
            <motion.div
              key={front.to}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
            >
              <Link
                to={front.to}
                className="group block relative h-full overflow-hidden border border-primary/10 bg-primary hover:border-gold/40 transition-all duration-500"
              >
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                  style={{ backgroundImage: `url(${front.image})` }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/85 to-primary/40" />

                {/* Corner ornaments */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-gold/40 group-hover:border-gold transition-colors" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-gold/40 group-hover:border-gold transition-colors" />

                <div className="relative z-10 p-8 lg:p-10 min-h-[28rem] flex flex-col">
                  <div className="w-12 h-12 flex items-center justify-center border border-gold/40 mb-6">
                    <front.icon className="w-6 h-6 text-gold" />
                  </div>

                  <span className="text-gold font-body text-[11px] tracking-[0.3em] uppercase font-semibold mb-3">
                    {front.eyebrow}
                  </span>

                  <h3 className="font-display text-3xl lg:text-4xl font-bold text-primary-foreground mb-4 tracking-tight">
                    {front.title}
                  </h3>

                  <p className="font-body text-sm text-primary-foreground/70 leading-relaxed font-light mb-6">
                    {front.description}
                  </p>

                  <ul className="space-y-2 mb-8">
                    {front.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-center gap-2 font-body text-sm text-primary-foreground/60 font-light"
                      >
                        <span className="w-1.5 h-1.5 bg-gold flex-shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto inline-flex items-center gap-2 text-gold font-body text-xs tracking-[0.2em] uppercase font-semibold group-hover:gap-4 transition-all">
                    Conhecer esta frente
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessFrontsSection;
