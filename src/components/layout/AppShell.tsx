"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Providers } from "@/components/providers/Providers";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { PageContent } from "./PageTransition";

/** The company view lives under /painel and brings its own shell (see src/app/painel/layout.tsx). */
export function isPanelPath(pathname: string): boolean {
  return pathname === "/painel" || pathname.startsWith("/painel/");
}

/**
 * Wraps the client view (public site) in its header, footer, smooth scroll and page transitions.
 * The panel is functional UI: no Lenis, no curtain, no reveals, so it renders without any of that.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (isPanelPath(pathname)) return <>{children}</>;

  return (
    <Providers>
      <Header />
      <PageContent>{children}</PageContent>
      <Footer />
    </Providers>
  );
}
