import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Análise Documental", desc: "Verificação cruzada meticulosa de cada detalhe. Nada passa despercebido." },
  { num: "02", title: "Teia de Informações", desc: "Conecto dados de múltiplas fontes para criar uma narrativa financeira coerente e irrefutável." },
  { num: "03", title: "Inteligência de Dados", desc: "Capturo e processo informações em diferentes cenários para decisões seguras e planejadas." },
  { num: "04", title: "Solução Estratégica", desc: "Estruturo a operação ideal — com segurança jurídica, condições otimizadas e visão de longo prazo." },
];

const MethodologySection = () => {
  return (
    <section id="metodologia" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-accent font-body text-sm tracking-[0.3em] uppercase font-medium"
            >
              Metodologia
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-3xl md:text-4xl font-semibold text-foreground mt-4 mb-6"
            >
              Como transformo{" "}
              <span className="text-gradient-gold">complexidade em clareza</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="font-body text-lg text-muted-foreground leading-relaxed mb-8"
            >
              Meu processo é rigoroso mas acessível. Cada etapa é desenhada para construir 
              uma base sólida que sustenta decisões inteligentes e crescimento sustentável.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-4 p-6 bg-card rounded-sm border border-border"
            >
              <div className="text-4xl font-display font-bold text-gradient-gold">+R$</div>
              <div>
                <div className="font-display text-2xl font-semibold text-foreground">500 milhões</div>
                <div className="font-body text-sm text-muted-foreground">em crédito intermediado pela Life Crédito</div>
              </div>
            </motion.div>
          </div>

          {/* Right: Steps */}
          <div className="space-y-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="flex gap-6 group"
              >
                <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-gradient-gold rounded-sm">
                  <span className="font-display text-lg font-bold text-accent-foreground">{step.num}</span>
                </div>
                <div className="pt-1">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;
