import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = Router();

const signToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

router.post("/signup", async (req, res) => {
  try {
    const { email, password, display_name } = req.body;
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ error: "Email already registered" });

    const user = await User.create({ email, password, display_name });
    const token = signToken(user);
    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, display_name: user.display_name },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = signToken(user);
    res.json({
      token,
      user: { id: user._id, email: user.email, display_name: user.display_name },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/me", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ id: user._id, email: user.email, display_name: user.display_name });
});

export default router;
