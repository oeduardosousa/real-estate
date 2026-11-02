import { ArrowUpRight } from "lucide-react";
import { Heading } from "@/components/motion/Heading";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { team } from "@/data";

const fullName = (id: string) => team.find((member) => member.id === id)?.name ?? "";

/** What the agency does, drawn from the brief's audience (buyers, owners, investors) and the team's roles. */
const services = [
  {
    title: "Comprar",
    text: "Casas, apartamentos e coberturas escolhidos com critério em Belo Horizonte e Nova Lima.",
    tint: "peach",
  },
  {
    title: "Vender",
    text: "Para quem quer anunciar um imóvel com cuidado, clareza e uma apresentação à altura.",
    tint: "sage",
  },
  {
    title: "Alugar",
    text: `Locação e relacionamento, com o acompanhamento de ${fullName("marina-alvarenga")}.`,
    tint: "sky",
  },
  {
    title: "Investir",
    text: `Imóveis pensados como investimento, com a orientação de ${fullName("bruno-teixeira")}.`,
    tint: "butter",
  },
] as const;

/** Four soft tiles. Each glows under the pointer; the whole set rises in with a short stagger. */
export function Services() {
  return (
    <section id="servicos" aria-labelledby="servicos-titulo" className="section services">
      <div className="container">
        <div className="section-head">
          <div>
            <Reveal>
              <p className="eyebrow">
                <span className="dot" /> Serviços
              </p>
            </Reveal>
            <Heading id="servicos-titulo" className="t-display section-title" text="Comprar, vender, *alugar*, investir." />
          </div>
          <Reveal className="section-aside">
            <Button href="/contato" variant="soft" arrow>
              Falar com a equipe
            </Button>
          </Reveal>
        </div>

        <ul className="services-grid">
          {services.map((service, index) => (
            <Reveal as="li" key={service.title} delay={index * 0.08}>
              <div className={`tile tile--${service.tint}`} data-spot>
                <span className="tile-index num">0{index + 1}</span>
                <ArrowUpRight className="tile-arrow" size={26} strokeWidth={1.4} aria-hidden="true" />
                <h3 className="t-headline tile-title">{service.title}</h3>
                <p className="tile-text">{service.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
