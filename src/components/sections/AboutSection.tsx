import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RibbonScene from "@/components/canvas/RibbonScene";
import { CanvasErrorBoundary } from "@/components/canvas/CanvasErrorBoundary";
import { useInViewCanvas, useIsMobile } from "@/hooks/useInViewCanvas";

const PANELS = [
  {
    n: "01",
    title: "Vision",
    body: "We design products that anticipate the next decade — not just the next sprint. Long-horizon engineering, applied today.",
  },
  {
    n: "02",
    title: "Approach",
    body: "Strategy, design, engineering and ops in one room. Tight feedback loops, brutal honesty, zero ceremony.",
  },
  {
    n: "03",
    title: "Impact",
    body: "Shipped products powering category leaders in fintech, climate, health and creator tools across 4 continents.",
  },
];

export const AboutSection = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { ref: canvasWrap, inView } = useInViewCanvas<HTMLDivElement>("150px");
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;
    if (!wrapRef.current || !trackRef.current) return;
    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      // Pinned horizontal scroll — distance = full track width minus viewport
      const tween = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      return () => {
        tween.kill();
        ScrollTrigger.refresh();
      };
    }, wrapRef);
    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section
      id="about"
      ref={wrapRef}
      className={`relative w-full overflow-hidden bg-background ${isMobile ? "py-24" : "h-[100svh]"}`}
      aria-label="Philosophy"
    >
      <div ref={canvasWrap} className={`absolute inset-0 -z-10 ${isMobile ? "opacity-35" : "opacity-70"}`} aria-hidden>
        <CanvasErrorBoundary>
          <Canvas
            dpr={isMobile ? [1, 1.25] : [1, 1.75]}
            camera={{ position: [0, 0, 6], fov: 50 }}
            frameloop={inView ? "always" : "demand"}
            gl={{ antialias: !isMobile, powerPreference: "high-performance" }}
          >
            <Suspense fallback={null}>
              <RibbonScene lite={isMobile} />
            </Suspense>
          </Canvas>
        </CanvasErrorBoundary>
      </div>

      <div
        ref={trackRef}
        className={isMobile ? "container flex flex-col gap-6" : "flex h-full items-center will-change-transform"}
        style={isMobile ? undefined : { width: "max-content" }}
      >
        {/* intro panel */}
        <div className={isMobile ? "" : "w-[100vw] flex items-center justify-center px-6 md:px-16 shrink-0"}>
          <div className="max-w-xl">
            <div className="text-xs font-mono uppercase tracking-[0.3em] text-accent mb-4">
              Philosophy
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl leading-[1.05] tracking-tight">
              We build like it&apos;s the only product in the world.
            </h2>
            <p className="mt-6 text-base text-muted-foreground max-w-md">
              Three principles guide every engagement — vision, approach and
              measurable impact.{!isMobile ? " Scroll →" : ""}
            </p>
          </div>
        </div>

        {PANELS.map((p) => (
          <article
            key={p.n}
            className={`glass-strong p-8 md:p-12 flex flex-col justify-between ${isMobile ? "min-h-[320px] rounded-2xl" : "w-[80vw] md:w-[60vw] lg:w-[44vw] mx-6 md:mx-10 shrink-0 rounded-3xl h-[60vh]"}`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {p.n} / 03
              </span>
              <span className="size-2 rounded-full bg-accent shadow-mint" />
            </div>
            <div>
              <h3 className="font-display font-bold text-2xl md:text-3xl text-gradient">
                {p.title}
              </h3>
              <p className="mt-5 text-base text-muted-foreground max-w-md">
                {p.body}
              </p>
            </div>
          </article>
        ))}

        {/* spacer */}
        {!isMobile && <div className="w-[20vw] shrink-0" aria-hidden />}
      </div>
    </section>
  );
};
