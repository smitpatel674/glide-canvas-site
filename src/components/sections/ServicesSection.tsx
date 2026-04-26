import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Code2, Brain, Cloud, Layers, Smartphone, Boxes } from "lucide-react";
import ServiceMiniScene from "@/components/canvas/ServiceMiniScene";
import { CanvasErrorBoundary } from "@/components/canvas/CanvasErrorBoundary";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useIsMobile } from "@/hooks/useInViewCanvas";

const SERVICES = [
  { icon: Code2, title: "Product Engineering", desc: "Full-stack web & SaaS platforms built on Next.js, TypeScript and edge runtimes.", color: "#6C63FF" },
  { icon: Brain, title: "AI & ML Systems", desc: "RAG pipelines, agent infrastructure and custom model integrations in production.", color: "#00FFA3" },
  { icon: Cloud, title: "Cloud & DevOps", desc: "AWS, GCP, Vercel — IaC, observability and zero-downtime deploys.", color: "#A78BFA" },
  { icon: Layers, title: "3D & WebGL", desc: "Real-time R3F experiences, GLSL shaders and immersive product configurators.", color: "#6C63FF" },
  { icon: Smartphone, title: "Mobile Apps", desc: "Cross-platform React Native and native iOS/Android with offline-first sync.", color: "#00FFA3" },
  { icon: Boxes, title: "Design Systems", desc: "Token-driven component libraries that scale across teams and brands.", color: "#A78BFA" },
];

const Card = ({ s, idx }: { s: (typeof SERVICES)[number]; idx: number }) => {
  const ref = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState(false);
  const isMobile = useIsMobile();

  // 3D tilt on mouse move (desktop only)
  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (isMobile) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--tilt-x", `${py * -8}deg`);
    el.style.setProperty("--tilt-y", `${px * 8}deg`);
  };
  const onLeave = () => {
    setHovered(false);
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", `0deg`);
    el.style.setProperty("--tilt-y", `0deg`);
  };

  const Icon = s.icon;
  return (
    <article
      ref={ref}
      data-service-card
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group relative glass-strong rounded-3xl p-7 overflow-hidden perspective-1000 transition-colors duration-500 hover:border-primary/30"
      style={{
        transform:
          "perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))",
        transformStyle: "preserve-3d",
        transition: "transform 0.4s var(--ease-out-expo)",
      }}
    >
      {hovered && (
        <div className="absolute inset-0 opacity-40 pointer-events-none animate-fade-in">
          <CanvasErrorBoundary>
            <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 3], fov: 45 }}>
              <Suspense fallback={null}>
                <ServiceMiniScene color={s.color} />
              </Suspense>
            </Canvas>
          </CanvasErrorBoundary>
        </div>
      )}
      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <span
            className="inline-flex size-12 items-center justify-center rounded-2xl"
            style={{ background: `${s.color}1a`, color: s.color }}
          >
            <Icon className="size-5" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            0{idx + 1}
          </span>
        </div>
        <h3 className="font-display font-semibold text-lg">{s.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
      </div>
    </article>
  );
};

export const ServicesSection = () => {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrap.current) return;
    const ctx = gsap.context(() => {
      const cards = wrap.current!.querySelectorAll("[data-service-card]");
      ScrollTrigger.batch(cards, {
        start: "top 85%",
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { opacity: 0, y: 60, rotateX: -60, transformPerspective: 1000 },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration: 1,
              ease: "expo.out",
              stagger: 0.08,
              overwrite: true,
            },
          ),
      });
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={wrap}
      className="relative py-32 md:py-40 grid-bg"
      aria-label="Services"
    >
      <div className="container">
        <SectionHeader
          eyebrow="Services"
          title="Six disciplines. One delivery team."
          description="From discovery to scale-up, we cover the full product lifecycle with senior practitioners on every engagement."
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => (
            <Card key={s.title} s={s} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
