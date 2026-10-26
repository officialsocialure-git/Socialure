function requireDb(req, res, next) {
  const mongoose = require("mongoose");
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ success: false, message: "Database is not connected. Configure MongoDB before using this endpoint." });
  }
  next();
}
module.exports = requireDb;
