import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";

/**
 * Slim gold reading-progress bar pinned at the very top of the viewport.
 * Animates from 0% to 100% as the user scrolls the document.
 */
export const ReadingProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-gold origin-left z-[60] pointer-events-none"
    />
  );
};

/**
 * Discreet "back to top" button. Appears after 600px of scroll,
 * placed bottom-left to avoid the social float button on the right.
 */
export const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Voltar ao topo da página"
      className="fixed bottom-6 left-6 z-40 flex items-center justify-center w-11 h-11 rounded-full bg-primary/90 text-gold border border-gold/40 backdrop-blur-sm shadow-lg hover:bg-primary hover:scale-105 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};
