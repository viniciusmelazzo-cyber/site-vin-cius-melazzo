import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import emp1 from "@/assets/testimonial-emp-1.jpg";
import emp2 from "@/assets/testimonial-emp-2.jpg";
import emp3 from "@/assets/testimonial-emp-3.jpg";

const testimonials = [
  {
    text: "Reestruturamos a holding e o fluxo de caixa em 90 dias. Saímos do achismo para tomar decisão com base em DRE, projeção e tributário consolidados.",
    author: "Mariana Vasconcelos",
    role: "CEO · Grupo Varejista — MG",
    metric: "+38% margem líquida em 12 meses",
    photo: emp1,
  },
  {
    text: "Estruturaram o crédito empresarial que três bancos haviam negado. Não foi sorte — foi preparação documental e narrativa de balanço.",
    author: "Carlos Henrique Andrade",
    role: "Diretor · Construtora — Triângulo Mineiro",
    metric: "R$ 8,2 mi captados a custo competitivo",
    photo: emp2,
  },
  {
    text: "A governança que a Melazzo implantou nos deu previsibilidade. Hoje sócios, contador e jurídico falam a mesma língua — e isso vale ouro.",
    author: "Juliana Tanaka",
    role: "Sócia-administradora · Indústria Metalúrgica",
    metric: "Blindagem patrimonial + sucessão estruturada",
    photo: emp3,
  },
];

const EmpresarialTestimonials = () => {
  return (
    <section id="depoimentos" className="py-24 lg:py-32 bg-gradient-navy relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
        }}
      />

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gold font-body text-xs tracking-[0.35em] uppercase font-semibold"
          >
            Cases · Frente Empresarial
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mt-4 tracking-tight"
          >
            Empresários que decidem com <span className="italic text-gradient-gold">previsibilidade</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body text-base text-primary-foreground/65 mt-5 max-w-2xl mx-auto font-light"
          >
            Resultados reais de empresários que estruturaram governança, crédito e estratégia financeira com a Melazzo.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.article
              key={t.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="relative flex flex-col p-8 bg-primary-foreground/[0.04] border border-gold/15 hover:border-gold/35 transition-all duration-300"
            >
              <Quote className="w-6 h-6 text-gold/35 mb-5" aria-hidden="true" />

              <p className="font-body text-sm text-primary-foreground/80 leading-relaxed font-light italic mb-8 flex-1">
                "{t.text}"
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-gold/10">
                <img
                  src={t.photo}
                  alt={`Retrato de ${t.author}`}
                  loading="lazy"
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover border border-gold/30 grayscale-[15%]"
                />
                <div className="min-w-0">
                  <p className="font-display text-sm text-primary-foreground font-semibold leading-tight">
                    {t.author}
                  </p>
                  <p className="font-body text-[11px] text-primary-foreground/55 mt-0.5 leading-snug">
                    {t.role}
                  </p>
                </div>
              </div>

              <div className="mt-4 inline-flex items-center gap-2">
                <span className="w-6 h-px bg-gold/40" />
                <span className="font-body text-[11px] text-gold/85 font-medium tracking-wide uppercase">
                  {t.metric}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmpresarialTestimonials;
