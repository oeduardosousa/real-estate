import type { Metadata } from "next";
import { ListingsTable } from "@/painel/ui/ListingsTable";

export const metadata: Metadata = { title: "Imóveis" };

export default function PanelListings() {
  return <ListingsTable />;
}
