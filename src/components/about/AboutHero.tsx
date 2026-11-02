import { Heading } from "@/components/motion/Heading";
import { Reveal } from "@/components/motion/Reveal";
import { Scene } from "@/components/ui/Scene";
import { site } from "@/data";

/** Opening of the Sobre page: headline, the founding idea and a ridge scene as a stand-in photograph. */
export function AboutHero() {
  return (
    <section aria-labelledby="sobre-titulo" className="container about-hero">
      <Reveal>
        <p className="eyebrow">
          <span className="dot" /> Sobre
        </p>
      </Reveal>
      <Heading id="sobre-titulo" as="h1" className="t-display about-title" text="Uma casa pequena, *de propósito*." />
      <div className="about-hero-grid">
        <Reveal as="p" className="t-lead about-lead">
          A {site.name} nasceu em {site.founded}, em Belo Horizonte, com a ideia de que comprar ou alugar um imóvel
          pede conversa, não pressa. Desde então a casa cresceu em gente e em bairros, mas não em ruído.
        </Reveal>
        <Reveal className="about-scene" delay={0.1}>
          <Scene label="Silhueta da Serra do Curral ao entardecer" tone="peach" variant={1} className="about-scene-art" />
        </Reveal>
      </div>
    </section>
  );
}
