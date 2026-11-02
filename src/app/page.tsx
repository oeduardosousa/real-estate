import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { Hero } from "@/components/home/Hero";
import { Story } from "@/components/home/Story";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Story />
      <FeaturedProperties />
    </>
  );
}
