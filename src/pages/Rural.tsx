import { useEffect } from "react";
import RuralNavbar from "@/components/rural/RuralNavbar";
import RuralHero from "@/components/rural/RuralHero";
import RuralProof from "@/components/rural/RuralProof";
import RuralPilares from "@/components/rural/RuralPilares";
import RuralSolucoes from "@/components/rural/RuralSolucoes";
import RuralQuemSomos from "@/components/rural/RuralQuemSomos";
import RuralTestimonials from "@/components/rural/RuralTestimonials";
import LeadMagnetSection from "@/components/LeadMagnetSection";
import ContactSection from "@/components/ContactSection";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const Rural = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Melazzo Consultoria · Frente Rural | Crédito e Estratégia Agro";
    return () => {
      document.title = prevTitle;
    };
  }, []);

  return (
    <div className="min-h-screen">
      <a href="#inicio" className="skip-to-content">
        Pular para o conteúdo
      </a>
      <RuralNavbar variant="rural" />
      <RuralHero />
      <RuralProof />
      <RuralPilares />
      <RuralSolucoes />
      <RuralQuemSomos />
      <RuralTestimonials />
      <LeadMagnetSection />
      <ContactSection />
      <WhatsAppFloat />
    </div>
  );
};

export default Rural;
