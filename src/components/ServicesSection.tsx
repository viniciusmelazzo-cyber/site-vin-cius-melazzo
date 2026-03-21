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
    <section id="atuacao" className="py-24 lg:py-32 bg-gradient-navy relative overflow-hidden">
      {/* Linen overlay subtle */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`
      }} />

      {/* Corner accents */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-gold/15" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-gold/15" />

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gold font-body text-xs tracking-[0.35em] uppercase font-semibold"
          >
            Áreas de Atuação
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mt-4 mb-6 tracking-tight"
          >
            Soluções financeiras <span className="italic">sob medida</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body text-base text-primary-foreground/60 leading-relaxed font-light"
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
              className="group p-8 bg-primary-foreground/[0.04] border border-primary-foreground/10 hover:bg-primary-foreground/[0.08] hover:border-gold/20 transition-all duration-300"
            >
              <div className="w-10 h-10 flex items-center justify-center border border-gold/30 mb-5">
                <service.icon className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-display text-xl font-semibold text-primary-foreground mb-3">{service.title}</h3>
              <p className="font-body text-sm text-primary-foreground/55 leading-relaxed font-light">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
