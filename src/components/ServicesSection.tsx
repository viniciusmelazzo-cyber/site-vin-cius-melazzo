import { motion } from "framer-motion";
import { Landmark, Building2, Home, TrendingUp, ShieldCheck, BarChart3 } from "lucide-react";

const services = [
  { icon: Landmark, title: "Crédito Rural", desc: "PRONAF, PRONAMP, custeio e investimento. Estruturação completa para produtores rurais." },
  { icon: Building2, title: "Crédito Empresarial", desc: "Capital de giro, antecipação de recebíveis e linhas garantidas para sua empresa crescer." },
  { icon: Home, title: "Home Equity", desc: "Use seu imóvel como garantia para obter crédito com as melhores condições do mercado." },
  { icon: TrendingUp, title: "Aquisição Imobiliária", desc: "Financiamento estruturado para aquisição de imóveis com segurança jurídica." },
  { icon: ShieldCheck, title: "Blindagem Patrimonial", desc: "Proteção do seu patrimônio com estratégias jurídicas e financeiras sólidas." },
  { icon: BarChart3, title: "Gestão Financeira", desc: "Centro de inteligência com dashboards, projeções e diagnóstico financeiro completo." },
];

const ServicesSection = () => {
  return (
    <section id="atuacao" className="py-24 lg:py-32 bg-gradient-teal relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium"
          >
            Áreas de Atuação
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl md:text-4xl font-semibold text-primary-foreground mt-4 mb-6"
          >
            Soluções financeiras sob medida
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body text-lg text-primary-foreground/70 leading-relaxed"
          >
            Como COO da Life Crédito, estruturo operações que vão além do crédito tradicional. 
            Cada solução é desenhada com análise jurídica rigorosa e inteligência de dados.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * i }}
              className="group p-8 rounded-sm bg-primary-foreground/5 border border-primary-foreground/10 backdrop-blur-sm hover:bg-primary-foreground/10 transition-all duration-300"
            >
              <service.icon className="w-8 h-8 text-gold mb-5" />
              <h3 className="font-display text-xl font-semibold text-primary-foreground mb-3">{service.title}</h3>
              <p className="font-body text-sm text-primary-foreground/65 leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
