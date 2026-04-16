import { useEffect, useState } from "react";

/**
 * Animated number counter from 0 to `end` once `isActive` becomes true.
 */
export function useCountUp(end: number, durationMs = 2000, isActive = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, durationMs, isActive]);

  return count;
}
