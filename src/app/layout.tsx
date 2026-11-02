import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageContent } from "@/components/layout/PageTransition";
import { Providers } from "@/components/providers/Providers";
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
        <Providers>
          <Header />
          <PageContent>{children}</PageContent>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
