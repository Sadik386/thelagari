import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useProducts, useCategories } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";

const styles = ["Casual", "Streetwear", "Loungewear", "Activewear", "Smart Casual", "Everyday", "Outdoor"];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc">("name");

  const { data: dbProducts, isLoading } = useProducts(categoryParam, selectedStyle || undefined);
  const { data: dbCategories } = useCategories();

  const allCategories = [
    { id: "all", name: "All Products", slug: "all" },
    ...(dbCategories || []).map((c) => ({ id: c.slug, name: c.name, slug: c.slug })),
  ];

  const sorted = useMemo(() => {
    if (!dbProducts) return [];
    const result = [...dbProducts];
    switch (sortBy) {
      case "price-asc": return result.sort((a, b) => a.base_price - b.base_price);
      case "price-desc": return result.sort((a, b) => b.base_price - a.base_price);
      default: return result.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [dbProducts, sortBy]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="font-mono text-xs tracking-[0.3em] text-primary mb-2">COLLECTION</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Shop</h1>
        </motion.div>

        <div className="space-y-4 mb-10">
          <div className="flex flex-wrap gap-2">
            {allCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSearchParams(cat.id === "all" ? {} : { category: cat.id })}
                className={`font-mono text-xs tracking-wider px-4 py-2 rounded-md border transition-all ${
                  categoryParam === cat.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {cat.name.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStyle(null)}
              className={`font-mono text-[10px] tracking-wider px-3 py-1.5 rounded-sm border transition-all ${
                !selectedStyle
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-transparent text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              ALL STYLES
            </button>
            {styles.map((style) => (
              <button
                key={style}
                onClick={() => setSelectedStyle(selectedStyle === style ? null : style)}
                className={`font-mono text-[10px] tracking-wider px-3 py-1.5 rounded-sm border transition-all ${
                  selectedStyle === style
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-transparent text-muted-foreground border-border hover:text-foreground"
                }`}
              >
                {style.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-card border border-border rounded-md font-mono text-xs px-3 py-1.5 text-foreground outline-none focus:border-primary"
            >
              <option value="name">Name</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-lg border border-border h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <p className="font-mono text-xs text-muted-foreground mb-6">{sorted.length} PRODUCT{sorted.length !== 1 ? "S" : ""} FOUND</p>
            {sorted.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sorted.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                <p className="font-mono text-sm">NO PRODUCTS MATCH YOUR FILTERS</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
