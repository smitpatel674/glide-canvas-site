import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ArrowUpRight } from "lucide-react";
import { useIsMobile } from "@/hooks/useInViewCanvas";

const PROJECTS = [
  {
    name: "Helix Pay",
    tag: "Fintech · 2024",
    metric: "+312% conversion",
    color: "from-violet-500/30 via-violet-500/5 to-transparent",
  },
  {
    name: "Atlas Climate",
    tag: "Climate · 2024",
    metric: "1.2M tCO₂ tracked",
    color: "from-emerald-400/30 via-emerald-400/5 to-transparent",
  },
  {
    name: "Vesper Health",
    tag: "Healthtech · 2023",
    metric: "$24M Series B",
    color: "from-pink-500/30 via-pink-500/5 to-transparent",
  },
  {
    name: "Northwind Studio",
    tag: "Creator tools · 2023",
    metric: "180k MAU",
    color: "from-cyan-400/30 via-cyan-400/5 to-transparent",
  },
  {
    name: "Orbital Logistics",
    tag: "Logistics · 2022",
    metric: "$8M ARR",
    color: "from-amber-400/30 via-amber-400/5 to-transparent",
  },
];

export const WorkSection = () => {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;
    if (!wrap.current || !track.current) return;
    const ctx = gsap.context(() => {
      const t = track.current!;
      gsap.to(t, {
        x: () => -(t.scrollWidth - window.innerWidth + 64),
        ease: "none",
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: () => `+=${t.scrollWidth}`,
          scrub: 0.9,
          pin: true,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });

      // Stat bars animate on enter
      gsap.utils.toArray<HTMLElement>("[data-stat-bar]").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "left 80%" },
          },
        );
      });
    }, wrap);
    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section
      id="work"
      ref={wrap}
      className={`relative overflow-hidden bg-background ${isMobile ? "py-24" : "h-[100svh]"}`}
      aria-label="Selected work"
    >
      <div className={`container z-10 pointer-events-none ${isMobile ? "relative mb-12" : "pt-16 md:pt-24 absolute top-0 inset-x-0"}`}>
        <SectionHeader eyebrow="Selected work" title="Outcomes worth scrolling for." />
      </div>

      <div
        ref={track}
        className={isMobile ? "container grid grid-cols-1 gap-5" : "flex items-center h-full gap-6 pl-[8vw] will-change-transform"}
        style={isMobile ? undefined : { width: "max-content" }}
      >
        {PROJECTS.map((p, i) => (
          <article
            key={p.name}
            className={`relative glass-strong overflow-hidden group ${isMobile ? "w-full rounded-2xl aspect-[5/4]" : "shrink-0 w-[80vw] md:w-[55vw] lg:w-[42vw] aspect-[4/5] rounded-3xl"}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${p.color}`} />
            {/* faux-image grain */}
            <div
              className="absolute inset-0 opacity-30 mix-blend-overlay"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 30% 30%, hsl(var(--primary)/0.4), transparent 60%), radial-gradient(circle at 70% 70%, hsl(var(--accent)/0.3), transparent 60%)",
              }}
            />
            <div className="absolute inset-0 grid-bg opacity-40" />

            <div className="absolute inset-0 p-7 md:p-10 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Case 0{i + 1} · {p.tag}
                </span>
                <ArrowUpRight className="size-5 text-foreground transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>

              <div className="space-y-5">
                <h3 className="font-display font-bold text-2xl md:text-3xl">
                  {p.name}
                </h3>
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em]">
                  <span className="text-muted-foreground">Outcome</span>
                  <span className="text-accent">{p.metric}</span>
                </div>
                <div className="h-px bg-foreground/10 origin-left" data-stat-bar />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
