import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";
import { getListing, listings } from "@/data";

// One statically generated page per listing; unknown slugs are a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return listings.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/imoveis/[slug]">): Promise<Metadata> {
  const listing = getListing((await params).slug);
  return { title: listing?.title ?? "Imóvel" };
}

export default async function ListingPage({ params }: PageProps<"/imoveis/[slug]">) {
  const listing = getListing((await params).slug);
  if (!listing) notFound();

  return (
    <PagePlaceholder label={`${listing.type} · ${listing.neighborhood}`} title={listing.title} />
  );
}
