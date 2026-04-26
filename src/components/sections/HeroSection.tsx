import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import HeroScene from "@/components/canvas/HeroScene";
import { CanvasErrorBoundary } from "@/components/canvas/CanvasErrorBoundary";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowRight, Sparkles } from "lucide-react";

const STATS = [
  { value: 200, suffix: "+", label: "Projects Delivered" },
  { value: 50, suffix: "+", label: "Global Clients" },
  { value: 10, suffix: "+", label: "Years of Engineering" },
];

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: to,
      duration: 2,
      ease: "power3.out",
      scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
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

  // Char-by-char stagger reveal (lightweight SplitText alternative — keeps a11y intact)
  useEffect(() => {
    if (!headlineRef.current) return;
    const ctx = gsap.context(() => {
      const chars = headlineRef.current!.querySelectorAll<HTMLElement>("[data-char]");
      gsap.from(chars, {
        yPercent: 110,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.02,
        delay: 0.3,
      });
    }, headlineRef);
    return () => ctx.revert();
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
      <div className="absolute inset-0 -z-10" aria-hidden>
        <CanvasErrorBoundary>
          <Canvas
            dpr={[1, 2]}
            camera={{ position: [0, 0, 6], fov: 45 }}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          >
            <Suspense fallback={null}>
              <HeroScene />
            </Suspense>
          </Canvas>
        </CanvasErrorBoundary>
        {/* Vignette + radial wash */}
        <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container relative z-10 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full glass text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground"
        >
          <Sparkles className="size-3.5 text-accent" />
          Nextron Solution · est. 2014
        </motion.div>

        <h1
          ref={headlineRef}
          className="font-display font-bold text-3xl md:text-4xl lg:text-5xl max-w-5xl leading-[0.95] tracking-tight"
          aria-label={headline}
        >
          {words.map((w, wi) => (
            <span key={wi} className="inline-block mr-[0.3em] last:mr-0">
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

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-8 max-w-xl text-base md:text-lg text-muted-foreground"
        >
          A senior engineering studio shipping AI, cloud and 3D-native products
          for ambitious founders and enterprises worldwide.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <MagneticButton variant="primary">
            Start a project <ArrowRight className="size-4" />
          </MagneticButton>
          <MagneticButton variant="ghost" strength={0.2}>
            See our work
          </MagneticButton>
        </motion.div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="glass rounded-2xl p-5 flex flex-col gap-1"
            >
              <div className="font-display font-bold text-2xl md:text-3xl text-gradient">
                <CountUp to={s.value} suffix={s.suffix} />
              </div>
              <div className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground"
      >
        Scroll
        <div className="h-12 w-px bg-gradient-to-b from-foreground/40 to-transparent" />
      </motion.div>
    </section>
  );
};
