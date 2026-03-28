import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Download } from "lucide-react";

const posts = [
  {
    tag: "Estratégia",
    date: "Mar 2026",
    title: "Como a Teia de Informações transforma decisões empresariais",
    summary: "Descubra como conectar dados de múltiplas fontes gera clareza e reduz riscos em operações complexas.",
    href: "#",
  },
  {
    tag: "Agro",
    date: "Fev 2026",
    title: "Crédito rural: o que muda com as novas linhas de fomento",
    summary: "Entenda as oportunidades e exigências das linhas atualizadas para produtores rurais em 2026.",
    href: "#",
  },
  {
    tag: "Jurídico",
    date: "Jan 2026",
    title: "Blindagem patrimonial: quando proteger é a melhor estratégia",
    summary: "Planejamento sucessório e estruturas de holding como ferramentas de proteção e eficiência tributária.",
    href: "#",
  },
];

const tagColors: Record<string, string> = {
  Estratégia: "bg-accent/15 text-accent",
  Agro: "bg-agro/15 text-agro",
  Jurídico: "bg-primary/80 text-primary-foreground",
  Financeiro: "bg-accent/15 text-accent",
};

const InsightsSection = () => {
  return (
    <section id="insights" className="py-24 lg:py-32 bg-linen-texture-dark relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-accent font-body text-xs tracking-[0.35em] uppercase font-semibold"
          >
            Insights
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6 tracking-tight"
          >
            Conhecimento que gera{" "}
            <span className="text-gradient-gold italic">vantagem</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-body text-base text-muted-foreground leading-relaxed font-light"
          >
            Artigos e análises para manter você à frente — com visão estratégica, 
            jurídica e financeira.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {posts.map((post, i) => (
            <motion.a
              key={post.title}
              href={post.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="group bg-card border border-border hover:border-accent/30 transition-all duration-300 flex flex-col"
            >
              {/* Top bar */}
              <div className="px-6 pt-6 pb-3 flex items-center justify-between">
                <span className={`inline-block px-2.5 py-1 font-body text-[10px] tracking-[0.15em] uppercase font-semibold ${tagColors[post.tag] || "bg-accent/15 text-accent"}`}>
                  {post.tag}
                </span>
                <span className="font-body text-[11px] text-muted-foreground/60 font-light">
                  {post.date}
                </span>
              </div>

              {/* Content */}
              <div className="px-6 pb-6 flex-1 flex flex-col">
                <h3 className="font-display text-lg font-semibold text-foreground mb-3 leading-snug group-hover:text-accent transition-colors">
                  {post.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed font-light mb-4 flex-1">
                  {post.summary}
                </p>
                <div className="flex items-center gap-1 font-body text-xs text-accent font-medium tracking-wide uppercase">
                  Ler mais
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InsightsSection;
