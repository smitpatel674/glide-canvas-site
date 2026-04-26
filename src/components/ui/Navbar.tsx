import { motion } from "framer-motion";

const links = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#team", label: "Team" },
  { href: "#contact", label: "Contact" },
];

export const Navbar = () => (
  <motion.header
    initial={{ y: -40, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
    className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(96%,1100px)]"
  >
    <nav
      aria-label="Primary"
      className="glass-strong rounded-full px-5 md:px-7 py-3 flex items-center justify-between"
    >
      <a href="#top" className="flex items-center gap-2 font-display font-bold text-base">
        <span className="inline-flex size-7 rounded-md bg-gradient-primary shadow-glow" />
        <span>Nextron</span>
        <span className="text-muted-foreground hidden sm:inline">Solution</span>
      </a>
      <ul className="hidden md:flex items-center gap-7 text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="hover:text-foreground transition-colors duration-300">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
      <a
        href="#contact"
        className="text-xs font-display font-semibold uppercase tracking-wider px-4 py-2 rounded-full bg-foreground text-background hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
      >
        Start →
      </a>
    </nav>
  </motion.header>
);
