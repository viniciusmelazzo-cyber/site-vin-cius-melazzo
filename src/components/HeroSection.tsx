import { motion } from "framer-motion";
import viniciusPhoto from "@/assets/vinicius-photo.jpg";
import logoVM from "@/assets/logo-vm.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-teal" />
      
      {/* Decorative brushstrokes */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
        <div className="w-full h-full bg-gold rounded-full blur-3xl" />
      </div>
      <div className="absolute bottom-0 left-0 w-96 h-96 opacity-5">
        <div className="w-full h-full bg-gold-light rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-primary-foreground order-2 lg:order-1"
          >
            <motion.img
              src={logoVM}
              alt="VM Logo"
              className="w-20 h-20 mb-8 object-contain"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            />

            <div className="mb-2">
              <span className="text-gold font-body text-sm tracking-[0.3em] uppercase font-medium">
                Consultor Jurídico-Financeiro
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-6">
              Dr. Vinícius
              <br />
              <span className="text-gradient-gold">Melazzo</span>
            </h1>

            <p className="font-body text-lg md:text-xl leading-relaxed opacity-85 mb-4 max-w-lg">
              Arquiteto de Inteligência Financeira. Transformo desafios financeiros em oportunidades através de análise jurídica, dados e soluções customizadas.
            </p>

            <div className="flex items-center gap-3 mb-8 opacity-70">
              <div className="w-8 h-px bg-gold" />
              <span className="font-body text-sm tracking-wider">OAB/SP 488.319 · COO Life Crédito</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#atuacao"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-gold text-accent-foreground font-body font-semibold text-sm tracking-wider uppercase rounded-sm transition-all hover:opacity-90 hover:shadow-lg"
              >
                Conheça meu trabalho
              </a>
              <a
                href="#contato"
                className="inline-flex items-center justify-center px-8 py-3.5 border border-gold/40 text-primary-foreground font-body font-medium text-sm tracking-wider uppercase rounded-sm transition-all hover:border-gold hover:bg-gold/10"
              >
                Fale comigo
              </a>
            </div>
          </motion.div>

          {/* Right: Photo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Gold accent frame */}
              <div className="absolute -inset-3 border border-gold/20 rounded-sm" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-gold opacity-20 rounded-sm" />
              
              <img
                src={viniciusPhoto}
                alt="Dr. Vinícius Melazzo"
                className="relative w-80 lg:w-96 h-[28rem] lg:h-[32rem] object-cover object-top rounded-sm shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
