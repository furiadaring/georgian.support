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
