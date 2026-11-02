"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Ridge, RidgeFill } from "@/components/ui/Ridge";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { duration, ease } from "@/lib/motion/config";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/use-motion";
import { ridgeClipPolygon } from "@/lib/ridge";
import { skyColor, skyFill, storyBeats, type StoryBeat } from "./story-content";

const FRAME_CLIP = ridgeClipPolygon(14);
const SHOWN = "inset(-4px 0% -4px 0)";
const HIDDEN = "inset(-4px 100% -4px 0)";

const toneText = (tone: StoryBeat["tone"]) => (tone === "dark" ? "text-nevoa" : "text-grafite");
const toneLabel = (tone: StoryBeat["tone"]) => (tone === "dark" ? "text-nevoa" : "text-grafite-soft");
const toneGlyph = (tone: StoryBeat["tone"]) => (tone === "dark" ? "text-canga-claro" : "text-canga");

function BeatText({ beat, heading: Heading = "h2" }: { beat: StoryBeat; heading?: "h2" | "h3" }) {
  const last = beat.id === "noite";
  return (
    <>
      <SectionLabel tone={toneLabel(beat.tone)} glyph={toneGlyph(beat.tone)}>
        {beat.label}
      </SectionLabel>
      <Heading className="mt-6 max-w-[14ch] text-display-xl">{beat.title}</Heading>
      <p className="mt-8 max-w-[36ch] text-body-lg">{beat.body}</p>
      {last && (
        <div className="mt-10">
          <Button href="/imoveis" variant="on-noite">
            Ver imóveis
          </Button>
        </div>
      )}
    </>
  );
}

/** Pinned desktop stage: all four skies, three drifting ridges and the beat copy live in one 100svh frame. */
function PinnedStage() {
  return (
    <div data-stage className="relative h-svh overflow-hidden bg-sky-alvorada">
      <div aria-hidden="true">
        {(["dia", "entardecer", "noite"] as const).map((id) => (
          <div key={id} data-sky={id} className={`absolute inset-0 ${skyColor[id]}`} />
        ))}

        {/* Back to front: far and mid are tints of noite, so they read on every sky. */}
        <div data-drift="-8" className="absolute bottom-0 left-0 h-[52%] w-[135%] text-noite/10">
          <RidgeFill shape="far" />
        </div>
        <div data-drift="-15" className="absolute bottom-0 left-0 h-[38%] w-[135%] text-noite/20">
          <RidgeFill shape="mid" />
        </div>

        {/* Foreground: page-coloured ground on the light skies, noite ground and a névoa line after dusk. */}
        <div data-drift="-26" className="absolute bottom-0 left-0 h-[26%] w-[135%]">
          <div className="absolute inset-0 text-bg">
            <RidgeFill shape="main" />
          </div>
          <div data-ground="dark" className="absolute inset-0 text-noite">
            <RidgeFill shape="main" />
          </div>
          <div data-line className="ridge-draw absolute inset-0">
            <div data-line-light className="absolute inset-0 text-grafite">
              <Ridge className="h-full" />
            </div>
            <div data-line-dark className="absolute inset-0 text-nevoa">
              <Ridge className="h-full" />
            </div>
          </div>
        </div>

        {/* Photograph slots (placeholders until photography exists) rise with a ridge-shaped top edge. */}
        <div
          data-photo="a"
          className="absolute bottom-[12svh] right-gutter aspect-[4/5] w-[min(24vw,24rem)] bg-noite-raised"
          style={{ clipPath: FRAME_CLIP }}
        />
        <div
          data-photo="b"
          className="absolute bottom-[12svh] right-gutter aspect-[3/2] w-[min(36vw,36rem)] bg-noite-raised"
          style={{ clipPath: FRAME_CLIP }}
        />
      </div>

      <div className="container-page absolute inset-0 grid items-end pb-[clamp(6rem,16svh,10rem)]">
        {storyBeats.map((beat, index) => (
          <div
            key={beat.id}
            data-beat={index}
            className={`[grid-area:1/1] ${toneText(beat.tone)}`}
          >
            <BeatText beat={beat} />
          </div>
        ))}
      </div>

      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-line">
        <div data-progress className="h-full origin-left bg-accent" />
      </div>
    </div>
  );
}

