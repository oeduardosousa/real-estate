import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { site } from "@/data";
import { fontVariables } from "@/lib/fonts";
import { motionInitScript } from "@/lib/motion/init-script";
import "./globals.css";

export const metadata: Metadata = {
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
