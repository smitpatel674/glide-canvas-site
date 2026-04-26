import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeader } from "@/components/ui/SectionHeader";

const TEAM = [
  { name: "Aria Lindqvist", role: "Co-founder · CTO", initials: "AL", grad: "from-violet-500/40 to-fuchsia-500/20" },
  { name: "Marcus Okafor", role: "Head of Engineering", initials: "MO", grad: "from-emerald-400/40 to-cyan-500/20" },
  { name: "Sofia Reyes", role: "Design Director", initials: "SR", grad: "from-pink-500/40 to-amber-400/20" },
  { name: "Jin Park", role: "Principal AI Engineer", initials: "JP", grad: "from-blue-500/40 to-violet-500/20" },
  { name: "Hana Berger", role: "Head of Product", initials: "HB", grad: "from-amber-400/40 to-rose-500/20" },
  { name: "Diego Costa", role: "Staff DevOps", initials: "DC", grad: "from-cyan-400/40 to-emerald-500/20" },
];

export const TeamSection = () => {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrap.current) return;
    const ctx = gsap.context(() => {
      const cards = wrap.current!.querySelectorAll("[data-team-card]");
      ScrollTrigger.batch(cards, {
        start: "top 85%",
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { opacity: 0, y: 80, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "expo.out", stagger: 0.08, overwrite: true },
          ),
      });
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <section id="team" ref={wrap} className="relative py-32 md:py-40" aria-label="Team">
      <div className="container">
        <SectionHeader
          eyebrow="Team"
          title="Senior people. No layers."
          description="A compact crew of principal engineers, designers and operators. Every name on a project is a name in the room."
        />
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TEAM.map((m) => (
            <article
              key={m.name}
              data-team-card
              className="group relative glass-strong rounded-3xl overflow-hidden aspect-[4/5]"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${m.grad}`} />
              <div
                className="absolute inset-0 opacity-50 mix-blend-overlay"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 50% 30%, hsl(var(--foreground)/0.3), transparent 60%)",
                }}
              />
              {/* Glitch-line decorations */}
              <div className="absolute inset-x-0 top-1/3 h-px bg-foreground/20 group-hover:translate-x-3 transition-transform duration-700" />
              <div className="absolute inset-x-0 top-2/3 h-px bg-foreground/10 group-hover:-translate-x-3 transition-transform duration-700" />

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display font-bold text-5xl text-foreground/90 transition-transform duration-700 group-hover:scale-110">
                  {m.initials}
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6 flex items-end justify-between">
                <div>
                  <h3 className="font-display font-semibold text-base">{m.name}</h3>
                  <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mt-1">
                    {m.role}
                  </p>
                </div>
                <span className="size-2 rounded-full bg-accent shadow-mint" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
