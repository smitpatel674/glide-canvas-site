import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollStore } from "@/store/scrollStore";

gsap.registerPlugin(ScrollTrigger);

/**
 * Singleton Lenis instance + GSAP ticker bridge.
 * - lerp 0.08, duration 1.4 (per spec)
 * - Lenis raf piped into gsap.ticker so ScrollTrigger stays in sync
 * - Pushes scroll state into Zustand for R3F consumers
 * - Respects prefers-reduced-motion
 */
export const SmoothScrollProvider = ({ children }: { children: ReactNode }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const setScroll = useScrollStore((s) => s.setScroll);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const lenis = new Lenis({
      lerp: reduced ? 1 : 0.08,
      duration: reduced ? 0 : 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo-ish
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      smoothWheel: !reduced,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", (e: { progress: number; velocity: number; scroll: number }) => {
      setScroll({ progress: e.progress, velocity: e.velocity, scrollY: e.scroll });
      // Expose CSS custom property for shader-free DOM effects
      document.documentElement.style.setProperty("--scroll-progress", String(e.progress));
    });

    // Bridge Lenis -> GSAP ticker so ScrollTrigger stays perfectly aligned
    const tickerCb = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    // Refresh on layout shifts
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refresh);

    return () => {
      gsap.ticker.remove(tickerCb);
      window.removeEventListener("resize", refresh);
      lenis.destroy();
      lenisRef.current = null;
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [setScroll]);

  return <>{children}</>;
};
