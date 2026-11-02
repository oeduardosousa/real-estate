import { Heading } from "@/components/motion/Heading";
import { Reveal } from "@/components/motion/Reveal";
import { milestones } from "@/data";

/** The company story as a vertical timeline, one fictional milestone per year. */
export function Timeline() {
  return (
    <section id="historia" aria-labelledby="historia-titulo" className="section timeline">
      <div className="container">
        <div className="section-head">
          <div>
            <Reveal>
              <p className="eyebrow">
                <span className="dot" /> Nossa história
              </p>
            </Reveal>
            <Heading id="historia-titulo" className="t-display section-title" text="Dezessete anos, *um critério*." />
          </div>
          <Reveal as="p" className="t-lead section-aside">
            A história abaixo é fictícia, criada para este projeto conceitual.
          </Reveal>
        </div>

        <ol className="timeline-list">
          {milestones.map((item, index) => (
            <Reveal as="li" key={item.year} className="timeline-item" delay={(index % 2) * 0.06}>
              <span className="timeline-year num">{item.year}</span>
              <div className="timeline-body">
                <h3 className="t-title">{item.title}</h3>
                <p className="timeline-text">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
