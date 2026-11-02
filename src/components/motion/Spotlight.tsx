"use client";

import { useEffect } from "react";

/**
 * One delegated listener for every `[data-spot]` surface: writes the pointer position into --px / --py
 * (percentages) so CSS can draw a soft radial glow under it. Fine pointers only; nothing is rendered here.
 */
export function Spotlight() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    let event: PointerEvent | null = null;

    const apply = () => {
      frame = 0;
      const target = (event?.target as Element | null)?.closest<HTMLElement>("[data-spot]");
      if (!target || !event) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--px", `${((event.clientX - rect.left) / rect.width) * 100}%`);
      target.style.setProperty("--py", `${((event.clientY - rect.top) / rect.height) * 100}%`);
    };
    const onMove = (next: PointerEvent) => {
      event = next;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
