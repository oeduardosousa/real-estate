import { Heading } from "@/components/motion/Heading";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";

/** Closing call to action on a drifting aurora card. */
export function Cta() {
  return (
    <section aria-labelledby="cta-titulo" className="cta-wrap">
      <div className="container">
        <div className="cta" data-ambient data-offscreen="true">
          <div className="aurora aurora--cta" aria-hidden="true">
            <i className="blob blob--a" />
            <i className="blob blob--b" />
            <i className="blob blob--c" />
          </div>
          <div className="cta-inner">
            <Heading id="cta-titulo" className="t-display" text="Vamos olhar o *seu horizonte*?" />
            <Reveal className="cta-actions" delay={0.2}>
              <Button href="/contato" arrow magnetic>
                Falar com a equipe
              </Button>
              <Button href="/imoveis" variant="light">
                Ver imóveis
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
