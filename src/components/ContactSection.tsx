import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";
import logoVM from "@/assets/logo-vm.png";

const ContactSection = () => {
  return (
    <section id="contato" className="py-24 lg:py-32 bg-gradient-teal relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <div className="max-w-2xl mx-auto text-center">
          <motion.img
            src={logoVM}
            alt="VM"
            className="w-16 h-16 object-contain mx-auto mb-8 opacity-60"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 0.6, scale: 1 }}
            viewport={{ once: true }}
          />

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl font-semibold text-primary-foreground mb-6"
          >
            Vamos conversar sobre o seu negócio
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-body text-lg text-primary-foreground/70 leading-relaxed mb-12"
          >
            Se você busca mais que acesso a crédito — busca inteligência, confiança e soluções 
            que realmente fazem sentido — entre em contato.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
          >
            <div className="flex items-center gap-3 text-primary-foreground/80">
              <MapPin className="w-4 h-4 text-gold" />
              <span className="font-body text-sm">Uberaba & Uberlândia — MG</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-primary-foreground/20" />
            <div className="flex items-center gap-3 text-primary-foreground/80">
              <Phone className="w-4 h-4 text-gold" />
              <span className="font-body text-sm">Atendimento presencial e remoto</span>
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
            className="inline-flex items-center justify-center px-10 py-4 bg-gradient-gold text-accent-foreground font-body font-semibold text-sm tracking-wider uppercase rounded-sm transition-all hover:opacity-90 hover:shadow-xl"
          >
            Agendar uma conversa
          </motion.a>
        </div>
      </div>

      {/* Footer bar */}
      <div className="container mx-auto px-6 lg:px-12 mt-24">
        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-body text-xs text-primary-foreground/40">
            © 2025 Dr. Vinícius Melazzo — OAB/SP 488.319
          </span>
          <span className="font-body text-xs text-primary-foreground/40">
            COO — Life Crédito · Hub Multibancos de Soluções Financeiras
          </span>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
