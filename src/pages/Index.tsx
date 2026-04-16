import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import AboutSection from "@/components/AboutSection";
import BusinessFrontsSection from "@/components/BusinessFrontsSection";
import MethodologySection from "@/components/MethodologySection";
import ResultsSection from "@/components/ResultsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import InsightsSection from "@/components/InsightsSection";
import ContactSection from "@/components/ContactSection";
import { useHashScroll } from "@/hooks/useHashScroll";

const Index = () => {
  useHashScroll();
  return (
    <div className="min-h-screen">
      <a href="#inicio" className="skip-to-content">Pular para o conteúdo</a>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <MethodologySection />
      <BusinessFrontsSection />
      <ResultsSection />
      <TestimonialsSection />
      <InsightsSection />
      <ContactSection />
      <WhatsAppFloat />
    </div>
  );
};

export default Index;
