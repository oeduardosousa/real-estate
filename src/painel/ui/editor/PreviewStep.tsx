"use client";

import { formatBRL, formatPrice, formatSpecs } from "@/lib/format";
import { reviewChecklist } from "../../model/checklist";
import type { PanelListing } from "../../model/types";
import { usePhotoUrl } from "../hooks";

/** The listing as the public card and header will show it, plus the review checklist. */
export function PreviewStep({ listing }: { listing: PanelListing }) {
  const cover = listing.photos.find((photo) => photo.id === listing.coverPhotoId);
  const coverUrl = usePhotoUrl(cover?.id ?? null);
  const checklist = reviewChecklist(listing);

  return (
    <div className="panel-preview">
      <article className="panel-card panel-preview-card" aria-label="Pré-visualização do imóvel">
        <div className="panel-preview-cover">
          {coverUrl && cover ? (
            // eslint-disable-next-line @next/next/no-img-element -- local blob URL, not optimizable
            <img src={coverUrl} alt={cover.alt} />
          ) : (
            <span className="panel-muted">{cover ? "Carregando foto…" : "Sem foto de capa"}</span>
          )}
        </div>
        <p className="panel-muted">
          {listing.neighborhood || "Bairro não definido"}
          {listing.city ? `, ${listing.city}` : ""}
        </p>
        <h2 className="panel-preview-title">{listing.title || "Sem título"}</h2>
        <p className="panel-preview-price">{listing.price > 0 ? formatPrice(listing) : "Preço não definido"}</p>
        {listing.area > 0 && <p className="panel-muted">{formatSpecs(listing)}</p>}
        {listing.summary && <p>{listing.summary}</p>}
        {listing.description.map((paragraph, index) => (
          <p key={index} className="panel-preview-text">
            {paragraph}
          </p>
        ))}
        {listing.features.length > 0 && (
          <ul className="panel-tags">
            {listing.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        )}
        {(listing.condominio > 0 || listing.iptu > 0) && (
          <p className="panel-muted">
            {listing.condominio > 0 && `Condomínio ${formatBRL(listing.condominio)}/mês`}
            {listing.condominio > 0 && listing.iptu > 0 && " · "}
            {listing.iptu > 0 && `IPTU ${formatBRL(listing.iptu)}/ano`}
          </p>
        )}
      </article>

      <section className="panel-card" aria-labelledby="checklist-title">
        <h2 id="checklist-title" className="panel-card-title">
          Lista de revisão
        </h2>
        <ul className="panel-checklist">
          {checklist.items.map((item) => (
            <li key={item.id} data-ok={item.ok}>
              <p className="panel-check-label">
                <span aria-hidden="true">{item.ok ? "✓" : "✕"}</span>
                <span className="visually-hidden">{item.ok ? "Pronto: " : "Pendente: "}</span>
                {item.label}
              </p>
              {item.problems.length > 0 && (
                <ul className="panel-problems">
                  {item.problems.map((problem) => (
                    <li key={problem}>{problem}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <p className="panel-muted">
          {checklist.ready
            ? "Tudo certo. Use “Enviar para revisão” no topo da página."
            : "Resolva as pendências para poder enviar para revisão."}
        </p>
      </section>
    </div>
  );
}
