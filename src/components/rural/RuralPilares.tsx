import { motion } from "framer-motion";
import { Handshake, ShieldCheck, Network } from "lucide-react";
import pillarsBg from "@/assets/rural-pillars.webp";

const pillars = [
  {
    icon: Handshake,
    title: "Atendimento Consultivo",
    description:
      "Não somos apenas intermediadores. Somos consultores estratégicos que entendem a dinâmica do campo e do balanço para encontrar o crédito certo, no momento certo.",
  },
  {
    icon: ShieldCheck,
    title: "Expertise Técnica e Jurídica",
    description:
      "Sob a liderança de Vinícius Melazzo, garantimos segurança jurídica e estruturação impecável de dossiês para máxima taxa de aprovação junto a bancos e fundos.",
  },
  {
    icon: Network,
    title: "Hub de Soluções",
    description:
      "Acesso direto a uma rede com mais de 70 bancos, fundos de investimento e investidores privados. Encontramos a solução ideal dentro de um portfólio completo.",
  },
];

const RuralPilares = () => {
  return (
    <section id="pilares" className="relative py-24 lg:py-32 overflow-hidden bg-background">
      <div
        className="absolute right-0 top-0 bottom-0 w-1/3 bg-cover bg-center opacity-[0.08] hidden lg:block"
        style={{ backgroundImage: `url(${pillarsBg})` }}
      />

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <div className="max-w-2xl mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gold font-body text-xs tracking-[0.35em] uppercase font-semibold"
          >
            Por que a Melazzo no Agro?
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold text-primary mt-4 mb-6 tracking-tight"
          >
            Nossos <span className="italic">Diferenciais</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body text-base text-graphite/80 leading-relaxed font-light"
          >
            Conectamos produtores rurais e agroindústrias às melhores oportunidades do
            mercado financeiro com um atendimento que vai muito além da intermediação.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="group relative bg-card border border-border p-8 hover:bg-primary hover:border-gold/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="w-12 h-12 flex items-center justify-center border border-gold/40 mb-6 group-hover:border-gold transition-colors">
                <p.icon className="w-6 h-6 text-gold" />
              </div>

              <h3 className="font-display text-xl font-semibold text-primary group-hover:text-primary-foreground mb-4 transition-colors">
                {p.title}
              </h3>

              <p className="font-body text-sm text-graphite/80 group-hover:text-primary-foreground/70 leading-relaxed font-light transition-colors">
                {p.description}
              </p>

              <div className="absolute bottom-0 left-8 right-8 h-px bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RuralPilares;
