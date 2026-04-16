import { motion } from "framer-motion";
import { Wheat, Building2, Home, Scale } from "lucide-react";
import bgAgro from "@/assets/rural-solucoes.webp";

const solutions = [
  {
    icon: Wheat,
    title: "Crédito Rural",
    items: [
      "Estruturação de Novo Crédito",
      "Reestruturação de Dívidas",
      "Revisão Técnica de Contratos",
      "Consultoria em Quebra de Safra",
      "Planejamento Financeiro Rural",
    ],
    highlight: true,
  },
  {
    icon: Building2,
    title: "Crédito para Agroindústria",
    items: [
      "Capital de Giro",
      "Crédito para Expansão",
      "Antecipação de Recebíveis",
      "Crédito com Garantia",
      "Financiamento de Equipamentos",
    ],
  },
  {
    icon: Home,
    title: "Home Equity Rural",
    items: [
      "Crédito com Garantia de Imóvel",
      "Garantia de Terras Produtivas",
      "Prazos Alongados",
      "Taxas Competitivas",
      "Processo Estruturado",
    ],
  },
  {
    icon: Scale,
    title: "Estratégia & Patrimônio",
    items: [
      "Blindagem Patrimonial",
      "Planejamento Sucessório",
      "Holding Rural",
      "Gestão de Riscos",
      "M&A no Agronegócio",
    ],
  },
];

const RuralSolucoes = () => {
  return (
    <section id="solucoes" className="relative py-24 lg:py-32 overflow-hidden bg-gradient-navy">
      {/* Subtle agro overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.06]"
        style={{ backgroundImage: `url(${bgAgro})` }}
      />

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
        }}
      />

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
            Nossas Soluções Rurais
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mt-4 mb-6 tracking-tight"
          >
            Um <span className="italic text-gradient-gold">Hub Completo</span> para o
            Agronegócio
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body text-base text-primary-foreground/65 leading-relaxed font-light"
          >
            Mais de 30 soluções customizadas para atender às necessidades específicas
            de produtores, fazendas e agroindústrias.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`group relative p-7 bg-primary-foreground/[0.04] border transition-all duration-500 hover:bg-primary-foreground/[0.08] hover:-translate-y-1 ${
                s.highlight
                  ? "border-gold/40 ring-1 ring-gold/20"
                  : "border-primary-foreground/10 hover:border-gold/30"
              }`}
            >
              {s.highlight && (
                <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-gold text-primary text-[10px] font-body font-bold tracking-[0.2em] uppercase">
                  Destaque
                </div>
              )}

              <div className="w-10 h-10 flex items-center justify-center border border-gold/40 mb-5">
                <s.icon className="w-5 h-5 text-gold" />
              </div>

              <h3 className="font-display text-xl font-semibold text-primary-foreground mb-5">
                {s.title}
              </h3>

              <ul className="space-y-2">
                {s.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 font-body text-sm text-primary-foreground/65 font-light"
                  >
                    <span className="w-1 h-1 bg-gold mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-14">
          <a
            href="https://wa.me/5534992282778"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-gold text-primary font-body font-semibold text-xs tracking-[0.2em] uppercase transition-all hover:opacity-90 hover:shadow-xl hover:shadow-accent/20"
          >
            Solicite uma consultoria gratuita
          </a>
        </div>
      </div>
    </section>
  );
};

export default RuralSolucoes;
