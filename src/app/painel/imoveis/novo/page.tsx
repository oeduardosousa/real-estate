import type { Metadata } from "next";
import { NewListing } from "@/painel/ui/NewListing";

export const metadata: Metadata = { title: "Novo imóvel" };

export default function PanelNewListing() {
  return <NewListing />;
}
