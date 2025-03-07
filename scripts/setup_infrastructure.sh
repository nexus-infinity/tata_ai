#!/bin/bash

# Define base directory
BASE_DIR="/Volumes/akron/Tata-ai"

# Define subdirectories
FRONTEND_DIR="$BASE_DIR/frontend"
BACKEND_DIR="$BASE_DIR/backend"
DOCKER_DIR="$BASE_DIR/docker"
MODELS_DIR="$BASE_DIR/data/models"
LOGS_DIR="$BASE_DIR/logs"
DATA_DIR="$BASE_DIR/data"
RAW_MODELS_DIR="$BASE_DIR/data/raw"

echo "🔍 Checking existing project structure..."

# ✅ Step 1: Ensure necessary directories exist but do NOT rebuild if they exist
mkdir -p "$FRONTEND_DIR" "$BACKEND_DIR" "$DOCKER_DIR" "$MODELS_DIR" "$LOGS_DIR" "$DATA_DIR"

# ✅ Step 2: Report on the Frontend Directory
if [ -d "$FRONTEND_DIR" ]; then
    echo "✅ Frontend directory exists at: $FRONTEND_DIR"
    ls -lh "$FRONTEND_DIR"
else
    echo "⚠️ Frontend directory missing!"
fi

# ✅ Step 3: Report on the Backend Directory
if [ -d "$BACKEND_DIR" ]; then
    echo "✅ Backend directory exists at: $BACKEND_DIR"
    ls -lh "$BACKEND_DIR"
else
    echo "⚠️ Backend directory missing!"
fi

# ✅ Step 4: Report and Move Language Models Only if Needed
if [ -d "$RAW_MODELS_DIR" ] && [ "$(ls -A $RAW_MODELS_DIR 2>/dev/null)" ]; then
    echo "📂 Found unprocessed models in $RAW_MODELS_DIR. Moving them..."
    mv "$RAW_MODELS_DIR"/* "$MODELS_DIR" 2>/dev/null || echo "⚠️ No models found to move."
else
    echo "✅ Models directory exists and is already set up: $MODELS_DIR"
    ls -lh "$MODELS_DIR"
fi

# ✅ Step 5: Set Correct Permissions
echo "🔧 Ensuring correct file permissions..."
chmod -R 755 "$BASE_DIR"

# ✅ Step 6: Scan & Verify File Integrity Without Moving Anything Unnecessarily
echo "🔍 Scanning files and generating integrity report..."
find "$BASE_DIR" -type f -exec md5sum {} \; > "$BASE_DIR/file_integrity_report.txt"
echo "✅ File integrity report saved to: $BASE_DIR/file_integrity_report.txt"

# ✅ Step 7: Confirm Project Structure (Scan Only, No Moving)
echo "📂 Final Project Structure:"
if command -v tree &> /dev/null; then
    tree -L 3 "$BASE_DIR"
else
    echo "⚠️ 'tree' command not found. Install it using 'brew install tree' or 'apt install tree'."
    ls -R "$BASE_DIR"
fi

echo "✅ Tata AI infrastructure scan completed! No unnecessary modifications made."
