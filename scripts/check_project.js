#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Configuration - adjust paths based on your README structure
const PROJECT_ROOT = process.env.PROJECT_ROOT || path.resolve(__dirname, '..');
const FRONTEND_DIR = path.join(PROJECT_ROOT, 'frontend/tata-ai-dashboard');
const BACKEND_DIRS = [
  path.join(PROJECT_ROOT, 'src/tata-core'),
  path.join(PROJECT_ROOT, 'src/tata-flow'),
  path.join(PROJECT_ROOT, 'src/tata-memex'),
  path.join(PROJECT_ROOT, 'src/tata-zkp')
];

// Required dependencies for frontend
const FRONTEND_DEPENDENCIES = [
  'next',
  'react',
  'react-dom',
  'tailwindcss',
  'lucide-react',
  'recharts',
  'next-themes',
  '@radix-ui/react-dropdown-menu',
  '@radix-ui/react-tabs',
  '@radix-ui/react-avatar',
  '@radix-ui/react-dialog',
  'class-variance-authority',
  'clsx',
  'tailwind-merge'
];

// Required dependencies for backend
const BACKEND_DEPENDENCIES = [
  'fastapi',
  'uvicorn',
  'pymongo',
  'psycopg2-binary',
  'pydantic'
];

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

async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`${colors.red}Error reading ${filePath}:${colors.reset}`, error.message);
    return null;
  }
}

async function checkDirectoryExists(dirPath, name) {
  if (!await fileExists(dirPath)) {
    console.error(`${colors.red}✘ ${name} directory not found at ${dirPath}${colors.reset}`);
    return false;
  }
  console.log(`${colors.green}✓ ${name} directory found${colors.reset}`);
  return true;
}

// Check functions
async function checkProjectStructure() {
  console.log(`\n${colors.cyan}Checking project structure...${colors.reset}`);
  
  const requiredDirs = [
    { path: path.join(PROJECT_ROOT, 'frontend'), name: 'Frontend' },
    { path: path.join(PROJECT_ROOT, 'backend'), name: 'Backend' },
    { path: path.join(PROJECT_ROOT, 'docker'), name: 'Docker' },
    { path: path.join(PROJECT_ROOT, 'data'), name: 'Data' },
    { path: path.join(PROJECT_ROOT, 'configs'), name: 'Configs' },
    { path: path.join(PROJECT_ROOT, 'logs'), name: 'Logs' },
    { path: path.join(PROJECT_ROOT, 'scripts'), name: 'Scripts' },
    { path: path.join(PROJECT_ROOT, 'src'), name: 'Source' },
    { path: path.join(PROJECT_ROOT, 'tests'), name: 'Tests' }
  ];
  
  let allDirsExist = true;
  for (const dir of requiredDirs) {
    const exists = await checkDirectoryExists(dir.path, dir.name);
    if (!exists) allDirsExist = false;
  }
  
  // Check for core module directories
  console.log(`\n${colors.cyan}Checking core module directories...${colors.reset}`);
  const coreDirs = [
    { path: path.join(PROJECT_ROOT, 'src/tata-core'), name: 'Tata Core' },
    { path: path.join(PROJECT_ROOT, 'src/tata-flow'), name: 'Tata Flow' },
    { path: path.join(PROJECT_ROOT, 'src/tata-memex'), name: 'Tata Memex' },
    { path: path.join(PROJECT_ROOT, 'src/tata-zkp'), name: 'Tata ZKP' }
  ];
  
  for (const dir of coreDirs) {
    const exists = await checkDirectoryExists(dir.path, dir.name);
    if (!exists) allDirsExist = false;
  }
  
  // Check for key files
  console.log(`\n${colors.cyan}Checking key files...${colors.reset}`);
  const keyFiles = [
    { path: path.join(PROJECT_ROOT, 'docker-compose.yml'), name: 'Docker Compose' },
    { path: path.join(PROJECT_ROOT, 'README.md'), name: 'README' }
  ];
  
  for (const file of keyFiles) {
    if (!await fileExists(file.path)) {
      console.error(`${colors.red}✘ ${file.name} file not found at ${file.path}${colors.reset}`);
      allDirsExist = false;
    } else {
      console.log(`${colors.green}✓ ${file.name} file found${colors.reset}`);
    }
  }
  
  return allDirsExist;
}

