"use client";

import { useRef, type ElementType } from "react";
import { duration, ease, stagger } from "@/lib/motion/config";
import { gsap, loadSplitText } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/use-motion";

interface SplitHeadingProps {
  as?: ElementType;
  className?: string;
  /** Plain text only: SplitText rewrites the element's children. */
  children: string;
  id?: string;
}

/**
 * Display and Headline text reveal (DESIGN.md "Text reveals"): line mask, `yPercent 110 → 0`, 60ms
 * stagger, `slow` + `ease-cinema`, at `top 85%`, once. The split waits for `document.fonts.ready` to
 * avoid layout shift, uses `aria: "auto"` so the heading still reads as one string, and re-splits on resize.
 * Reduced motion: a 200ms fade. Without JavaScript the heading is simply visible.
 */
export function SplitHeading({ as: Tag = "h2", className = "", children, id }: SplitHeadingProps) {
  const ref = useRef<HTMLElement>(null);

  useMotion(({ mode }) => {
    const el = ref.current;
    if (!el) return;

    if (mode === "reduced") {
      el.classList.remove("pre-reveal");
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: duration.slow, ease: ease.linear, clearProps: "opacity" });
      return;
    }

    let split: { revert: () => void } | undefined;
    let cancelled = false;
    let revealed = false;

    document.fonts.ready.then(async () => {
      const SplitText = await loadSplitText();
      if (cancelled) return;
      split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        aria: "auto",
        autoSplit: true,
        onSplit(self) {
          el.classList.remove("pre-reveal");
          gsap.set(el, { opacity: 1 });
          // A resize re-splits the text; lines that were already revealed stay revealed.
          if (revealed) return;
          return gsap.from(self.lines, {
            yPercent: 110,
            duration: duration.slow,
            ease: ease.cinema,
            stagger: stagger.line,
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
            onComplete: () => {
              revealed = true;
            },
          });
        },
      });
    });

    return () => {
      cancelled = true;
      split?.revert();
      el.classList.add("pre-reveal");
    };
  });

  return (
    <Tag ref={ref} id={id} className={`pre-reveal ${className}`}>
      {children}
    </Tag>
  );
}
