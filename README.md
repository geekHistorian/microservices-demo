# Microservices Demo

This is a group project for our Capstone course at SAIT.  
The idea was to build a small microservices architecture and deploy 
it to Azure to show how independent services can talk to each other.

## What it does

You place an order through the frontend and the request travels 
through 3 separate backend services before you get a response back.

Frontend (React) -> Order Service -> Product Service -> Pricing Service

Each service is its own codebase, its own container, running independently.

## Tech stack

- Order Service: Python / Flask
- Product Service: Node.js / Express
- Pricing Service: TypeScript / Express
- Frontend: React + Vite
- Containers: Docker
- Image storage: Azure Container Registry
- Orchestration: Azure Kubernetes Service (AKS)
- Frontend hosting: Azure Static Web Apps

## How to run locally

You need Docker Desktop and Node.js installed.

```bash
# start the backend services
kubectl apply -f k8s/deployments.yaml

# run the frontend
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173

## Live demo

Frontend: https://gentle-plant-0fd7f100f.7.azurestaticapps.net

Backend runs on AKS at http://68.155.193.56

## Notes

The services find each other using Kubernetes Service names, not IP 
addresses. So when Order Service needs to call Product Service it just 
calls "product-service" and Kubernetes handles the routing.

Each service has a /health endpoint that Kubernetes pings to make sure 
its still running. If it goes down it gets restarted automatically.