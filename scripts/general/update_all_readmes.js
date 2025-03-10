#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PROJECT_ROOT = process.env.PROJECT_ROOT || path.resolve(__dirname, '../..');
const FRONTEND_DIR = path.join(PROJECT_ROOT, 'frontend');
const SCRIPTS_DIR = path.join(PROJECT_ROOT, 'scripts');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// Utility functions
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Generate the main project README
async function generateMainReadme() {
  console.log(`${colors.cyan}Generating main project README...${colors.reset}`);
  
  const readmePath = path.join(PROJECT_ROOT, 'README.md');
  
  // Get project structure
  let directoryTree = '';
  try {
    directoryTree = execSync(`find ${PROJECT_ROOT} -type d -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/.next/*" -maxdepth 2 | sort`).toString();
    directoryTree = directoryTree.split('\n').filter(line => line.trim() !== '').map(line => {
      const relativePath = line.replace(PROJECT_ROOT, '');
      const depth = (relativePath.match(/\//g) || []).length;
      return '  '.repeat(depth) + path.basename(line);
    }).join('\n');
  } catch (error) {
    console.warn(`${colors.yellow}⚠ Could not generate directory tree: ${error.message}${colors.reset}`);
    directoryTree = '(Directory tree generation failed)';
  }
  
  const timestamp = new Date().toISOString();
  
  const readmeContent = `# 🧠 Tata AI: The Intelligence Collective

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Status](https://img.shields.io/badge/status-experimental-orange)

## 🌟 Welcome to the Future of AI

Tata AI isn't just another AI platform—it's an **intelligence collective** where multiple specialized AI modules work together like a digital neural network, creating something greater than the sum of its parts.

Think of it as an AI orchestra where each instrument plays its unique part in a symphony of artificial intelligence.

## 🧩 The Collective Mind

\`\`\`ascii
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Tata Core  │◄───►│  Tata Flow  │◄───►│ Tata Memex  │
└──────┬──────┘     └─────────────┘     └─────────────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│  Tata Moto  │◄───►│   Tata ZKP  │
└─────────────┘     └─────────────┘
\`\`\`

### 🧠 The Brain Collective

- **Tata Core** - The cerebral cortex of our system. It orchestrates all other modules, making decisions and coordinating responses. Without it, our AI would be like a body without a brain.

- **Tata Flow** - The neural pathways. This workflow management service creates and optimizes the connections between different AI processes, ensuring smooth information flow like synapses firing in perfect harmony.

- **Tata Memex** - The hippocampus of our AI. This memory extension service stores and retrieves knowledge, turning fleeting data into lasting wisdom. It doesn't just remember—it understands.

- **Tata Moto** - The motor cortex. This module handles AI model training and inference, turning abstract thoughts into concrete actions. It's where ideas become reality.

- **Tata ZKP** - The immune system. Using zero-knowledge proofs, this security module protects operations while maintaining privacy—like having bodyguards who can verify your identity without seeing your face.

## 🚀 Blast Off: Getting Started

### What You'll Need

- 🟢 Node.js 18+ (The newer, the better!)
- 🐍 Python 3.9+ (We like our Python fresh)
- 🐳 Docker and Docker Compose (For smooth sailing)
- 🍃 MongoDB (For flexible data storage)
- 🐘 PostgreSQL (For when you need that relational goodness)

### The Ritual of Installation

1. **Summon the code**:
   \`\`\`bash
   git clone https://github.com/yourusername/tata-ai.git
   cd tata-ai
   \`\`\`

2. **Awaken the frontend**:
   \`\`\`bash
   cd frontend
   npm install
   \`\`\`

3. **Empower the backend modules**:
   \`\`\`bash
   # Repeat for each module (tata-core, tata-flow, etc.)
   cd src/tata-core
   pip install -r requirements.txt
   \`\`\`

4. **Configure the mystical energies**:
   - Create \`.env.local\` from \`.env.example\` in the frontend directory
   - Set up your database connection strings in the configs directory
   - Align your chakras (optional but recommended)

## 🎮 Controlling Your AI Collective

### Development Mode (for Tinkerers)

1. **Start the frontend portal**:
   \`\`\`bash
   cd frontend
   npm run dev
   \`\`\`
   Your gateway will materialize at http://localhost:3000

2. **Activate the backend neurons**:
   \`\`\`bash
   cd src/tata-core
   python app.py
   \`\`\`

### Production Mode (for Serious Business)

Let Docker handle the complexity:
\`\`\`bash
docker-compose up -d
\`\`\`

Sit back and watch as your AI collective comes to life in perfect harmony!

## 🗺️ Project Landscape

Our digital ecosystem spans multiple dimensions:

\`\`\`
${directoryTree}
\`\`\`

## 🤝 Join the Collective

Whether you're a human or an AI, we welcome contributions from all sentient entities! Check out our contribution guidelines and help us build the future of artificial intelligence.

## 📜 The Fine Print

This README was automatically generated on ${timestamp} by a collaboration between human creativity and AI assistance. The perfect example of what Tata AI stands for!

## 📄 License

[Choose your legal adventure here]

---

> "The measure of intelligence is the ability to change." — Albert Einstein
`;

  try {
    await fs.writeFile(readmePath, readmeContent);
    console.log(`${colors.green}✓ Main README.md generated at ${readmePath}${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}✘ Failed to generate main README.md: ${error.message}${colors.reset}`);
    return false;
  }
}

// Generate the frontend README
async function generateFrontendReadme() {
  console.log(`${colors.cyan}Generating frontend README...${colors.reset}`);
  
  try {
    // Check if the frontend directory exists
    if (!await fileExists(FRONTEND_DIR)) {
      console.error(`${colors.red}✘ Frontend directory not found at ${FRONTEND_DIR}${colors.reset}`);
      return false;
    }
    
    // Run the frontend README generator script if it exists
    const frontendReadmeScript = path.join(SCRIPTS_DIR, 'frontend', 'generate-frontend-readme.js');
    if (await fileExists(frontendReadmeScript)) {
      console.log(`${colors.blue}Running frontend README generator script...${colors.reset}`);
      execSync(`node ${frontendReadmeScript}`, { stdio: 'inherit' });
      return true;
    }
    
    // If the script doesn't exist, create a basic frontend README
    const readmePath = path.join(FRONTEND_DIR, 'README.md');
    const readmeContent = `# 🖥️ Tata AI Frontend

## Overview

The Tata AI Frontend is a Next.js application that provides a modern, responsive interface for interacting with the Tata AI collective. It serves as the primary user interface for monitoring, controlling, and visualizing the AI system's operations.

## 🏗️ Architecture

The frontend follows a modular architecture with components, pages, hooks, and utilities organized in a clean, maintainable structure.

## 🚀 Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser

This README was automatically generated on ${new Date().toISOString()}.
`;

    await fs.writeFile(readmePath, readmeContent);
    console.log(`${colors.green}✓ Frontend README.md generated at ${readmePath}${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}✘ Failed to generate frontend README.md: ${error.message}${colors.reset}`);
    return false;
  }
}

// Generate the scripts README
async function generateScriptsReadme() {
  console.log(`${colors.cyan}Generating scripts README...${colors.reset}`);
  
  try {
    // Check if the scripts directory exists
    if (!await fileExists(SCRIPTS_DIR)) {
      console.error(`${colors.red}✘ Scripts directory not found at ${SCRIPTS_DIR}${colors.reset}`);
      return false;
    }
    
    // Get script directories
    const scriptDirs = await fs.readdir(SCRIPTS_DIR);
    const categories = scriptDirs.filter(dir => {
      const dirPath = path.join(SCRIPTS_DIR, dir);
      return fs.stat(dirPath).then(stat => stat.isDirectory());
    });
    
    // Generate script listings for each category
    const categoryListings = {};
    for (const category of categories) {
      try {
        const categoryPath = path.join(SCRIPTS_DIR, category);
        const scripts = await fs.readdir(categoryPath);
        categoryListings[category] = scripts.filter(script => {
          return script.endsWith('.js') || script.endsWith('.py') || script.endsWith('.sh');
        });
      } catch (error) {
        console.warn(`${colors.yellow}⚠ Could not read scripts in ${category}: ${error.message}${colors.reset}`);
      }
    }
    
    // Generate the README content
    const readmePath = path.join(SCRIPTS_DIR, 'README.md');
    let readmeContent = `# 🛠️ Tata AI Scripts

This directory contains various scripts for the Tata AI project, organized by purpose and functionality.

## 📂 Directory Structure

\`\`\`
scripts/
`;

    // Add categories to the directory structure
    for (const category of Object.keys(categoryListings)) {
      readmeContent += `├── ${category}/`.padEnd(30) + `# ${category.charAt(0).toUpperCase() + category.slice(1)}-related scripts\n`;
    }
    
    readmeContent += `\`\`\`

## 📋 Script Categories

`;

    // Add script listings for each category
    for (const [category, scripts] of Object.entries(categoryListings)) {
      if (scripts.length === 0) continue;
      
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
      readmeContent += `### ${categoryName} Scripts

Scripts related to ${category} functionality.

| Script | Description |
|--------|-------------|
`;

      for (const script of scripts) {
        const scriptPath = path.join(SCRIPTS_DIR, category, script);
        let description = script.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        description = description.charAt(0).toUpperCase() + description.slice(1) + " script";
        
        // Try to extract description from file header
        try {
          const content = await fs.readFile(scriptPath, 'utf8');
          const lines = content.split('\n').slice(0, 10);
          
          for (const line of lines) {
            if (line.includes('//') || line.includes('#')) {
              const comment = line.replace(/^[#/\s]+/, '').trim();
              if (comment && comment.length > 5) {
                description = comment;
                break;
              }
            }
          }
        } catch (error) {
          // Ignore errors reading script files
        }
        
        readmeContent += `| \`${script}\` | ${description} |\n`;
      }
      
      readmeContent += '\n';
    }
    
    readmeContent += `## 🚀 Running Scripts

Most scripts can be run directly from the command line:

\`\`\`bash
# Running a Python script
python scripts/category/script-name.py

# Running a Node.js script
node scripts/category/script-name.js

# Running a shell script
bash scripts/category/script-name.sh
# or if executable:
./scripts/category/script-name.sh
\`\`\`

## 📝 Adding New Scripts

When adding new scripts:

1. Place the script in the appropriate subdirectory
2. Make sure the script has a clear, descriptive name
3. Add execution permissions if needed: \`chmod +x script-name.sh\`
4. Add a comment header describing the script's purpose
5. Update this README with information about the script

This README was automatically generated on ${new Date().toISOString()}.
`;

    await fs.writeFile(readmePath, readmeContent);
    console.log(`${colors.green}✓ Scripts README.md generated at ${readmePath}${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}✘ Failed to generate scripts README.md: ${error.message}${colors.reset}`);
    return false;
  }
}

// Main function
async function main() {
  console.log(`${colors.magenta}=== Tata AI README Generator ===${colors.reset}`);
  console.log(`${colors.blue}Updating READMEs for project at: ${PROJECT_ROOT}${colors.reset}`);
  
  if (!await fileExists(PROJECT_ROOT)) {
    console.error(`${colors.red}✘ Project root directory not found at ${PROJECT_ROOT}${colors.reset}`);
    console.log(`${colors.yellow}Set the PROJECT_ROOT environment variable to the correct path or update the script.${colors.reset}`);
    process.exit(1);
  }
  
  // Generate all READMEs
  const mainResult = await generateMainReadme();
  const frontendResult = await generateFrontendReadme();
  const scriptsResult = await generateScriptsReadme();
  
  // Summary
  console.log(`\n${colors.magenta}=== README Generation Summary ===${colors.reset}`);
  console.log(`${mainResult ? colors.green + '✓' : colors.red + '✘'} Main README${colors.reset}`);
  console.log(`${frontendResult ? colors.green + '✓' : colors.red + '✘'} Frontend README${colors.reset}`);
  console.log(`${scriptsResult ? colors.green + '✓' : colors.red + '✘'} Scripts README${colors.reset}`);
  
  if (mainResult && frontendResult && scriptsResult) {
    console.log(`\n${colors.green}All READMEs were successfully generated!${colors.reset}`);
  } else {
    console.log(`\n${colors.yellow}Some READMEs could not be generated. Check the errors above.${colors.reset}`);
  }
}

// Run the script
main().catch(error => {
  console.error(`${colors.red}Error running README generator:${colors.reset}`, error);
  process.exit(1);
});

console.log("All READMEs have been updated!");