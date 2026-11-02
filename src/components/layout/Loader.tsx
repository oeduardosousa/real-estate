"use client";

import { useRef } from "react";
import { Ridge } from "@/components/ui/Ridge";
import { LOADER_STORAGE_KEY } from "@/lib/motion/init-script";
import { duration, ease, stagger } from "@/lib/motion/config";
import { gsap } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/use-motion";

const NAME = "Curral Residências";

/**
 * First-visit loading animation (DESIGN.md "Loading animation"). A fixed, ≤ 1.4s timeline that never
 * waits on assets: noite panel, wordmark fades in by characters (18ms) while the ridge draws left to
 * right, then the panel lifts away. The head script sets html[data-loader="on"] only on the first
 * visit (and never for reduced motion or save-data); CSS keeps this panel hidden otherwise, so it
 * can never block the first paint of the page underneath. The hero intro waits for "done".
 */
export function Loader() {
  const panelRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);
  const ridgeRef = useRef<HTMLDivElement>(null);

  useMotion(({ mode }) => {
    const root = document.documentElement;
    const panel = panelRef.current;
    if (!panel || root.dataset.loader !== "on") return;

    try {
      window.localStorage.setItem(LOADER_STORAGE_KEY, "1");
    } catch {
      // Storage can be blocked; the loader then plays again next visit.
    }

    const light = mode !== "full";
    const chars = gsap.utils.toArray<HTMLElement>("[data-char]", nameRef.current);
    const drawTime = light ? 0.7 : 0.9;
    const liftAt = light ? 0.75 : 0.95;
    const liftTime = light ? 0.4 : 0.45;

    const finish = () => {
      panel.removeAttribute("data-lifting");
      root.dataset.loader = "off";
    };

    const tl = gsap.timeline({ onComplete: finish });

    if (light) {
      gsap.set(chars, { opacity: 1 });
    } else {
      tl.fromTo(
        chars,
        { opacity: 0 },
        { opacity: 1, duration: duration.moderate, ease: ease.out, stagger: stagger.char },
        0,
      );
    }

    tl.fromTo(
      ridgeRef.current,
      { clipPath: "inset(-4px 100% -4px 0)" },
      { clipPath: "inset(-4px 0% -4px 0)", duration: drawTime, ease: ease.cinema },
      0.05,
    );

    tl.add(() => {
      panel.setAttribute("data-lifting", "");
      root.dataset.loader = "done";
    }, liftAt);
    tl.to(panel, { yPercent: -100, duration: liftTime, ease: ease.inOut }, liftAt);

    return () => {
      tl.kill();
      gsap.set(panel, { clearProps: "transform" });
      panel.removeAttribute("data-lifting");
      if (root.dataset.loader === "on" || root.dataset.loader === "done") root.dataset.loader = "off";
    };
  });

  return (
    <div
      ref={panelRef}
      aria-hidden="true"
      className="loader theme-noite fixed inset-0 z-loader place-items-center bg-bg text-fg"
    >
      <div className="w-[min(86vw,28rem)]">
        <p ref={nameRef} className="text-title font-normal tracking-[0.02em]">
          {Array.from(NAME).map((char, index) => (
            <span key={index} data-char className="pre-reveal inline-block whitespace-pre">
              {char}
            </span>
          ))}
        </p>
        <div ref={ridgeRef} className="ridge-draw mt-6 h-10 text-accent">
          <Ridge />
        </div>
      </div>
    </div>
  );
}
