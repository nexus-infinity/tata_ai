#!/bin/bash

MODULES=("tata-core" "tata-flow" "tata-memex" "tata-zkp")
BASE_DIR="/Volumes/akron/tata-ai/src"

for module in "${MODULES[@]}"; do
    REQUIREMENTS_FILE="$BASE_DIR/$module/requirements.txt"
    if [ ! -f "$REQUIREMENTS_FILE" ]; then
        echo "🔧 Creating missing requirements.txt for $module..."
        echo "fastapi" > "$REQUIREMENTS_FILE"
        echo "uvicorn" >> "$REQUIREMENTS_FILE"
        echo "pydantic" >> "$REQUIREMENTS_FILE"
    else
        echo "✅ $module already has a requirements.txt"
    fi
done

echo "✅ All missing requirements.txt files created!"
