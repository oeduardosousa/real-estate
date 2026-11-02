import { Cta } from "@/components/home/Cta";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Neighborhoods } from "@/components/home/Neighborhoods";
import { Reviews } from "@/components/home/Reviews";
import { Numbers } from "@/components/home/Numbers";
import { Services } from "@/components/home/Services";
import { Story } from "@/components/home/Story";
import { Team } from "@/components/home/Team";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Story />
      <FeaturedProperties />
      <Reviews />
      <Services />
      <Numbers />
      <Neighborhoods />
      <Team />
      <Cta />
    </>
  );
}
