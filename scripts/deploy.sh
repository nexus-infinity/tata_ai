#!/bin/bash

echo "🚀 Deploying all services..."

# Check if docker-compose.yml exists
if [ ! -f "infrastructure/docker-compose.yml" ]; then
  echo "❌ docker-compose.yml not found. Please run build-all.sh first."
  exit 1
fi

# Deploy using docker-compose
cd infrastructure
docker-compose up -d

echo "✅ All services deployed successfully!"
echo "📊 Dashboard available at: http://localhost:3000"
echo "🔌 API Gateway available at: http://localhost:8000"

