import { useEffect, useRef } from "react";
import { useScrollStore } from "@/store/scrollStore";

const TECH = [
  "TypeScript", "Next.js", "React", "Node", "PostgreSQL", "Rust",
  "Python", "Go", "AWS", "Vercel", "Docker", "Kubernetes",
  "Three.js", "GSAP", "TailwindCSS", "GraphQL", "Prisma", "tRPC",
];

/** Infinite marquee — speed scales w/ Lenis scroll velocity. */
export const MarqueeSection = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const halfWidthRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const updateMetrics = () => {
      if (!trackRef.current) return;
      halfWidthRef.current = trackRef.current.scrollWidth / 2;
    };

    updateMetrics();
    window.addEventListener("resize", updateMetrics, { passive: true });

    let raf = 0;
    const tick = () => {
      const v = useScrollStore.getState().velocity;
      velocityRef.current += (v - velocityRef.current) * 0.08;
      // base speed + velocity multiplier
      offset.current -= 0.32 + Math.abs(velocityRef.current) * 0.035;
      if (trackRef.current) {
        const halfWidth = halfWidthRef.current;
        if (-offset.current >= halfWidth) offset.current += halfWidth;
        trackRef.current.style.transform = `translate3d(${offset.current}px,0,0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateMetrics);
    };
  }, []);

  const items = [...TECH, ...TECH];

  return (
    <section
      className="relative py-20 border-y border-border/10 overflow-hidden bg-background"
      aria-label="Technologies we use"
    >
      <div
        ref={trackRef}
        className="flex items-center gap-12 whitespace-nowrap will-change-transform"
      >
        {items.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="inline-flex items-center gap-3 font-display font-semibold text-2xl md:text-3xl text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="size-1.5 rounded-full bg-accent" />
            {t}
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent" />
    </section>
  );
};
