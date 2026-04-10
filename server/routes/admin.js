import { Router } from "express";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();

// Apply adminAuth to all routes in this file
router.use(adminAuth);

// Get Statistics/Analytics
router.get("/stats", async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    
    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total_amount" } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Last 30 days revenue (simplified)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRevenueResult = await Order.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo }, status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total_amount" } } }
    ]);
    const recentRevenue = recentRevenueResult[0]?.total || 0;

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    res.json({
      totals: {
        orders: totalOrders,
        users: totalUsers,
        products: totalProducts,
        revenue: totalRevenue,
        recentRevenue: recentRevenue
      },
      ordersByStatus
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Order Management
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user_id", "display_name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/orders/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Customer Management
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    
    // Fetch order counts for each user
    const usersWithOrderCount = await Promise.all(users.map(async (user) => {
      const orderCount = await Order.countDocuments({ user_id: user._id });
      const totalSpent = await Order.aggregate([
        { $match: { user_id: user._id, status: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$total_amount" } } }
      ]);
      
      return {
        ...user.toObject(),
        orderCount,
        totalSpent: totalSpent[0]?.total || 0
      };
    }));
    
    res.json(usersWithOrderCount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
