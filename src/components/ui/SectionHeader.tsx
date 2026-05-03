import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export const SectionHeader = ({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: Props) => (
  <div
    className={cn(
      "max-w-3xl",
      align === "center" && "mx-auto text-center",
      className,
    )}
  >
    {eyebrow && (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full glass text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground"
      >
        <span className="size-1.5 rounded-full bg-accent shadow-mint" />
        {eyebrow}
      </motion.div>
    )}
    <motion.h2
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-foreground"
    >
      {title}
    </motion.h2>
    {description && (
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
        className="mt-5 text-base text-muted-foreground max-w-xl"
      >
        {description}
      </motion.p>
    )}
  </div>
);
