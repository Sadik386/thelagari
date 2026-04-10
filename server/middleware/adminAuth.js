export const adminAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
  if (!adminEmails.includes(req.user.email)) {
    return res.status(403).json({ error: "Access denied. Admin privileges required." });
  }

  next();
};
