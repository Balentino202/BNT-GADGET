export type ProductCategory =
  | 'all'
  | 'iphone'
  | 'android'
  | 'macbook'
  | 'ipad'
  | 'watch'
  | 'gaming'
  | 'accessories';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  currentPrice: string;
  description: string;
  features: string[];
  thumbnail: string;
  images: string[];
  badge?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  repairs: string[];
  iconBg: string;
}

export interface Testimonial {
  id: string;
  text: string;
  author: string;
  location: string;
  initials: string;
  rating: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}
