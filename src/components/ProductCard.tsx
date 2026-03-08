import { Link } from "react-router-dom";
import { Product } from "@/data/products";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={`/product/${product.slug}`}
        className="block group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="bg-card rounded-lg border border-border overflow-hidden card-hover">
          {/* Image area */}
          <div className="relative aspect-[4/3] bg-secondary flex items-center justify-center overflow-hidden">
            <div className="text-center">
              <p className="font-mono text-4xl font-bold text-muted-foreground/20 group-hover:text-primary/30 transition-colors duration-500">
                {product.techSpecs.lumens}
              </p>
              <p className="font-mono text-xs text-muted-foreground/30 tracking-widest mt-1">LUMENS</p>
            </div>
            
            {/* Quick view overlay */}
            <motion.div
              initial={false}
              animate={{ opacity: hovered ? 1 : 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="text-center space-y-3 px-4">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Eye className="w-4 h-4" />
                  <span className="font-mono text-xs tracking-wider">QUICK SPECS</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-secondary/50 rounded px-2 py-1.5">
                    <span className="text-muted-foreground block">Runtime</span>
                    <span className="text-foreground">{product.techSpecs.runtime.split("/")[0].trim()}</span>
                  </div>
                  <div className="bg-secondary/50 rounded px-2 py-1.5">
                    <span className="text-muted-foreground block">Weight</span>
                    <span className="text-foreground">{product.techSpecs.weight}</span>
                  </div>
                  <div className="bg-secondary/50 rounded px-2 py-1.5">
                    <span className="text-muted-foreground block">IP Rating</span>
                    <span className="text-foreground">{product.techSpecs.waterproof}</span>
                  </div>
                  <div className="bg-secondary/50 rounded px-2 py-1.5">
                    <span className="text-muted-foreground block">Charge</span>
                    <span className="text-foreground">{product.techSpecs.chargingTime}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {product.isFeatured && (
              <span className="absolute top-3 left-3 font-mono text-[10px] tracking-widest bg-primary text-primary-foreground px-2 py-1 rounded-sm">
                FEATURED
              </span>
            )}
          </div>

          {/* Info */}
          <div className="p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-mono text-sm font-bold tracking-wide group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <span className="font-mono text-sm font-bold text-primary whitespace-nowrap">
                €{product.basePrice.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {product.shortDescription}
            </p>
            <div className="flex gap-1.5 pt-1">
              {product.activity.slice(0, 3).map((act) => (
                <span key={act} className="text-[10px] font-mono tracking-wider text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-sm">
                  {act.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
