import { Heading } from "@/components/motion/Heading";
import { Reveal } from "@/components/motion/Reveal";
import { stats } from "@/data";
import { CountUp } from "./CountUp";

/**
 * The numbers on a dark rounded panel with two glows drifting behind them. Figures count up when they
 * enter the viewport. The note states the figures are fictional.
 */
export function Numbers() {
  return (
    <section id="numeros" aria-labelledby="numeros-titulo" className="numbers-wrap">
      <div className="numbers on-dark" data-ambient>
        <div className="numbers-glow numbers-glow--a" aria-hidden="true" />
        <div className="numbers-glow numbers-glow--b" aria-hidden="true" />

        <div className="container numbers-inner">
          <Reveal>
            <p className="eyebrow">
              <span className="dot" /> Em números
            </p>
          </Reveal>
          <Heading id="numeros-titulo" className="t-display section-title" text="Uma casa de cada vez, *desde 2009*." />

          <dl className="numbers-grid">
            {stats.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 0.08} className="stat">
                <dt className="stat-label">{stat.label}</dt>
                <dd className="stat-value num">
                  <CountUp value={stat.value} />
                </dd>
              </Reveal>
            ))}
          </dl>

          <p className="numbers-note">Números fictícios de um projeto conceitual.</p>
        </div>
      </div>
    </section>
  );
}
