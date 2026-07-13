import { useState } from "react";

// Where the Order Service lives — in Kubernetes this is the external IP
const ORDER_SERVICE_URL = "http://68.155.193.56";
const products = [
  { id: "1", name: "Laptop Stand" },
  { id: "2", name: "Mechanical Keyboard" },
  { id: "3", name: "USB-C Cable" },
];

export default function App() {
  const [productId, setProductId] = useState("1");
  const [quantity, setQuantity] = useState(1);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function placeOrder() {
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const response = await fetch(`${ORDER_SERVICE_URL}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) throw new Error("Order failed");

      const data = await response.json();
      setOrder(data);
    } catch (err) {
      setError("Something went wrong. Is the Order Service running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>🛒 Place an Order</h1>
        <p style={styles.subtitle}>
          This request travels through 3 services: Order → Product → Pricing
        </p>

        <div style={styles.field}>
          <label style={styles.label}>Product</label>
          <select
            style={styles.select}
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Quantity</label>
          <input
            style={styles.input}
            type="number"
            min="1"
            max="10"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        <button style={styles.button} onClick={placeOrder} disabled={loading}>
          {loading ? "Placing order..." : "Place Order"}
        </button>

        {error && <div style={styles.error}>{error}</div>}

        {order && (
          <div style={styles.result}>
            <h2 style={styles.resultTitle}>✅ Order Confirmed</h2>
            <div style={styles.row}>
              <span style={styles.key}>Order ID</span>
              <span>{order.orderId}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.key}>Product</span>
              <span>{order.product.name}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.key}>Unit Price</span>
              <span>${order.product.price}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.key}>Quantity</span>
              <span>{order.quantity}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.key}>Total</span>
              <span style={styles.total}>${order.total}</span>
            </div>
            <div style={styles.chain}>
              <span style={styles.hop}>Order Service (Python)</span>
              <span style={styles.arrow}>→</span>
              <span style={styles.hop}>Product Service (Node.js)</span>
              <span style={styles.arrow}>→</span>
              <span style={styles.hop}>Pricing Service (TypeScript)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "2rem",
  },
  card: {
    background: "#1e293b",
    borderRadius: "16px",
    padding: "2.5rem",
    width: "100%",
    maxWidth: "480px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
  },
  title: {
    color: "#f1f5f9",
    fontSize: "1.8rem",
    margin: "0 0 0.5rem",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "0.875rem",
    margin: "0 0 2rem",
  },
  field: {
    marginBottom: "1.25rem",
  },
  label: {
    display: "block",
    color: "#94a3b8",
    fontSize: "0.85rem",
    marginBottom: "0.4rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  select: {
    width: "100%",
    padding: "0.75rem",
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "8px",
    color: "#f1f5f9",
    fontSize: "1rem",
    boxSizing: "border-box",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "8px",
    color: "#f1f5f9",
    fontSize: "1rem",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "0.875rem",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "0.5rem",
  },
  error: {
    marginTop: "1rem",
    padding: "0.75rem",
    background: "#450a0a",
    color: "#fca5a5",
    borderRadius: "8px",
    fontSize: "0.875rem",
  },
  result: {
    marginTop: "1.5rem",
    padding: "1.25rem",
    background: "#0f172a",
    borderRadius: "12px",
    border: "1px solid #1d4ed8",
  },
  resultTitle: {
    color: "#f1f5f9",
    margin: "0 0 1rem",
    fontSize: "1.1rem",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    color: "#cbd5e1",
    fontSize: "0.95rem",
    padding: "0.35rem 0",
    borderBottom: "1px solid #1e293b",
  },
  key: {
    color: "#64748b",
  },
  total: {
    color: "#34d399",
    fontWeight: "700",
    fontSize: "1.1rem",
  },
  chain: {
    marginTop: "1.25rem",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "0.4rem",
  },
  hop: {
    background: "#1e3a5f",
    color: "#93c5fd",
    padding: "0.25rem 0.6rem",
    borderRadius: "6px",
    fontSize: "0.75rem",
  },
  arrow: {
    color: "#475569",
    fontSize: "0.85rem",
  },
};
