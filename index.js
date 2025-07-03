// index.js 🚀 TradingZee Backend Main Entry

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const morgan = require("morgan");
const chartRoutes = require("./routes/chartRoutes");
require("dotenv").config({ path: "./.env.local" });

const app = express();
const PORT = process.env.PORT || 5001;
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const RENDER_API_KEY = process.env.RENDER_API_KEY;
const RENDER_SERVICE_ID = process.env.RENDER_SERVICE_ID; // Optional if using deploy API

// === 🔧 Middleware Setup ===
app.use(cors());
app.use(express.json());
app.use(morgan("dev")); // Logs requests for debugging

// === ✅ Health Check Route ===
app.get("/", (req, res) => {
  res.send("✅ TradingZee Backend is Running!");
});

// === 📈 Live Price Endpoint ===
app.get("/api/price/:symbol", async (req, res) => {
  const { symbol } = req.params;

  if (!API_KEY) {
    return res.status(500).json({
      error: "❌ Missing ALPHA_VANTAGE_API_KEY in .env.local file.",
    });
  }

  try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetching price data:", error.message);
    res.status(500).json({
      error: "❌ Price fetch failed",
      details: error.message,
    });
  }
});

// === 📊 Chart/Indicators API Routes ===
app.use("/api", chartRoutes); // handles /api/indicators etc.

// === 🚀 Optional: Trigger Render Deployment ===
app.post("/deploy", async (req, res) => {
  if (!RENDER_API_KEY || !RENDER_SERVICE_ID) {
    return res.status(500).json({
      error: "❌ Missing RENDER_API_KEY or RENDER_SERVICE_ID in env.",
    });
  }

  try {
    const deployUrl = `https://api.render.com/v1/services/${RENDER_SERVICE_ID}/deploys`;

    const response = await axios.post(
      deployUrl,
      {},
      {
        headers: {
          Authorization: `Bearer ${RENDER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ status: "✅ Deploy triggered successfully", data: response.data });
  } catch (error) {
    console.error("❌ Render deploy error:", error.message);
    res.status(500).json({
      error: "❌ Failed to trigger deploy",
      details: error.message,
    });
  }
});

// === 🎯 Start the Server ===
app.listen(PORT, () => {
  console.log("====================================");
  console.log(`✅ Backend initialized at port: ${PORT}`);
  console.log(`🌐 Visit: http://localhost:${PORT}`);
  console.log("====================================");
});
