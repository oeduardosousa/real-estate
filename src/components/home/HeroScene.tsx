"use client";

import { useRef } from "react";
import { Ridge, RidgeFill } from "@/components/ui/Ridge";
import { duration, ease } from "@/lib/motion/config";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { onIntroReady } from "@/lib/motion/intro";
import { useMotion } from "@/lib/motion/use-motion";

/**
 * The layered still behind the hero: flat alvorada sky, two tonal ridge layers and the page-coloured
 * ground whose crest is the 1px ridge line. When photography arrives it replaces the sky layer; the
 * ridge line stays in the foreground (DESIGN.md "Imagery").
 *
 * Motion: the scene settles (scale 1.12 → 1 over `epic`; 1.06 over 1.2s on mobile), the ridge line
 * draws left to right, and on desktop the two ridge layers drift at 6–10% while the hero scrolls out.
 * Reduced motion: final state, no tweens. Without JavaScript the scene is simply visible.
 */
export function HeroScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const farRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useMotion(({ mode }) => {
    const scene = sceneRef.current;
    const line = lineRef.current;
    if (mode === "reduced" || !scene || !line) {
      if (line) gsap.set(line, { clipPath: "inset(-4px 0% -4px 0)" });
      return;
    }

    const full = mode === "full";
    gsap.set(scene, { scale: full ? 1.12 : 1.06, willChange: "transform" });
    gsap.set(line, { clipPath: "inset(-4px 100% -4px 0)" });

    const intro = gsap.timeline({ paused: true });
    intro
      .to(scene, { scale: 1, duration: full ? duration.epic : duration.cinematic, ease: ease.cinema })
      .to(
        line,
        {
          clipPath: "inset(-4px 0% -4px 0)",
          duration: full ? duration.cinematic : duration.slow,
          ease: ease.cinema,
        },
        0.35,
      )
      .set(scene, { clearProps: "willChange" });

    const cancel = onIntroReady(() => intro.play());

    if (full) {
      const drift = (el: HTMLElement | null, yPercent: number) =>
        el &&
        gsap.to(el, {
          yPercent,
          ease: "none",
          scrollTrigger: { trigger: scene.parentElement, start: "top top", end: "bottom top", scrub: true },
        });
      drift(farRef.current, 10);
      drift(midRef.current, 6);
    }

    return () => {
      cancel();
      intro.kill();
      ScrollTrigger.refresh();
    };
  });

  return (
    <div ref={sceneRef} aria-hidden="true" className="hero-settle absolute inset-0 overflow-hidden bg-sky-alvorada">
      <div ref={farRef} className="absolute bottom-0 left-0 h-[34%] w-[260%] -translate-x-[30%] md:inset-x-0 md:h-[52%] md:w-auto md:translate-x-0 text-[color-mix(in_srgb,var(--sky-dia)_75%,var(--sky-alvorada))]">
        <RidgeFill shape="far" />
      </div>
      <div ref={midRef} className="absolute bottom-0 left-0 h-[26%] w-[220%] -translate-x-[8%] md:inset-x-0 md:h-[38%] md:w-auto md:translate-x-0 text-[color-mix(in_srgb,var(--serra-muted)_32%,var(--sky-alvorada))]">
        <RidgeFill shape="mid" />
      </div>
      <div className="absolute bottom-0 left-0 h-[17%] w-[200%] -translate-x-[40%] text-bg md:inset-x-0 md:h-[26%] md:w-auto md:translate-x-0">
        <RidgeFill shape="main" />
      </div>
      <div ref={lineRef} className="ridge-draw absolute bottom-0 left-0 h-[17%] w-[200%] -translate-x-[40%] text-grafite md:inset-x-0 md:h-[26%] md:w-auto md:translate-x-0">
        <Ridge className="h-full" />
      </div>
    </div>
  );
}
