const WORDS = ["Comprar", "Vender", "Alugar", "Investir"] as const;

/**
 * Endless band of the four things the agency does. Pure CSS: the track holds two identical halves and
 * slides by exactly one half, so the loop has no seam. Pauses on hover; stops under reduced motion.
 * Only the first half is exposed to assistive tech.
 */
export function Marquee() {
  const half = (hidden: boolean) => (
    <ul className="marquee-half" aria-hidden={hidden || undefined}>
      {WORDS.map((word, index) => (
        <li key={word} className={index % 2 ? "marquee-italic" : undefined}>
          {word}
          <span className="marquee-star" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee" data-ambient role="region" aria-label="O que fazemos">
      <div className="marquee-track">
        {half(false)}
        {half(true)}
        {half(true)}
      </div>
    </div>
  );
}
