import { z } from "zod";
import type { ListingType } from "@/data";
import type { PanelListing } from "./types";

export const LISTING_TYPES = [
  "Apartamento",
  "Casa",
  "Casa em condomínio",
  "Cobertura",
  "Loft",
  "Studio",
] as const satisfies readonly ListingType[];

export const MIN_PHOTOS = 3;
/** Featured listings are shown large on the home page, so they need more photos. */
export const MIN_PHOTOS_FEATURED = 6;
export const MIN_DESCRIPTION_CHARS = 120;

/** Required fields from PAINEL.md. Messages are shown to the user, so they are PT-BR. */
export const requiredFieldsSchema = z.object({
  title: z.string().trim().min(3, "Informe o título, com pelo menos 3 caracteres."),
  type: z.enum(LISTING_TYPES, "Escolha o tipo do imóvel."),
  purpose: z.enum(["venda", "aluguel"], "Escolha a finalidade."),
  price: z.number().int().positive("Informe um valor maior que zero."),
  area: z.number().positive("Informe a área em m²."),
  bedrooms: z.number().int().min(1, "Informe ao menos 1 quarto."),
  neighborhood: z.string().trim().min(1, "Escolha o bairro."),
  city: z.string().trim().min(1, "Informe a cidade."),
});

export type RequiredField = keyof z.infer<typeof requiredFieldsSchema>;

/** Field name to message. Empty when every required field is valid. */
export function validateRequired(
  listing: Pick<PanelListing, RequiredField>,
): Partial<Record<RequiredField, string>> {
  const result = requiredFieldsSchema.safeParse(listing);
  if (result.success) return {};
  const errors: Partial<Record<RequiredField, string>> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as RequiredField;
    errors[field] ??= issue.message;
  }
  return errors;
}

export interface ChecklistItem {
  id: "required" | "photos" | "cover" | "text";
  label: string;
  ok: boolean;
  /** What is still missing. Empty when ok. */
  problems: string[];
}

export interface Checklist {
  items: ChecklistItem[];
  /** True when "Enviar para revisão" is allowed. */
  ready: boolean;
}

/** Brand voice: no exclamation marks anywhere in the listing's copy. */
export function hasExclamation(listing: Pick<PanelListing, "title" | "summary" | "description" | "features">) {
  return [listing.title, listing.summary, ...listing.description, ...listing.features].some((text) =>
    text.includes("!"),
  );
}

export function minPhotosFor(listing: Pick<PanelListing, "featured">): number {
  return listing.featured ? MIN_PHOTOS_FEATURED : MIN_PHOTOS;
}

/** The review checklist from PAINEL.md. It blocks "Enviar para revisão". */
export function reviewChecklist(listing: PanelListing): Checklist {
  const required = Object.values(validateRequired(listing));

  const minPhotos = minPhotosFor(listing);
  const photoProblems: string[] = [];
  if (listing.photos.length < minPhotos) {
    const missing = minPhotos - listing.photos.length;
    photoProblems.push(
      `${missing === 1 ? "Falta 1 foto" : `Faltam ${missing} fotos`} (mínimo ${minPhotos}${listing.featured ? ", por ser destaque" : ""}).`,
    );
  }
  const withoutAlt = listing.photos.filter((photo) => !photo.alt.trim()).length;
  if (withoutAlt > 0) {
    photoProblems.push(
      withoutAlt === 1 ? "1 foto está sem texto alternativo." : `${withoutAlt} fotos estão sem texto alternativo.`,
    );
  }

  const coverProblems = listing.photos.some((photo) => photo.id === listing.coverPhotoId)
    ? []
    : ["Escolha a foto de capa."];

  const textProblems: string[] = [];
  if (!listing.summary.trim()) textProblems.push("Escreva o resumo de uma frase.");
  const descriptionLength = listing.description.join("").trim().length;
  if (descriptionLength < MIN_DESCRIPTION_CHARS) {
    textProblems.push(`A descrição precisa de pelo menos ${MIN_DESCRIPTION_CHARS} caracteres (hoje ${descriptionLength}).`);
  }
  if (hasExclamation(listing)) textProblems.push("Retire os pontos de exclamação: a voz da marca é calma.");

  const items: ChecklistItem[] = [
    { id: "required", label: "Dados obrigatórios", ok: required.length === 0, problems: required },
    { id: "photos", label: "Fotos com texto alternativo", ok: photoProblems.length === 0, problems: photoProblems },
    { id: "cover", label: "Foto de capa", ok: coverProblems.length === 0, problems: coverProblems },
    { id: "text", label: "Resumo e descrição", ok: textProblems.length === 0, problems: textProblems },
  ];
  return { items, ready: items.every((item) => item.ok) };
}
