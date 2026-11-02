"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Ridge } from "@/components/ui/Ridge";
import type { ListingCore } from "@/data/types";
import { ease } from "@/lib/motion/config";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { scrollTo } from "@/lib/motion/scroll";
import { useMotion } from "@/lib/motion/use-motion";
import { ListingCard } from "./ListingCard";

const CARD_STAGGER = 0.07;
const PROGRESS_START = "inset(-4px 100% -4px 0)";

const progressClip = (progress: number) => `inset(-4px ${((1 - progress) * 100).toFixed(2)}% -4px 0)`;
const getCards = (track: HTMLElement | null) => Array.from(track?.children ?? []) as HTMLElement[];

function IconButton({
  label,
  onClick,
  children,
  disabled,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-11 place-items-center border border-line text-fg transition-[color,background-color,opacity] duration-fast ease-out enabled:hover:bg-fg enabled:hover:text-bg disabled:opacity-40"
    >
      {children}
    </button>
  );
}

/**
 * The featured-property track (DESIGN.md "Horizontal scroll"). One DOM, two behaviours:
 * - full (desktop, fine pointer, ≥ 560px tall): the section pins and the track's translateX is scrubbed to
 *   scroll. Prev/next scroll the page to the neighbouring card; focusing an off-screen card does the same,
 *   so keyboard users never get stuck. A "Ver todos os imóveis" link sits before the pin.
 * - everything else: a native overflow-x scroller with snap points, 80vw cards and visible arrows.
 */
export function FeaturedTrack({ listings }: { listings: readonly ListingCore[] }) {
  const pinRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{ trigger: ScrollTrigger | null; mode: "full" | "native" }>({
    trigger: null,
    mode: "native",
  });
  const [position, setPosition] = useState({ atStart: true, atEnd: false });

  /** Index of the card the viewer is on, from the scroll progress (full) or scrollLeft (native). */
  const currentIndex = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return 0;
    const list = getCards(trackRef.current);
    const offset = stateRef.current.mode === "full" ? -(gsap.getProperty(track, "x") as number) : viewport.scrollLeft;
    let best = 0;
    list.forEach((card, index) => {
      if (Math.abs(card.offsetLeft - offset) < Math.abs(list[best].offsetLeft - offset)) best = index;
    });
    return best;
  }, []);

  const goTo = useCallback((index: number) => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const list = getCards(trackRef.current);
    const card = list[Math.max(0, Math.min(list.length - 1, index))];
    if (!viewport || !track || !card) return;

    const { mode, trigger } = stateRef.current;
    if (mode === "full" && trigger) {
      const distance = track.scrollWidth - viewport.clientWidth;
      const target = Math.min(card.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft), distance);
      const progress = distance > 0 ? target / distance : 0;
      scrollTo(trigger.start + progress * (trigger.end - trigger.start));
    } else {
      viewport.scrollTo({
        left: card.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft),
        behavior: document.documentElement.dataset.motion === "reduced" ? "auto" : "smooth",
      });
    }
  }, []);

  const updatePosition = useCallback((atStart: boolean, atEnd: boolean) => {
    setPosition((prev) => (prev.atStart === atStart && prev.atEnd === atEnd ? prev : { atStart, atEnd }));
  }, []);

  const updateNative = useCallback(() => {
    const viewport = viewportRef.current;
    const bar = progressRef.current;
    if (!viewport || !bar || stateRef.current.mode === "full") return;
    const max = viewport.scrollWidth - viewport.clientWidth;
    const progress = max > 0 ? viewport.scrollLeft / max : 0;
    bar.style.clipPath = progressClip(progress);
    updatePosition(viewport.scrollLeft < 4, viewport.scrollLeft > max - 4);
  }, [updatePosition]);

  useMotion(
    ({ mode }) => {
      const pin = pinRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      const bar = progressRef.current;
      if (!pin || !viewport || !track || !bar) return;

      if (mode !== "full") {
        stateRef.current = { trigger: null, mode: "native" };
        updateNative();
        return;
      }

      const distance = () => Math.max(track.scrollWidth - viewport.clientWidth, 0);

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: ease.linear,
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set(bar, { clipPath: progressClip(self.progress) });
            updatePosition(self.progress < 0.01, self.progress > 0.99);
          },
        },
      });
      stateRef.current = { trigger: tween.scrollTrigger ?? null, mode: "full" };

      // Cards rise in one after another as the section first comes into view.
      gsap.from(getCards(trackRef.current), {
        opacity: 0,
        y: 32,
        duration: 0.7,
        ease: ease.cinema,
        stagger: CARD_STAGGER,
        scrollTrigger: { trigger: pin, start: "top 80%", once: true },
      });

      // A focused card can never sit off-screen: bring it into view by scrolling the page.
      const onFocusIn = (event: FocusEvent) => {
        viewport.scrollLeft = 0;
        const card = (event.target as Element).closest("li");
        const index = card ? getCards(trackRef.current).indexOf(card as HTMLElement) : -1;
        if (index >= 0) goTo(index);
      };
      viewport.addEventListener("focusin", onFocusIn);

      document.fonts.ready.then(() => ScrollTrigger.refresh());

      return () => {
        viewport.removeEventListener("focusin", onFocusIn);
        gsap.set(bar, { clipPath: PROGRESS_START });
        stateRef.current = { trigger: null, mode: "native" };
      };
    },
    { scope: pinRef, dependencies: [listings.length, updateNative, updatePosition, goTo] },
  );

  // Native mode: keep the progress ridge and arrow state in sync with the scroller.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.addEventListener("scroll", updateNative, { passive: true });
    window.addEventListener("resize", updateNative);
    updateNative();
    return () => {
      viewport.removeEventListener("scroll", updateNative);
      window.removeEventListener("resize", updateNative);
    };
  }, [updateNative]);

  return (
    <div ref={pinRef} className="track-pin">
      <div ref={viewportRef} className="track-viewport">
        <ul
          ref={trackRef}
          aria-label="Imóveis em destaque"
          className="flex w-max items-start gap-4 px-gutter sm:gap-6"
        >
          {listings.map((listing, index) => (
            <li key={listing.id} className="track-card shrink-0">
              <ListingCard listing={listing} index={index} />
            </li>
          ))}
        </ul>
      </div>

      <div className="container-page mt-10 flex items-center gap-6 lg:mt-14">
        <div className="flex gap-2">
          <IconButton label="Imóvel anterior" disabled={position.atStart} onClick={() => goTo(currentIndex() - 1)}>
            <ArrowLeft size={20} strokeWidth={1.5} aria-hidden="true" />
          </IconButton>
          <IconButton label="Próximo imóvel" disabled={position.atEnd} onClick={() => goTo(currentIndex() + 1)}>
            <ArrowRight size={20} strokeWidth={1.5} aria-hidden="true" />
          </IconButton>
        </div>
        <div aria-hidden="true" className="relative h-10 flex-1 text-line">
          <Ridge className="h-full" />
          <div className="absolute inset-0 text-accent">
            <div ref={progressRef} className="h-full" style={{ clipPath: PROGRESS_START }}>
              <Ridge className="h-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
