import { Star } from "lucide-react";
import { Heading } from "@/components/motion/Heading";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Fictional client reviews (BRIEF.md: testimonials are fictional and labeled as such). The layout
 * follows the familiar review-card pattern, but there is no third-party brand or real source here.
 */
const reviews = [
  {
    name: "Patrícia M.",
    when: "há 2 semanas",
    rating: 5,
    text: "A Camila entendeu o que a gente procurava logo na primeira conversa. Vimos poucos imóveis e todos faziam sentido.",
  },
  {
    name: "Ricardo A.",
    when: "há 1 mês",
    rating: 5,
    text: "Anunciar o apartamento foi simples. Fotos bem cuidadas, texto claro e retorno rápido de toda a equipe.",
  },
  {
    name: "Luciana T.",
    when: "há 2 meses",
    rating: 5,
    text: "Aluguel sem surpresa. A Marina acompanhou do contrato à entrega das chaves e respondeu sempre no mesmo dia.",
  },
  {
    name: "Eduardo F.",
    when: "há 3 meses",
    rating: 4,
    text: "O Bruno mostrou números honestos sobre o investimento, inclusive os pontos fracos. Isso pesou na minha decisão.",
  },
] as const;

const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
const averageText = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(average);

function Stars({ value }: { value: number }) {
  return (
    <span className="stars" role="img" aria-label={`${value} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={16} strokeWidth={1.5} aria-hidden="true" data-on={n <= value} />
      ))}
    </span>
  );
}

export function Reviews() {
  return (
    <section id="avaliacoes" aria-labelledby="avaliacoes-titulo" className="section reviews">
      <div className="container">
        <div className="section-head">
          <div>
            <Reveal>
              <p className="eyebrow">
                <span className="dot" /> Avaliações
              </p>
            </Reveal>
            <Heading id="avaliacoes-titulo" className="t-display section-title" text="Quem já passou por aqui *conta como foi*." />
          </div>
          <Reveal className="reviews-score section-aside">
            <p className="reviews-average num">{averageText}</p>
            <Stars value={Math.round(average)} />
            <p className="t-small">{reviews.length} avaliações de clientes</p>
          </Reveal>
        </div>

        <ul className="reviews-grid">
          {reviews.map((review, index) => (
            <Reveal as="li" key={review.name} className="review" delay={(index % 4) * 0.07}>
              <header className="review-head">
                <span className="review-avatar" aria-hidden="true">
                  {review.name.charAt(0)}
                </span>
                <div>
                  <p className="review-name">{review.name}</p>
                  <p className="t-small">{review.when}</p>
                </div>
              </header>
              <Stars value={review.rating} />
              <p className="review-text">{review.text}</p>
            </Reveal>
          ))}
        </ul>

        <p className="t-small reviews-note">Avaliações fictícias, criadas para este projeto de portfólio.</p>
      </div>
    </section>
  );
}
