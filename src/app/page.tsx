import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { Hero } from "@/components/home/Hero";
import { Numbers } from "@/components/home/Numbers";
import { Services } from "@/components/home/Services";
import { Story } from "@/components/home/Story";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Story />
      <FeaturedProperties />
      <Services />
      <Numbers />
    </>
  );
}
