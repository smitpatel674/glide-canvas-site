import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether a wrapper element is intersecting the viewport.
 * Used to switch R3F Canvas frameloop between "always" and "demand"
 * so offscreen canvases stop burning GPU/CPU.
 */
export function useInViewCanvas<T extends HTMLElement = HTMLDivElement>(
  rootMargin = "200px",
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin, threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}

/** Returns true when the device is mobile-ish (≤768px or coarse pointer). */
export function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px), (pointer: coarse)");
    const update = () => setM(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return m;
}
