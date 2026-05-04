import { ArrowUpRight } from "lucide-react";

const COLS = [
  {
    title: "Studio",
    links: ["About", "Approach", "Team", "Careers", "Press"],
  },
  {
    title: "Work",
    links: ["Selected", "Case studies", "Industries", "Awards"],
  },
  {
    title: "Services",
    links: ["Engineering", "Product design", "AI & ML", "Cloud", "3D / WebGL"],
  },
  {
    title: "Contact",
    links: ["hello@nextron.studio", "+1 (415) 555-0142", "New York · Lisbon"],
  },
];

export const Footer = () => (
  <footer
    id="footer"
    className="relative bg-background border-t border-border/60 noise"
    aria-label="Footer"
  >
    {/* Soft top wash */}
    <div
      aria-hidden
      className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
    />
    <div
      aria-hidden
      className="absolute inset-x-0 -top-32 h-32 pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse at 50% 100%, hsl(250 100% 68% / 0.10), transparent 70%)",
      }}
    />

    <div className="container pt-24 pb-10">
      {/* CTA strip */}
      <div className="grid lg:grid-cols-12 gap-10 pb-20 border-b border-border/60">
        <div className="lg:col-span-7">
          <h2 className="font-display font-bold text-[clamp(2rem,4.5vw,3.75rem)] leading-[1] tracking-[-0.035em] text-foreground">
            Have a project worth <br />
            <span className="text-gradient italic font-semibold">building right?</span>
          </h2>
          <p className="mt-6 max-w-md text-[16px] text-muted-foreground leading-relaxed">
            Tell us where you want to be in 18 months. We'll come back with an
            honest plan within 48 hours.
          </p>
        </div>
        <div className="lg:col-span-5 lg:col-start-8 flex lg:justify-end items-end">
          <a
            href="#contact"
            className="btn-primary group text-base px-7 py-4"
          >
            Start a Project
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>

      {/* Sitemap grid */}
      <div className="grid lg:grid-cols-12 gap-10 py-16">
        <div className="lg:col-span-4">
          <a href="#top" className="inline-flex items-center gap-2.5">
            <span className="inline-flex size-8 rounded-lg bg-gradient-primary shadow-glow" />
            <span className="font-display font-bold text-lg tracking-tight">
              Nextron <span className="text-muted-foreground font-normal">Solution</span>
            </span>
          </a>
          <p className="mt-5 max-w-xs text-[14px] text-muted-foreground leading-relaxed">
            Senior engineering studio. Building AI, cloud and 3D-native products
            since 2014.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-[12px] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            All systems operational
          </div>
        </div>

        <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-mono uppercase tracking-[0.22em] text-muted-foreground mb-5">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-[14px] text-foreground/80 hover:text-foreground transition-colors duration-200"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Wordmark */}
      <div className="py-12 border-t border-border/60 overflow-hidden">
        <div className="font-display font-bold text-gradient leading-none tracking-[-0.06em] text-[clamp(4rem,18vw,16rem)] select-none">
          NEXTRON
        </div>
      </div>

      {/* Meta line */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-6 text-[12px] text-muted-foreground">
        <div>© {new Date().getFullYear()} Nextron Solution. All rights reserved.</div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
          <span className="font-mono">v4.2 · NS-2014</span>
        </div>
      </div>
    </div>
  </footer>
);
