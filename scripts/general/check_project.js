#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

// Define the directories and files to check for
const requiredDirs = [
  'src/tata-core',
  'src/tata-flow',
  'src/tata-memex',
  'src/tata-moto',
  'src/tata-zkp',
  'templates',
  'configs',
  'frontend',
  'backend',
  'docker',
  'data',
  'logs',
  'monitoring'
];

const requiredFiles = [
  'docker-compose.yml',
  'README.md',
  'package.json',
  'next.config.mjs',
  'tailwind.config.js',
  'requirements.txt',
  'app.py',
  'core_configs.json',
  'postgresql_config.json'
];

// Check if directory exists
async function checkDirExists(dir) {
  try {
    await fs.access(dir);
    console.log(`✅ Directory ${dir} exists.`);
    return true;
  } catch (error) {
    console.log(`❌ Directory ${dir} not found.`);
    return false;
  }
}

// Check if file exists
async function checkFileExists(file) {
  try {
    await fs.access(file);
    console.log(`✅ File ${file} exists.`);
    return true;
  } catch (error) {
    console.log(`❌ File ${file} not found.`);
    return false;
  }
}

// Check all required directories and files
async function checkProjectStructure() {
  console.log("\n🔍 Checking project structure...\n");

  for (const dir of requiredDirs) {
    await checkDirExists(path.join(__dirname, '..', dir));
  }

  for (const file of requiredFiles) {
    await checkFileExists(path.join(__dirname, '..', file));
  }
}

// Main function to run the check
async function startCheck() {
  try {
    await checkProjectStructure();
    console.log("\n✅ All checks passed!");
  } catch (error) {
    console.error(`❌ Error during project structure check: ${error.message}`);
  }
}

// Check for warnings, like missing or incomplete configurations
async function checkWarnings() {
  console.log("\n⚠ Checking for potential warnings...");

  const envFile = path.join(__dirname, '..', '.env');
  try {
    await fs.access(envFile);
    console.log(`✅ ${envFile} found.`);
  } catch (error) {
    console.log(`⚠ ${envFile} not found. This file may be necessary for API configuration.`);
  }
}

(async () => {
  await startCheck();
  await checkWarnings();
})();

const PROJECT_ROOT = process.env.PROJECT_ROOT || path.resolve(__dirname, '..');
const FRONTEND_DIR = path.join(PROJECT_ROOT, 'frontend');
const BACKEND_DIRS = [
  path.join(PROJECT_ROOT, 'src/tata-core'),
  path.join(PROJECT_ROOT, 'src/tata-flow'),
  path.join(PROJECT_ROOT, 'src/tata-memex'),
  path.join(PROJECT_ROOT, 'src/tata-zkp')
];

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

const BACKEND_DEPENDENCIES = [
  'fastapi',
  'uvicorn',
  'pymongo',
  'psycopg2-binary',
  'pydantic'
];

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
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
}

async function checkDirectoryExists(dirPath, name) {
  if (!await fileExists(dirPath)) {
    console.error(`✘ ${name} directory not found at ${dirPath}`);
    return false;
  }
  console.log(`✓ ${name} directory found`);
  return true;
}

