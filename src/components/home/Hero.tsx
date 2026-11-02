import { Button } from "@/components/ui/Button";
import { site } from "@/data";
import { HeroScene } from "./HeroScene";

const HEADLINE = site.tagline.split(" ");

/**
 * Cinematic hero. The headline is the LCP element and is animated with pure CSS (words rise from a
 * mask, 60ms apart), so it starts on the first frame without waiting for JavaScript; it only waits for
 * the first-visit loader to lift. The scene behind it is animated by GSAP (see HeroScene).
 * Text sits on alvorada, so it is grafite (DESIGN.md "Stage Text Rule").
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden text-grafite">
      <HeroScene />

      <div className="container-page relative pb-[clamp(6.5rem,19svh,11rem)] pt-header">
        <p className="type-label intro-wait intro-fade mb-6 text-grafite-soft [--intro-delay:0.1s]">
          Belo Horizonte e região metropolitana
        </p>

        <h1 id="hero-title" className="max-w-[13ch] text-display-xl">
          {HEADLINE.map((word, index) => (
            <span key={`${word}-${index}`} className="hero-word">
              <span className="intro-wait" style={{ ["--i" as string]: index }}>
                {word}
              </span>{" "}
            </span>
          ))}
        </h1>

        <div className="mt-8 grid gap-8 md:mt-12 lg:grid-cols-12 lg:gap-x-6">
          <p className="intro-wait intro-fade max-w-[34ch] text-body-lg text-grafite [--intro-delay:0.85s] lg:col-span-4 lg:col-start-9 lg:row-start-1">
            Casas, apartamentos e coberturas em Belo Horizonte e Nova Lima, apresentados com calma e precisão.
          </p>
          <div className="intro-wait intro-fade flex flex-wrap gap-4 [--intro-delay:1s] lg:col-span-8 lg:row-start-1">
            <Button href="/imoveis" magnetic>
              Ver imóveis
            </Button>
            <Button href="/contato" variant="secondary">
              Falar com a equipe
            </Button>
          </div>
        </div>
      </div>

      <p className="type-label intro-wait intro-fade container-page absolute inset-x-0 bottom-6 flex text-grafite-soft [--intro-delay:1.1s]">
        <span>Desde {site.founded}</span>
      </p>
    </section>
  );
}
