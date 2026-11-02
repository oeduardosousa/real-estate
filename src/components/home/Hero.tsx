import { ArrowDown } from "lucide-react";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { PointerField } from "@/components/motion/PointerField";
import { Button } from "@/components/ui/Button";
import { RidgeFill } from "@/components/ui/Ridge";
import { Scene, type Tone } from "@/components/ui/Scene";
import { featuredListings, site } from "@/data";
import { formatPrice } from "@/lib/format";

const ITALIC = new Set(["serra", "lar"]);
const WORDS = site.tagline.split(" ").map((word) => ({ word, italic: ITALIC.has(word.replace(/[.,]/g, "")) }));

const BADGE = "Belo Horizonte · Nova Lima · Desde 2009 · ";
const CARD_TONES: readonly Tone[] = ["peach", "sage", "sky"];

/**
 * Hero: a slow aurora of colour, the headline rising word by word, three listings floating at different
 * depths (they follow the pointer a little), a rotating badge and ridges that sway at the bottom.
 * The headline animates with pure CSS so the LCP text never waits on JavaScript.
 */
export function Hero() {
  const cards = featuredListings.slice(0, 3);

  return (
    <PointerField className="hero" aria-labelledby="hero-title" data-ambient>
      <div className="aurora" aria-hidden="true">
        <i className="blob blob--a" />
        <i className="blob blob--b" />
        <i className="blob blob--c" />
        <i className="blob blob--d" />
      </div>

      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow hero-in" style={{ ["--d" as string]: 0.05 }}>
            <span className="dot pulse" /> Belo Horizonte e região metropolitana
          </p>

          <h1 id="hero-title" className="t-hero hero-title">
            {WORDS.map(({ word, italic }, index) => (
              <span key={`${word}-${index}`}>
                <span className="hero-word">
                  <span style={{ ["--i" as string]: index }}>{italic ? <em>{word}</em> : word}</span>
                </span>{" "}
              </span>
            ))}
          </h1>

          <p className="t-lead hero-lead hero-in" style={{ ["--d" as string]: 0.3 }}>
            Casas, apartamentos e coberturas em Belo Horizonte e Nova Lima, apresentados com calma e precisão.
          </p>

          <div className="hero-actions hero-in" style={{ ["--d" as string]: 0.4 }}>
            <Button href="/imoveis" arrow magnetic>
              Ver imóveis
            </Button>
            <Button href="/contato" variant="soft">
              Falar com a equipe
            </Button>
          </div>
        </div>

        <div className="hero-stage" aria-label="Imóveis em destaque">
          {cards.map((listing, index) => (
            <div key={listing.id} className={`hero-card hero-card--${index + 1}`}>
              <div className="hero-card-float">
                <TransitionLink href={`/imoveis/${listing.slug}`} className="hero-card-link">
                  <Scene
                    label={`${listing.title}, ${listing.neighborhood}. Imagem ilustrativa.`}
                    tone={CARD_TONES[index]}
                    variant={index + 1}
                  />
                  <span className="hero-card-info">
                    <span className="hero-card-name">{listing.title}</span>
                    <span className="hero-card-price num">{formatPrice(listing)}</span>
                  </span>
                </TransitionLink>
              </div>
            </div>
          ))}

          <div className="badge" aria-hidden="true">
            <svg viewBox="0 0 120 120" className="badge-ring">
              <defs>
                <path id="badge-path" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
              </defs>
              <text>
                <textPath href="#badge-path" textLength="270">
                  {BADGE}
                </textPath>
              </text>
            </svg>
            <ArrowDown className="badge-arrow" size={22} strokeWidth={1.6} />
          </div>
        </div>
      </div>

      <div className="hero-ridges" aria-hidden="true">
        <span className="hero-ridge hero-ridge--far">
          <RidgeFill shape="far" />
        </span>
        <span className="hero-ridge hero-ridge--mid">
          <RidgeFill shape="mid" />
        </span>
        <span className="hero-ridge hero-ridge--near">
          <RidgeFill shape="main" />
        </span>
      </div>
    </PointerField>
  );
}
