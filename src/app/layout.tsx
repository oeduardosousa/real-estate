import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { site } from "@/data";
import { fontVariables } from "@/lib/fonts";
import { motionInitScript } from "@/lib/motion/init-script";
import "./globals.css";

// Vercel injects the production host at build time; locally the card URLs fall back to localhost.
const host = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const metadata: Metadata = {
  metadataBase: new URL(host ? `https://${host}` : "http://localhost:3000"),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.tagline,
};

export const viewport: Viewport = {
  themeColor: "#F5F0E8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the inline script sets data-motion on <html> before React hydrates.
    <html lang="pt-BR" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionInitScript }} />
      </head>
      <body>
        <a href="#conteudo" className="skip-link">
          Ir para o conteúdo
        </a>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