async function checkFrontendConfig() {
  console.log(`\n${colors.cyan}Checking frontend configuration...${colors.reset}`);
  
  if (!await checkDirectoryExists(FRONTEND_DIR, 'Frontend Dashboard')) {
    return false;
  }
  
  // Check package.json
  const packageJsonPath = path.join(FRONTEND_DIR, 'package.json');
  if (!await fileExists(packageJsonPath)) {
    console.error(`${colors.red}✘ package.json not found at ${packageJsonPath}${colors.reset}`);
    return false;
  }
  
  console.log(`${colors.green}✓ package.json found${colors.reset}`);
  
  const packageJson = await readJsonFile(packageJsonPath);
  if (!packageJson) return false;
  
  // Check required dependencies
  console.log(`${colors.cyan}Checking frontend dependencies...${colors.reset}`);
  const missingDeps = [];
  
  for (const dep of FRONTEND_DEPENDENCIES) {
    if (!packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]) {
      missingDeps.push(dep);
    }
  }
  
  if (missingDeps.length > 0) {
    console.error(`${colors.red}✘ Missing frontend dependencies: ${missingDeps.join(', ')}${colors.reset}`);
    console.log(`${colors.yellow}Run the following command to install missing dependencies:${colors.reset}`);
    console.log(`cd ${FRONTEND_DIR} && npm install --save ${missingDeps.join(' ')}`);
    return false;
  }
  
  console.log(`${colors.green}✓ All required frontend dependencies are installed${colors.reset}`);
  
  // Check Next.js config
  const nextConfigPath = path.join(FRONTEND_DIR, 'next.config.mjs');
  const nextConfigJsPath = path.join(FRONTEND_DIR, 'next.config.js');
  
  if (!await fileExists(nextConfigPath) && !await fileExists(nextConfigJsPath)) {
    console.error(`${colors.red}✘ Next.js config not found${colors.reset}`);
    return false;
  }
  
  console.log(`${colors.green}✓ Next.js config found${colors.reset}`);
  
  // Check Tailwind config
  const tailwindConfigPath = path.join(FRONTEND_DIR, 'tailwind.config.js');
  if (!await fileExists(tailwindConfigPath)) {
    console.error(`${colors.red}✘ tailwind.config.js not found${colors.reset}`);
    return false;
  }
  
  console.log(`${colors.green}✓ Tailwind config found${colors.reset}`);
  
  // Check for environment variables
  const envPath = path.join(FRONTEND_DIR, '.env.local');
  const envExists = await fileExists(envPath);
  
  if (!envExists) {
    console.warn(`${colors.yellow}⚠ .env.local not found. This may be needed for API configuration.${colors.reset}`);
  } else {
    console.log(`${colors.green}✓ .env.local found${colors.reset}`);
    
    // Check for API base URL
    const envContent = await fs.readFile(envPath, 'utf8');
    if (!envContent.includes('NEXT_PUBLIC_API_BASE_URL')) {
      console.warn(`${colors.yellow}⚠ NEXT_PUBLIC_API_BASE_URL not found in .env.local${colors.reset}`);
    } else {
      console.log(`${colors.green}✓ NEXT_PUBLIC_API_BASE_URL found in .env.local${colors.reset}`);
    }
  }
  
  return true;
}

async function checkBackendConfig() {
  console.log(`\n${colors.cyan}Checking backend configuration...${colors.reset}`);
  
  let allModulesValid = true;
  
  for (const backendDir of BACKEND_DIRS) {
    const moduleName = path.basename(backendDir);
    console.log(`\n${colors.cyan}Checking ${moduleName} module...${colors.reset}`);
    
    if (!await checkDirectoryExists(backendDir, moduleName)) {
      allModulesValid = false;
      continue;
    }
    
    // Check for app.py
    const appPath = path.join(backendDir, 'app.py');
    if (!await fileExists(appPath)) {
      console.error(`${colors.red}✘ app.py not found in ${moduleName}${colors.reset}`);
      allModulesValid = false;
    } else {
      console.log(`${colors.green}✓ app.py found in ${moduleName}${colors.reset}`);
    }
    
    // Check for requirements.txt
    const requirementsPath = path.join(backendDir, 'requirements.txt');
    if (!await fileExists(requirementsPath)) {
      console.warn(`${colors.yellow}⚠ requirements.txt not found in ${moduleName}${colors.reset}`);
    } else {
      console.log(`${colors.green}✓ requirements.txt found in ${moduleName}${colors.reset}`);
      
      // Check for required Python dependencies
      const requirementsContent = await fs.readFile(requirementsPath, 'utf8');
      const missingDeps = [];
      
      for (const dep of BACKEND_DEPENDENCIES) {
        if (!requirementsContent.includes(dep)) {
          missingDeps.push(dep);
        }
      }
      
      if (missingDeps.length > 0) {
        console.warn(`${colors.yellow}⚠ Some recommended dependencies may be missing in ${moduleName}: ${missingDeps.join(', ')}${colors.reset}`);
      } else {
        console.log(`${colors.green}✓ All recommended dependencies found in ${moduleName}${colors.reset}`);
      }
    }
  }
  
  return allModulesValid;
}

