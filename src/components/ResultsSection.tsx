import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const metrics = [
  { value: "R$ 500M+", label: "em operações estruturadas" },
  { value: "40%", label: "redução média de custos financeiros" },
  { value: "98%", label: "de aprovação em linhas de crédito" },
];

const cases = [
  {
    tag: "Agronegócio",
    context: "Produtor rural com dificuldade de acesso a crédito subsidiado por inconsistências documentais e ausência de histórico estruturado.",
    action: "Auditoria documental completa, construção de dossiê estratégico e negociação direta com instituições financeiras via Teia de Informações.",
    result: "Aprovação de R$ 12M em crédito rural com taxa 40% abaixo do mercado e prazo de carência estendido.",
  },
  {
    tag: "Indústria",
    context: "Empresa de médio porte enfrentando gargalo de caixa e custos financeiros elevados em múltiplas linhas de crédito.",
    action: "Diagnóstico financeiro completo, renegociação de dívidas e reestruturação de operações com foco em performance e redução de custos.",
    result: "Economia de R$ 1,2M/ano em despesas financeiras e liberação de capital de giro para expansão.",
  },
  {
    tag: "Patrimônio Familiar",
    context: "Família empresária buscando proteção patrimonial e planejamento sucessório sem comprometer a operação do negócio.",
    action: "Assessoria jurídica estratégica integrada com análise financeira, criação de estrutura de holding e blindagem patrimonial.",
    result: "Patrimônio protegido com redução de 35% na carga tributária sobre transferências e sucessão planejada.",
  },
];

const ResultsSection = () => {
  return (
    <section id="resultados" className="py-24 lg:py-32 bg-linen-texture relative">
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
            Resultados
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6 tracking-tight"
          >
            Resultados que{" "}
            <span className="text-gradient-gold italic">falam por si</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body text-base text-muted-foreground leading-relaxed font-light"
          >
            Cada número representa uma história de confiança, estratégia e impacto real 
            na vida de empresários e produtores rurais.
          </motion.p>
        </div>

        {/* Metrics bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 mb-20"
        >
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="text-center p-8 bg-primary border-l-2 border-gold"
            >
              <div className="font-impact text-4xl md:text-5xl text-gradient-gold tracking-wide mb-2">
                {m.value}
              </div>
              <div className="font-body text-sm text-primary-foreground/60 font-light">
                {m.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Cases */}
        <div className="grid lg:grid-cols-3 gap-6 mb-16">
          {cases.map((c, i) => (
            <motion.div
              key={c.tag}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="bg-card border border-border hover:border-accent/30 transition-all duration-300 flex flex-col"
            >
              {/* Tag header */}
              <div className="px-8 pt-8 pb-4">
                <span className="inline-block px-3 py-1 bg-primary text-primary-foreground font-body text-[10px] tracking-[0.2em] uppercase font-semibold">
                  {c.tag} — Exemplo
                </span>
              </div>

              {/* Content */}
              <div className="px-8 pb-8 flex-1 space-y-4">
                <div>
                  <h4 className="font-display text-sm font-semibold text-accent uppercase tracking-wider mb-1">
                    Contexto
                  </h4>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed font-light">
                    {c.context}
                  </p>
                </div>
                <div>
                  <h4 className="font-display text-sm font-semibold text-accent uppercase tracking-wider mb-1">
                    Ação
                  </h4>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed font-light">
                    {c.action}
                  </p>
                </div>
                <div>
                  <h4 className="font-display text-sm font-semibold text-accent uppercase tracking-wider mb-1">
                    Resultado
                  </h4>
                  <p className="font-body text-sm text-foreground leading-relaxed font-semibold">
                    {c.result}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <a
            href="#contato"
            className="inline-flex items-center gap-2 px-10 py-4 border border-accent/40 text-foreground font-body font-medium text-xs tracking-[0.2em] uppercase transition-all hover:border-accent hover:bg-accent/10"
          >
            Quero resultados como esses
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ResultsSection;
