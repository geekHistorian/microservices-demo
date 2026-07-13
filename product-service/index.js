const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// Where to find the Pricing Service
// In Kubernetes, services find each other by name — not IP address
const PRICING_SERVICE_URL = process.env.PRICING_SERVICE_URL || "http://localhost:3002";

// Simple hardcoded product catalog
const products = {
  "1": { id: "1", name: "Laptop Stand", category: "Accessories" },
  "2": { id: "2", name: "Mechanical Keyboard", category: "Accessories" },
  "3": { id: "3", name: "USB-C Cable", category: "Cables" },
};

// Health check — Kubernetes pings this to know the service is alive
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "product-service" });
});

// Return product details + price (fetched from Pricing Service)
app.get("/product/:productId", async (req, res) => {
  const { productId } = req.params;
  const product = products[productId];

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  console.log(`[Product Service] Got request for product ${productId}`);
  console.log(`[Product Service] Calling Pricing Service at ${PRICING_SERVICE_URL}`);

  // Call the Pricing Service — this is the container hop
  const priceResponse = await axios.get(`${PRICING_SERVICE_URL}/price/${productId}`);
  const { price } = priceResponse.data;

  console.log(`[Product Service] Got price $${price} from Pricing Service`);

  res.json({ ...product, price });
});

app.listen(3001, () => {
  console.log("Product Service running on port 3001");
});
