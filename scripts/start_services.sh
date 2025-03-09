#!/bin/bash

echo "🚀 Starting all services..."

# Start databases
brew services start postgresql
brew services start redis
brew services start mysql
brew services start mongodb-community

# Start APIs
for port in 8000 8001 8002 8003; do
  echo "🚀 Starting API on port $port..."
  python "services/api_$port.py" &
done

# Start frontend
echo "🚀 Starting frontend dashboard..."
npm --prefix frontend start &

echo "🎉 All services started!"
