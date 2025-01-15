const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const Crypto = require("./models/Crypto"); // Import the Crypto model
const Alert = require("./models/Alert"); // Import the Alert model
const axios = require("axios");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/cryptoDB")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Route: Home Page
app.get("/", async (req, res) => {
  try {
    const cryptos = await Crypto.find();
    const alerts = [];

    // Check for triggered alerts
    const userAlerts = await Alert.find();
    for (const alert of userAlerts) {
      const crypto = cryptos.find((c) => c.symbol === alert.cryptoSymbol);
      if (crypto && crypto.price <= alert.thresholdPrice) {
        alerts.push(
          `Alert: ${crypto.symbol} price is below threshold of $${
            alert.thresholdPrice
          }. Current price: $${crypto.price.toFixed(2)}`
        );
      }
    }

    res.render("index", { cryptos, alerts });
  } catch (err) {
    res.status(500).send("Error loading data");
  }
});

app.post("/update-prices", async (req, res) => {
  try {
    // Fetch the list of all cryptocurrencies from your database
    const cryptos = await Crypto.find({});

    // Create an array of cryptocurrency IDs to fetch their prices from CoinGecko API
    const ids = cryptos.map((crypto) => crypto.symbol.toLowerCase()).join(",");

    // Fetch the latest prices from CoinGecko API for all the cryptocurrencies
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
    );
    const prices = response.data;

    // Update prices in the database for all cryptocurrencies
    const updatePromises = cryptos
      .map((crypto) => {
        const cryptoPrice = prices[crypto.symbol.toLowerCase()];
        if (cryptoPrice && cryptoPrice.usd) {
          return Crypto.updateOne(
            { symbol: crypto.symbol },
            { $set: { price: cryptoPrice.usd } },
            { upsert: true }
          );
        }
        return null;
      })
      .filter((promise) => promise !== null);

    // Wait for all the update operations to complete
    await Promise.all(updatePromises);

    // Redirect back to the home page after updating prices
    res.redirect("/");
  } catch (err) {
    console.error("Error updating prices:", err);
    res.status(500).send("Error updating prices");
  }
});

// Route: Render form to set alert
app.get("/set-alert", async (req, res) => {
  res.render("setAlert"); // EJS file for user input
});

// Route: Handle alert submission
app.post("/set-alert", async (req, res) => {
  const { cryptoSymbol, thresholdPrice, email } = req.body;

  try {
    // Check if the cryptocurrency symbol exists in the Crypto model
    const crypto = await Crypto.findOne({ symbol: cryptoSymbol.toUpperCase() });

    if (!crypto) {
      // If the cryptocurrency does not exist, redirect back with an error message
      return res
        .status(400)
        .send("Cryptocurrency symbol not found in the database.");
    }

    // If the cryptocurrency exists, save the alert
    const alert = new Alert({
      cryptoSymbol: crypto.symbol,
      thresholdPrice,
      email,
    });
    await alert.save();

    // Redirect to the home page or any confirmation page
    res.redirect("/");
  } catch (err) {
    console.error("Error saving alert:", err);
    res.status(500).send("Internal server error");
  }
});

// Route: Render list of alerts to remove
app.get("/remove-alert", async (req, res) => {
  try {
    const alerts = await Alert.find();
    res.render("removeAlert", { alerts });
  } catch (err) {
    res.status(500).send("Error loading alerts");
  }
});

// Route: Handle alert removal
app.post("/remove-alert", async (req, res) => {
  const { alertId } = req.body;

  try {
    await Alert.findByIdAndDelete(alertId);
    res.redirect("/remove-alert");
  } catch (err) {
    res.status(500).send("Error removing alert");
  }
});

// Route: Add Cryptocurrency
app.get("/add-crypto", (req, res) => {
  res.render("addCrypto"); // Render the form to add a new cryptocurrency
});

// Route: Add Cryptocurrency
app.post("/add-crypto", async (req, res) => {
  const { name, symbol } = req.body;

  try {
    // Fetch the cryptocurrency price from CoinGecko API
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=usd`
    );

    // Check if the symbol is valid and the price is available
    if (response.data[symbol.toLowerCase()]) {
      const price = response.data[symbol.toLowerCase()].usd;

      // Save cryptocurrency details (name, symbol, and price) to the database
      const crypto = new Crypto({
        name: name,
        symbol: symbol.toUpperCase(),
        price: price,
      });

      await crypto.save();
      res.redirect("/");
    } else {
      res.status(400).send("Invalid cryptocurrency symbol");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding cryptocurrency");
  }
});

// Route: Fetch Prices from CoinGecko API
app.get("/fetch-api-prices", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
    );
    const prices = response.data;

    // Return the fetched prices
    res.json(prices);
  } catch (err) {
    console.error("Error fetching prices from CoinGecko:", err);
    res.status(500).send("Error fetching prices");
  }
});

// Route: Delete Cryptocurrency
app.get("/delete-crypto/:symbol", async (req, res) => {
  const { symbol } = req.params;

  try {
    // Find and delete the cryptocurrency by its symbol
    const crypto = await Crypto.findOneAndDelete({
      symbol: symbol.toUpperCase(),
    });

    if (!crypto) {
      return res.status(404).send("Cryptocurrency not found.");
    }

    // Redirect to the home page after deletion
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error deleting cryptocurrency");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
