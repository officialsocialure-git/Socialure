const express = require("express");
const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");
const { login, me, updateProfile, changePassword } = require("../controllers/auth.controller");
const { requireAuth } = require("../middleware/auth");
const requireDb = require("../middleware/require-db");
const validate = require("../middleware/validate");
const router = express.Router();
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: "draft-7", legacyHeaders: false, message: { success: false, message: "Too many login attempts. Please try again in 15 minutes." } });
router.post("/login", loginLimiter, requireDb, [
  body("email").isEmail().withMessage("Enter a valid email address.").normalizeEmail(),
  body("password").isString().isLength({ min: 1, max: 200 }).withMessage("Password is required.")
], validate, login);
router.get("/me", requireAuth, requireDb, me);
router.patch("/profile", requireAuth, requireDb, [
  body("name").trim().isLength({ min: 2, max: 100 }),
  body("email").trim().isEmail().normalizeEmail()
], validate, updateProfile);
router.patch("/password", requireAuth, requireDb, [
  body("currentPassword").isString().isLength({ min: 1, max: 200 }),
  body("newPassword").isString().isLength({ min: 12, max: 200 })
], validate, changePassword);
module.exports = router;
