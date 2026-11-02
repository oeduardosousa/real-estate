import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BedDouble, Bath, Car, Maximize, ShowerHead, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Cta } from "@/components/home/Cta";
import { ListingCard } from "@/components/home/ListingCard";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { ContactForm } from "@/components/listings/ContactForm";
import { MortgageCalculator } from "@/components/listings/MortgageCalculator";
import { Heading } from "@/components/motion/Heading";
import { Reveal } from "@/components/motion/Reveal";
import { Scene, TONES } from "@/components/ui/Scene";
import { getListingDetail, listings, team } from "@/data";
import { formatBRL, formatPrice, purposeLabel } from "@/lib/format";

// One statically generated page per listing; unknown slugs are a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return listings.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/imoveis/[slug]">): Promise<Metadata> {
  const listing = getListingDetail((await params).slug);
  if (!listing) return { title: "Imóvel" };
  return { title: listing.title, description: listing.summary, openGraph: { title: listing.title, description: listing.summary } };
}

const initials = (name: string) =>
  name
    .split(" ")
    .filter((part) => part.length > 2)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

export default async function ListingPage({ params }: PageProps<"/imoveis/[slug]">) {
  const listing = getListingDetail((await params).slug);
  if (!listing) notFound();

  const index = listings.findIndex(({ id }) => id === listing.id);
  const tone = (offset = 0) => TONES[(index + offset) % TONES.length];
  const agent = team.find(({ id }) => id === listing.agent) ?? team[0];
  const isSale = listing.purpose === "venda";
  const previous = listings[(index - 1 + listings.length) % listings.length];
  const next = listings[(index + 1) % listings.length];
  const similar = listings
    .filter((other) => other.id !== listing.id && other.purpose === listing.purpose)
    .sort((a, b) => Number(b.type === listing.type) - Number(a.type === listing.type) || Math.abs(a.price - listing.price) - Math.abs(b.price - listing.price))
    .slice(0, 3);

  const facts = [
    { icon: Maximize, value: `${listing.area} m²`, label: "Área" },
    { icon: BedDouble, value: listing.bedrooms, label: listing.bedrooms === 1 ? "Quarto" : "Quartos" },
    { icon: ShowerHead, value: listing.suites, label: listing.suites === 1 ? "Suíte" : "Suítes" },
    { icon: Bath, value: listing.bathrooms, label: listing.bathrooms === 1 ? "Banheiro" : "Banheiros" },
    { icon: Car, value: listing.parking, label: listing.parking === 1 ? "Vaga" : "Vagas" },
  ];

  const costs = [
    isSale ? null : { label: "Aluguel", value: `${formatBRL(listing.price)}/mês` },
    listing.condominio > 0 ? { label: "Condomínio", value: `${formatBRL(listing.condominio)}/mês` } : { label: "Condomínio", value: "Não se aplica" },
    { label: "IPTU", value: `${formatBRL(listing.iptu)}/ano` },
  ].filter((cost) => cost !== null);

  return (
    <>
      <article aria-labelledby="imovel-titulo">
        <header className="container page-top detail-head">
          <nav aria-label="Você está em" className="crumbs">
            <TransitionLink href="/imoveis" className="link">
              Imóveis
            </TransitionLink>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{listing.title}</span>
          </nav>

          <div className="detail-title">
            <div>
              <Reveal eager>
                <p className="eyebrow">
                  <span className="dot" /> {purposeLabel[listing.purpose]} · {listing.type}
                </p>
              </Reveal>
              <Heading eager as="h1" id="imovel-titulo" className="t-display page-title" text={listing.title} />
              <Reveal eager as="p" className="t-lead page-lead" delay={0.15}>
                {listing.summary}
              </Reveal>
            </div>
            <Reveal eager className="detail-price" delay={0.2}>
              <p className="t-small">{isSale ? "Valor de venda" : "Aluguel mensal"}</p>
              <p className="detail-price-figure num">{formatPrice(listing)}</p>
            </Reveal>
          </div>
        </header>

        <section aria-label="Imagens" className="container">
          <ul className="gallery">
            {listing.views.slice(0, 5).map((view, i) => (
              <Reveal as="li" key={view} className={`gallery-item gallery-item--${i}`} delay={i * 0.06}>
                <Scene label={`${view}. Imagem ilustrativa.`} tone={tone(i)} variant={index + i} />
                <span className="gallery-cap">{view}</span>
              </Reveal>
            ))}
          </ul>
          <p className="t-small gallery-note">Imagens ilustrativas. A fotografia dos imóveis ainda não existe neste projeto conceitual.</p>
        </section>

        <div className="container detail-body">
          <div className="detail-main">
            <dl className="facts">
              {facts.map(({ icon: Icon, value, label }) => (
                <Reveal as="div" key={label} className="fact">
                  <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
                  <dt>{label}</dt>
                  <dd className="num">{value}</dd>
                </Reveal>
              ))}
            </dl>

            <section aria-labelledby="sobre-imovel" className="block">
              <Heading id="sobre-imovel" className="t-headline" text="Sobre o *imóvel*" />
              {listing.description.map((paragraph) => (
                <Reveal as="p" key={paragraph} className="t-lead block-text">
                  {paragraph}
                </Reveal>
              ))}
            </section>

            <section aria-labelledby="diferenciais" className="block">
              <Heading id="diferenciais" className="t-headline" text="Diferenciais" />
              <ul className="features">
                {listing.features.map((feature, i) => (
                  <Reveal as="li" key={feature} className="feature" delay={(i % 4) * 0.05}>
                    <Check size={18} strokeWidth={2} aria-hidden="true" /> {feature}
                  </Reveal>
                ))}
              </ul>
            </section>

            {isSale && (
              <section aria-labelledby="financiamento" className="block">
                <Heading id="financiamento" className="t-headline" text="Simule o *financiamento*" />
                <MortgageCalculator price={listing.price} />
              </section>
            )}
          </div>

          <aside className="detail-side" aria-label="Valores e contato">
            <div className="side-card">
              <h2 className="t-title">Valores</h2>
              <dl className="cost-list">
                {costs.map((cost) => (
                  <div key={cost.label}>
                    <dt>{cost.label}</dt>
                    <dd className="num">{cost.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="side-card">
              <div className="agent">
                <span className={`agent-avatar person--${tone(2)}`} aria-hidden="true">
                  {initials(agent.name)}
                </span>
                <div>
                  <p className="agent-name">{agent.name}</p>
                  <p className="t-small">{agent.role}</p>
                </div>
              </div>
              <ContactForm listingTitle={listing.title} agentName={agent.name} />
            </div>
          </aside>
        </div>
      </article>

      <section aria-labelledby="parecidos" className="section similar">
        <div className="container">
          <div className="section-head">
            <Heading id="parecidos" className="t-display section-title" text="Veja também" />
            <Reveal className="section-aside">
              <TransitionLink href="/imoveis" className="link">
                Ver todos os imóveis
              </TransitionLink>
            </Reveal>
          </div>
          <ul className="results-grid">
            {similar.map((other, i) => (
              <Reveal as="li" key={other.id} delay={i * 0.07}>
                <ListingCard listing={other} index={other.id - 1} />
              </Reveal>
            ))}
          </ul>

          <nav aria-label="Outros imóveis" className="pager">
            <TransitionLink href={`/imoveis/${previous.slug}`} className="pager-link">
              <ArrowLeft size={18} aria-hidden="true" />
              <span>
                <small>Anterior</small>
                {previous.title}
              </span>
            </TransitionLink>
            <TransitionLink href={`/imoveis/${next.slug}`} className="pager-link pager-link--next">
              <span>
                <small>Próximo</small>
                {next.title}
              </span>
              <ArrowRight size={18} aria-hidden="true" />
            </TransitionLink>
          </nav>
        </div>
      </section>

      <Cta />
    </>
  );
}