async function checkDockerConfig() {
  console.log(`\n${colors.cyan}Checking Docker configuration...${colors.reset}`);
  
  const dockerComposePath = path.join(PROJECT_ROOT, 'docker-compose.yml');
  if (!await fileExists(dockerComposePath)) {
    console.error(`${colors.red}✘ docker-compose.yml not found${colors.reset}`);
    return false;
  }
  
  console.log(`${colors.green}✓ docker-compose.yml found${colors.reset}`);
  
  // Check Docker directory
  const dockerDir = path.join(PROJECT_ROOT, 'docker');
  if (!await checkDirectoryExists(dockerDir, 'Docker')) {
    return false;
  }
  
  // Check for module Dockerfiles
  const moduleDockerDirs = [
    { path: path.join(dockerDir, 'tata-core'), name: 'Tata Core' },
    { path: path.join(dockerDir, 'tata-flow'), name: 'Tata Flow' },
    { path: path.join(dockerDir, 'tata-memex'), name: 'Tata Memex' },
    { path: path.join(dockerDir, 'tata-zkp'), name: 'Tata ZKP' }
  ];
  
  let allDockerfilesExist = true;
  for (const dir of moduleDockerDirs) {
    if (!await checkDirectoryExists(dir.path, `${dir.name} Docker`)) {
      allDockerfilesExist = false;
      continue;
    }
    
    const dockerfilePath = path.join(dir.path, 'Dockerfile');
    if (!await fileExists(dockerfilePath)) {
      console.error(`${colors.red}✘ Dockerfile not found for ${dir.name}${colors.reset}`);
      allDockerfilesExist = false;
    } else {
      console.log(`${colors.green}✓ Dockerfile found for ${dir.name}${colors.reset}`);
    }
  }
  
  return allDockerfilesExist;
}

async function checkDatabaseConfig() {
  console.log(`\n${colors.cyan}Checking database configuration...${colors.reset}`);
  
  // Check for MongoDB connection string in environment variables
  const configsDir = path.join(PROJECT_ROOT, 'configs');
  if (!await checkDirectoryExists(configsDir, 'Configs')) {
    return false;
  }
  
  // Look for database configuration files
  const dbConfigFiles = await fs.readdir(configsDir);
  const mongoConfigExists = dbConfigFiles.some(file => file.toLowerCase().includes('mongo'));
  const postgresConfigExists = dbConfigFiles.some(file => file.toLowerCase().includes('postgres') || file.toLowerCase().includes('postgresql'));
  
  if (!mongoConfigExists) {
    console.warn(`${colors.yellow}⚠ MongoDB configuration file not found in configs directory${colors.reset}`);
  } else {
    console.log(`${colors.green}✓ MongoDB configuration found${colors.reset}`);
  }
  
  if (!postgresConfigExists) {
    console.warn(`${colors.yellow}⚠ PostgreSQL configuration file not found in configs directory${colors.reset}`);
  } else {
    console.log(`${colors.green}✓ PostgreSQL configuration found${colors.reset}`);
  }
  
  return true;
}

async function checkModelFiles() {
  console.log(`\n${colors.cyan}Checking AI model files...${colors.reset}`);
  
  const modelsDir = path.join(PROJECT_ROOT, 'data/models');
  if (!await checkDirectoryExists(modelsDir, 'Models')) {
    return false;
  }
  
  try {
    const modelFiles = await fs.readdir(modelsDir);
    if (modelFiles.length === 0) {
      console.warn(`${colors.yellow}⚠ No model files found in data/models directory${colors.reset}`);
      return true;
    }
    
    console.log(`${colors.green}✓ Found ${modelFiles.length} model files${colors.reset}`);
    
    // Check for specific model types
    const llamaModels = modelFiles.filter(file => file.toLowerCase().includes('llama'));
    const huggingFaceModels = modelFiles.filter(file => file.toLowerCase().includes('huggingface'));
    const gpt4AllModels = modelFiles.filter(file => file.toLowerCase().includes('gpt4all'));
    
    if (llamaModels.length > 0) {
      console.log(`${colors.green}✓ Found Llama models: ${llamaModels.join(', ')}${colors.reset}`);
    }
    
    if (huggingFaceModels.length > 0) {
      console.log(`${colors.green}✓ Found Hugging Face models: ${huggingFaceModels.join(', ')}${colors.reset}`);
    }
    
    if (gpt4AllModels.length > 0) {
      console.log(`${colors.green}✓ Found GPT-4All models: ${gpt4AllModels.join(', ')}${colors.reset}`);
    }
    
    return true;
  } catch (error) {
    console.error(`${colors.red}Error reading model files:${colors.reset}`, error.message);
    return false;
  }
}

