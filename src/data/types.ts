export type ListingType =
  | "Apartamento"
  | "Casa"
  | "Casa em condomínio"
  | "Cobertura"
  | "Loft"
  | "Studio";

export type ListingPurpose = "venda" | "aluguel";

export interface Coordinates {
  lat: number;
  lng: number;
}

/** What BRIEF.md already fixes for each listing (the table in "Listings"). */
export interface ListingCore {
  id: number;
  slug: string;
  title: string;
  type: ListingType;
  purpose: ListingPurpose;
  /** BRL. Total price for venda, monthly rent for aluguel. */
  price: number;
  /** Built area in m². */
  area: number;
  bedrooms: number;
  neighborhood: string;
  city: string;
  featured: boolean;
}

/** Detail fields written in the content phase. Merged with {@link ListingCore} by `getListingDetail`. */
export interface ListingExtras {
  suites: number;
  bathrooms: number;
  parking: number;
  /** BRL per month. */
  condominio: number;
  /** BRL per year. */
  iptu: number;
  /** Approximate, used only as setting (BRIEF.md). */
  coordinates: Coordinates;
  features: string[];
  /** Short PT-BR paragraphs. */
  description: string[];
  /** One sentence for meta tags and the detail header. */
  summary: string;
  /** PT-BR descriptions of the rooms and views. Until photography exists each one is drawn as a Scene. */
  views: string[];
  /** Id of a TeamMember. */
  agent: string;
}

/** The complete listing contract. */
export type Listing = ListingCore & ListingExtras;

export interface TeamMember {
  id: string;
  name: string;
  role: string;
}

export interface Neighborhood {
  name: string;
  city: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface NavLink {
  label: string;
  href: string;
}
