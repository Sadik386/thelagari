export interface TechSpecs {
  material: string;
  weight: string;
  fit: string;
  care: string;
  origin?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  priceModifier: number;
  sku: string;
  stockLevel: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  shortDescription: string;
  longDescription: string;
  techSpecs: TechSpecs;
  category: "t-shirts" | "hoodies" | "pants" | "jackets";
  activity: string[];
  isFeatured: boolean;
  images: string[];
  variants: ProductVariant[];
}

export const categories = [
  { id: "all", name: "All Products", slug: "all" },
  { id: "t-shirts", name: "T-Shirts", slug: "t-shirts" },
  { id: "hoodies", name: "Hoodies", slug: "hoodies" },
  { id: "pants", name: "Pants", slug: "pants" },
  { id: "jackets", name: "Jackets", slug: "jackets" },
];

export const activities = ["Casual", "Streetwear", "Loungewear", "Activewear", "Smart Casual", "Everyday", "Outdoor"];

export const products: Product[] = [];
