import type { Metadata } from "next";
import { Awards } from "@/components/about/Awards";
import { AboutHero } from "@/components/about/AboutHero";
import { Principles } from "@/components/about/Principles";
import { Timeline } from "@/components/about/Timeline";
import { Cta } from "@/components/home/Cta";
import { Numbers } from "@/components/home/Numbers";
import { Team } from "@/components/home/Team";
import { site } from "@/data";

export const metadata: Metadata = {
  title: "Sobre",
  description: `A história da ${site.name}: desde ${site.founded}, uma casa pequena de propósito que conhece cada imóvel antes de apresentá-lo.`,
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <Timeline />
      <Principles />
      <Numbers />
      <Awards />
      <Team />
      <Cta />
    </>
  );
}
