import { motion } from "framer-motion";
import { Shield, Crosshair, Lightbulb, Heart } from "lucide-react";
import viniciusPhoto from "@/assets/vinicius-photo.jpg";
import viniciusPhotoWebp from "@/assets/vinicius-photo.webp";
import viniciusPhotoAvif from "@/assets/vinicius-photo.avif";
import { ResponsiveImage } from "@/components/ui/responsive-image";

const values = [
  { icon: Shield, title: "Integridade", desc: "Transparência absoluta em cada operação. Sua confiança é o nosso maior ativo." },
  { icon: Crosshair, title: "Precisão", desc: "Análises rigorosas que eliminam achismos e sustentam decisões com dados reais." },
  { icon: Lightbulb, title: "Inovação", desc: "Ferramentas tecnológicas e metodologias proprietárias que vão além do convencional." },
  { icon: Heart, title: "Compromisso", desc: "Cada cliente é único. Cada solução é construída com dedicação e visão de longo prazo." },
];

const AboutSection = () => {
  return (
    <section id="sobre" className="py-24 lg:py-32 bg-linen-texture relative">
      {/* Ornamental top border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-accent font-body text-xs tracking-[0.35em] uppercase font-semibold"
          >
            Quem Somos
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4 mb-4 tracking-tight max-w-3xl mx-auto"
          >
            Vinícius Melazzo: A Visão que Conecta{" "}
            <span className="text-gradient-gold italic">Direito e Finanças</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="ornament-line text-accent/40 text-lg"
          >
            ◆
          </motion.div>
        </div>

        {/* 2-column: Photo + Story */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative flex justify-center lg:justify-start"
          >
            <div className="relative">
              <div className="absolute -inset-3 border border-gold/15" />
              <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-gold/40" />
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-gold/40" />
              <ResponsiveImage
                src={viniciusPhoto}
                webp={viniciusPhotoWebp}
                avif={viniciusPhotoAvif}
                alt="Vinícius Melazzo — Consultor Estratégico"
                loading="lazy"
                className="relative w-full max-w-md h-[26rem] lg:h-[30rem] object-cover object-top shadow-xl"
              />
            </div>
          </motion.div>

          {/* Story */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-6 leading-snug">
              Da advocacia à consultoria estratégica:{" "}
              <span className="text-gradient-gold italic">uma trajetória de conexão</span>
            </h3>

            <div className="space-y-4 font-body text-base text-muted-foreground leading-relaxed font-light">
              <p>
                Com formação jurídica e vivência profunda no mercado financeiro, Vinícius Melazzo 
                identificou uma lacuna: empresários e produtores rurais precisavam de mais do que 
                produtos de crédito — precisavam de um parceiro que enxergasse o todo.
              </p>
              <p>
                Assim nasceu a Melazzo Consultoria, com a missão de integrar segurança jurídica, 
                inteligência de dados e estratégia financeira em um único ponto de decisão. 
                Cada operação é construída pela nossa metodologia proprietária — a{" "}
                <span className="font-semibold text-foreground">Teia de Informações</span> — 
                que conecta fontes, cenários e análises para gerar clareza onde havia complexidade.
              </p>
              <p>
                Ir além das opções tradicionais não é um slogan. É a razão pela qual existimos.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Values grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h3 className="font-display text-2xl font-semibold text-foreground text-center mb-10">
            Nossos Valores
          </h3>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="group bg-card p-8 border border-border hover:border-accent/40 transition-all duration-300"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-primary mb-5">
                <item.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h4 className="font-display text-xl font-semibold text-foreground mb-3">{item.title}</h4>
              <p className="font-body text-sm text-muted-foreground leading-relaxed font-light">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
