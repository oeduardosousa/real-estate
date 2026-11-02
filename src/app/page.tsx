import { PagePlaceholder } from "@/components/ui/PagePlaceholder";
import { site } from "@/data";

export default function HomePage() {
  return (
    <PagePlaceholder label="Início" title={site.name}>
      {site.tagline}
    </PagePlaceholder>
  );
}
