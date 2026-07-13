import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

PRODUCT_SERVICE_URL = os.environ.get("PRODUCT_SERVICE_URL", "http://localhost:3001")

@app.route("/health")
def health():
    return jsonify({"status": "ok", "service": "order-service"})

@app.route("/order", methods=["POST"])
def place_order():
    data = request.get_json()
    product_id = data.get("productId")
    quantity = data.get("quantity", 1)

    if not product_id:
        return jsonify({"error": "productId is required"}), 400

    print(f"[Order Service] Received order for product {product_id}, qty {quantity}")
    print(f"[Order Service] Calling Product Service at {PRODUCT_SERVICE_URL}")

    product_response = requests.get(f"{PRODUCT_SERVICE_URL}/product/{product_id}")

    if product_response.status_code != 200:
        return jsonify({"error": "Product not found"}), 404

    product = product_response.json()

    print(f"[Order Service] Got product '{product['name']}' at ${product['price']} from Product Service")

    order = {
        "orderId": "ORD-001",
        "product": product,
        "quantity": quantity,
        "total": round(product["price"] * quantity, 2),
        "status": "confirmed"
    }

    return jsonify(order)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)