async function checkFrontendConfig() {
  console.log("\nChecking frontend configuration...");
  
  if (!await checkDirectoryExists(FRONTEND_DIR, 'Frontend')) {
    return false;
  }
  
  const packageJsonPath = path.join(FRONTEND_DIR, 'package.json');
  if (!await fileExists(packageJsonPath)) {
    console.error(`✘ package.json not found at ${packageJsonPath}`);
    return false;
  }
  
  console.log(`✓ package.json found`);
  
  const packageJson = await readJsonFile(packageJsonPath);
  if (!packageJson) {
    return false;
  }
  
  console.log("Checking frontend dependencies...");
  const missingDeps = [];
  
  for (const dep of FRONTEND_DEPENDENCIES) {
    if (!packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]) {
      missingDeps.push(dep);
    }
  }
  
  if (missingDeps.length > 0) {
    console.error(`✘ Missing frontend dependencies: ${missingDeps.join(', ')}`);
    console.log(`Run the following command to install missing dependencies:`);
    console.log(`cd ${FRONTEND_DIR} && npm install --save ${missingDeps.join(' ')}`);
    return false;
  }
  
  console.log(`✓ All required frontend dependencies are installed`);
  
  const nextConfigPath = path.join(FRONTEND_DIR, 'next.config.mjs');
  const nextConfigJsPath = path.join(FRONTEND_DIR, 'next.config.js');
  
  if (!await fileExists(nextConfigPath) && !await fileExists(nextConfigJsPath)) {
    console.error(`✘ Next.js config not found`);
    return false;
  }
  
  console.log(`✓ Next.js config found`);
  
  const tailwindConfigPath = path.join(FRONTEND_DIR, 'tailwind.config.js');
  if (!await fileExists(tailwindConfigPath)) {
    console.error(`✘ tailwind.config.js not found`);
    return false;
  }
  
  console.log(`✓ Tailwind config found`);
  
  const envPath = path.join(FRONTEND_DIR, '.env.local');
  const envExists = await fileExists(envPath);
  
  if (!envExists) {
    console.warn(`⚠ .env.local not found. This may be needed for API configuration.`);
  } else {
    console.log(`✓ .env.local found`);
    
    const envContent = await fs.readFile(envPath, 'utf8');
    if (!envContent.includes('NEXT_PUBLIC_API_BASE_URL')) {
      console.warn(`⚠ NEXT_PUBLIC_API_BASE_URL not found in .env.local`);
    } else {
      console.log(`✓ NEXT_PUBLIC_API_BASE_URL found in .env.local`);
    }
  }
  
  return true;
}

async function checkBackendConfig() {
  console.log("\nChecking backend configuration...");
  
  let allModulesValid = true;
  
  for (const backendDir of BACKEND_DIRS) {
    const moduleName = path.basename(backendDir);
    console.log(`\nChecking ${moduleName} module...`);
    
    if (!await checkDirectoryExists(backendDir, moduleName)) {
      allModulesValid = false;
      continue;
    }
    
    const appPath = path.join(backendDir, 'app.py');
    if (!await fileExists(appPath)) {
      console.error(`✘ app.py not found in ${moduleName}`);
      allModulesValid = false;
    } else {
      console.log(`✓ app.py found in ${moduleName}`);
    }
    
    const requirementsPath = path.join(backendDir, 'requirements.txt');
    if (!await fileExists(requirementsPath)) {
      console.warn(`⚠ requirements.txt not found in ${moduleName}`);
    } else {
      console.log(`✓ requirements.txt found in ${moduleName}`);
      
      const requirementsContent = await fs.readFile(requirementsPath, 'utf8');
      const missingDeps = [];
      
      for (const dep of BACKEND_DEPENDENCIES) {
        if (!requirementsContent.includes(dep)) {
          missingDeps.push(dep);
        }
      }
      
      if (missingDeps.length > 0) {
        console.warn(`⚠ Some recommended dependencies may be missing in ${moduleName}: ${missingDeps.join(', ')}`);
      } else {
        console.log(`✓ All recommended dependencies found in ${moduleName}`);
      }
    }
  }
  
  return allModulesValid;
}

async function checkDockerConfig() {
  console.log("\nChecking Docker configuration...");
  
  const dockerComposePath = path.join(PROJECT_ROOT, 'docker-compose.yml');
  if (!await fileExists(dockerComposePath)) {
    console.error(`✘ docker-compose.yml not found`);
    return false;
  }
  
  console.log(`✓ docker-compose.yml found`);
  
  const dockerDir = path.join(PROJECT_ROOT, 'docker');
  if (!await checkDirectoryExists(dockerDir, 'Docker')) {
    return false;
  }
  
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
      console.error(`✘ Dockerfile not found for ${dir.name}`);
      allDockerfilesExist = false;
    } else {
      console.log(`✓ Dockerfile found for ${dir.name}`);
    }
  }
  
  return allDockerfilesExist;
}

async function checkDatabaseConfig() {
  console.log("\nChecking database configuration...");
  
  const configsDir = path.join(PROJECT_ROOT, 'configs');
  if (!await checkDirectoryExists(configsDir, 'Configs')) {
    return false;
  }
  
  const dbConfigFiles = await fs.readdir(configsDir);
  const mongoConfigExists = dbConfigFiles.some(file => file.toLowerCase().includes('mongo'));
  const postgresConfigExists = dbConfigFiles.some(file => file.toLowerCase().includes('postgres') || file.toLowerCase().includes('postgresql'));
  
  if (!mongoConfigExists) {
    console.warn(`⚠ MongoDB configuration file not found in configs directory`);
  } else {
    console.log(`✓ MongoDB configuration found`);
  }
  
  if (!postgresConfigExists) {
    console.warn(`⚠ PostgreSQL configuration file not found in configs directory`);
  } else {
    console.log(`✓ PostgreSQL configuration found`);
  }
  
  return true;
}

