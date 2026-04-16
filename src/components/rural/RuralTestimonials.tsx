import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import rural1 from "@/assets/testimonial-rural-1.jpg";
import rural2 from "@/assets/testimonial-rural-2.jpg";
import rural3 from "@/assets/testimonial-rural-3.jpg";

const testimonials = [
  {
    text: "Estruturamos o custeio e o investimento da safra com taxa abaixo da média de mercado. A Melazzo entendeu o ciclo da lavoura — não tratou como um empréstimo qualquer.",
    author: "Geraldo Pacheco",
    role: "Produtor de soja e milho · Triângulo Mineiro",
    metric: "R$ 4,5 mi em custeio aprovados · safra 24/25",
    photo: rural1,
  },
  {
    text: "Renegociamos dívidas de pecuária e liberamos caixa para reformar pastagem. Hoje produzo mais com o mesmo rebanho e respiro financeiro.",
    author: "Helena Rezende",
    role: "Pecuarista · Goiás",
    metric: "Dívida reestruturada + 22% de ganho de produtividade",
    photo: rural2,
  },
  {
    text: "Captamos via Pronampe Agro e FCO Rural para implantar irrigação. Sem a estruturação documental e técnica deles, o projeto não saía do papel.",
    author: "Rafael Monteiro",
    role: "Agroindústria de grãos · Sul de Minas",
    metric: "R$ 2,1 mi liberados · projeto de irrigação implantado",
    photo: rural3,
  },
];

const RuralTestimonials = () => {
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
            Cases · Frente Rural
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mt-4 tracking-tight"
          >
            Produtores que captam, plantam e <span className="italic text-gradient-gold">crescem</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body text-base text-primary-foreground/65 mt-5 max-w-2xl mx-auto font-light"
          >
            Histórias reais de quem estruturou crédito rural, reorganizou dívidas e ganhou previsibilidade na safra com a Melazzo.
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
                  className="w-14 h-14 rounded-full object-cover border border-gold/30"
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

export default RuralTestimonials;
