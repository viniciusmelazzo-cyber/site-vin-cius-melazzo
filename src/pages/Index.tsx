import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import MethodologySection from "@/components/MethodologySection";
import ResultsSection from "@/components/ResultsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import InsightsSection from "@/components/InsightsSection";
import LeadMagnetSection from "@/components/LeadMagnetSection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <a href="#inicio" className="skip-to-content">Pular para o conteúdo</a>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <MethodologySection />
      <ServicesSection />
      <ResultsSection />
      <TestimonialsSection />
      <InsightsSection />
      <LeadMagnetSection />
      <ContactSection />
      <WhatsAppFloat />
    </div>
  );
};

export default Index;
