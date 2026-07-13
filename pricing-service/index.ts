import express from "express";

const app = express();
app.use(express.json());

// Simple hardcoded prices for demo products
const prices: Record<string, number> = {
  "1": 9.99,
  "2": 24.99,
  "3": 4.99,
};

// Health check — Kubernetes pings this to know the service is alive
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "pricing-service" });
});

// Return price for a product
app.get("/price/:productId", (req, res) => {
  const { productId } = req.params;
  const price = prices[productId];

  if (!price) {
    return res.status(404).json({ error: "Price not found" });
  }

  console.log(`[Pricing Service] Returning price for product ${productId}: $${price}`);
  res.json({ productId, price });
});

app.listen(3002, () => {
  console.log("Pricing Service running on port 3002");
});
