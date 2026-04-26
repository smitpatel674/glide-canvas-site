import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * useGsapTimeline — creates a paused GSAP timeline scoped to a ref,
 * cleans up on unmount. Pass a builder fn that receives (tl, ctx).
 */
export function useGsapTimeline<T extends HTMLElement>(
  build: (tl: gsap.core.Timeline, scope: T) => void,
  deps: React.DependencyList = [],
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      build(tl, ref.current as T);
    }, ref);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
