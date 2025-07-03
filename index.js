// 🚀 TradingZee Backend — Sophisticated Edition
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const morgan = require("morgan");
const chartRoutes = require("./routes/chartRoutes");
require("dotenv").config({ path: "./.env.local" });

const app = express();
const PORT = process.env.PORT || 5001;
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const RENDER_API_KEY = process.env.RENDER_API_KEY;
const RENDER_SERVICE_ID = process.env.RENDER_SERVICE_ID;

// === 🔷 Middleware ===
app.use(cors());
app.use(express.json());
app.use(
  morgan((tokens, req, res) => {
    return [
      `[${new Date().toISOString()}]`,
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens["response-time"](req, res), "ms",
    ].join(" ");
  })
);

// === 🔷 Utility: Standardized Response ===
const sendResponse = (res, status, message, data = null) => {
  res.status(status).json({
    timestamp: new Date().toISOString(),
    status,
    message,
    data,
  });
};

// === ✅ Health Check ===
app.get("/", (req, res) => {
  sendResponse(res, 200, "✅ TradingZee Backend is Running Magnificently 🚀");
});

// === 📈 Live Price: F

