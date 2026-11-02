"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { ease, pageTransition, type MotionMode } from "@/lib/motion/config";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { scrollTo } from "@/lib/motion/scroll";
import { useMotion } from "@/lib/motion/use-motion";

interface PageTransitionContextValue {
  /** Runs the exit animation, swaps the route, then lifts the panel away. */
  navigate: (href: string) => void;
  contentRef: RefObject<HTMLElement | null>;
}

const PageTransitionContext = createContext<PageTransitionContextValue | null>(null);

export function usePageTransition() {
  return useContext(PageTransitionContext);
}

const PANEL_HIDDEN = { yPercent: 100, visibility: "hidden", pointerEvents: "none" } as const;
const PANEL_COVERING = { visibility: "visible", pointerEvents: "auto" } as const;

/** If the route has not changed this long after the exit, lift anyway so nobody is left on a blank panel. */
const LIFT_FALLBACK_SECONDS = 2;

/**
 * Persistent shell for page transitions (DESIGN.md "Page transitions").
 * Exit: a noite panel rises over the page. Enter: it lifts away once the new route is in place.
 * Timings follow the motion mode; reduced motion swaps the route at once with a short fade.
 * The panel's flat top edge becomes the ridge profile when the ridge SVG is drawn (landing phase).
 * Always interruptible: a new navigation kills the running tween.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const modeRef = useRef<MotionMode>("full");
  const pathnameRef = useRef(pathname);
  const previousPathname = useRef(pathname);
  const navigating = useRef(false);
  const tween = useRef<gsap.core.Tween | null>(null);
  const fallback = useRef<gsap.core.Tween | null>(null);

  useMotion(({ mode }) => {
    modeRef.current = mode;
    const panel = panelRef.current;
    if (panel) gsap.set(panel, PANEL_HIDDEN);

    return () => {
      tween.current?.kill();
      fallback.current?.kill();
      if (panel) gsap.set(panel, PANEL_HIDDEN);
      navigating.current = false;
    };
  });

  const lift = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;
    fallback.current?.kill();
    tween.current?.kill();
    const { enter } = pageTransition[modeRef.current === "light" ? "light" : "full"];
    tween.current = gsap.to(panel, {
      yPercent: -100,
      duration: enter,
      ease: ease.inOut,
      onComplete: () => {
        gsap.set(panel, PANEL_HIDDEN);
      },
    });
  }, []);

  const navigate = useCallback(
    (href: string) => {
      const target = new URL(href, window.location.href);
      const panel = panelRef.current;

      // Same page (hash or query change) and reduced motion swap at once.
      if (target.pathname === pathnameRef.current || modeRef.current === "reduced" || !panel) {
        navigating.current = target.pathname !== pathnameRef.current;
        router.push(href);
        return;
      }

      navigating.current = true;
      tween.current?.kill();
      fallback.current?.kill();

      // Interrupting a lift: rise again from where the panel is. Otherwise start below the screen.
      if (getComputedStyle(panel).visibility === "hidden") {
        gsap.set(panel, { yPercent: 100 });
      }
      gsap.set(panel, PANEL_COVERING);

      const { exit } = pageTransition[modeRef.current === "light" ? "light" : "full"];
      tween.current = gsap.to(panel, {
        yPercent: 0,
        duration: exit,
        ease: ease.inOut,
        onComplete: () => {
          router.push(href);
          fallback.current = gsap.delayedCall(LIFT_FALLBACK_SECONDS, lift);
        },
      });
    },
    [lift, router],
  );

  // The new route is in place.
  useEffect(() => {
    pathnameRef.current = pathname;
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;

    const fromLink = navigating.current;
    navigating.current = false;
    const content = contentRef.current;

    if (fromLink) scrollTo(0, { immediate: true });
    content?.focus({ preventScroll: true });
    requestAnimationFrame(() => ScrollTrigger.refresh());

    if (modeRef.current === "reduced") {
      if (content) {
        gsap.fromTo(
          content,
          { opacity: 0 },
          { opacity: 1, duration: pageTransition.reducedFade, clearProps: "opacity" },
        );
      }
    } else if (fromLink) {
      lift();
    }
  }, [pathname, lift]);

  const value = useMemo(() => ({ navigate, contentRef }), [navigate]);

  return (
    <PageTransitionContext.Provider value={value}>
      {children}
      <div
        ref={panelRef}
        aria-hidden="true"
        className="theme-noite pointer-events-none invisible fixed inset-0 z-transition bg-bg"
      />
    </PageTransitionContext.Provider>
  );
}

/** The `<main>` landmark. Receives focus after a link-driven route change and fades in under reduced motion. */
export function PageContent({ children }: { children: ReactNode }) {
  const context = usePageTransition();
  return (
    <main id="conteudo" ref={context?.contentRef} tabIndex={-1} className="outline-none">
      {children}
    </main>
  );
}
