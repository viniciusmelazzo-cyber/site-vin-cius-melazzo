import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    text: "A Melazzo Consultoria transformou a forma como enxergamos nossas finanças. Decisões que antes eram intuitivas agora têm fundamento e clareza.",
    author: "Empresário do varejo",
  },
  {
    text: "Conseguimos aprovar uma linha de crédito que nos disseram ser impossível. A diferença está na preparação estratégica que eles entregam.",
    author: "Produtor rural — Triângulo Mineiro",
  },
  {
    text: "Profissionalismo e visão de longo prazo. Não é só consultoria, é ter um parceiro que realmente entende o nosso negócio.",
    author: "Sócia de grupo industrial",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-gradient-navy relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`
      }} />

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gold font-body text-xs tracking-[0.35em] uppercase font-semibold"
          >
            Depoimentos
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mt-4 tracking-tight"
          >
            O que dizem nossos <span className="italic">parceiros</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="relative p-8 bg-primary-foreground/[0.04] border border-gold/15 hover:border-gold/30 transition-all duration-300"
            >
              <Quote className="w-6 h-6 text-gold/30 mb-4" />
              <p className="font-body text-sm text-primary-foreground/75 leading-relaxed font-light italic mb-6">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-gold/40" />
                <span className="font-body text-xs text-gold/80 font-medium tracking-wide uppercase">
                  {t.author}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
