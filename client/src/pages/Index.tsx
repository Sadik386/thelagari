import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Truck, Shield, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const { data: allProducts, isLoading } = useProducts();
  const featuredProducts = (allProducts || []).filter((p) => p.is_featured);

  console.log('Index page - allProducts:', allProducts);
  console.log('Index page - isLoading:', isLoading);
  console.log('Index page - featuredProducts:', featuredProducts);

  const heroRef = useRef<HTMLElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroGlowRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const featuredRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations - only if refs exist
      if (heroRef.current && heroTextRef.current) {
        gsap.to(heroTextRef.current, {
          y: -120,
          opacity: 0.2,
          scale: 0.95,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (heroRef.current && heroGlowRef.current) {
        gsap.to(heroGlowRef.current, {
          scale: 1.8,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (statsRef.current) {
        const statItems = statsRef.current.querySelectorAll(".stat-item");
        if (statItems.length > 0) {
          gsap.from(statItems, {
            y: 40,
            opacity: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: statsRef.current, start: "top 85%" },
          });
        }
      }

      if (featuredRef.current) {
        const featuredHeading = featuredRef.current.querySelector(".featured-heading");
        if (featuredHeading) {
          gsap.from(featuredHeading, {
            x: -60,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: featuredRef.current, start: "top 80%" },
          });
        }

        const productCards = featuredRef.current.querySelectorAll(".product-card-wrapper");
        if (productCards.length > 0) {
          gsap.from(productCards, {
            y: 80,
            opacity: 0,
            stagger: 0.12,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: featuredRef.current, start: "top 70%" },
          });
        }
      }

      if (ctaRef.current && ctaRef.current.children.length > 0) {
        gsap.from(ctaRef.current.children, {
          y: 50,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: ctaRef.current, start: "top 85%" },
        });
      }
    });

    return () => ctx.revert();
  }, [allProducts]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          ref={heroGlowRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-pulse-glow"
        />

        <div ref={heroTextRef} className="container mx-auto px-4 text-center relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: { 
                  staggerChildren: 0.2,
                  delayChildren: 0.3
                }
              }
            }}
          >
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="font-mono text-xs tracking-[0.3em] text-primary mb-6"
            >
              CASUAL ESSENTIALS
            </motion.p>

            <motion.h1 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
              }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] mb-6"
            >
              WEAR
              <span className="block text-gradient">YOUR WAY.</span>
            </motion.h1>

            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="max-w-lg mx-auto text-muted-foreground text-lg md:text-xl leading-relaxed mb-10"
            >
              Everyday clothing crafted from premium materials. Comfortable, sustainable, and effortlessly stylish.
            </motion.p>

            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button asChild size="lg" className="font-mono tracking-wider px-8">
                <Link to="/products">
                  SHOP NOW <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-mono tracking-wider px-8">
                <Link to="/products?category=t-shirts">NEW ARRIVALS</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-primary/40" />
        </motion.div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="border-y border-border bg-card/50">
        <div className="container mx-auto px-4 py-8 grid grid-cols-3 gap-4">
          {[
            { icon: Leaf, label: "MATERIALS", value: "Organic" },
            { icon: Truck, label: "SHIPPING", value: "Free 50€+" },
            { icon: Shield, label: "RETURNS", value: "30 Days" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="stat-item text-center">
              <Icon className="w-5 h-5 mx-auto mb-2 text-primary" />
              <p className="font-mono text-xs tracking-wider text-muted-foreground">{label}</p>
              <p className="font-mono text-xl md:text-2xl font-bold mt-1">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section ref={featuredRef} className="py-20">
        <div className="container mx-auto px-4">
          <div className="featured-heading flex items-end justify-between mb-12">
            <div>
              <p className="font-mono text-xs tracking-[0.3em] text-primary mb-2">FEATURED</p>
              <h2 className="text-3xl md:text-4xl font-bold">Staff Picks</h2>
            </div>
            <Link to="/products" className="font-mono text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
              VIEW ALL <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-lg border border-border h-80 animate-pulse" />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product, i) => (
                <div key={product.id} className="product-card-wrapper">
                  <ProductCard product={product} index={i} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <p className="font-mono text-sm">NO FEATURED PRODUCTS AVAILABLE</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border">
        <div ref={ctaRef} className="container mx-auto px-4 text-center">
          <p className="font-mono text-xs tracking-[0.3em] text-primary mb-4">SUSTAINABLY MADE</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Comfort Meets Craft</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Every piece is made from responsibly sourced materials with quality construction that lasts.
          </p>
          <Button asChild size="lg" className="font-mono tracking-wider">
            <Link to="/products">EXPLORE COLLECTION <ArrowRight className="w-4 h-4 ml-2" /></Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm font-bold tracking-widest uppercase">TheLagari<span className="text-primary">.</span></p>
            <p className="font-mono text-xs text-muted-foreground">© 2026 THELAGARI. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
