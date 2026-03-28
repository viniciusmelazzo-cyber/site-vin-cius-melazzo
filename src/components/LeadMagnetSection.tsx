import { motion } from "framer-motion";
import { FileDown } from "lucide-react";

const LeadMagnetSection = () => {
  return (
    <section className="py-20 lg:py-24 bg-gradient-navy relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`
      }} />

      <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-gold/15" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-gold/15" />

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="w-14 h-14 flex items-center justify-center border border-gold/30 mx-auto mb-6">
            <FileDown className="w-6 h-6 text-gold" />
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4 tracking-tight leading-snug">
            Checklist: Organize seus dados e{" "}
            <span className="italic text-gradient-gold">destrave decisões melhores</span>
          </h2>

          <p className="font-body text-base text-primary-foreground/60 leading-relaxed font-light mb-8 max-w-lg mx-auto">
            Criamos um guia prático com os passos essenciais para estruturar suas informações 
            financeiras e jurídicas — o primeiro passo da sua Teia de Informações. 
            Enviaremos gratuitamente por e-mail.
          </p>

          <a
            href="#contato"
            onClick={() => {
              setTimeout(() => {
                const subjectField = document.querySelector<HTMLSelectElement>('[data-field="subject"]');
                if (subjectField) {
                  subjectField.value = "checklist";
                  subjectField.dispatchEvent(new Event("change", { bubbles: true }));
                }
              }, 500);
            }}
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-gradient-gold text-primary font-body font-semibold text-xs tracking-[0.2em] uppercase transition-all hover:opacity-90 hover:shadow-xl hover:shadow-accent/20"
          >
            Quero receber o checklist
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default LeadMagnetSection;
