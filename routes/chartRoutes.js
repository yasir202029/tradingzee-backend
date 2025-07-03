// routes/chartRoutes.js

const express = require("express");
const router = express.Router();
const {
  RSI,
  SMA,
  EMA,
  MACD,
  BollingerBands,
} = require("technicalindicators");

// === 📊 Dynamic Indicator Calculation Endpoint ===
router.post("/indicators", (req, res) => {
  const { indicator, values, period, fastPeriod, slowPeriod, signalPeriod, stdDev } = req.body;

  if (!indicator || !values || !Array.isArray(values) || values.length === 0) {
    return res.status(400).json({
      error: "Invalid input: 'indicator', 'values' (array), and parameters are required.",
    });
  }

  try {
    let result;

    switch (indicator.toLowerCase()) {
      case "rsi":
        if (!period || values.length < period) {
          return res.status(400).json({
            error: `RSI requires a valid 'period' and at least ${period} data points.`,
          });
        }
        result = RSI.calculate({ values, period });
        break;

      case "sma":
        if (!period || values.length < period) {
          return res.status(400).json({
            error: `SMA requires a valid 'period' and at least ${period} data points.`,
          });
        }
        result = SMA.calculate({ values, period });
        break;

      case "ema":
        if (!period || values.length < period) {
          return res.status(400).json({
            error: `EMA requires a valid 'period' and at least ${period} data points.`,
          });
        }
        result = EMA.calculate({ values, period });
        break;

      case "macd":
        if (!fastPeriod || !slowPeriod || !signalPeriod) {
          return res.status(400).json({
            error: "MACD requires 'fastPeriod', 'slowPeriod', and 'signalPeriod'.",
          });
        }
        result = MACD.calculate({
          values,
          fastPeriod,
          slowPeriod,
          signalPeriod,
          SimpleMAOscillator: false,
          SimpleMASignal: false,
        });
        break;

      case "bbands":
      case "bollingerbands":
        if (!period || !stdDev) {
          return res.status(400).json({
            error: "Bollinger Bands require 'period' and 'stdDev'.",
          });
        }
        result = BollingerBands.calculate({
          period,
          stdDev,
          values,
        });
        break;

      default:
        return res.status(400).json({ error: `Unsupported indicator: ${indicator}` });
    }

    return res.json({ indicator, result });
  } catch (error) {
    console.error(`❌ Error calculating ${indicator.toUpperCase()}:`, error.message);
    return res.status(500).json({
      error: `Failed to calculate ${indicator}`,
      details: error.message,
    });
  }
});

module.exports = router;
