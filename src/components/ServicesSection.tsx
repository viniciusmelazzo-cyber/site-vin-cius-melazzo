import { motion } from "framer-motion";
import { Landmark, Building2, Home, TrendingUp, ShieldCheck, BarChart3 } from "lucide-react";

const services = [
  { icon: Landmark, title: "Crédito Rural & Agro", desc: "Estruturação de PRONAF, PRONAMP, custeio e investimento com análise estratégica e segurança jurídica." },
  { icon: Building2, title: "Crédito Empresarial", desc: "Capital de giro, antecipação de recebíveis e linhas garantidas com inteligência de dados para sua empresa." },
  { icon: Home, title: "Home Equity", desc: "Operações com imóvel em garantia, estruturadas para extrair as melhores condições do mercado." },
  { icon: TrendingUp, title: "Aquisição Imobiliária", desc: "Financiamento estratégico para aquisição de imóveis com planejamento e blindagem patrimonial." },
  { icon: ShieldCheck, title: "Blindagem Patrimonial", desc: "Proteção inteligente do seu patrimônio com estratégias jurídicas e financeiras integradas." },
  { icon: BarChart3, title: "Performance & Gestão", desc: "Diagnóstico financeiro completo, dashboards e projeções para decisões baseadas em dados reais." },
];

const ServicesSection = () => {
  return (
    <section id="servicos" className="py-24 lg:py-32 bg-gradient-navy relative overflow-hidden">
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
            Soluções estratégicas <span className="italic">sob medida</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body text-base text-primary-foreground/60 leading-relaxed font-light"
          >
            Na Melazzo Consultoria, cada operação é desenhada com análise jurídica rigorosa, 
            inteligência de dados e visão estratégica — conectadas pela nossa Teia de Informações.
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
