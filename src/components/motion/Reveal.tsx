"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Adds `.is-in` to an element the first time it scrolls into view. The CSS (base.css) does the motion,
 * so there is no animation library on this path. Reduced motion and no-JS never hide the element.
 */
export function useInView<T extends HTMLElement>(margin = "0px 0px -8% 0px") {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.documentElement.dataset.motion !== "full" || !("IntersectionObserver" in window)) {
      el.classList.add("is-in");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        el.classList.add("is-in");
        observer.disconnect();
      },
      { rootMargin: margin, threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [margin]);

  return ref;
}

interface RevealProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** Seconds. Staggers siblings. */
  delay?: number;
  id?: string;
  /** Above the fold: animates on load from CSS, without waiting for hydration (keeps LCP off the JS path). */
  eager?: boolean;
}

/** Fades and rises a block once, when it enters the viewport. */
export function Reveal({ as: Tag = "div", className = "", children, delay = 0, id, eager = false }: RevealProps) {
  const ref = useInView<HTMLElement>();
  return (
    <Tag ref={ref} id={id} className={`${eager ? "reveal-eager" : "reveal"} ${className}`} style={delay ? { ["--d" as string]: delay } : undefined}>
      {children}
    </Tag>
  );
}
