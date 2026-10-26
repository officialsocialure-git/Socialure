const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const enquiryRoutes = require("./routes/enquiry.routes");
const healthRoutes = require("./routes/health.routes");
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");

const app = express();
app.disable("x-powered-by");
app.use(helmet());

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",").map(value => value.trim()).filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS"));
  }
}));

app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: false, limit: "32kb" }));
app.use("/api", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." }
}));

app.get("/", (req, res) => res.json({
  success: true,
  message: "Socialure enquiry API is running.",
  health: "/api/health"
}));
app.use("/api/health", healthRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
