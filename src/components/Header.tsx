import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, User, LogOut, ClipboardList } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProductSearch from "@/components/ProductSearch";

const Header = () => {
  const { totalItems, openCart } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-widest text-foreground hover:text-primary transition-colors uppercase">
          The Lagari<span className="text-primary">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/products" className="text-sm font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors">
            SHOP ALL
          </Link>
          <Link to="/products?category=t-shirts" className="text-sm font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors">
            T-SHIRTS
          </Link>
          <Link to="/products?category=hoodies" className="text-sm font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors">
            HOODIES
          </Link>
          <Link to="/products?category=pants" className="text-sm font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors">
            PANTS
          </Link>
          <Link to="/products?category=jackets" className="text-sm font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors">
            JACKETS
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Search products"
          >
            <Search className="w-5 h-5" />
          </button>

          {user ? (
            <>
              <Link
                to="/orders"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Order history"
              >
                <ClipboardList className="w-5 h-5" />
              </Link>
              <button
                onClick={handleSignOut}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Sign in"
            >
              <User className="w-5 h-5" />
            </Link>
          )}

          <button
            onClick={openCart}
            className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Open shopping cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <ProductSearch open={searchOpen} onClose={() => setSearchOpen(false)} />

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
              <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors py-2">SHOP ALL</Link>
              <Link to="/products?category=t-shirts" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors py-2">T-SHIRTS</Link>
              <Link to="/products?category=hoodies" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors py-2">HOODIES</Link>
              <Link to="/products?category=pants" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors py-2">PANTS</Link>
              <Link to="/products?category=jackets" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors py-2">JACKETS</Link>
              {!user && (
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium tracking-wide text-primary hover:text-foreground transition-colors py-2">SIGN IN</Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
