const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true, maxlength: 100 },
  email: { type: String, trim: true, lowercase: true, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ["admin"], default: "admin" },
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date, default: null }
}, { timestamps: true });
module.exports = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
