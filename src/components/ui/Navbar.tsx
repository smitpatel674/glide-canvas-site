import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const links = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#team", label: "Team" },
  { href: "#contact", label: "Contact" },
];

export const Navbar = () => (
  <motion.header
    initial={{ y: -32, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
    className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(96%,1180px)]"
  >
    <nav
      aria-label="Primary"
      className="glass-strong rounded-full pl-4 pr-2 py-2 flex items-center justify-between"
    >
      <a href="#top" className="flex items-center gap-2.5 font-display font-semibold text-[15px] tracking-tight">
        <span className="inline-flex size-7 rounded-lg bg-gradient-primary shadow-glow" />
        <span>Nextron</span>
        <span className="text-muted-foreground hidden sm:inline font-normal">Solution</span>
      </a>
      <ul className="hidden md:flex items-center gap-1 text-[13px] font-medium text-muted-foreground">
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              className="px-3 py-1.5 rounded-full hover:text-foreground hover:bg-foreground/5 transition-colors duration-200"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
      <a
        href="#contact"
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors duration-300"
      >
        Start <ArrowUpRight className="size-3.5" />
      </a>
    </nav>
  </motion.header>
);
