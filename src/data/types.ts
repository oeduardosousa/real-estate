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

export interface ListingImage {
  /** Path under /public. Originals stay in git-ignored raw-assets/. */
  src: string;
  /** PT-BR description of the room or view. */
  alt: string;
  width: number;
  height: number;
  /** Set when the image is AI-rendered or illustrative; shown as "Imagem ilustrativa". */
  illustrative?: boolean;
}

/** The complete listing contract (BRIEF.md "Listings"). */
export interface Listing {
  id: number;
  slug: string;
  title: string;
  type: ListingType;
  purpose: ListingPurpose;
  /** BRL. Total price for venda, monthly rent for aluguel. */
  price: number;
  /** BRL per month. */
  condominio?: number;
  /** BRL per year. */
  iptu?: number;
  /** Built area in m². */
  area: number;
  bedrooms: number;
  suites: number;
  bathrooms: number;
  parking: number;
  neighborhood: string;
  city: string;
  coordinates: Coordinates;
  features: string[];
  description: string;
  images: ListingImage[];
  /** Id of a TeamMember. */
  agent: string;
  featured: boolean;
  floorplan?: ListingImage;
}

/**
 * What BRIEF.md already fixes for each listing. The content phase fills the rest of
 * {@link Listing} (description, images, coordinates, features, agent, extra costs).
 */
export type ListingCore = Pick<
  Listing,
  | "id"
  | "slug"
  | "title"
  | "type"
  | "purpose"
  | "price"
  | "area"
  | "bedrooms"
  | "neighborhood"
  | "city"
  | "featured"
>;

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
