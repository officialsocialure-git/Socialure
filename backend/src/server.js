require("dotenv").config();
const app = require("./app");

const PORT = Number(process.env.PORT) || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

const server = app.listen(PORT, () => {
  console.log(`Socialure enquiry API listening on port ${PORT} (${NODE_ENV})`);
});

function shutDown(signal) {
  console.log(`${signal} received. Shutting down gracefully...`);
  server.close(() => process.exit(0));
}

process.on("SIGINT", () => shutDown("SIGINT"));
process.on("SIGTERM", () => shutDown("SIGTERM"));
