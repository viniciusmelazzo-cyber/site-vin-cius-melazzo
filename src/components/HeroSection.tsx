import { motion } from "framer-motion";
import viniciusPhoto from "@/assets/vinicius-photo.jpg";
import logoVM from "@/assets/logo-vm.png";

const HeroSection = () => {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-navy" />
      
      {/* Subtle linen overlay on dark */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`
      }} />

      {/* Classic gold corner accents */}
      <div className="absolute top-8 left-8 w-24 h-24 border-t-2 border-l-2 border-gold/20" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-b-2 border-r-2 border-gold/20" />

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-primary-foreground order-2 lg:order-1">
            
            <motion.img
              src={logoVM}
              alt="VM Logo"
              className="w-20 h-20 mb-8 object-contain"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }} />
            

            <div className="mb-3">
              <span className="text-gold font-body text-xs tracking-[0.35em] uppercase font-semibold">
                Estratégia & Performance Empresarial
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight">
              Vinícius <span className="font-impact text-gradient-gold tracking-[0.05em] text-6xl md:text-7xl lg:text-8xl not-italic">MELAZZO</span>
            </h1>

            <p className="font-body text-base md:text-lg leading-relaxed opacity-80 mb-4 max-w-lg font-light">
              Integro estratégia, inteligência de dados e segurança jurídica para transformar a performance do seu negócio. Cada decisão, conectada pela Teia de Informações.
            </p>

            <div className="flex items-center gap-3 mb-10 opacity-50">
              <div className="w-10 h-px bg-gold" />
              <span className="font-body text-xs tracking-[0.15em] uppercase">Melazzo Consultoria</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#atuacao"
                className="inline-flex items-center justify-center px-10 py-4 bg-gradient-gold text-primary font-body font-semibold text-xs tracking-[0.2em] uppercase transition-all hover:opacity-90 hover:shadow-xl hover:shadow-accent/20">
                
                Conheça meu trabalho
              </a>
              <a
                href="#contato"
                className="inline-flex items-center justify-center px-10 py-4 border border-gold/30 text-primary-foreground font-body font-medium text-xs tracking-[0.2em] uppercase transition-all hover:border-gold hover:bg-gold/10">
                
                Fale comigo
              </a>
            </div>
          </motion.div>

          {/* Right: Photo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end">
            
            <div className="relative">
              {/* Classic double frame */}
              <div className="absolute -inset-4 border border-gold/15" />
              <div className="absolute -inset-1 border border-gold/10" />
              
              {/* Gold corner ornaments */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-gold/40" />
              <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-gold/40" />
              <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-gold/40" />
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-gold/40" />
              
              <img
                src={viniciusPhoto}
                alt="Vinícius Melazzo"
                className="relative w-80 lg:w-96 h-[28rem] lg:h-[32rem] object-cover object-top shadow-2xl" />
              
            </div>
          </motion.div>
        </div>
      </div>
    </section>);

};

export default HeroSection;