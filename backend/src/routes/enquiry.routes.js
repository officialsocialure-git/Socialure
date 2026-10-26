const express = require("express");
const rateLimit = require("express-rate-limit");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { createEnquiry } = require("../controllers/enquiry.controller");

const router = express.Router();
const enquirySubmitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, message: "Too many submissions. Please try again later." }
});

router.post("/", enquirySubmitLimiter, [
  body("name").trim().isLength({ min: 2, max: 120 }).withMessage("Please enter your name."),
  body("email").optional({ values: "falsy" }).trim().isEmail().normalizeEmail().withMessage("Enter a valid email address."),
  body("phone").trim().isLength({ min: 5, max: 40 }).withMessage("Please enter a valid contact number."),
  body("company").optional({ values: "falsy" }).trim().isLength({ max: 160 }),
  body("service").trim().isLength({ min: 1, max: 120 }).withMessage("Please select a service."),
  body("budget").trim().isLength({ min: 1, max: 120 }).withMessage("Please select a budget range."),
  body("message").optional({ values: "falsy" }).trim().isLength({ max: 2000 }),
  body("source").optional({ values: "falsy" }).trim().isLength({ max: 120 })
], validate, createEnquiry);

module.exports = router;
