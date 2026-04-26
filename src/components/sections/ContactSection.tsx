import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { gsap } from "gsap";
import ContactScene from "@/components/canvas/ContactScene";
import { CanvasErrorBoundary } from "@/components/canvas/CanvasErrorBoundary";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { useInViewCanvas, useIsMobile } from "@/hooks/useInViewCanvas";

const FIELDS = [
  { name: "name", label: "Your name", type: "text", placeholder: "Ada Lovelace" },
  { name: "email", label: "Email", type: "email", placeholder: "ada@studio.com" },
  { name: "company", label: "Company", type: "text", placeholder: "Analytical Engines Ltd." },
  { name: "budget", label: "Budget (USD)", type: "text", placeholder: "$50k – $250k" },
] as const;

export const ContactSection = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const { ref: canvasWrap, inView } = useInViewCanvas<HTMLDivElement>("150px");
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!formRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-field]", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: formRef.current, start: "top 75%" },
      });
    }, formRef);
    return () => ctx.revert();
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Message received — we'll be in touch within 24h.");
      formRef.current?.reset();
    }, 900);
  };

  return (
    <section id="contact" className="relative min-h-[100svh] py-32 overflow-hidden" aria-label="Contact">
      {/* R3F background */}
      <div ref={canvasWrap} className="absolute inset-0 -z-10 opacity-80" aria-hidden>
        <CanvasErrorBoundary>
          <Canvas
            dpr={isMobile ? [1, 1.25] : [1, 1.5]}
            camera={{ position: [0, 0, 4], fov: 50 }}
            frameloop={inView ? "always" : "demand"}
            gl={{ antialias: false, powerPreference: "high-performance" }}
          >
            <Suspense fallback={null}>
              <ContactScene />
            </Suspense>
          </Canvas>
        </CanvasErrorBoundary>
        <div className="absolute inset-0 bg-background/40" />
      </div>

      <div className="container">
        <SectionHeader
          eyebrow="Let's build"
          title="Tell us what you're shipping."
          description="Drop a few lines. A senior engineer (not a sales rep) replies within 24 hours."
        />

        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="mt-16 max-w-3xl glass-strong rounded-3xl p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {FIELDS.map((f) => (
            <label key={f.name} data-field className="flex flex-col gap-2">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
                {f.label}
              </span>
              <input
                name={f.name}
                type={f.type}
                placeholder={f.placeholder}
                required={f.name !== "company"}
                className="bg-transparent border-b border-border/20 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
              />
            </label>
          ))}

          <label data-field className="md:col-span-2 flex flex-col gap-2">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
              Project brief
            </span>
            <textarea
              name="brief"
              rows={4}
              placeholder="Goals, timelines, anything that gives us context…"
              required
              className="bg-transparent border-b border-border/20 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </label>

          <div data-field className="md:col-span-2 flex items-center justify-between pt-4">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
              Reply within 24h ·
              <span className="text-accent"> Stockholm / NYC</span>
            </span>
            <MagneticButton type="submit" disabled={submitting}>
              {submitting ? "Sending…" : "Send message"} <Send className="size-4" />
            </MagneticButton>
          </div>
        </form>

        <footer className="mt-24 pt-10 border-t border-border/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-5 rounded-md bg-gradient-primary" />
            <span>Nextron Solution © {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
            <a href="#" className="hover:text-foreground transition-colors">LinkedIn</a>
          </div>
        </footer>
      </div>
    </section>
  );
};
