import { X, Minus, Plus, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const CartSidebar = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
            onClick={closeCart}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card border-l border-border flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-mono text-lg font-bold tracking-wider">CART</h2>
              <button onClick={closeCart} className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Close cart">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <p className="font-mono text-sm">CART IS EMPTY</p>
                  <p className="text-xs mt-2">Add some products to get started</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => {
                    const price = item.product.basePrice + item.variant.priceModifier;
                    return (
                      <div key={`${item.product.id}-${item.variant.id}`} className="flex gap-4">
                        <div className="w-20 h-20 bg-secondary rounded-md flex items-center justify-center flex-shrink-0">
                          <span className="font-mono text-xs text-muted-foreground">{item.variant.name}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-mono text-sm font-semibold truncate">{item.product.name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.variant.name}</p>
                          <p className="font-mono text-sm text-primary mt-1">€{price.toFixed(2)}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity - 1)}
                              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono text-xs w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity + 1)}
                              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => removeItem(item.product.id, item.variant.id)}
                              className="ml-auto p-1 text-muted-foreground hover:text-destructive transition-colors"
                              aria-label="Remove item"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-border space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-sm text-muted-foreground">TOTAL</span>
                  <span className="font-mono text-lg font-bold text-primary">€{totalPrice.toFixed(2)}</span>
                </div>
                <Button className="w-full font-mono tracking-wider" size="lg" onClick={() => { closeCart(); navigate("/checkout"); }}>
                  CHECKOUT <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