async function checkVercelDeployment() {
  console.log(`\n${colors.cyan}Checking Vercel deployment configuration...${colors.reset}`);
  
  const vercelConfigPath = path.join(FRONTEND_DIR, 'vercel.json');
  const vercelExists = await fileExists(vercelConfigPath);
  
  if (!vercelExists) {
    console.warn(`${colors.yellow}⚠ vercel.json not found. This may be needed for Vercel deployment.${colors.reset}`);
  } else {
    console.log(`${colors.green}✓ vercel.json found${colors.reset}`);
  }
  
  // Check for .vercel directory (indicates a previous deployment)
  const vercelDirPath = path.join(FRONTEND_DIR, '.vercel');
  const vercelDirExists = await fileExists(vercelDirPath);
  
  if (!vercelDirExists) {
    console.warn(`${colors.yellow}⚠ .vercel directory not found. The project may not have been deployed to Vercel yet.${colors.reset}`);
  } else {
    console.log(`${colors.green}✓ .vercel directory found (project has been deployed to Vercel)${colors.reset}`);
  }
  
  return true;
}

async function main() {
  console.log(`${colors.magenta}=== Tata AI Project Checker ===${colors.reset}`);
  console.log(`${colors.blue}Checking project at: ${PROJECT_ROOT}${colors.reset}`);
  
  if (!await fileExists(PROJECT_ROOT)) {
    console.error(`${colors.red}✘ Project root directory not found at ${PROJECT_ROOT}${colors.reset}`);
    console.log(`${colors.yellow}Set the PROJECT_ROOT environment variable to the correct path or update the script.${colors.reset}`);
    process.exit(1);
  }
  
  const checks = [
    { name: 'Project Structure', fn: checkProjectStructure },
    { name: 'Frontend Configuration', fn: checkFrontendConfig },
    { name: 'Backend Configuration', fn: checkBackendConfig },
    { name: 'Docker Configuration', fn: checkDockerConfig },
    { name: 'Database Configuration', fn: checkDatabaseConfig },
    { name: 'AI Model Files', fn: checkModelFiles },
    { name: 'Vercel Deployment', fn: checkVercelDeployment }
  ];
  
  const results = {};
  
  for (const check of checks) {
    results[check.name] = await check.fn();
  }
  
  console.log(`\n${colors.magenta}=== Check Summary ===${colors.reset}`);
  
  let allPassed = true;
  for (const [name, passed] of Object.entries(results)) {
    console.log(`${passed ? colors.green + '✓' : colors.red + '✘'} ${name}${colors.reset}`);
    if (!passed) allPassed = false;
  }
  
  if (allPassed) {
    console.log(`\n${colors.green}All checks passed! Your project is correctly configured.${colors.reset}`);
  } else {
    console.log(`\n${colors.yellow}Some checks failed. Please address the issues above before proceeding.${colors.reset}`);
  }
  
  // Generate a report file
  const reportPath = path.join(process.cwd(), 'tata_ai_project_check_report.json');
  await fs.writeFile(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    projectRoot: PROJECT_ROOT,
    frontendDir: FRONTEND_DIR,
    backendDirs: BACKEND_DIRS,
    results,
    allPassed
  }, null, 2));
  
  console.log(`\n${colors.blue}Report saved to: ${reportPath}${colors.reset}`);
  
  // Provide next steps
  console.log(`\n${colors.magenta}=== Next Steps ===${colors.reset}`);
  console.log(`${colors.cyan}1. Address any issues identified in the report${colors.reset}`);
  console.log(`${colors.cyan}2. Run the script again to verify fixes${colors.reset}`);
  console.log(`${colors.cyan}3. Once all checks pass, proceed with updating your code${colors.reset}`);
  
  // Bonus: Create a README updater script if requested
  console.log(`\n${colors.yellow}Would you like to create a script to automatically update your README.md when the project structure changes?${colors.reset}`);
  console.log(`${colors.yellow}Run: node scripts/create_readme_updater.js${colors.reset}`);
}

main().catch(error => {
  console.error(`${colors.red}Error running project checker:${colors.reset}`, error);
  process.exit(1);
});