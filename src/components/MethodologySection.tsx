import { motion } from "framer-motion";
import { FileSearch, Database, BarChart3, BookOpen, KeyRound, ShieldCheck, Target, TrendingUp } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: FileSearch,
    title: "Auditoria Documental Completa",
    desc: "Verificação cruzada e meticulosa de cada documento. Identificamos inconsistências, riscos ocultos e oportunidades antes invisíveis.",
  },
  {
    num: "02",
    icon: Database,
    title: "Construção da Base de Dados Estratégica",
    desc: "Organizamos e conectamos informações de múltiplas fontes em uma base sólida — o alicerce da sua Teia de Informações.",
  },
  {
    num: "03",
    icon: BarChart3,
    title: "Análise de Indicadores Financeiros e Jurídicos",
    desc: "Processamos cenários, projeções e indicadores-chave para transformar complexidade em visão clara e acionável.",
  },
  {
    num: "04",
    icon: BookOpen,
    title: "Criação de Narrativas Financeiras Sólidas",
    desc: "Estruturamos a operação ideal com segurança jurídica, condições otimizadas e uma narrativa irrefutável para cada stakeholder.",
  },
];

const benefits = [
  { icon: KeyRound, title: "Acesso a Crédito", desc: "Operações estruturadas que abrem portas nos melhores termos do mercado." },
  { icon: ShieldCheck, title: "Proteção Patrimonial", desc: "Estratégias jurídicas e financeiras integradas para blindar o que você construiu." },
  { icon: Target, title: "Decisões Assertivas", desc: "Dados reais e análise rigorosa que eliminam achismos e reduzem riscos." },
  { icon: TrendingUp, title: "Crescimento Sustentável", desc: "Visão de longo prazo que transforma performance em resultados duradouros." },
];

const MethodologySection = () => {
  return (
    <section id="metodologia" className="py-24 lg:py-32 bg-linen-texture-dark relative">
      {/* Ornamental border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-accent font-body text-xs tracking-[0.35em] uppercase font-semibold"
          >
            Metodologia
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6 tracking-tight"
          >
            A Teia de Informações:{" "}
            <span className="text-gradient-gold italic">Desvendando o Potencial Oculto dos Seus Dados</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body text-base text-muted-foreground leading-relaxed font-light"
          >
            Nosso processo proprietário conecta documentos, dados e cenários em uma 
            estrutura inteligente — para que cada decisão tenha fundamento, clareza e impacto.
          </motion.p>
        </div>

        {/* Steps timeline */}
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 mb-20 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="group flex gap-5"
            >
              {/* Number + icon block */}
              <div className="flex-shrink-0 relative">
                <div className="w-16 h-16 flex items-center justify-center border-2 border-accent/25 group-hover:border-accent transition-colors duration-300 bg-card">
                  <step.icon className="w-6 h-6 text-accent" />
                </div>
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground font-body text-[10px] font-bold tracking-wider w-6 h-6 flex items-center justify-center">
                  {step.num}
                </span>
              </div>

              {/* Text */}
              <div className="pt-1">
                <h3 className="font-display text-xl font-semibold text-foreground mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed font-light">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Connector ornament */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-accent/30" />
          <span className="text-accent/40 text-sm">◆</span>
          <span className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">
            O que a Teia entrega
          </span>
          <span className="text-accent/40 text-sm">◆</span>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-accent/30" />
        </div>

        {/* Benefits 2x2 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {benefits.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * i }}
              className="text-center p-6 bg-card border border-border hover:border-accent/40 transition-all duration-300"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-primary mx-auto mb-4">
                <item.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h4 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h4>
              <p className="font-body text-sm text-muted-foreground leading-relaxed font-light">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;
