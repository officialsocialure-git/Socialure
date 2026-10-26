function getHealth(req, res) {
  res.status(200).json({
    success: true, status: "ok", service: "offmint-agency-backend",
    timestamp: new Date().toISOString(), environment: process.env.NODE_ENV || "development",
    database: "not configured by design"
  });
}
module.exports = { getHealth };
