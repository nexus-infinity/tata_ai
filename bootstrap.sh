#!/bin/bash

# Set project directory
PROJECT_DIR="$(dirname "$(realpath "$0")")"
LOG_DIR="$PROJECT_DIR/logs"

# Ensure logs directory exists
mkdir -p "$LOG_DIR"

# Step 1: Run AI-powered setup validation (Only check dependencies, not running services yet)
echo "[INFO] Checking system dependencies..."
python3 "$PROJECT_DIR/setup_tata_ai.py"
STATUS=$?

if [ $STATUS -eq 1 ]; then
    echo "[ERROR] Dependencies are missing. Install them and retry."
    exit 1
fi

# Step 2: Force Build & Start Tata AI services
echo "[INFO] Building Tata AI containers..."
docker-compose down --remove-orphans
sleep 5  # Ensure old instances are fully stopped

docker-compose build --no-cache
if [ $? -ne 0 ]; then
    echo "[ERROR] Build failed. Check logs for details."
    exit 1
fi

echo "[INFO] Starting Tata AI services..."
docker-compose up -d

# Step 3: Wait long enough for services to initialize
echo "[INFO] Giving services time to start..."
sleep 30  # Allow enough time for slow services

echo "[INFO] Verifying that services are running..."
python3 "$PROJECT_DIR/setup_tata_ai.py"
STATUS=$?

if [ $STATUS -ne 0 ]; then
    echo "[ERROR] Some services failed to start. Check logs for details."
    exit 1
fi

# Step 4: Display logs and monitor
docker-compose logs -f > "$LOG_DIR/tata_ai.log" 2>&1 &
echo "[INFO] Logs are being written to $LOG_DIR/tata_ai.log"

echo "[SUCCESS] Tata AI is fully running and operational."
