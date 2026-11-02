import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = { title: "Imóveis" };

export default function ListingsPage() {
  return <PagePlaceholder label="Imóveis" title="Imóveis" />;
}
