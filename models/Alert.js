// models/Alert.js
const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    cryptoSymbol: { type: String, required: true }, // e.g., BTC
    thresholdPrice: { type: Number, required: true }, // Alert price
    email: { type: String, required: true }, // User email for notifications (optional for now)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);
