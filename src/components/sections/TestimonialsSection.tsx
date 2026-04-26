import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote: "Nextron rebuilt our trading platform from a 2s to a 90ms TTI. They operate at a level we hadn't seen from any other partner.",
    name: "Elena Vasquez",
    role: "VP Engineering, Helix Pay",
  },
  {
    quote: "The 3D configurator they shipped doubled our enterprise demo close rate. Six weeks, end-to-end.",
    name: "Tomás Ribeiro",
    role: "CEO, Atlas Climate",
  },
  {
    quote: "They embedded a principal engineer in our team and it was like adding ten. We extended the contract twice.",
    name: "Priya Anand",
    role: "CTO, Vesper Health",
  },
  {
    quote: "Best AI implementation team we've worked with. They get the math AND ship production-grade code.",
    name: "Kenji Tanaka",
    role: "Head of AI, Northwind Studio",
  },
];

export const TestimonialsSection = () => {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setIdx((i) => (i + 1) % TESTIMONIALS.length), []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [paused, next]);

  return (
    <section
      className="relative py-32 md:py-40 overflow-hidden"
      aria-label="Testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0 -z-10 bg-gradient-radial opacity-60" />
      <div className="container">
        <SectionHeader eyebrow="Trusted by" title="Operators who've shipped with us." align="center" />

        <div className="mt-16 max-w-3xl mx-auto perspective-1000">
          <div className="relative h-[280px] md:h-[240px]">
            <AnimatePresence mode="wait">
              <motion.figure
                key={idx}
                initial={{ opacity: 0, y: 30, rotateX: 15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -30, rotateX: -15 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 glass-strong rounded-3xl p-8 md:p-10 flex flex-col justify-between"
                style={{ transformStyle: "preserve-3d" }}
              >
                <Quote className="size-7 text-primary opacity-60" />
                <blockquote className="font-display text-lg md:text-xl leading-snug text-foreground">
                  &ldquo;{TESTIMONIALS[idx].quote}&rdquo;
                </blockquote>
                <figcaption className="flex items-center justify-between text-sm">
                  <div>
                    <div className="font-display font-semibold">{TESTIMONIALS[idx].name}</div>
                    <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">
                      {TESTIMONIALS[idx].role}
                    </div>
                  </div>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Show testimonial ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === idx ? "w-8 bg-foreground" : "w-1.5 bg-foreground/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
