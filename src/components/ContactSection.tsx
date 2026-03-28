import { motion } from "framer-motion";
import { MapPin, Phone } from "lucide-react";
import logoVM from "@/assets/logo-vm.webp";

const ContactSection = () => {
  return (
    <section id="contato" className="py-24 lg:py-32 bg-gradient-navy relative overflow-hidden">
      {/* Corner accents */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-gold/15" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-gold/15" />

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <div className="max-w-2xl mx-auto text-center">
          <motion.img
            src={logoVM}
            alt="VM"
            className="w-16 h-16 object-contain mx-auto mb-8 opacity-50"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 0.5, scale: 1 }}
            viewport={{ once: true }} />
          

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6 tracking-tight">
            
            Vamos conversar sobre <span className="italic">a sua estratégia</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-body text-base text-primary-foreground/60 leading-relaxed mb-12 font-light">
            
            Se você busca mais que soluções financeiras — busca estratégia, performance e 
            decisões que realmente fazem sentido — entre em contato.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            
            <div className="flex items-center gap-3 text-primary-foreground/70">
              <MapPin className="w-4 h-4 text-gold" />
              <span className="font-body text-sm font-light">Uberaba & Uberlândia — MG</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-primary-foreground/20" />
            <div className="flex items-center gap-3 text-primary-foreground/70">
              <Phone className="w-4 h-4 text-gold" />
              <span className="font-body text-sm font-light">Atendimento presencial e remoto</span>
            </div>
          </motion.div>

          <motion.a
            href="https://wa.me/5534999999999"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center justify-center px-12 py-4 bg-gradient-gold text-primary font-body font-semibold text-xs tracking-[0.2em] uppercase transition-all hover:opacity-90 hover:shadow-xl hover:shadow-accent/20">
            
            Agendar uma conversa
          </motion.a>
        </div>
      </div>

      {/* Footer bar */}
      <div className="container mx-auto px-6 lg:px-12 mt-24">
        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-body text-xs text-primary-foreground/35 font-light">
            © 2025 Melazzo Consultoria
          </span>
          <span className="font-body text-xs text-primary-foreground/35 font-light">Estratégia & Performance Empresarial
          </span>
        </div>
      </div>
    </section>);

};

export default ContactSection;