const jwt = require("jsonwebtoken");
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return res.status(401).json({ success: false, message: "Authentication required." });
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    return res.status(503).json({ success: false, message: "Authentication is not configured securely." });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== "admin") return res.status(403).json({ success: false, message: "Admin access required." });
    req.admin = { id: payload.sub, email: payload.email, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
}
module.exports = { requireAuth };
