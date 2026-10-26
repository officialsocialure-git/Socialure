const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
async function login(req, res, next) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required." });
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) return res.status(503).json({ success: false, message: "JWT_SECRET must be configured with at least 32 characters." });
    const admin = await Admin.findOne({ email }).select("+passwordHash");
    if (!admin || !admin.isActive || !(await bcrypt.compare(password, admin.passwordHash))) return res.status(401).json({ success: false, message: "Invalid email or password." });
    admin.lastLoginAt = new Date();
    await admin.save();
    const token = jwt.sign({ role: "admin", email: admin.email }, process.env.JWT_SECRET, { subject: String(admin._id), expiresIn: process.env.JWT_EXPIRES_IN || "1d" });
    res.json({ success: true, message: "Login successful.", token, expiresIn: process.env.JWT_EXPIRES_IN || "1d", admin: { id: String(admin._id), name: admin.name, email: admin.email, role: admin.role } });
  } catch (error) { next(error); }
}
async function me(req, res, next) {
  try {
    const admin = await Admin.findById(req.admin.id).select("name email role lastLoginAt createdAt").lean();
    if (!admin) return res.status(404).json({ success: false, message: "Admin account not found." });
    res.json({ success: true, admin });
  } catch (error) { next(error); }
}
async function updateProfile(req, res, next) {
  try {
    const admin = await Admin.findByIdAndUpdate(req.admin.id, {
      name: String(req.body.name).trim(),
      email: String(req.body.email).trim().toLowerCase()
    }, { new: true, runValidators: true }).select("name email role lastLoginAt createdAt").lean();
    if (!admin) return res.status(404).json({ success: false, message: "Admin account not found." });
    res.json({ success: true, message: "Profile updated.", admin });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ success: false, message: "That email is already in use." });
    next(error);
  }
}
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin.id).select("+passwordHash");
    if (!admin) return res.status(404).json({ success: false, message: "Admin account not found." });
    if (!(await bcrypt.compare(String(currentPassword || ""), admin.passwordHash))) return res.status(400).json({ success: false, message: "Current password is incorrect." });
    if (String(newPassword || "").length < 12) return res.status(400).json({ success: false, message: "New password must be at least 12 characters." });
    admin.passwordHash = await bcrypt.hash(newPassword, 12);
    await admin.save();
    res.json({ success: true, message: "Password changed successfully. Please log in again if your session expires." });
  } catch (error) { next(error); }
}
module.exports = { login, me, updateProfile, changePassword };
