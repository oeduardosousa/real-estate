import { Heading } from "@/components/motion/Heading";
import { Reveal } from "@/components/motion/Reveal";
import { awards } from "@/data";

/** Fictional awards as a ledger: year, title and category, then the awarding body and a note. */
export function Awards() {
  return (
    <section id="premios" aria-labelledby="premios-titulo" className="section awards">
      <div className="container">
        <div className="section-head">
          <div>
            <Reveal>
              <p className="eyebrow">
                <span className="dot" /> Reconhecimentos
              </p>
            </Reveal>
            <Heading id="premios-titulo" className="t-display section-title" text="Prêmios que *marcaram o caminho*." />
          </div>
          <Reveal as="p" className="t-lead section-aside">
            Cinco distinções em sete anos, todas ligadas a atendimento e transparência.
          </Reveal>
        </div>

        <ol className="awards-list">
          {awards.map((award, index) => (
            <Reveal as="li" key={award.title} className="award" delay={(index % 3) * 0.05}>
              <span className="award-year num">{award.year}</span>
              <div className="award-main">
                <h3 className="t-title">{award.title}</h3>
                <p className="award-category">{award.category}</p>
              </div>
              <div className="award-side">
                <p className="award-note">{award.note}</p>
                <p className="t-small award-body">{award.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <p className="awards-note t-small">Prêmios e entidades fictícios, criados para este projeto conceitual.</p>
      </div>
    </section>
  );
}
