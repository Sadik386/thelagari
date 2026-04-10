import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

interface OrderRow {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  order_items: {
    id: string;
    quantity: number;
    unit_price: number;
    products: { name: string } | null;
    product_variants: { variant_name: string } | null;
  }[];
}

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth"); return; }

    api.get<OrderRow[]>("/orders/my-orders")
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="font-mono text-xs tracking-[0.3em] text-primary mb-2">ACCOUNT</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Order History</h1>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center gap-4"
          >
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            <p className="font-mono text-sm text-muted-foreground">NO ORDERS YET</p>
            <Button variant="outline" asChild className="font-mono tracking-wider text-xs">
              <Link to="/products">BROWSE PRODUCTS</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => {
              const ref = order.id.slice(0, 8).toUpperCase();
              const itemCount = order.order_items.reduce((s, oi) => s + oi.quantity, 0);
              const itemNames = order.order_items
                .map((oi) => oi.products?.name || "Product")
                .slice(0, 3)
                .join(", ");

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={`/order/${order.id}`}
                    className="block bg-card border border-border rounded-lg p-5 hover:border-primary/40 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-primary" />
                        <span className="font-mono text-sm font-bold">#{ref}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground truncate max-w-[300px]">{itemNames}{order.order_items.length > 3 && "…"}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="font-mono text-[10px] tracking-wider px-2 py-0.5 rounded bg-secondary text-secondary-foreground uppercase">
                            {order.status}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {itemCount} item{itemCount !== 1 ? "s" : ""} · {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-sm font-bold text-primary">
                        €{Number(order.total_amount).toFixed(2)}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
