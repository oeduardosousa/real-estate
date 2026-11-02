import { ImageResponse } from "next/og";
import { site } from "@/data";

export const dynamic = "force-static";
export const alt = `${site.name}. ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Share card: the sand page, the ridge and the tagline (no photography exists yet).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(160deg,#F6C3A2,#F5F0E8 60%,#C4D7E8)", color: "#1D1B18", fontFamily: "serif" }}>
        <div style={{ fontSize: 40 }}>{site.name}</div>
        <div style={{ fontSize: 92, lineHeight: 1.05, maxWidth: 900 }}>{site.tagline}</div>
      </div>
    ),
    size,
  );
}
