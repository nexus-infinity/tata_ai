const fs = require('fs');
const path = require('path');

// Define the directories and files to check for
const requiredDirs = [
  'src/tata-core', 
  'src/tata-flow', 
  'src/tata-memex', 
  'src/tata-moto', 
  'src/tata-zkp',
  'templates',   // New templates folder
  'configs',     // New configs folder
  'frontend',    // Frontend folder for nextjs setup
  'backend',     // Backend folder for Python and API
  'docker',      // Docker-related setup
  'data',        // Folder for data storage (raw, processed, models)
  'logs',        // Log files directory
  'monitoring'   // Monitoring configurations
];

// Define key files to check
const requiredFiles = [
  'docker-compose.yml', 
  'README.md', 
  'package.json',   // Frontend and backend package files
  'next.config.mjs', // Next.js config for frontend
  'tailwind.config.js', // TailwindCSS config for frontend
  'requirements.txt', // Backend dependencies
  'app.py',          // Backend entry point
  'core_configs.json', // Core configuration files
  'postgresql_config.json' // Database config
];

// Check if directory exists
function checkDirExists(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`❌ Directory ${dir} not found.`);
    return false;
  }
  console.log(`✅ Directory ${dir} exists.`);
  return true;
}

// Check if file exists
function checkFileExists(file) {
  if (!fs.existsSync(file)) {
    console.log(`❌ File ${file} not found.`);
    return false;
  }
  console.log(`✅ File ${file} exists.`);
  return true;
}

// Check all required directories and files
function checkProjectStructure() {
  console.log("\n🔍 Checking project structure...\n");

  // Check for required directories
  requiredDirs.forEach((dir) => {
    checkDirExists(path.join(__dirname, dir));
  });

  // Check for required files
  requiredFiles.forEach((file) => {
    checkFileExists(path.join(__dirname, file));
  });
}

checkProjectStructure();
