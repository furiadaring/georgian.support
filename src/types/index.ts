export interface NavItem {
  label: string;
  href: string;
}

export interface Address {
  city: string;
  address: string;
}

export interface Review {
  name: string;
  avatar: string;
  text: string;
  rating: number;
}

export interface PricingItem {
  title: string;
  included: string;
  documents: string;
  period: string;
  price: string[];
}

export interface Advantage {
  icon: string;
  title: string;
  description: string;
}

export interface Step {
  number: string;
  title: string;
  description: string;
}

export interface ContactFormData {
  name: string;
  phone: string;
  time?: string;
}

// Insurance Plan Types from Database
export interface PlanFeature {
  id: number;
  featureKey: string;
  nameRu: string;
  nameEn: string | null;
  nameKa: string | null;
  nameUk: string | null;
  nameTr: string | null;
  nameHe: string | null;
  nameAr: string | null;
  sortOrder: number;
}

export interface CoverageItem {
  id: number;
  coverageKey: string;
  titleRu: string;
  titleEn: string | null;
  titleKa: string | null;
  titleUk: string | null;
  titleTr: string | null;
  titleHe: string | null;
  titleAr: string | null;
  limitRu: string | null;
  limitEn: string | null;
  limitKa: string | null;
  limitUk: string | null;
  limitTr: string | null;
  limitHe: string | null;
  limitAr: string | null;
  sortOrder: number;
}

export interface Plan {
  id: number;
  slug: string;
  name: string;
  descriptionRu: string;
  descriptionEn: string | null;
  descriptionKa: string | null;
  descriptionUk: string | null;
  descriptionTr: string | null;
  descriptionHe: string | null;
  descriptionAr: string | null;
  subtitleRu: string | null;
  subtitleEn: string | null;
  subtitleKa: string | null;
  subtitleUk: string | null;
  subtitleTr: string | null;
  subtitleHe: string | null;
  subtitleAr: string | null;
  price: number;
  originalPrice: number | null;
  discountPercent: number | null;
  discountFixed: number | null;
  netPrice: number | null;
  pricingType: "per_day" | "fixed" | "per_month";
  period: string;
  periodLabel: string;
  isFavorite: boolean;
  isLegalCompliant: boolean;
  isActive: boolean;
  sortOrder: number;
  categorySlug: string | null;
  translations: Record<string, { name: string; description: string }>;
  features: PlanFeature[];
  coverageItems: CoverageItem[];
}
