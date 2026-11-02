import { Reveal } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { stats } from "@/data";

/**
 * The number row on a noite chapter. Figures are set in Newsreader (lining, tabular) at Numeral size.
 * A 2 x 2 grid keeps "R$ 1,2 bi" on one line at that size. The note states the figures are fictional.
 */
export function Numbers() {
  return (
    <section id="numeros" aria-labelledby="numeros-titulo" className="theme-noite bg-bg py-section text-fg">
      <div className="container-page">
        <SectionLabel>
          <span id="numeros-titulo">Em números</span>
        </SectionLabel>

        <dl className="mt-16 grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:mt-24">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.07} className="flex flex-col-reverse border-t border-line pt-6">
              <dt className="mt-4 text-body-lg text-fg-secondary">{stat.label}</dt>
              <dd className="type-numeral tabular-nums">{stat.value}</dd>
            </Reveal>
          ))}
        </dl>

        <p className="mt-16 max-w-measure text-fg-muted">
          Números fictícios de um projeto conceitual.
        </p>
      </div>
    </section>
  );
}
