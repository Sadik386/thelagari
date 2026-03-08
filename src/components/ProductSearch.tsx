import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  short_description: string | null;
  product_images: { url: string; alt_text: string | null; display_order: number | null }[];
}

const ProductSearch = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      const { data } = await supabase
        .from("products")
        .select("id, name, slug, base_price, short_description, product_images(url, alt_text, display_order)")
        .ilike("name", `%${query}%`)
        .limit(6);

      setResults((data as unknown as SearchResult[]) ?? []);
      setLoading(false);
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (slug: string) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-border overflow-hidden"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground font-mono text-sm outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {query.trim() && (
              <div className="mt-3 space-y-1 max-h-80 overflow-y-auto">
                {loading && (
                  <p className="font-mono text-xs text-muted-foreground py-4 text-center">Searching...</p>
                )}
                {!loading && results.length === 0 && (
                  <p className="font-mono text-xs text-muted-foreground py-4 text-center">No products found</p>
                )}
                {!loading &&
                  results.map((product) => {
                    const img = product.product_images?.sort(
                      (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
                    )[0];
                    return (
                      <button
                        key={product.id}
                        onClick={() => handleSelect(product.slug)}
                        className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-secondary/50 transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded bg-card border border-border overflow-hidden shrink-0">
                          {img ? (
                            <img src={img.url} alt={img.alt_text ?? product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-muted" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-sm text-foreground truncate">{product.name}</p>
                          <p className="font-mono text-xs text-muted-foreground">
                            €{product.base_price.toFixed(2)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductSearch;
