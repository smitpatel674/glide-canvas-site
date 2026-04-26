import { create } from "zustand";

/**
 * Global scroll state shared between DOM (Lenis-driven) and R3F canvases.
 * Updated from a single Lenis listener in <SmoothScrollProvider/>.
 *
 * - progress: 0..1 page scroll
 * - velocity: lenis.velocity (px/ms-ish, signed)
 * - scrollY:  raw pixels
 */
interface ScrollState {
  progress: number;
  velocity: number;
  scrollY: number;
  setScroll: (s: Partial<Pick<ScrollState, "progress" | "velocity" | "scrollY">>) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  velocity: 0,
  scrollY: 0,
  setScroll: (s) => set(s),
}));
