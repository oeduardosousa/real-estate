import { Suspense } from "react";
import type { Metadata } from "next";
import { ReviewDetail } from "@/painel/ui/ReviewDetail";

export const metadata: Metadata = { title: "Revisar imóvel" };

export default function PanelReviewDetail() {
  return (
    <Suspense fallback={null}>
      <ReviewDetail />
    </Suspense>
  );
}
