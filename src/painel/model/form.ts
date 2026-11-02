import type { ListingPurpose, ListingType } from "@/data";
import type { EditableFields, PanelListing } from "./types";

/** Text-field state for the editor. Numbers are kept as strings while the user types. */
export interface FormValues {
  title: string;
  type: ListingType;
  purpose: ListingPurpose;
  neighborhood: string;
  city: string;
  featured: boolean;
  price: string;
  condominio: string;
  iptu: string;
  area: string;
  bedrooms: string;
  suites: string;
  bathrooms: string;
  parking: string;
  /** One feature per line. */
  features: string;
  summary: string;
  /** Paragraphs separated by a blank line. */
  description: string;
}

/** Digits only, so "1.350.000" and "R$ 1350000" both read as 1350000. Empty reads as 0. */
export function parseWhole(text: string): number {
  const digits = text.replace(/\D/g, "");
  return digits === "" ? 0 : Number(digits);
}

export function splitLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function splitParagraphs(text: string): string[] {
  return text
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

const asText = (value: number) => (value === 0 ? "" : String(value));

export function toFormValues(listing: PanelListing): FormValues {
  return {
    title: listing.title,
    type: listing.type,
    purpose: listing.purpose,
    neighborhood: listing.neighborhood,
    city: listing.city,
    featured: listing.featured,
    price: asText(listing.price),
    condominio: asText(listing.condominio),
    iptu: asText(listing.iptu),
    area: asText(listing.area),
    bedrooms: asText(listing.bedrooms),
    suites: asText(listing.suites),
    bathrooms: asText(listing.bathrooms),
    parking: asText(listing.parking),
    features: listing.features.join("\n"),
    summary: listing.summary,
    description: listing.description.join("\n\n"),
  };
}

/** The edit that turns a listing into what the form shows. Unchanged fields are dropped by `applyEdit`. */
export function toPatch(values: FormValues): EditableFields {
  return {
    title: values.title.trim(),
    type: values.type,
    purpose: values.purpose,
    neighborhood: values.neighborhood,
    city: values.city,
    featured: values.featured,
    price: parseWhole(values.price),
    condominio: parseWhole(values.condominio),
    iptu: parseWhole(values.iptu),
    area: parseWhole(values.area),
    bedrooms: parseWhole(values.bedrooms),
    suites: parseWhole(values.suites),
    bathrooms: parseWhole(values.bathrooms),
    parking: parseWhole(values.parking),
    features: splitLines(values.features),
    summary: values.summary.trim(),
    description: splitParagraphs(values.description),
  };
}
