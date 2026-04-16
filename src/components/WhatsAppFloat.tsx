import { MessageCircle } from "lucide-react";

const WA_LINK = "https://wa.me/5534992282778";

const WhatsAppFloat = () => (
  <a
    href={WA_LINK}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Fale conosco pelo WhatsApp"
    className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
  >
    <MessageCircle className="w-7 h-7" />
  </a>
);

export default WhatsAppFloat;
