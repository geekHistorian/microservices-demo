# Microservices Demo — Setup Guide

## Architecture

```
[React Frontend]
      ↓ HTTP POST /order
[Order Service — Python/Flask — port 5000]
      ↓ HTTP GET /product/:id
[Product Service — Node.js — port 3001]
      ↓ HTTP GET /price/:id
[Pricing Service — TypeScript — port 3002]
```

---

## Step 1 — Create an Azure Container Registry (ACR)

In Azure Portal, create a Container Registry. Call it something like `saitdemo`.
Your registry address will be: `saitdemo.azurecr.io`

Login to it:
```bash
az acr login --name saitdemo
```

---

## Step 2 — Build and push all three images

Replace `saitdemo` with your actual ACR name.

```bash
# Pricing Service
cd pricing-service
docker build -t saitdemo.azurecr.io/pricing-service:latest .
docker push saitdemo.azurecr.io/pricing-service:latest

# Product Service
cd ../product-service
docker build -t saitdemo.azurecr.io/product-service:latest .
docker push saitdemo.azurecr.io/product-service:latest

# Order Service
cd ../order-service
docker build -t saitdemo.azurecr.io/order-service:latest .
docker push saitdemo.azurecr.io/order-service:latest
```

---

## Step 3 — Update the YAML file

Open `k8s/deployments.yaml` and replace every `YOUR_ACR_NAME` with `saitdemo` (or whatever you named it).

---

## Step 4 — Create AKS cluster and deploy

```bash
# Create the cluster (only do this once)
az aks create --resource-group myResourceGroup --name sait-cluster --node-count 1 --generate-ssh-keys --attach-acr saitdemo

# Connect kubectl to your cluster
az aks get-credentials --resource-group myResourceGroup --name sait-cluster

# Deploy everything
kubectl apply -f k8s/deployments.yaml
```

---

## Step 5 — Get the Order Service public IP

```bash
kubectl get services
```

Wait until `order-service` shows an EXTERNAL-IP (takes ~2 minutes).
Copy that IP — that's what your frontend points to.

---

## Step 6 — Run the frontend

```bash
cd frontend
# Set the Order Service IP
echo "VITE_ORDER_SERVICE_URL=http://<EXTERNAL-IP>" > .env
npm install
npm run dev
```

---

## Demo Commands (for your presentation)

```bash
# Show all running pods
kubectl get pods

# Show all services (stable names)
kubectl get services

# Watch logs live from each service (open 3 terminals)
kubectl logs -f deployment/order-service
kubectl logs -f deployment/product-service
kubectl logs -f deployment/pricing-service

# Kill a pod — watch Kubernetes restart it automatically
kubectl delete pod <pod-name>

# Scale Order Service to 3 copies
kubectl scale deployment order-service --replicas=3

# Scale back down
kubectl scale deployment order-service --replicas=1
```
