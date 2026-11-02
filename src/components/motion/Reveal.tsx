"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { duration, ease } from "@/lib/motion/config";
import { gsap } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/use-motion";

interface RevealProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** Seconds. Used to stagger siblings (cards 70ms apart). */
  delay?: number;
  id?: string;
}

/**
 * Block reveal for body copy and small groups: fades and rises 12px as one block (never line by line),
 * once, at `top 88%`. Reduced motion: a 200ms fade. Visible without JavaScript.
 */
export function Reveal({ as: Tag = "div", className = "", children, delay = 0, id }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useMotion(({ mode }) => {
    const el = ref.current;
    if (!el) return;

    if (mode === "reduced") {
      el.classList.remove("pre-reveal");
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: duration.slow, ease: ease.linear, clearProps: "opacity" });
      return;
    }

    gsap.fromTo(
      el,
      { opacity: 0, y: mode === "light" ? 24 : 12 },
      {
        opacity: 1,
        y: 0,
        duration: mode === "light" ? 0.6 : duration.slow,
        delay,
        ease: ease.cinema,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onStart: () => el.classList.remove("pre-reveal"),
        onComplete: () => gsap.set(el, { clearProps: "opacity,transform" }),
      },
    );

    return () => {
      el.classList.add("pre-reveal");
    };
  });

  return (
    <Tag ref={ref} id={id} className={`pre-reveal ${className}`}>
      {children}
    </Tag>
  );
}
