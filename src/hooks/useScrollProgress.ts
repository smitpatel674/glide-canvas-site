import { useScrollStore } from "@/store/scrollStore";

/** Subscribe to global Lenis-driven scroll progress (0..1). */
export const useScrollProgress = () => useScrollStore((s) => s.progress);
export const useScrollVelocity = () => useScrollStore((s) => s.velocity);
