import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Battery } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const { data: allProducts } = useProducts();
  const featuredProducts = (allProducts || []).filter((p) => p.is_featured);

  const heroRef = useRef<HTMLElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroGlowRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const featuredRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero parallax: text moves up slower, glow scales down
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

      // Stats: stagger in from below
      if (statsRef.current) {
        gsap.from(statsRef.current.querySelectorAll(".stat-item"), {
          y: 40,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
          },
        });
      }

      // Featured section
      if (featuredRef.current) {
        gsap.from(featuredRef.current.querySelector(".featured-heading"), {
          x: -60,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: featuredRef.current,
            start: "top 80%",
          },
        });

        gsap.from(featuredRef.current.querySelectorAll(".product-card-wrapper"), {
          y: 80,
          opacity: 0,
          stagger: 0.12,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: featuredRef.current,
            start: "top 70%",
          },
        });
      }

      // CTA parallax
      if (ctaRef.current) {
        gsap.from(ctaRef.current.children, {
          y: 50,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          ref={heroGlowRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-pulse-glow"
        />

        <div ref={heroTextRef} className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="font-mono text-xs tracking-[0.3em] text-primary mb-6">ENGINEERED ILLUMINATION</p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] mb-6">
              SEE
              <span className="block text-gradient">EVERYTHING.</span>
            </h1>
            <p className="max-w-lg mx-auto text-muted-foreground text-lg md:text-xl leading-relaxed mb-10">
              Professional lighting systems engineered for extreme conditions. From 650 to 4,500 lumens.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="font-mono tracking-wider px-8">
                <Link to="/products">
                  EXPLORE PRODUCTS <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-mono tracking-wider px-8">
                <Link to="/products?category=bicycle">BICYCLE LIGHTS</Link>
              </Button>
            </div>
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
            { icon: Zap, label: "MAX OUTPUT", value: "4,500 lm" },
            { icon: Shield, label: "IP RATING", value: "IP68" },
            { icon: Battery, label: "MAX RUNTIME", value: "48h" },
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
              <h2 className="text-3xl md:text-4xl font-bold">Top Performers</h2>
            </div>
            <Link to="/products" className="font-mono text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
              VIEW ALL <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product, i) => (
              <div key={product.id} className="product-card-wrapper">
                <ProductCard product={product} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border">
        <div ref={ctaRef} className="container mx-auto px-4 text-center">
          <p className="font-mono text-xs tracking-[0.3em] text-primary mb-4">PROFESSIONAL GRADE</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for the Dark</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Every unit is CNC-machined, thermally managed, and tested to military standards.
          </p>
          <Button asChild size="lg" className="font-mono tracking-wider">
            <Link to="/products">SHOP NOW <ArrowRight className="w-4 h-4 ml-2" /></Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-mono text-sm font-bold tracking-widest">LŪMEN<span className="text-primary">.</span></p>
            <p className="font-mono text-xs text-muted-foreground">© 2026 LŪMEN LIGHTING SYSTEMS. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