/** Stacked variant for mobile, touch, reduced motion and no JavaScript: four 100svh stages. */
function StackedStages() {
  return (
    <div>
      {storyBeats.map((beat, index) => {
        const next = storyBeats[index + 1];
        const nextFill = next ? skyFill[next.id] : "text-bg";
        return (
          <section
            key={beat.id}
            data-story-stage
            aria-labelledby={`story-${beat.id}`}
            className={`relative flex min-h-svh flex-col justify-end overflow-hidden ${skyColor[beat.id]} ${toneText(beat.tone)}`}
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute bottom-0 left-0 h-[34%] w-[260%] -translate-x-[30%] text-noite/10 md:h-[44%] md:w-[160%] md:translate-x-0">
                <RidgeFill shape="far" />
              </div>
              <div className="absolute bottom-0 left-0 h-[24%] w-[220%] -translate-x-[8%] text-noite/20 md:h-[32%] md:w-[150%] md:translate-x-0">
                <RidgeFill shape="mid" />
              </div>
              <div className={`absolute bottom-0 left-0 h-[17%] w-[200%] -translate-x-[40%] md:h-[22%] md:w-[135%] md:translate-x-0 ${nextFill}`}>
                <RidgeFill shape="main" />
              </div>
              <div
                data-story-line
                className={`ridge-draw absolute bottom-0 left-0 h-[17%] w-[200%] -translate-x-[40%] md:h-[22%] md:w-[135%] md:translate-x-0 ${
                  next?.tone === "dark" ? "text-nevoa" : "text-grafite"
                }`}
              >
                <Ridge className="h-full" />
              </div>
            </div>

            <div className="container-page relative pb-[clamp(7rem,22svh,12rem)] pt-[calc(var(--header-height)+3rem)]">
              <BeatText beat={beat} heading={index === 0 ? "h2" : "h3"} />
            </div>
          </section>
        );
      })}
    </div>
  );
}

/**
 * "A serra", the signature moment (DESIGN.md "Scroll storytelling"). Two renderings of the same four
 * beats, chosen in CSS and mirrored by the motion mode:
 * - full (desktop, fine pointer, ≥ 560px tall): one pinned stage, about 400vh of scroll, scrub 1.
 *   Skies crossfade, three ridges drift, the main ridge draws, photograph slots rise, the copy swaps.
 * - everything else: four stacked 100svh stages that each draw their ridge once on enter
 *   (light) or are simply drawn (reduced motion, no JavaScript).
 */
export function Story() {
  const rootRef = useRef<HTMLElement>(null);

  useMotion(
    ({ mode }) => {
      const root = rootRef.current;
      if (!root || mode === "reduced") return;
      const q = gsap.utils.selector(root);

      if (mode === "light") {
        q("[data-story-line]").forEach((line) => {
          gsap.fromTo(
            line,
            { clipPath: HIDDEN },
            {
              clipPath: SHOWN,
              duration: duration.slow,
              ease: ease.cinema,
              scrollTrigger: { trigger: line, start: "top 85%", once: true },
            },
          );
        });
        return;
      }

      const stage = q("[data-stage]")[0] as HTMLElement | undefined;
      if (!stage) return;

      const beats = q("[data-beat]") as HTMLElement[];
      const tl = gsap.timeline({
        defaults: { ease: ease.linear },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=400%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Skies: each crossfades in over its beat boundary.
      tl.to(q("[data-sky='dia']"), { opacity: 1, duration: 0.4 }, 0.8)
        .to(q("[data-sky='entardecer']"), { opacity: 1, duration: 0.4 }, 1.8)
        .to(q("[data-sky='noite']"), { opacity: 1, duration: 0.4 }, 2.8)
        // Foreground ground and line turn to night with the sky.
        .to(q("[data-ground='dark']"), { opacity: 1, duration: 0.4 }, 1.8)
        .to(q("[data-line-light]"), { opacity: 0, duration: 0.4 }, 1.8)
        .to(q("[data-line-dark]"), { opacity: 1, duration: 0.4 }, 1.8)
        // The main ridge draws across the first beat.
        .to(q("[data-line]"), { clipPath: SHOWN, duration: 0.8 }, 0)
        // Ridge layers drift at different speeds across the whole story.
        .to(q("[data-drift]"), { xPercent: (_, el: HTMLElement) => Number(el.dataset.drift), duration: 4 }, 0)
        // Photograph slots rise into place, then give way.
        .fromTo(q("[data-photo='a']"), { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7 }, 0.95)
        .fromTo(q("[data-photo='b']"), { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7 }, 1.95)
        .to(q("[data-photo='a']"), { opacity: 0, duration: 0.2 }, 2.4)
        .to(q("[data-photo]"), { opacity: 0, duration: 0.3 }, 2.95)
        // Scroll progress along the bottom edge.
        .fromTo(q("[data-progress]"), { scaleX: 0 }, { scaleX: 1, duration: 4 }, 0);

      // Beat copy swaps by opacity and an 8px translate; hidden beats are not focusable.
      beats.forEach((beat, index) => {
        const enter = index * 1 + 0.05;
        if (index > 0) {
          tl.fromTo(beat, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.25 }, enter);
        }
        if (index < beats.length - 1) {
          tl.to(beat, { autoAlpha: 0, y: -8, duration: 0.2 }, index + 0.75);
        }
      });

      document.fonts.ready.then(() => ScrollTrigger.refresh());
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} id="a-serra" aria-label="A serra" data-story>
      <div className="story-pinned">
        <PinnedStage />
      </div>
      <div className="story-stacked">
        <StackedStages />
      </div>
    </section>
  );
}
