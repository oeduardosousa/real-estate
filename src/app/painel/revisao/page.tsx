import type { Metadata } from "next";
import { ReviewQueue } from "@/painel/ui/ReviewQueue";

export const metadata: Metadata = { title: "Revisão" };

export default function PanelReview() {
  return <ReviewQueue />;
}
