#!/bin/bash

# Define project directory
PROJECT_DIR="/Volumes/akron/Tata-ai"
README_FILE="$PROJECT_DIR/README.md"

echo "🔍 Scanning project structure and updating README.md..."

# Get the directory structure (excluding venv & logs)
PROJECT_STRUCTURE=$(tree -L 3 --noreport "$PROJECT_DIR" --exclude 'venv' --exclude 'logs' 2>/dev/null || ls -R "$PROJECT_DIR")

# Generate README content
cat <<EOF > "$README_FILE"
# Tata AI  

🚀 **Tata AI** is an AI-powered framework for automated intelligence workflows.  

---

## 📂 Project Structure  

\`\`\`plaintext
$PROJECT_STRUCTURE
\`\`\`

---

## 🔧 Setup Instructions  

### 1️⃣ Install Dependencies  
\`\`\`bash
brew install python node docker  
pip install -r requirements.txt  
\`\`\`

### 2️⃣ Start Backend  
\`\`\`bash
uvicorn src.tata-core.app:app --reload  
\`\`\`

### 3️⃣ Deploy Frontend  
\`\`\`bash
cd frontend/tata-ai-dashboard  
vercel --prod  
\`\`\`

### 4️⃣ Run AI Models  
\`\`\`bash
lms load Meta-Llama-3.1-8B-Instruct-GGUF  
\`\`\`

---

## 📦 Deployment Guide  

### 🔹 Vercel Deployment  
\`\`\`bash
vercel --prod  
\`\`\`

### 🔹 Docker Deployment  
\`\`\`bash
docker-compose up -d  
\`\`\`

---

## 📊 System Monitoring  

### 🔹 Check Running Services  
\`\`\`bash
docker ps  
\`\`\`

### 🔹 View Logs  
\`\`\`bash
tail -f logs/system.log  
\`\`\`

---

## ✅ Auto-Updating README  
This README updates automatically when project structure changes.  

EOF

echo "✅ README.md has been updated!"

# ✅ Optional: Auto-commit & push changes to GitHub
if [ "$1" == "--git" ]; then
    cd "$PROJECT_DIR" || exit
    git add README.md
    git commit -m "Auto-update README.md with latest project structure"
    git push origin main
    echo "✅ Changes pushed to GitHub."
fi
