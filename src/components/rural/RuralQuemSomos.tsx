import { motion } from "framer-motion";
import { Target, Award, Users } from "lucide-react";
import viniciusPhoto from "@/assets/vinicius-photo.jpg";

const values = [
  {
    icon: Target,
    title: "Nossa Missão",
    text: "Ser a ponte entre o produtor que precisa de capital e as melhores soluções financeiras do mercado, com atendimento personalizado e profundamente técnico.",
  },
  {
    icon: Award,
    title: "Nossa Visão",
    text: "Consolidar a Melazzo Consultoria como referência nacional em estruturação de crédito e estratégia patrimonial para o agronegócio brasileiro.",
  },
  {
    icon: Users,
    title: "Nossos Valores",
    text: "Transparência, ética, excelência técnica e compromisso com resultados reais para cada produtor e cada agroindústria que confia em nosso trabalho.",
  },
];

const RuralQuemSomos = () => {
  return (
    <section id="quem-somos" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gold font-body text-xs tracking-[0.35em] uppercase font-semibold"
          >
            Quem Está por Trás
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold text-primary mt-4 mb-6 tracking-tight"
          >
            Experiência que gera <span className="italic">resultado no campo</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body text-base text-graphite/80 leading-relaxed font-light"
          >
            A Melazzo Consultoria nasceu da convicção de que o produtor rural brasileiro
            precisa de uma assessoria que entenda igualmente a lavoura, o crédito e o
            jurídico — em um só lugar.
          </motion.p>
        </div>

        {/* Mission / Vision / Values */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center p-6"
            >
              <div className="w-14 h-14 flex items-center justify-center border border-gold/40 mx-auto mb-5">
                <v.icon className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-display text-lg font-semibold text-primary mb-3">
                {v.title}
              </h3>
              <p className="font-body text-sm text-graphite/70 leading-relaxed font-light">
                {v.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Founder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto bg-card border border-border p-8 lg:p-10 grid md:grid-cols-[160px_1fr] gap-8 items-center"
        >
          <div className="relative mx-auto md:mx-0">
            <div className="absolute -inset-2 border border-gold/30" />
            <img
              src={viniciusPhoto}
              alt="Vinícius Melazzo"
              className="relative w-32 h-32 md:w-36 md:h-36 object-cover object-top"
              loading="lazy"
            />
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold text-primary mb-1">
              Vinícius Melazzo
            </h3>
            <p className="text-gold font-body text-xs tracking-[0.2em] uppercase font-semibold mb-4">
              Fundador · Estrategista & Especialista em Crédito Rural
            </p>
            <p className="font-body text-sm text-graphite/80 leading-relaxed font-light">
              Especializado em estruturação de crédito, segurança jurídica e planejamento
              patrimonial para o agronegócio. Atua na linha de frente das operações,
              garantindo dossiês de altíssima qualidade técnica e máxima taxa de
              aprovação junto a bancos, fundos e investidores privados.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RuralQuemSomos;
