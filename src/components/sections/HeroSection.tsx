import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const STATS = [
  { value: 200, suffix: "+", label: "Products shipped" },
  { value: 50, suffix: "+", label: "Global clients" },
  { value: 10, suffix: "+", label: "Years engineering" },
];

const CLIENTS = ["Stripe", "Linear", "Vercel", "Figma", "Notion", "Arc"];

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: to,
      duration: 2.2,
      ease: "power3.out",
      scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
      onUpdate: () => {
        if (ref.current) ref.current.textContent = `${Math.round(obj.v)}${suffix}`;
      },
    });
    return () => {
      tween.kill();
    };
  }, [to, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

/**
 * Abstract mesh-gradient orb — the standout hero visual.
 * Built with layered radial gradients + soft float for premium depth.
 */
function MeshOrb() {
  return (
    <div
      aria-hidden
      className="absolute -right-32 top-1/2 -translate-y-1/2 hidden lg:block w-[640px] h-[640px] pointer-events-none"
    >
      <motion.div
        animate={{ y: [0, -18, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-full h-full"
      >
        {/* Base orb */}
        <div
          className="absolute inset-12 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, hsl(255 100% 80%) 0%, hsl(250 100% 68%) 35%, hsl(250 100% 62%) 70%, hsl(245 80% 45%) 100%)",
            filter: "blur(2px)",
            boxShadow:
              "0 60px 120px -20px hsl(250 100% 62% / 0.5), inset 0 -40px 80px hsl(245 100% 40% / 0.4), inset 0 40px 80px hsl(0 0% 100% / 0.3)",
          }}
        />
        {/* Highlight */}
        <div
          className="absolute top-20 left-24 w-40 h-40 rounded-full opacity-80"
          style={{
            background: "radial-gradient(circle, hsl(0 0% 100% / 0.7), transparent 70%)",
            filter: "blur(20px)",
          }}
        />
        {/* Outer glow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, hsl(250 100% 68% / 0.25) 0%, transparent 60%)",
            filter: "blur(40px)",
          }}
        />
      </motion.div>
    </div>
  );
}

export const HeroSection = () => {
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!headlineRef.current) return;
    const ctx = gsap.context(() => {
      const lines = headlineRef.current!.querySelectorAll<HTMLElement>("[data-line]");
      gsap.from(lines, {
        yPercent: 105,
        opacity: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.08,
        delay: 0.25,
      });
    }, headlineRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      className="relative min-h-[100svh] w-full overflow-hidden flex items-center noise"
      aria-label="Hero"
    >
      {/* Layered backdrop — soft mesh + grid + vignette */}
      <div className="absolute inset-0 bg-mesh pointer-events-none" aria-hidden />
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" aria-hidden />
      <div
        className="absolute inset-x-0 top-0 h-[60vh] pointer-events-none"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, hsl(250 100% 68% / 0.10), transparent 70%)",
        }}
      />

      <MeshOrb />

      <div className="container relative z-10 pt-36 pb-24 lg:pt-40">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* LEFT — slightly off-grid (cols 1-7) for asymmetry */}
          <div className="lg:col-span-7">
            {/* Status pill */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="inline-flex items-center gap-2.5 mb-9 pl-2 pr-4 py-1.5 rounded-full glass text-[12px] font-medium text-muted-foreground"
            >
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
                <span className="relative inline-flex rounded-full size-1.5 bg-primary" />
              </span>
              <span className="text-foreground">Booking Q3 2026</span>
              <span className="text-muted-foreground/60">— 2 slots remaining</span>
            </motion.div>

            {/* Headline */}
            <h1
              ref={headlineRef}
              className="font-display font-bold text-[clamp(2.5rem,6.4vw,5.25rem)] leading-[0.98] tracking-[-0.035em] text-foreground"
            >
              <span className="block overflow-hidden">
                <span data-line className="block">We engineer</span>
              </span>
              <span className="block overflow-hidden">
                <span data-line className="block">
                  next{" "}
                  <span className="relative inline-block italic font-semibold">
                    <span className="text-gradient">digital</span>
                    <svg
                      aria-hidden
                      viewBox="0 0 200 12"
                      className="absolute -bottom-1 left-0 w-full h-2"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M2 8 Q50 2 100 6 T198 6"
                        fill="none"
                        stroke="url(#g1)"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="g1" x1="0" x2="1">
                          <stop offset="0" stopColor="hsl(250 100% 68%)" />
                          <stop offset="1" stopColor="hsl(250 100% 62%)" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </span>
              </span>
              <span className="block overflow-hidden">
                <span data-line className="block">success.</span>
              </span>
            </h1>

            {/* Subhead */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.85 }}
              className="mt-8 max-w-xl text-[17px] md:text-[18px] leading-[1.55] text-muted-foreground font-normal"
            >
              A senior engineering studio shipping AI, cloud and 3D-native
              products. Architecture-grade craft, measurable business outcomes —
              from the first commit to year five.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <a href="#contact" className="btn-primary group">
                Start a Project
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
              <a href="#work" className="btn-ghost group">
                See Our Work
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </motion.div>

            {/* Trust micro-line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.4 }}
              className="mt-12 flex items-center gap-4 text-[12px] text-muted-foreground"
            >
              <div className="flex -space-x-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="size-7 rounded-full border-2 border-background"
                    style={{
                      background: `linear-gradient(135deg, hsl(${
                        220 + i * 15
                      } 70% 70%), hsl(${250 + i * 10} 80% 60%))`,
                    }}
                  />
                ))}
              </div>
              <span>
                Trusted by <span className="text-foreground font-medium">50+</span> teams ·
                avg. reply <span className="text-foreground font-medium">&lt; 12h</span>
              </span>
            </motion.div>
          </div>

          {/* RIGHT — minimal meta card (asymmetric, cols 9-12) */}
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1 }}
            className="lg:col-span-4 lg:col-start-9 lg:mt-12"
          >
            <div className="glass-strong rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                  Now shipping
                </span>
                <span className="text-[10px] font-mono text-primary">●  LIVE</span>
              </div>
              <div>
                <div className="text-[15px] font-medium text-foreground">
                  Helix Pay — v3.0
                </div>
                <div className="text-[13px] text-muted-foreground mt-0.5">
                  AI-native payments orchestration
                </div>
              </div>
              <div className="h-px bg-border/60" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-1">
                    Conversion
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    +312<span className="text-primary">%</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-1">
                    Time-to-ship
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    9<span className="text-muted-foreground/60">w</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>

        {/* Stats row */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-px bg-border/60 rounded-2xl overflow-hidden shadow-soft-sm border border-border/60">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.3 + i * 0.08 }}
              className="bg-card p-7 flex flex-col gap-2"
            >
              <div className="font-display font-bold text-4xl md:text-5xl tracking-tight leading-none">
                <span className="text-gradient">
                  <CountUp to={s.value} suffix={s.suffix} />
                </span>
              </div>
              <div className="text-[13px] text-muted-foreground font-medium">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trusted by — refined logo strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="mt-20 flex flex-col items-center gap-6"
        >
          <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
            Trusted by teams shipping at scale
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {CLIENTS.map((c) => (
              <span
                key={c}
                className="font-display font-semibold text-base tracking-[-0.01em] text-muted-foreground/70 hover:text-foreground transition-colors duration-300"
              >
                {c}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