async function checkModelFiles() {
  console.log("\nChecking AI model files...");
  
  const modelsDir = path.join(PROJECT_ROOT, 'data/models');
  if (!await checkDirectoryExists(modelsDir, 'Models')) {
    return false;
  }
  
  try {
    const modelFiles = await fs.readdir(modelsDir);
    if (modelFiles.length === 0) {
      console.warn(`⚠ No model files found in data/models directory`);
      return true;
    }
    
    console.log(`✓ Found ${modelFiles.length} model files`);
    
    const llamaModels = modelFiles.filter(file => file.toLowerCase().includes('llama'));
    const huggingFaceModels = modelFiles.filter(file => file.toLowerCase().includes('huggingface'));
    const gpt4AllModels = modelFiles.filter(file => file.toLowerCase().includes('gpt4all'));
    
    if (llamaModels.length > 0) {
      console.log(`✓ Found Llama models: ${llamaModels.join(', ')}`);
    }
    
    if (huggingFaceModels.length > 0) {
      console.log(`✓ Found Hugging Face models: ${huggingFaceModels.join(', ')}`);
    }
    
    if (gpt4AllModels.length > 0) {
      console.log(`✓ Found GPT-4All models: ${gpt4AllModels.join(', ')}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error reading model files:`, error.message);
    return false;
  }
}

async function checkVercelDeployment() {
  console.log("\nChecking Vercel deployment configuration...");
  
  const vercelConfigPath = path.join(FRONTEND_DIR, 'vercel.json');
  const vercelExists = await fileExists(vercelConfigPath);
  
  if (!vercelExists) {
    console.warn(`⚠ vercel.json not found. This may be needed for Vercel deployment.`);
  } else {
    console.log(`✓ vercel.json found`);
  }
  
  const vercelDirPath = path.join(FRONTEND_DIR, '.vercel');
  const vercelDirExists = await fileExists(vercelDirPath);
  
  if (!vercelDirExists) {
    console.warn(`⚠ .vercel directory not found. The project may not have been deployed to Vercel yet.`);
  } else {
    console.log(`✓ .vercel directory found (project has been deployed to Vercel)`);
  }
  
  return true;
}

async function main() {
  console.log("=== Tata AI Project Checker ===");
  console.log(`Checking project at: ${PROJECT_ROOT}`);
  
  if (!await fileExists(PROJECT_ROOT)) {
    console.error(`✘ Project root directory not found at ${PROJECT_ROOT}`);
    console.log(`Set the PROJECT_ROOT environment variable to the correct path or update the script.`);
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
  
  console.log("\n=== Check Summary ===");
  
  let allPassed = true;
  for (const [name, passed] of Object.entries(results)) {
    console.log(`${passed ? '✓' : '✘'} ${name}`);
    if (!passed) {
      allPassed = false;
    }
  }
  
  if (allPassed) {
    console.log("\nAll checks passed! Your project is correctly configured.");
  } else {
    console.log("\nSome checks failed. Please address the issues above before proceeding.");
  }
  
  const reportPath = path.join(process.cwd(), 'tata_ai_project_check_report.json');
  await fs.writeFile(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    projectRoot: PROJECT_ROOT,
    frontendDir: FRONTEND_DIR,
    backendDirs: BACKEND_DIRS,
    results,
    allPassed
  }, null, 2));

  console.log(`\nReport saved to: ${reportPath}`);
  
  console.log("\n=== Next Steps ===");
  console.log("1. Address any issues identified in the report");
  console.log("2. Run the script again to verify fixes");
  console.log("3. Once all checks pass, proceed with updating your code");
  
  console.log("\nWould you like to create a script to automatically update your README.md when the project structure changes?");
  console.log("Run: node scripts/create_readme_updater.js");
}

main().catch(error => {
  console.error(`Error running project checker:`, error);
  process.exit(1);
});
