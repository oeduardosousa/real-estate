import type { Metadata } from "next";
import { Suspense } from "react";
import { Cta } from "@/components/home/Cta";
import { ListingsExplorer, ListingsSkeleton } from "@/components/listings/ListingsExplorer";
import { Heading } from "@/components/motion/Heading";
import { Reveal } from "@/components/motion/Reveal";
import { listings } from "@/data";

export const metadata: Metadata = {
  title: "Imóveis",
  description: "Casas, apartamentos e coberturas em Belo Horizonte e Nova Lima. Filtre por tipo, bairro, quartos e preço.",
};

export default function ListingsPage() {
  return (
    <>
      <section aria-labelledby="imoveis-titulo" className="container page-top">
        <Reveal>
          <p className="eyebrow">
            <span className="dot" /> {listings.length} imóveis
          </p>
        </Reveal>
        <Heading as="h1" id="imoveis-titulo" className="t-display page-title" text="Todos os *imóveis*." />
        <Reveal as="p" className="t-lead page-lead" delay={0.15}>
          Belo Horizonte e Nova Lima, à venda e para alugar. Use os filtros para chegar mais perto do que procura.
        </Reveal>
      </section>

      <section aria-label="Resultados" className="container results">
        <Suspense fallback={<ListingsSkeleton />}>
          <ListingsExplorer />
        </Suspense>
      </section>

      <Cta />
    </>
  );
}
