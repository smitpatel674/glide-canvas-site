import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "ghost";
  strength?: number;
}

/** Magnetic button — cursor distortion effect on hover. */
export const MagneticButton = ({
  children,
  variant = "primary",
  strength = 0.35,
  className,
  ...rest
}: MagneticButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });
  const rotX = useTransform(sy, [-30, 30], [8, -8]);
  const rotY = useTransform(sx, [-30, 30], [-8, 8]);

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const mx = e.clientX - r.left - r.width / 2;
    const my = e.clientY - r.top - r.height / 2;
    x.set(mx * strength);
    y.set(my * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy, rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-display font-semibold text-sm uppercase tracking-wider transition-colors duration-300",
        variant === "primary" &&
          "bg-primary text-primary-foreground shadow-glow hover:bg-primary/90",
        variant === "ghost" &&
          "glass-strong text-foreground hover:bg-white/[0.08]",
        className,
      )}
      {...(rest as React.ComponentProps<typeof motion.button>)}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
};
