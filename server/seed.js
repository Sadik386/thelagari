import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./db.js";
import Category from "./models/Category.js";
import Product from "./models/Product.js";

const categories = [
  { name: "T-Shirts", slug: "t-shirts", description: "Essential tees for every day", image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80" },
  { name: "Hoodies", slug: "hoodies", description: "Cozy hoodies and sweatshirts", image_url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80" },
  { name: "Pants", slug: "pants", description: "Comfortable pants and joggers", image_url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80" },
  { name: "Jackets", slug: "jackets", description: "Lightweight outerwear", image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80" },
];

const sizes = ["S", "M", "L", "XL"];

const products = [
  {
    name: "Essential Crew Tee",
    slug: "essential-crew-tee",
    base_price: 29.99,
    short_description: "A timeless crew neck tee made from 100% organic cotton.",
    long_description: "Our Essential Crew Tee is the foundation of any wardrobe. Cut from premium organic cotton with a relaxed fit that drapes perfectly. Pre-washed for softness, this tee gets better with every wear.",
    tech_specs: { material: "100% Organic Cotton", weight: "180gsm", fit: "Relaxed", care: "Machine wash cold", origin: "Portugal" },
    is_featured: true,
    activity: ["Casual", "Everyday", "Loungewear"],
    category_slug: "t-shirts",
    sku_prefix: "ECT",
    images: [
      { url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80", alt_text: "Essential Crew Tee - white cotton t-shirt", display_order: 0 },
      { url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80", alt_text: "Essential Crew Tee - detail view", display_order: 1 },
    ],
  },
  {
    name: "Oversized Graphic Tee",
    slug: "oversized-graphic-tee",
    base_price: 34.99,
    short_description: "Bold oversized tee with minimalist graphic print.",
    long_description: "Make a statement with our Oversized Graphic Tee. Features a dropped shoulder and boxy silhouette with a subtle screen-printed design. Heavy-weight cotton for a premium drape.",
    tech_specs: { material: "100% Heavyweight Cotton", weight: "220gsm", fit: "Oversized", care: "Machine wash cold, inside out", origin: "Turkey" },
    is_featured: true,
    activity: ["Streetwear", "Casual", "Everyday"],
    category_slug: "t-shirts",
    sku_prefix: "OGT",
    images: [
      { url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80", alt_text: "Oversized Graphic Tee - front view", display_order: 0 },
      { url: "https://images.unsplash.com/photo-1503341504253-dff4f37f6c43?w=800&q=80", alt_text: "Oversized Graphic Tee - styled look", display_order: 1 },
    ],
  },
  {
    name: "Classic Pullover Hoodie",
    slug: "classic-pullover-hoodie",
    base_price: 59.99,
    short_description: "Soft fleece-lined hoodie with kangaroo pocket.",
    long_description: "The Classic Pullover Hoodie is your go-to for cool weather comfort. Made from a premium cotton-poly blend with brushed fleece interior. Features a double-lined hood and ribbed cuffs.",
    tech_specs: { material: "80% Cotton, 20% Polyester", weight: "350gsm", fit: "Regular", care: "Machine wash warm", origin: "Portugal" },
    is_featured: true,
    activity: ["Casual", "Loungewear", "Outdoor"],
    category_slug: "hoodies",
    sku_prefix: "CPH",
    images: [
      { url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80", alt_text: "Classic Pullover Hoodie - grey hoodie", display_order: 0 },
      { url: "https://images.unsplash.com/photo-1578768079470-fa604cf40946?w=800&q=80", alt_text: "Classic Pullover Hoodie - detail", display_order: 1 },
    ],
  },
  {
    name: "Zip-Up Track Hoodie",
    slug: "zip-up-track-hoodie",
    base_price: 64.99,
    short_description: "Modern zip hoodie with track-inspired side panels.",
    long_description: "Our Zip-Up Track Hoodie blends athletic heritage with everyday style. Full-zip construction with contrast panels, zippered pockets, and a slim-fit silhouette.",
    tech_specs: { material: "70% Cotton, 30% Polyester", weight: "320gsm", fit: "Slim", care: "Machine wash cold", origin: "Turkey" },
    is_featured: false,
    activity: ["Activewear", "Streetwear", "Smart Casual"],
    category_slug: "hoodies",
    sku_prefix: "ZTH",
    images: [
      { url: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&q=80", alt_text: "Zip-Up Track Hoodie - front view", display_order: 0 },
      { url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80", alt_text: "Zip-Up Track Hoodie - side view", display_order: 1 },
    ],
  },
  {
    name: "Relaxed Chino Pants",
    slug: "relaxed-chino-pants",
    base_price: 49.99,
    short_description: "Versatile chinos with a comfortable relaxed fit.",
    long_description: "These Relaxed Chino Pants bridge the gap between casual and smart. Made from stretch-woven organic cotton with a tapered leg. Perfect for the office or weekend outings.",
    tech_specs: { material: "98% Organic Cotton, 2% Elastane", weight: "260gsm", fit: "Relaxed Taper", care: "Machine wash cold", origin: "Spain" },
    is_featured: true,
    activity: ["Smart Casual", "Everyday", "Outdoor"],
    category_slug: "pants",
    sku_prefix: "RCP",
    images: [
      { url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80", alt_text: "Relaxed Chino Pants - front view", display_order: 0 },
      { url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80", alt_text: "Relaxed Chino Pants - styled", display_order: 1 },
    ],
  },
  {
    name: "Fleece Jogger Pants",
    slug: "fleece-jogger-pants",
    base_price: 44.99,
    short_description: "Ultra-soft fleece joggers with elastic cuffs.",
    long_description: "Maximum comfort meets clean design. Our Fleece Jogger Pants feature brushed-back fleece, a drawstring waist, and tapered legs with ribbed ankle cuffs. Side pockets and one back pocket.",
    tech_specs: { material: "85% Cotton, 15% Polyester", weight: "300gsm", fit: "Tapered", care: "Machine wash warm", origin: "Portugal" },
    is_featured: false,
    activity: ["Loungewear", "Casual", "Activewear"],
    category_slug: "pants",
    sku_prefix: "FJP",
    images: [
      { url: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80", alt_text: "Fleece Jogger Pants - front view", display_order: 0 },
      { url: "https://images.unsplash.com/photo-1580906853305-9e4f6e3e0b95?w=800&q=80", alt_text: "Fleece Jogger Pants - detail", display_order: 1 },
    ],
  },
  {
    name: "Lightweight Bomber Jacket",
    slug: "lightweight-bomber-jacket",
    base_price: 79.99,
    short_description: "Classic bomber silhouette in a lightweight fabric.",
    long_description: "A modern take on the iconic bomber. Lightweight ripstop shell with satin lining, ribbed collar, cuffs and hem. Perfect as a layering piece for transitional weather.",
    tech_specs: { material: "100% Nylon Ripstop, Satin Lining", weight: "180gsm", fit: "Regular", care: "Machine wash cold, hang dry", origin: "Italy" },
    is_featured: true,
    activity: ["Streetwear", "Smart Casual", "Outdoor"],
    category_slug: "jackets",
    sku_prefix: "LBJ",
    images: [
      { url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80", alt_text: "Lightweight Bomber Jacket - front view", display_order: 0 },
      { url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80", alt_text: "Lightweight Bomber Jacket - styled", display_order: 1 },
    ],
  },
  {
    name: "Quilted Puffer Vest",
    slug: "quilted-puffer-vest",
    base_price: 69.99,
    short_description: "Warm quilted vest with recycled insulation.",
    long_description: "Stay warm without the bulk. Our Quilted Puffer Vest uses recycled polyester fill for excellent warmth-to-weight ratio. Water-resistant shell, stand collar, and two hand-warmer pockets.",
    tech_specs: { material: "Recycled Polyester Shell & Fill", weight: "220gsm", fit: "Regular", care: "Machine wash cold, tumble dry low", origin: "Poland" },
    is_featured: false,
    activity: ["Outdoor", "Casual", "Everyday"],
    category_slug: "jackets",
    sku_prefix: "QPV",
    images: [
      { url: "https://images.unsplash.com/photo-1544923246-77307dd270cb?w=800&q=80", alt_text: "Quilted Puffer Vest - front view", display_order: 0 },
      { url: "https://images.unsplash.com/photo-1608063615781-e2ef8c73d114?w=800&q=80", alt_text: "Quilted Puffer Vest - detail", display_order: 1 },
    ],
  },
];

async function seed() {
  await connectDB();

  // Clear existing data
  await Category.deleteMany({});
  await Product.deleteMany({});

  // Insert categories
  const createdCategories = await Category.insertMany(categories);
  const catMap = {};
  createdCategories.forEach((c) => { catMap[c.slug] = c._id; });

  console.log(`Seeded ${createdCategories.length} categories`);

  // Insert products with embedded variants and images
  for (const p of products) {
    const variants = sizes.map((size) => ({
      variant_name: size,
      price_modifier: 0,
      sku: `${p.sku_prefix}-${size}`,
      stock_level: size === "M" ? 50 : size === "L" ? 40 : size === "S" ? 30 : 20,
    }));

    await Product.create({
      category_id: catMap[p.category_slug],
      name: p.name,
      slug: p.slug,
      base_price: p.base_price,
      short_description: p.short_description,
      long_description: p.long_description,
      tech_specs: p.tech_specs,
      is_featured: p.is_featured,
      activity: p.activity,
      product_variants: variants,
      product_images: p.images,
    });
  }

  console.log(`Seeded ${products.length} products with variants and images`);
  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
