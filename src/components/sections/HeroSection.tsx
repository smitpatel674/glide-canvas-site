import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import HeroScene from "@/components/canvas/HeroScene";
import { CanvasErrorBoundary } from "@/components/canvas/CanvasErrorBoundary";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useInViewCanvas, useIsMobile } from "@/hooks/useInViewCanvas";

const STATS = [
  { value: 200, suffix: "+", label: "Shipped products", sub: "since 2014" },
  { value: 50, suffix: "+", label: "Global clients", sub: "across 14 countries" },
  { value: 98, suffix: "%", label: "Retention rate", sub: "year over year" },
];

const CLIENTS = ["VERCEL", "LINEAR", "STRIPE", "FIGMA", "NOTION", "ARC"];

const SHIPPING = [
  "AI agents · Helix Pay v3",
  "Realtime ops · Atlas Climate",
  "WebGL pitch · Vesper Health",
  "Design system · Northwind",
];

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

export const HeroSection = () => {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const { ref: canvasWrap, inView } = useInViewCanvas<HTMLDivElement>("100px");
  const isMobile = useIsMobile();

  // Char-by-char stagger reveal
  useEffect(() => {
    if (!headlineRef.current) return;
    const ctx = gsap.context(() => {
      const chars = headlineRef.current!.querySelectorAll<HTMLElement>("[data-char]");
      gsap.from(chars, {
        yPercent: 110,
        opacity: 0,
        duration: 1.15,
        ease: "expo.out",
        stagger: 0.018,
        delay: 0.35,
      });
    }, headlineRef);
    return () => ctx.revert();
  }, []);

  // Rotating "now shipping" ticker
  useEffect(() => {
    if (!tickerRef.current) return;
    const items = tickerRef.current.querySelectorAll<HTMLElement>("[data-ticker-item]");
    if (!items.length) return;
    const tl = gsap.timeline({ repeat: -1, defaults: { ease: "expo.inOut" } });
    items.forEach((_, i) => {
      const next = items[(i + 1) % items.length];
      tl.to(items[i], { yPercent: -110, opacity: 0, duration: 0.6 }, "+=2.2")
        .fromTo(next, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6 }, "<");
    });
    return () => {
      tl.kill();
    };
  }, []);

  const headline = "We engineer next digital success.";
  const words = headline.split(" ");

  return (
    <section
      id="top"
      className="relative min-h-[100svh] w-full overflow-hidden flex items-center"
      aria-label="Hero"
    >
      {/* Canvas background */}
      <div ref={canvasWrap} className="absolute inset-0 -z-10" aria-hidden>
        <CanvasErrorBoundary>
          <Canvas
            dpr={isMobile ? [1, 1.25] : [1, 1.75]}
            camera={{ position: [0, 0, 6], fov: 45 }}
            frameloop={inView ? "always" : "demand"}
            gl={{ antialias: !isMobile, alpha: true, powerPreference: "high-performance" }}
          >
            <Suspense fallback={null}>
              <HeroScene lite={isMobile} />
            </Suspense>
          </Canvas>
        </CanvasErrorBoundary>
        <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container relative z-10 pt-32 pb-24">
        {/* Status pill */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="inline-flex items-center gap-3 mb-8 pl-2 pr-4 py-1.5 rounded-full glass-strong text-[11px] font-mono uppercase tracking-[0.22em] text-muted-foreground"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full size-2 bg-accent" />
          </span>
          Booking Q3 · 2 slots left
          <span className="h-3 w-px bg-border/30" />
          <span className="text-foreground/70">Nextron Solution</span>
        </motion.div>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="font-display font-bold text-[clamp(2.25rem,7vw,5.75rem)] max-w-6xl leading-[0.95] tracking-tight"
          aria-label={headline}
        >
          {words.map((w, wi) => (
            <span key={wi} className="inline-block mr-[0.25em] last:mr-0">
              <span className="inline-flex overflow-hidden align-bottom">
                {w.split("").map((c, ci) => (
                  <span
                    key={ci}
                    data-char
                    className={
                      wi === words.length - 2
                        ? "inline-block text-gradient"
                        : "inline-block"
                    }
                  >
                    {c}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </h1>

        {/* Subhead split — left description, right meta */}
        <div className="mt-12 grid md:grid-cols-12 gap-8 md:gap-12 items-start">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="md:col-span-7 text-base md:text-lg leading-relaxed text-muted-foreground max-w-xl"
          >
            A senior engineering studio building <span className="text-foreground">AI-native, cloud and 3D</span> products
            for ambitious founders and enterprises. We pair architecture-grade
            craft with measurable business outcomes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.15 }}
            className="md:col-span-4 md:col-start-9 space-y-3 md:border-l md:border-border/10 md:pl-6"
          >
            <div className="flex items-baseline gap-3 text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
              <span className="text-accent">●</span> Now shipping
            </div>
            <div
              ref={tickerRef}
              className="relative h-6 overflow-hidden font-display text-base text-foreground"
            >
              {SHIPPING.map((s, i) => (
                <div
                  key={s}
                  data-ticker-item
                  className="absolute inset-0"
                  style={{
                    transform: i === 0 ? "translateY(0)" : "translateY(110%)",
                    opacity: i === 0 ? 1 : 0,
                  }}
                >
                  {s}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="mt-12 flex flex-wrap items-center gap-4"
        >
          <MagneticButton variant="primary">
            Start a project <ArrowRight className="size-4" />
          </MagneticButton>
          <MagneticButton variant="ghost" strength={0.2}>
            See our work <ArrowUpRight className="size-4" />
          </MagneticButton>
          <div className="flex items-center gap-3 ml-2 text-[11px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
            <span className="h-px w-8 bg-border/30" />
            Avg. reply &lt; 12h
          </div>
        </motion.div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.45 + i * 0.1 }}
              className="glass rounded-2xl p-5 flex flex-col gap-1.5"
            >
              <div className="font-display font-bold text-3xl md:text-4xl text-gradient leading-none">
                <CountUp to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-[10px] font-mono uppercase tracking-[0.2em] text-foreground">
                {s.label}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                {s.sub}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trusted by — logo strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="mt-16 flex flex-col gap-4"
        >
          <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
            <span className="h-px flex-1 bg-border/15 max-w-16" />
            Trusted by teams shipping at scale
            <span className="h-px flex-1 bg-border/15" />
          </div>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-3 opacity-70">
            {CLIENTS.map((c) => (
              <span
                key={c}
                className="font-display font-bold text-sm md:text-base tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
              >
                {c}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll cue + section index */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 inset-x-0 hidden md:flex items-end justify-between container pointer-events-none"
      >
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
          01 / 08 · Intro
        </div>
        <div className="flex flex-col items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
          Scroll
          <div className="relative h-12 w-px bg-border/20 overflow-hidden">
            <motion.div
              animate={{ y: ["-100%", "100%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent via-foreground to-transparent"
            />
          </div>
        </div>
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground text-right">
          NS-2014 / v4.2
          <br />
          <span className="text-foreground/50">Lat 40.7 · Lon -74.0</span>
        </div>
      </motion.div>
    </section>
  );
};
