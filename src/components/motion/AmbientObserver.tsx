"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Ambient loops (aurora, floating cards, marquee, clouds) should only cost anything while visible.
 * Every `[data-ambient]` element gets `data-offscreen="true"` when it leaves the viewport; CSS pauses its
 * animations and drops its decorative layers (see home.css). Re-scans on route change. Renders nothing.
 */
export function AmbientObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          (entry.target as HTMLElement).dataset.offscreen = String(!entry.isIntersecting);
        }
      },
      { rootMargin: "120px 0px" },
    );
    document.querySelectorAll("[data-ambient]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
