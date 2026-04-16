import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { SOCIAL_CHANNELS } from "@/lib/social-channels";
import { WhatsAppIcon } from "@/components/icons/SocialIcons";

/**
 * Floating action button: closed shows WhatsApp; opens a vertical
 * stack of social channels (Instagram, LinkedIn, TikTok) on click.
 */
const SocialFloat = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  // Channels except WhatsApp (which is the main button)
  const others = SOCIAL_CHANNELS.filter((c) => c.name !== "WhatsApp");

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open &&
          others.map((channel, i) => (
            <motion.a
              key={channel.name}
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Abrir ${channel.name}`}
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              transition={{ duration: 0.18, delay: i * 0.05 }}
              className="group flex items-center gap-3"
            >
              <span className="bg-primary text-primary-foreground font-body text-[11px] tracking-[0.15em] uppercase px-3 py-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                {channel.name}
              </span>
              <span
                className="flex items-center justify-center w-12 h-12 rounded-full text-white shadow-lg hover:scale-110 transition-transform"
                style={{ backgroundColor: channel.color }}
              >
                <channel.Icon size={22} />
              </span>
            </motion.a>
          ))}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
        aria-label={open ? "Fechar redes sociais" : "Abrir redes sociais"}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl hover:scale-105 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
      >
        <motion.span
          animate={{ rotate: open ? 90 : 0, opacity: open ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          <WhatsAppIcon size={26} />
        </motion.span>
        <motion.span
          animate={{ rotate: open ? 0 : -90, opacity: open ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          <X className="w-6 h-6" />
        </motion.span>
      </button>

      {/* Direct link for WhatsApp when collapsed (long-press hint via title) */}
      {!open && (
        <a
          href="https://wa.me/5534992282778"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Conversar no WhatsApp"
          className="absolute inset-0 rounded-full"
          onClick={(e) => {
            // Only navigate if user single-clicked the FAB while closed
            // Stop event so the toggle button click doesn't open the menu
            e.stopPropagation();
          }}
          style={{ display: "none" }}
        />
      )}
    </div>
  );
};

export default SocialFloat;
