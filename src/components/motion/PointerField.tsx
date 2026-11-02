"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface PointerFieldProps {
  className?: string;
  children: ReactNode;
  "aria-labelledby"?: string;
  "data-ambient"?: boolean;
}

/**
 * A section that publishes the pointer position as --mx / --my in [-1, 1], eased in CSS by the layers
 * that read it (`translate: calc(var(--mx) * ...)`). One rAF-throttled listener, fine pointers only,
 * and nothing happens under reduced motion. No JS animation runs here: it only writes two variables.
 */
export function PointerField({ className = "", children, ...rest }: PointerFieldProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (document.documentElement.dataset.motion !== "full") return;

    let frame = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      frame = 0;
      el.style.setProperty("--mx", x.toFixed(3));
      el.style.setProperty("--my", y.toFixed(3));
    };
    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      x = 0;
      y = 0;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={ref} className={className} {...rest}>
      {children}
    </section>
  );
}
