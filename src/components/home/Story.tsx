"use client";

import { useRef } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { RidgeFill } from "@/components/ui/Ridge";
import { site, stats } from "@/data";
import { gsap } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/use-motion";

const STATEMENT = `Belo Horizonte quer dizer belo horizonte. A Serra do Curral é a linha que o fecha, e olhamos para ela desde ${site.founded}.`;
const WORDS = STATEMENT.split(" ");

const served = stats.find((stat) => stat.label === "bairros atendidos")?.value;

/**
 * "A serra": a paragraph whose words light up as you read down the page, then a scene where the day
 * passes with the scroll (sun along an arc, sky from dawn to dusk, ridges drifting at three speeds).
 * Two soft clouds drift on their own, so the scene moves even when you are not scrolling.
 * Reduced motion: the text is fully lit and the scene rests at midday.
 */
export function Story() {
  const textRef = useRef<HTMLParagraphElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useMotion(({ mode }) => {
    const text = textRef.current;
    const scene = sceneRef.current;
    if (mode === "reduced" || !text || !scene) return;

    const words = gsap.utils.toArray<HTMLElement>("[data-w]", text);
    gsap.fromTo(
      words,
      { opacity: 0.16 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.1,
        scrollTrigger: { trigger: text, start: "top 82%", end: "bottom 50%", scrub: true },
      },
    );

    const q = (selector: string) => scene.querySelector(selector);
    const trigger = { trigger: scene, start: "top bottom", end: "bottom top", scrub: 0.6 };
    const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: trigger });
    tl.fromTo(q("[data-orbit]"), { rotate: -50 }, { rotate: 50 }, 0)
      .fromTo(q("[data-sky='a']"), { opacity: 1 }, { opacity: 0, duration: 0.5 }, 0.1)
      .fromTo(q("[data-sky='b']"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.1)
      .to(q("[data-sky='b']"), { opacity: 0, duration: 0.35 }, 0.6)
      .fromTo(q("[data-sky='c']"), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.6)
      .fromTo(q("[data-drift='far']"), { yPercent: 8 }, { yPercent: -2 }, 0)
      .fromTo(q("[data-drift='mid']"), { yPercent: 14 }, { yPercent: -4 }, 0)
      .fromTo(q("[data-drift='near']"), { yPercent: 22 }, { yPercent: -6 }, 0);
  });

  return (
    <section id="serra" className="story section" aria-labelledby="serra-titulo">
      <div className="container">
        <Reveal>
          <p className="eyebrow">
            <span className="dot" /> <span id="serra-titulo">A serra</span>
          </p>
        </Reveal>

        <p ref={textRef} className="t-display story-text" aria-label={STATEMENT}>
          {WORDS.map((word, index) => (
            <span key={`${word}-${index}`} data-w aria-hidden="true">
              {word}{" "}
            </span>
          ))}
        </p>

        <Reveal as="dl" className="story-facts">
          <div>
            <dt>Desde</dt>
            <dd className="num">{site.founded}</dd>
          </div>
          <div>
            <dt>Pessoas na equipe</dt>
            <dd className="num">{site.teamSize}</dd>
          </div>
          <div>
            <dt>Bairros atendidos</dt>
            <dd className="num">{served}</dd>
          </div>
        </Reveal>
      </div>

      <div className="container">
        <div ref={sceneRef} data-ambient className="serra" role="img" aria-label="Ilustração da Serra do Curral ao longo do dia.">
          <div className="serra-sky serra-sky--a" data-sky="a" />
          <div className="serra-sky serra-sky--b" data-sky="b" />
          <div className="serra-sky serra-sky--c" data-sky="c" />

          <div className="serra-orbit" data-orbit>
            <span className="serra-sun" />
          </div>

          <span className="serra-cloud serra-cloud--1" />
          <span className="serra-cloud serra-cloud--2" />

          <span className="serra-ridge serra-ridge--far" data-drift="far">
            <RidgeFill shape="far" />
          </span>
          <span className="serra-ridge serra-ridge--mid" data-drift="mid">
            <RidgeFill shape="mid" />
          </span>
          <span className="serra-ridge serra-ridge--near" data-drift="near">
            <RidgeFill shape="main" />
          </span>

          <p className="serra-caption" aria-hidden="true">
            Do amanhecer ao entardecer
          </p>
        </div>
      </div>
    </section>
  );
}
