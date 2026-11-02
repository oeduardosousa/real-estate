import { Heading } from "@/components/motion/Heading";
import { Reveal } from "@/components/motion/Reveal";
import { TONES } from "@/components/ui/Scene";
import { site, team } from "@/data";

const initials = (name: string) =>
  name
    .split(" ")
    .filter((part) => part.length > 2)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

/**
 * Team: the founder on a large card, the other four on smaller ones. Portraits are not in the brief yet,
 * so each person gets a soft coloured card with their initials; real photographs replace these later.
 */
export function Team() {
  return (
    <section id="equipe" aria-labelledby="equipe-titulo" className="section team">
      <div className="container">
        <div className="section-head">
          <div>
            <Reveal>
              <p className="eyebrow">
                <span className="dot" /> Equipe
              </p>
            </Reveal>
            <Heading id="equipe-titulo" className="t-display section-title" text="Quem vai *receber você*." />
          </div>
          <Reveal as="p" className="t-lead section-aside">
            A equipe da {site.name} tem {site.teamSize} pessoas. Conheça cinco delas.
          </Reveal>
        </div>

        <ul className="team-grid">
          {team.map((member, index) => (
            <Reveal as="li" key={member.id} delay={(index % 4) * 0.07} className={index === 0 ? "team-lead" : undefined}>
              <figure className={`person person--${TONES[index % TONES.length]}`} data-spot>
                <div className="person-art" aria-hidden="true">
                  <span className="person-initials">{initials(member.name)}</span>
                  <i className="person-orb" />
                </div>
                <figcaption>
                  <p className="person-name t-title">{member.name}</p>
                  <p className="t-small">{member.role}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
