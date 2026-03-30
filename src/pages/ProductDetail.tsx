import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, Check } from "lucide-react";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import TechSpecsTable from "@/components/TechSpecsTable";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug || "");
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [added, setAdded] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="font-mono text-sm text-muted-foreground animate-pulse">LOADING...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-sm text-muted-foreground">PRODUCT NOT FOUND</p>
          <Button asChild variant="outline" className="mt-4 font-mono">
            <Link to="/products"><ArrowLeft className="w-4 h-4 mr-2" /> BACK TO SHOP</Link>
          </Button>
        </div>
      </div>
    );
  }

  const variants = product.product_variants || [];
  const variant = variants[selectedVariant];
  const totalPrice = Number(product.base_price) + (variant ? Number(variant.price_modifier || 0) : 0);
  const specs = product.tech_specs as Record<string, any>;

  const handleAdd = () => {
    if (!variant) return;
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        basePrice: Number(product.base_price),
        shortDescription: product.short_description || "",
        longDescription: product.long_description || "",
        techSpecs: specs as any,
        category: (product.categories?.slug || "t-shirts") as any,
        activity: product.activity || [],
        isFeatured: product.is_featured || false,
        images: product.product_images?.map((i) => i.url) || [],
        variants: variants.map((v) => ({
          id: v.id,
          name: v.variant_name,
          priceModifier: Number(v.price_modifier || 0),
          sku: v.sku || "",
          stockLevel: v.stock_level || 0,
        })),
      },
      {
        id: variant.id,
        name: variant.variant_name,
        priceModifier: Number(variant.price_modifier || 0),
        sku: variant.sku || "",
        stockLevel: variant.stock_level || 0,
      }
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <Link to="/products" className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-3 h-3" /> BACK TO SHOP
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="aspect-square bg-card rounded-lg border border-border flex items-center justify-center relative overflow-hidden">
              {product.product_images?.[0]?.url ? (
                <img src={product.product_images[0].url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <p className="font-mono text-5xl md:text-6xl font-bold text-muted-foreground/10">{specs.fit || "—"}</p>
                  <p className="font-mono text-sm tracking-[0.5em] text-muted-foreground/30 mt-2">{specs.material?.split(",")[0] || "APPAREL"}</p>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-primary/5 to-transparent" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="space-y-6">
            <div>
              <p className="font-mono text-xs tracking-[0.3em] text-primary mb-2">
                {product.categories?.name?.toUpperCase() || "PRODUCT"}
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">{product.name}</h1>
              <p className="text-muted-foreground leading-relaxed">{product.long_description}</p>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-mono text-3xl font-bold text-primary">€{totalPrice.toFixed(2)}</span>
            </div>

            {variants.length > 0 && (
              <div className="space-y-3">
                <p className="font-mono text-xs tracking-wider text-muted-foreground">SELECT SIZE</p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v, i) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(i)}
                      className={`px-4 py-2 rounded-md border font-mono text-sm transition-all ${
                        i === selectedVariant
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {v.variant_name}
                    </button>
                  ))}
                </div>
                {variant && (
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {(variant.stock_level || 0) > 0 ? `${variant.stock_level} in stock` : "OUT OF STOCK"}
                  </p>
                )}
              </div>
            )}

            <Button
              size="lg"
              className="w-full font-mono tracking-wider"
              onClick={handleAdd}
              disabled={!variant || (variant.stock_level || 0) === 0}
            >
              {added ? (
                <><Check className="w-4 h-4 mr-2" /> ADDED TO CART</>
              ) : (
                <><ShoppingCart className="w-4 h-4 mr-2" /> ADD TO CART — €{totalPrice.toFixed(2)}</>
              )}
            </Button>

            <div className="flex flex-wrap gap-2">
              {(product.activity || []).map((act) => (
                <span key={act} className="font-mono text-[10px] tracking-wider text-muted-foreground bg-secondary px-2 py-1 rounded-sm">
                  {act.toUpperCase()}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-16">
          <p className="font-mono text-xs tracking-[0.3em] text-primary mb-2">DETAILS</p>
          <h2 className="text-2xl font-bold mb-6">Product Specs</h2>
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <TechSpecsTable specs={specs} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
