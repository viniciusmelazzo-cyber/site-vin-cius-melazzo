import { motion } from "framer-motion";

const steps = [
  { num: "I", title: "Análise Documental", desc: "Verificação cruzada meticulosa de cada detalhe. Nada passa despercebido." },
  { num: "II", title: "Teia de Informações", desc: "Conecto dados de múltiplas fontes para criar uma narrativa financeira coerente e irrefutável." },
  { num: "III", title: "Inteligência de Dados", desc: "Capturo e processo informações em diferentes cenários para decisões seguras e planejadas." },
  { num: "IV", title: "Solução Estratégica", desc: "Estruturo a operação ideal — com segurança jurídica, condições otimizadas e visão de longo prazo." },
];

const MethodologySection = () => {
  return (
    <section id="metodologia" className="py-24 lg:py-32 bg-linen-texture-dark relative">
      {/* Ornamental border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
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
              Como transformo{" "}
              <span className="text-gradient-gold italic">complexidade em clareza</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="font-body text-base text-muted-foreground leading-relaxed mb-8 font-light"
            >
              Meu processo é rigoroso mas acessível. Cada etapa é desenhada para construir 
              uma base sólida que sustenta decisões inteligentes e crescimento sustentável.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-4 p-6 bg-primary border-l-2 border-gold"
            >
              <div className="font-display text-4xl font-bold text-gold">+R$</div>
              <div>
                <div className="font-display text-2xl font-semibold text-primary-foreground">500 milhões</div>
                <div className="font-body text-sm text-primary-foreground/60 font-light">em crédito intermediado pela Life Crédito</div>
              </div>
            </motion.div>
          </div>

          {/* Right: Steps with roman numerals */}
          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="flex gap-6 group"
              >
                <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center border-2 border-accent/30 group-hover:border-accent transition-colors">
                  <span className="font-display text-xl font-bold text-accent">{step.num}</span>
                </div>
                <div className="pt-1">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed font-light">{step.desc}</p>
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
