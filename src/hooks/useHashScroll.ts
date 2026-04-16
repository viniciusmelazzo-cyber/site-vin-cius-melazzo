import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls to the element matching the URL hash whenever it changes.
 * Use it once at the top of pages that should respond to /#section navigation.
 */
export function useHashScroll() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) {
      // No hash: scroll to top when navigating to a new route
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    const id = hash.replace("#", "");
    // Wait one frame for DOM to be ready
    const t = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);

    return () => clearTimeout(t);
  }, [hash, pathname]);
}
