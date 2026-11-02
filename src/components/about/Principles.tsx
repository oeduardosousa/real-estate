import { Heading } from "@/components/motion/Heading";
import { Reveal } from "@/components/motion/Reveal";
import { principles } from "@/data";

/** Three working principles on soft cards. */
export function Principles() {
  return (
    <section id="principios" aria-labelledby="principios-titulo" className="section principles">
      <div className="container">
        <Reveal>
          <p className="eyebrow">
            <span className="dot" /> Como trabalhamos
          </p>
        </Reveal>
        <Heading id="principios-titulo" className="t-display section-title" text="Três regras que *não mudam*." />

        <ul className="principles-grid">
          {principles.map((item, index) => (
            <Reveal as="li" key={item.title} className="principle" delay={index * 0.08}>
              <span className="principle-index num" aria-hidden="true">
                0{index + 1}
              </span>
              <h3 className="t-title">{item.title}</h3>
              <p>{item.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
