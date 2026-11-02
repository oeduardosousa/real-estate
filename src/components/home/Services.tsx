import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { team } from "@/data";

const fullName = (id: string) => team.find((member) => member.id === id)?.name ?? "";

/** What the agency does, drawn from the brief's audience (buyers, owners, investors) and the team's roles. */
const services = [
  {
    title: "Comprar",
    text: "Casas, apartamentos e coberturas escolhidos com critério em Belo Horizonte e Nova Lima.",
  },
  {
    title: "Vender",
    text: "Para quem quer anunciar um imóvel com cuidado, clareza e uma apresentação à altura.",
  },
  {
    title: "Alugar",
    text: `Locação e relacionamento, com o acompanhamento de ${fullName("marina-alvarenga")}.`,
  },
  {
    title: "Investir",
    text: `Imóveis pensados como investimento, com a orientação de ${fullName("bruno-teixeira")}.`,
  },
] as const;

/**
 * Services as an asymmetric list rather than a row of identical cards: the headline names all four,
 * hairline rows explain them, and one action closes the section.
 */
export function Services() {
  return (
    <section id="servicos" aria-labelledby="servicos-titulo" className="bg-bg py-section">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-8">
          <SectionLabel>Serviços</SectionLabel>
          <SplitHeading id="servicos-titulo" className="mt-8 text-display">
            Comprar, vender, alugar, investir.
          </SplitHeading>
        </div>

        <ul className="lg:col-span-8 lg:col-start-5">
          {services.map((service, index) => (
            <Reveal
              as="li"
              key={service.title}
              delay={index * 0.07}
              className="grid gap-3 border-t border-line py-8 sm:grid-cols-[1fr_1.5fr] sm:gap-8"
            >
              <h3 className="text-title">{service.title}</h3>
              <p className="max-w-measure text-fg-secondary">{service.text}</p>
            </Reveal>
          ))}
          <li className="border-t border-line pt-10">
            <Button href="/contato" variant="secondary">
              Falar com a equipe
            </Button>
          </li>
        </ul>
      </div>
    </section>
  );
}
