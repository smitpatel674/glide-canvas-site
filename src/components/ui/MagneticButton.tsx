import { motion, useMotionValue, useSpring, useTransform, type HTMLMotionProps } from "framer-motion";
import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type MagneticButtonProps = Omit<HTMLMotionProps<"button">, "ref" | "children"> & {
  children: ReactNode;
  variant?: "primary" | "ghost";
  strength?: number;
};

/** Magnetic button — cursor distortion effect on hover. */
export const MagneticButton = ({
  children,
  variant = "primary",
  strength = 0.35,
  className,
  ...rest
}: MagneticButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const frame = useRef<number | null>(null);
  const [interactive, setInteractive] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const sx = useSpring(x, { stiffness: 180, damping: 20, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 180, damping: 20, mass: 0.5 });
  const rotX = useTransform(sy, [-24, 24], [6, -6]);
  const rotY = useTransform(sx, [-24, 24], [-6, 6]);

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!interactive || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const mx = e.clientX - r.left - r.width / 2;
    const my = e.clientY - r.top - r.height / 2;

    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      x.set(mx * strength);
      y.set(my * strength);
    });
  };
  const onLeave = () => {
    setInteractive(false);
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = null;
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onPointerEnter={() => setInteractive(window.matchMedia("(hover: hover) and (pointer: fine)").matches)}
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
      {...rest}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
};
