const express = require("express");
const { getStats } = require("../controllers/dashboard.controller");
const { requireAuth } = require("../middleware/auth");
const requireDb = require("../middleware/require-db");
const router = express.Router();
router.get("/stats", requireAuth, requireDb, getStats);
module.exports = router;
