import { Heading } from "@/components/motion/Heading";
import { Reveal } from "@/components/motion/Reveal";
import { Scene } from "@/components/ui/Scene";
import { site, stats } from "@/data";

const facts = [
  { label: "Fundada em", value: String(site.founded) },
  { label: "Pessoas na equipe", value: String(site.teamSize) },
  { label: stats[1].label.replace(/^./, (c) => c.toUpperCase()), value: stats[1].value },
] as const;

/** Opening of the Sobre page: headline and founding idea beside a ridge scene, then a strip of key facts. */
export function AboutHero() {
  return (
    <section aria-labelledby="sobre-titulo" className="container about-hero">
      <div className="about-hero-grid">
        <div className="about-hero-text">
          <Reveal eager>
            <p className="eyebrow">
              <span className="dot" /> Sobre
            </p>
          </Reveal>
          <Heading eager id="sobre-titulo" as="h1" className="t-display about-title" text="Uma casa pequena, *de propósito*." />
          <Reveal eager as="p" className="t-lead about-lead" delay={0.1}>
            A {site.name} nasceu em {site.founded}, em Belo Horizonte, com a ideia de que comprar ou alugar um imóvel
            pede conversa, não pressa. Desde então a casa cresceu em gente e em bairros, mas não em ruído.
          </Reveal>
        </div>
        <Reveal eager className="about-scene" delay={0.1}>
          <Scene label="Silhueta da Serra do Curral ao entardecer" tone="peach" variant={1} className="about-scene-art" />
        </Reveal>
      </div>

      <Reveal eager as="dl" className="about-facts" delay={0.2}>
        {facts.map((fact) => (
          <div key={fact.label} className="about-fact">
            <dt className="t-small">{fact.label}</dt>
            <dd className="num">{fact.value}</dd>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
