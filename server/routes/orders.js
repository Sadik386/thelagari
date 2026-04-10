import { Router } from "express";
import Order from "../models/Order.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { items, total_amount, shipping_address, guest_email } = req.body;
    const order = await Order.create({
      user_id: req.user?.id || null,
      guest_email: req.user ? null : guest_email,
      total_amount,
      shipping_address,
      status: "confirmed",
      order_items: items,
    });
    res.status(201).json({ id: order._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/my-orders", requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user.id })
      .sort({ createdAt: -1 });

    res.json(orders.map((o) => ({
      id: o._id,
      status: o.status,
      total_amount: o.total_amount,
      created_at: o.createdAt,
      order_items: o.order_items.map((item) => ({
        id: item._id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        products: { name: item.product_name },
        product_variants: { variant_name: item.variant_name },
      })),
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json({
      id: order._id,
      status: order.status,
      total_amount: order.total_amount,
      shipping_address: order.shipping_address,
      guest_email: order.guest_email,
      created_at: order.createdAt,
      order_items: order.order_items.map((item) => ({
        id: item._id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        products: { name: item.product_name, slug: "" },
        product_variants: { variant_name: item.variant_name },
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
