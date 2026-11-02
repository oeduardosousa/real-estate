"use client";

import { useEffect, type ReactNode } from "react";
import { MEDIA } from "@/lib/motion/config";
import { loadGsap } from "@/lib/motion/load-gsap";
import { useSiteReducedMotion } from "@/lib/motion/preference";
import { setLenis } from "@/lib/motion/scroll";
import { useMediaQuery } from "@/lib/motion/use-motion";

/**
 * One Lenis instance, driven by the GSAP ticker and synced with ScrollTrigger.
 * The native document scroller is kept (no scroller proxy). Lenis only runs in `full` mode;
 * touch and reduced motion keep native scroll and never download Lenis or GSAP for this.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const fullMode = useMediaQuery(MEDIA.full);
  const siteReduced = useSiteReducedMotion();
  const enabled = fullMode && !siteReduced;

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;

    void Promise.all([loadGsap(), import("lenis")]).then(([{ gsap, ScrollTrigger }, { default: Lenis }]) => {
      if (cancelled) return;
      const lenis = new Lenis({
        autoRaf: false,
        duration: 1.1,
        smoothWheel: true,
        syncTouch: false,
      });
      setLenis(lenis);

      const tick = (time: number) => lenis.raf(time * 1000);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      dispose = () => {
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        setLenis(null);
        lenis.destroy();
      };
    });

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [enabled]);

  return children;
}
