import { motion } from "framer-motion";
import { Shield, Target, Brain, Users } from "lucide-react";

const values = [
  { icon: Shield, title: "Segurança Jurídica", desc: "Análise rigorosa que protege seu patrimônio e garante operações seguras." },
  { icon: Brain, title: "Inteligência de Dados", desc: "Decisões estratégicas baseadas em dados reais, não em achismos." },
  { icon: Target, title: "Soluções Customizadas", desc: "Cada cliente é único. Cada solução é desenhada sob medida." },
  { icon: Users, title: "Humanidade nos Negócios", desc: "Relações duráveis construídas com confiança e transparência." },
];

const AboutSection = () => {
  return (
    <section id="sobre" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-accent font-body text-sm tracking-[0.3em] uppercase font-medium"
          >
            Quem sou
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl md:text-4xl font-semibold text-foreground mt-4 mb-6"
          >
            Mais que um consultor.{" "}
            <span className="text-gradient-gold">Um parceiro estratégico.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body text-lg text-muted-foreground leading-relaxed"
          >
            Advogado de formação, com 28 anos, uno expertise jurídica ao profundo conhecimento 
            do mercado financeiro. Minha missão é ser o melhor braço financeiro do seu negócio — 
            criando crescimento sustentável, protegendo patrimônio e transformando dados em decisões inteligentes.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="group bg-card p-8 rounded-sm border border-border hover:border-accent/40 transition-all duration-300"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-gold rounded-sm mb-5">
                <item.icon className="w-5 h-5 text-accent-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-3">{item.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
