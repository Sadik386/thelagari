import { Router } from "express";
import Product from "../models/Product.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { category, activity, search } = req.query;
    let query = {};

    if (category && category !== "all") {
      const Category = (await import("../models/Category.js")).default;
      const cat = await Category.findOne({ slug: category });
      if (cat) query.category_id = cat._id;
    }

    if (activity) {
      query.activity = { $in: [activity] };
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(query)
      .populate("category_id", "name slug")
      .sort({ createdAt: -1 });

    const mapped = products.map((p) => ({
      id: p._id,
      name: p.name,
      slug: p.slug,
      base_price: p.base_price,
      short_description: p.short_description,
      long_description: p.long_description,
      tech_specs: p.tech_specs,
      is_featured: p.is_featured,
      activity: p.activity,
      category_id: p.category_id?._id || null,
      categories: p.category_id ? { id: p.category_id._id, name: p.category_id.name, slug: p.category_id.slug } : null,
      product_variants: p.product_variants.map((v) => ({
        id: v._id,
        variant_name: v.variant_name,
        price_modifier: v.price_modifier,
        sku: v.sku,
        stock_level: v.stock_level,
      })),
      product_images: p.product_images
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
        .map((img) => ({
          id: img._id,
          url: img.url,
          alt_text: img.alt_text,
          display_order: img.display_order,
        })),
    }));

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("category_id", "name slug");

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json({
      id: product._id,
      name: product.name,
      slug: product.slug,
      base_price: product.base_price,
      short_description: product.short_description,
      long_description: product.long_description,
      tech_specs: product.tech_specs,
      is_featured: product.is_featured,
      activity: product.activity,
      category_id: product.category_id?._id || null,
      categories: product.category_id ? { id: product.category_id._id, name: product.category_id.name, slug: product.category_id.slug } : null,
      product_variants: product.product_variants.map((v) => ({
        id: v._id,
        variant_name: v.variant_name,
        price_modifier: v.price_modifier,
        sku: v.sku,
        stock_level: v.stock_level,
      })),
      product_images: product.product_images
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
        .map((img) => ({
          id: img._id,
          url: img.url,
          alt_text: img.alt_text,
          display_order: img.display_order,
        })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create product
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update product
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
