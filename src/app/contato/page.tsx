import type { Metadata } from "next";
import { Heading } from "@/components/motion/Heading";
import { Reveal } from "@/components/motion/Reveal";
import { ContactPageForm } from "@/components/listings/ContactPageForm";
import { site, team } from "@/data";

export const metadata: Metadata = {
  title: "Contato",
  description: `Fale com a equipe da ${site.name}: comprar, vender, alugar ou investir em Belo Horizonte e Nova Lima.`,
};

export default function ContactPage() {
  return (
    <section aria-labelledby="contato-titulo" className="container contact">
      <Reveal>
        <p className="eyebrow">
          <span className="dot" /> Contato
        </p>
      </Reveal>
      <Heading id="contato-titulo" as="h1" className="t-display contact-title" text="Vamos conversar sobre o *seu imóvel*." />
      <Reveal as="p" className="t-lead contact-lead">
        Conte o que você procura ou o que quer anunciar. A equipe responde com calma e sem compromisso.
      </Reveal>

      <div className="contact-grid">
        <Reveal className="contact-form-wrap">
          <ContactPageForm />
        </Reveal>

        <Reveal as="aside" className="contact-team" delay={0.08}>
          <h2 className="t-title">Quem atende</h2>
          <ul>
            {team.map((member) => (
              <li key={member.id}>
                <span className="contact-avatar" aria-hidden="true">
                  {member.name.charAt(0)}
                </span>
                <span>
                  <span className="contact-name">{member.name}</span>
                  <span className="t-small">{member.role}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="t-small">Atendemos Belo Horizonte e Nova Lima. {site.disclaimer.pt}</p>
        </Reveal>
      </div>
    </section>
  );
}
