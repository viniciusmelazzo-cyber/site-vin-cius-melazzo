import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Briefcase, TrendingUp, Scale, Landmark, Leaf, Download } from "lucide-react";

const services = [
  {
    icon: Briefcase,
    title: "Estratégia Empresarial",
    tagline: "Planejamento que antecipa o futuro.",
    bullets: ["Análise de mercado", "Otimização de processos", "Reestruturação organizacional"],
  },
  {
    icon: TrendingUp,
    title: "Performance Financeira",
    tagline: "Maximizando seus resultados.",
    bullets: ["Gestão de caixa", "Redução de custos", "Precificação e projeções"],
  },
  {
    icon: Scale,
    title: "Assessoria Jurídica Estratégica",
    tagline: "Proteção e conformidade.",
    bullets: ["Contratos e due diligence", "Compliance", "Blindagem patrimonial"],
  },
  {
    icon: Landmark,
    title: "Captação de Crédito",
    tagline: "O capital certo.",
    bullets: ["Dossiês estratégicos", "Negociação bancária", "Linhas de fomento"],
  },
  {
    icon: Leaf,
    title: "Soluções para o Agronegócio",
    tagline: "Expertise no campo.",
    bullets: ["Crédito rural", "Gestão de riscos", "Planejamento sucessório"],
  },
];

const ServicesSection = () => {
  return (
    <section id="servicos" className="py-24 lg:py-32 bg-gradient-navy relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`
      }} />

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
            Serviços
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mt-4 mb-6 tracking-tight"
          >
            Soluções Integradas para o seu{" "}
            <span className="italic">Negócio e Patrimônio</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body text-base text-primary-foreground/60 leading-relaxed font-light"
          >
            Na Melazzo Consultoria, cada serviço é uma peça fundamental na 
            construção da sua estratégia de sucesso.
          </motion.p>
        </div>

        {/* Top row: 3 cards / Bottom row: 2 centered */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {services.slice(0, 3).map((s, i) => (
            <ServiceCard key={s.title} service={s} delay={0.08 * i} />
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {services.slice(3).map((s, i) => (
            <ServiceCard key={s.title} service={s} delay={0.08 * (i + 3)} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface ServiceCardProps {
  service: typeof services[number];
  delay: number;
}

const ServiceCard = ({ service, delay }: ServiceCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="group p-8 bg-primary-foreground/[0.04] border border-primary-foreground/10 hover:bg-primary-foreground/[0.08] hover:border-gold/25 transition-all duration-300"
  >
    <div className="w-10 h-10 flex items-center justify-center border border-gold/30 mb-5">
      <service.icon className="w-5 h-5 text-gold" />
    </div>
    <h3 className="font-display text-xl font-semibold text-primary-foreground mb-1">
      {service.title}
    </h3>
    <p className="font-body text-sm text-gold/80 font-medium italic mb-4">
      {service.tagline}
    </p>
    <ul className="space-y-1.5">
      {service.bullets.map((b) => (
        <li key={b} className="flex items-center gap-2 font-body text-sm text-primary-foreground/50 font-light">
          <span className="w-1 h-1 bg-gold/60 flex-shrink-0" />
          {b}
        </li>
      ))}
    </ul>

    {service.title === "Soluções para o Agronegócio" && (
      <Link
        to="/manual-credito-rural-2026"
        className="mt-6 flex items-center gap-3 px-4 py-3 bg-gold/10 border border-gold/20 hover:border-gold/40 transition-colors group/cta"
      >
        <Download className="w-4 h-4 text-gold flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="block font-body text-xs text-gold font-semibold tracking-wide uppercase">
            Baixe grátis
          </span>
          <span className="block font-body text-[11px] text-primary-foreground/50 font-light truncate">
            Manual Completo de Crédito Rural 2026
          </span>
        </div>
        <span className="text-gold/50 group-hover/cta:translate-x-0.5 transition-transform">→</span>
      </Link>
    )}
  </motion.div>
);

export default ServicesSection;
