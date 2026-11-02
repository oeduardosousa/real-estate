import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Frontend-only, no server runtime (BRIEF.md): every route is prerendered to static HTML.
  output: "export",
  // The static export has no image optimizer; optimized AVIF/WebP files are committed instead.
  images: { unoptimized: true },
};

export default nextConfig;
