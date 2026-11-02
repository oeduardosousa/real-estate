"use client";

import { useRef } from "react";
import { ease } from "@/lib/motion/config";
import { gsap } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/use-motion";

/**
 * Custom cursor (DESIGN.md "Cursor effects"): a 12px follower ring beside the system cursor, which
 * stays visible. Over `[data-cursor="Label"]` a 72px disc with that label scales in; it hides over
 * text inputs. One element pair, transform and opacity only, pointer-events none. Fine pointers only.
 */
export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useMotion(({ mode }) => {
    const ring = ringRef.current;
    const disc = discRef.current;
    const label = labelRef.current;
    if (mode !== "full" || !ring || !disc || !label) return;

    gsap.set([ring, disc], { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });
    const discX = gsap.quickTo(disc, "x", { duration: 0.35, ease: "power3.out" });
    const discY = gsap.quickTo(disc, "y", { duration: 0.35, ease: "power3.out" });

    let visible = false;
    let state: "ring" | "disc" | "hidden" = "ring";

    const show = (next: typeof state, text?: string) => {
      if (next === state) return;
      state = next;
      if (text !== undefined) label.textContent = text;
      gsap.to(ring, {
        opacity: next === "ring" ? 1 : 0,
        scale: next === "ring" ? 1 : 0.4,
        duration: 0.16,
        ease: ease.out,
        overwrite: "auto",
      });
      gsap.to(disc, {
        opacity: next === "disc" ? 1 : 0,
        scale: next === "disc" ? 1 : 0.2,
        duration: 0.24,
        ease: ease.out,
        overwrite: "auto",
      });
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if (!visible) {
        visible = true;
        gsap.set([ring, disc], { x: event.clientX, y: event.clientY });
        gsap.to(ring, { opacity: 1, duration: 0.2 });
      }
      ringX(event.clientX);
      ringY(event.clientY);
      discX(event.clientX);
      discY(event.clientY);

      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("input, textarea, select")) {
        show("hidden");
        return;
      }
      const hot = target?.closest<HTMLElement>("[data-cursor]");
      if (hot) show("disc", hot.dataset.cursor);
      else show("ring");
    };

    const onLeave = () => {
      visible = false;
      gsap.to([ring, disc], { opacity: 0, duration: 0.16 });
      state = "hidden";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      gsap.set([ring, disc], { clearProps: "all" });
    };
  });

  return (
    <div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-loader hidden lg:block">
      <div
        ref={ringRef}
        className="absolute left-0 top-0 size-3 rounded-pill border-[1.5px] border-white opacity-0 mix-blend-difference"
      />
      <div
        ref={discRef}
        className="absolute left-0 top-0 grid size-[72px] place-items-center rounded-pill bg-pedra text-grafite opacity-0"
        style={{ transform: "scale(0.2)" }}
      >
        <span ref={labelRef} className="type-label" />
      </div>
    </div>
  );
}
