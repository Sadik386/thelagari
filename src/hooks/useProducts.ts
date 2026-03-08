import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

export const useProducts = (category?: string, activity?: string) => {
  return useQuery({
    queryKey: ["products", category, activity],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select(`
          *,
          categories(*),
          product_variants(*),
          product_images(*)
        `)
        .order("created_at", { ascending: false });

      if (category && category !== "all") {
        query = query.eq("categories.slug", category);
      }

      if (activity) {
        query = query.contains("activity", [activity]);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Filter by category join (supabase doesn't filter parent by child)
      let result = data as unknown as DbProduct[];
      if (category && category !== "all") {
        result = result.filter((p) => p.categories?.slug === category);
      }

      return result;
    },
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories(*),
          product_variants(*),
          product_images(*)
        `)
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data as unknown as DbProduct;
    },
    enabled: !!slug,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });
};
