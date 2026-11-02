import type { Metadata } from "next";
import { PanelShell } from "@/painel/ui/PanelShell";

export const metadata: Metadata = {
  title: "Painel",
  robots: { index: false, follow: false },
};

export default function PanelLayout({ children }: LayoutProps<"/painel">) {
  return <PanelShell>{children}</PanelShell>;
}
