import { PagePlaceholder } from "@/components/ui/PagePlaceholder";
import { TransitionLink } from "@/components/layout/TransitionLink";

export default function NotFound() {
  return (
    <PagePlaceholder label="Erro 404" title="Página não encontrada">
      O endereço não existe ou mudou.{" "}
      <TransitionLink href="/" className="text-accent underline underline-offset-4">
        Voltar ao início
      </TransitionLink>
    </PagePlaceholder>
  );
}
