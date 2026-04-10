import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { products as localProducts, categories as localCategories } from "@/data/products";

export interface DbProduct {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  short_description: string | null;
  long_description: string | null;
  tech_specs: Record<string, any>;
  is_featured: boolean | null;
  activity: string[] | null;
  category_id: string | null;
  categories: { id: string; name: string; slug: string } | null;
  product_variants: {
    id: string;
    variant_name: string;
    price_modifier: number | null;
    sku: string | null;
    stock_level: number | null;
  }[];
  product_images: {
    id: string;
    url: string;
    alt_text: string | null;
    display_order: number | null;
  }[];
}

// Convert local product format to DbProduct format
const convertProduct = (p: any): DbProduct => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  base_price: p.basePrice,
  short_description: p.shortDescription,
  long_description: p.longDescription,
  tech_specs: p.techSpecs,
  is_featured: p.isFeatured,
  activity: p.activity,
  category_id: p.category,
  categories: null,
  product_variants: p.variants.map((v: any) => ({
    id: v.id,
    variant_name: v.name,
    price_modifier: v.priceModifier,
    sku: v.sku,
    stock_level: v.stockLevel,
  })),
  product_images: [],
});

export const useProducts = (category?: string, activity?: string) => {
  return useQuery({
    queryKey: ["products", category, activity],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (category && category !== "all") params.set("category", category);
        if (activity) params.set("activity", activity);
        const qs = params.toString();
        return await api.get<DbProduct[]>(`/products${qs ? `?${qs}` : ""}`);
      } catch (error) {
        // Fallback to local data if API fails
        console.warn("API not available, using local product data");
        let filtered = localProducts.map(convertProduct);

        if (category && category !== "all") {
          filtered = filtered.filter(p => p.category_id === category);
        }
        if (activity) {
          filtered = filtered.filter(p => p.activity?.includes(activity));
        }

        return filtered;
      }
    },
    retry: false,
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      try {
        return api.get<DbProduct>(`/products/${slug}`);
      } catch (error) {
        // Fallback to local data if API fails
        console.warn("API not available, using local product data");
        const product = localProducts.find(p => p.slug === slug);
        if (!product) throw new Error(`Product not found: ${slug}`);
        return convertProduct(product);
      }
    },
    enabled: !!slug,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        return api.get<{ id: string; name: string; slug: string; description: string; image_url: string }[]>("/categories");
      } catch (error) {
        // Fallback to local data if API fails
        console.warn("API not available, using local category data");
        return localCategories.map(c => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: "",
          image_url: "",
        }));
      }
    },
  });
};
