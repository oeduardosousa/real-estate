import { ImageResponse } from "next/og";
import { getListingDetail, listings, site } from "@/data";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return listings.map(({ slug }) => ({ slug }));
}

export default async function ListingOpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const listing = getListingDetail((await params).slug);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(160deg,#F6C3A2,#F5F0E8 60%,#C4D7E8)", color: "#1D1B18", fontFamily: "serif" }}>
        <div style={{ fontSize: 40 }}>{site.name}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, lineHeight: 1.05 }}>{listing?.title ?? "Imóvel"}</div>
          {listing && <div style={{ fontSize: 44, marginTop: 24, color: "#5A554D" }}>{`${listing.neighborhood} · ${formatPrice(listing)}`}</div>}
        </div>
      </div>
    ),
    size,
  );
}
