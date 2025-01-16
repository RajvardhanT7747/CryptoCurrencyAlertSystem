// models/Crypto.js
const mongoose = require("mongoose");

const cryptoSchema = new mongoose.Schema({
  name: String,
  symbol: { type: String, required: true, unique: true },
  price: Number,
});

const Crypto = mongoose.model("Crypto", cryptoSchema);

module.exports = Crypto;
