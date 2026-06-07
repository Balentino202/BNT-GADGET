export type ProductCategory =
  | 'all'
  | 'iphone'
  | 'android'
  | 'macbook'
  | 'ipad'
  | 'watch'
  | 'gaming'
  | 'accessories';

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

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
  stockStatus?: StockStatus;
  /** When false, the product is hidden from the public site (still editable in admin). Undefined = visible. */
  published?: boolean;
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
