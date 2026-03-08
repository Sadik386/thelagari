import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { products, categories, activities } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc" | "lumens">("name");

  const filtered = useMemo(() => {
    let result = products;
    if (categoryParam !== "all") {
      result = result.filter((p) => p.category === categoryParam);
    }
    if (selectedActivity) {
      result = result.filter((p) => p.activity.includes(selectedActivity));
    }
    switch (sortBy) {
      case "price-asc": return [...result].sort((a, b) => a.basePrice - b.basePrice);
      case "price-desc": return [...result].sort((a, b) => b.basePrice - a.basePrice);
      case "lumens": return [...result].sort((a, b) => b.techSpecs.lumens - a.techSpecs.lumens);
      default: return [...result].sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [categoryParam, selectedActivity, sortBy]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="font-mono text-xs tracking-[0.3em] text-primary mb-2">CATALOG</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Products</h1>
        </motion.div>

        {/* Filters */}
        <div className="space-y-4 mb-10">
          {/* Category */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
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

          {/* Activity */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedActivity(null)}
              className={`font-mono text-[10px] tracking-wider px-3 py-1.5 rounded-sm border transition-all ${
                !selectedActivity
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-transparent text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              ALL ACTIVITIES
            </button>
            {activities.map((act) => (
              <button
                key={act}
                onClick={() => setSelectedActivity(selectedActivity === act ? null : act)}
                className={`font-mono text-[10px] tracking-wider px-3 py-1.5 rounded-sm border transition-all ${
                  selectedActivity === act
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-transparent text-muted-foreground border-border hover:text-foreground"
                }`}
              >
                {act.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Sort */}
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
              <option value="lumens">Lumens: High → Low</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <p className="font-mono text-xs text-muted-foreground mb-6">{filtered.length} PRODUCT{filtered.length !== 1 ? "S" : ""} FOUND</p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p className="font-mono text-sm">NO PRODUCTS MATCH YOUR FILTERS</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
