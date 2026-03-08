import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, Check } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import TechSpecsTable from "@/components/TechSpecsTable";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find((p) => p.slug === slug);
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-sm text-muted-foreground">PRODUCT NOT FOUND</p>
          <Button asChild variant="outline" className="mt-4 font-mono">
            <Link to="/products"><ArrowLeft className="w-4 h-4 mr-2" /> BACK TO PRODUCTS</Link>
          </Button>
        </div>
      </div>
    );
  }

  const variant = product.variants[selectedVariant];
  const totalPrice = product.basePrice + variant.priceModifier;

  const handleAdd = () => {
    addItem(product, variant);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <Link to="/products" className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-3 h-3" /> BACK TO PRODUCTS
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="aspect-square bg-card rounded-lg border border-border flex items-center justify-center relative overflow-hidden">
              <div className="text-center">
                <p className="font-mono text-7xl md:text-8xl font-bold text-muted-foreground/10">{product.techSpecs.lumens}</p>
                <p className="font-mono text-sm tracking-[0.5em] text-muted-foreground/30 mt-2">LUMENS</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-primary/5 to-transparent" />
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <p className="font-mono text-xs tracking-[0.3em] text-primary mb-2">{product.category.toUpperCase()}</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">{product.name}</h1>
              <p className="text-muted-foreground leading-relaxed">{product.longDescription}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-3xl font-bold text-primary">€{totalPrice.toFixed(2)}</span>
              {variant.priceModifier !== 0 && (
                <span className="font-mono text-sm text-muted-foreground line-through">€{product.basePrice.toFixed(2)}</span>
              )}
            </div>

            {/* Variants */}
            <div className="space-y-3">
              <p className="font-mono text-xs tracking-wider text-muted-foreground">SELECT VARIANT</p>
              <div className="grid gap-2">
                {product.variants.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(i)}
                    className={`text-left p-3 rounded-md border font-mono text-sm transition-all ${
                      i === selectedVariant
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{v.name}</span>
                      <span className="text-xs">
                        {v.priceModifier > 0 && `+€${v.priceModifier.toFixed(2)}`}
                        {v.priceModifier < 0 && `-€${Math.abs(v.priceModifier).toFixed(2)}`}
                        {v.priceModifier === 0 && "Base price"}
                      </span>
                    </div>
                    <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                      <span>SKU: {v.sku}</span>
                      <span>{v.stockLevel > 0 ? `${v.stockLevel} in stock` : "OUT OF STOCK"}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Add to cart */}
            <Button
              size="lg"
              className="w-full font-mono tracking-wider"
              onClick={handleAdd}
              disabled={variant.stockLevel === 0}
            >
              {added ? (
                <><Check className="w-4 h-4 mr-2" /> ADDED TO CART</>
              ) : (
                <><ShoppingCart className="w-4 h-4 mr-2" /> ADD TO CART — €{totalPrice.toFixed(2)}</>
              )}
            </Button>

            {/* Activities */}
            <div className="flex flex-wrap gap-2">
              {product.activity.map((act) => (
                <span key={act} className="font-mono text-[10px] tracking-wider text-muted-foreground bg-secondary px-2 py-1 rounded-sm">
                  {act.toUpperCase()}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tech Specs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-primary mb-2">SPECIFICATIONS</p>
          <h2 className="text-2xl font-bold mb-6">Technical Data</h2>
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <TechSpecsTable specs={product.techSpecs} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
