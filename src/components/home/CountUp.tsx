"use client";

import { useRef } from "react";
import { useMotion, useNearViewport } from "@/lib/motion/use-motion";

/** "R$ 1,2 bi" → prefix "R$ ", number 1.2 (one decimal), suffix " bi". */
function parse(value: string) {
  const match = value.match(/^(\D*?)(\d+(?:[.,]\d+)?)(.*)$/);
  if (!match) return null;
  const [, prefix, raw, suffix] = match;
  const decimals = raw.includes(",") ? raw.split(",")[1].length : 0;
  return { prefix, target: Number(raw.replace(",", ".")), decimals, suffix };
}

/**
 * Counts up to `value` once, when it scrolls into view. The final text is in the markup, so no-JS and
 * reduced motion show the real number; the count only runs in the animated modes.
 */
export function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const near = useNearViewport(ref);

  useMotion(({ mode, gsap }) => {
    const el = ref.current;
    const parsed = parse(value);
    if (mode === "reduced" || !el || !parsed) return;

    const { prefix, target, decimals, suffix } = parsed;
    const format = (n: number) =>
      prefix + n.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
    const state = { n: 0 };
    el.textContent = format(0);

    gsap.to(state, {
      n: target,
      duration: 2,
      ease: "power3.out",
      onUpdate: () => {
        el.textContent = format(state.n);
      },
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });

    return () => {
      el.textContent = value;
    };
  }, { enabled: near });

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
