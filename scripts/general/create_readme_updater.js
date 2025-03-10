const fs = require('fs');
const { execSync } = require('child_process');

const PROJECT_DIR = "/Volumes/akron/tata-ai";
const README_PATH = `${PROJECT_DIR}/README.md`;

console.log("🔍 Updating README.md with latest project structure...");

// Get directory structure (macOS-friendly)
let projectStructure;
try {
    projectStructure = execSync(`tree -L 3 ${PROJECT_DIR} --noreport`, { encoding: 'utf8' });
} catch (error) {
    projectStructure = execSync(`find ${PROJECT_DIR} -maxdepth 3 -type d`, { encoding: 'utf8' });
}

// Generate README content
const readmeContent = `# Tata AI

🚀 **Tata AI** is an AI-powered framework.

---

## 📂 Project Structure  

\`\`\`plaintext
${projectStructure}
\`\`\`

## ✅ Automated README Updates  

This README updates automatically when project structure changes.
`;

fs.writeFileSync(README_PATH, readmeContent);
console.log("✅ README.md updated!");

// ✅ Fix Git Error: Check if it's a Git repository before committing
try {
    execSync(`git rev-parse --is-inside-work-tree`, { stdio: 'ignore' });
    execSync(`git add ${README_PATH} && git commit -m "Auto-update README structure" && git push origin main`, { stdio: 'inherit' });
    console.log("✅ Changes pushed to GitHub.");
} catch (error) {
    console.log("⚠️ Git commit failed. Either this is not a Git repository or the remote is missing.");
}
