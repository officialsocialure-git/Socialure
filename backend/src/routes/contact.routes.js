const express = require("express");
const { body, param, query } = require("express-validator");
const { requireAuth } = require("../middleware/auth");
const requireDb = require("../middleware/require-db");
const validate = require("../middleware/validate");
const controller = require("../controllers/contact.controller");
const router = express.Router();
router.use(requireAuth, requireDb);
router.get("/", [query("page").optional().isInt({ min: 1 }), query("limit").optional().isInt({ min: 1, max: 100 })], validate, controller.listContacts);
router.post("/", [
  body("name").trim().isLength({ min: 2, max: 120 }),
  body("email").trim().isEmail().normalizeEmail(),
  body("phone").optional({ values: "falsy" }).trim().isLength({ max: 40 }),
  body("company").optional({ values: "falsy" }).trim().isLength({ max: 160 }),
  body("notes").optional({ values: "falsy" }).trim().isLength({ max: 3000 })
], validate, controller.createContact);
router.patch("/:id", [
  param("id").isMongoId(),
  body("name").optional().trim().isLength({ min: 2, max: 120 }),
  body("email").optional().trim().isEmail().normalizeEmail(),
  body("phone").optional().trim().isLength({ max: 40 }),
  body("company").optional().trim().isLength({ max: 160 }),
  body("notes").optional().trim().isLength({ max: 3000 }),
  body().custom(value => Object.keys(value).some(key => ["name","email","phone","company","notes"].includes(key))).withMessage("Provide a field to update.")
], validate, controller.updateContact);
router.delete("/:id", [param("id").isMongoId()], validate, controller.deleteContact);
module.exports = router;
