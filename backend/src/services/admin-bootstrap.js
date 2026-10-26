// Intentionally does not create public registration. Once MongoDB is configured,
// create the first admin through a trusted local script or one-time secure seed.
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

async function createInitialAdmin({ name, email, password }) {
  if (!name || !email || !password || String(password).length < 12) {
    throw new Error("Provide name, email, and an initial password of at least 12 characters.");
  }
  const normalizedEmail = String(email).trim().toLowerCase();
  const existing = await Admin.findOne({ email: normalizedEmail });
  if (existing) throw new Error("An admin with this email already exists.");
  const passwordHash = await bcrypt.hash(password, 12);
  return Admin.create({ name: String(name).trim(), email: normalizedEmail, passwordHash, role: "admin" });
}
module.exports = { createInitialAdmin };
