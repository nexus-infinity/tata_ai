#!/usr/bin/env node

/**
 * Script Name: Organize Scripts (Improved)
 * 
 * Description: Organizes script files into appropriate categories
 * based on their names and content.
 */

const fs = require('fs');
const path = require('path');

// Configuration - use absolute paths
const SCRIPTS_ROOT = '/volumes/akron/tata-ai/scripts';

// Create directory structure if it doesn't exist
const directories = [
  path.join(SCRIPTS_ROOT, 'backend'),
  path.join(SCRIPTS_ROOT, 'frontend'),
  path.join(SCRIPTS_ROOT, 'general'),
  path.join(SCRIPTS_ROOT, 'docker'),
  path.join(SCRIPTS_ROOT, 'docker/reports'),
  path.join(SCRIPTS_ROOT, 'deployment'),
  path.join(SCRIPTS_ROOT, 'setup'),
  path.join(SCRIPTS_ROOT, 'testing'),
  path.join(SCRIPTS_ROOT, 'model')
];

// Create directories
directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Script categorization rules
const categorization = [
  // Docker scripts
  { pattern: /docker/, category: 'docker' },
  { pattern: /dockerfile/i, category: 'docker' },
  { pattern: /container/, category: 'docker' },
  
  // Deployment scripts
  { pattern: /deploy/, category: 'deployment' },
  { pattern: /build\.sh/, category: 'deployment' },
  { pattern: /prepare_deployment/, category: 'deployment' },
  { pattern: /start_services/, category: 'deployment' },
  
  // Setup scripts
  { pattern: /setup/, category: 'setup' },
  { pattern: /install/, category: 'setup' },
  { pattern: /generate_env/, category: 'setup' },
  { pattern: /generate_requirements/, category: 'setup' },
  { pattern: /automate_system/, category: 'setup' },
  
  // Testing scripts
  { pattern: /test/, category: 'testing' },
  { pattern: /run_tests/, category: 'testing' },
  
  // Model scripts
  { pattern: /model/, category: 'model' },
  { pattern: /train/, category: 'model' },
  { pattern: /inference/, category: 'model' },
  { pattern: /tata_ai/, category: 'model' },
  { pattern: /template-ai/, category: 'model' },
  
  // Backend scripts
  { pattern: /backend/, category: 'backend' },
  { pattern: /api/, category: 'backend' },
  { pattern: /server/, category: 'backend' },
  { pattern: /database/, category: 'backend' },
  { pattern: /core/, category: 'backend' },
  
  // Frontend scripts
  { pattern: /frontend/, category: 'frontend' },
  { pattern: /ui/, category: 'frontend' },
  { pattern: /react/, category: 'frontend' },
  { pattern: /next/, category: 'frontend' },
  
  // General scripts (fallback)
  { pattern: /check_project/, category: 'general' },
  { pattern: /update/, category: 'general' },
  { pattern: /readme/, category: 'general' },
  { pattern: /generate_app/, category: 'general' }
];

/**
 * Categorize a script based on its filename
 * @param {string} scriptPath - Path to the script file
 * @returns {string} - The category the script belongs to
 */
function categorizeScript(scriptPath) {
  const filename = path.basename(scriptPath).toLowerCase();
  
  // Special case for docker reports
  if (filename.includes('report') && (filename.includes('docker') || filename.includes('container'))) {
    return 'docker/reports';
  }
  
  // Check against categorization rules
  for (const rule of categorization) {
    if (rule.pattern.test(filename)) {
      return rule.category;
    }
  }
  
  // Default to general
  return 'general';
}

/**
 * Find all script files in a directory recursively
 * @param {string} dir - Directory to search
 * @returns {string[]} - Array of script file paths
 */
function findScripts(dir) {
  const results = [];
  
  // Skip if directory doesn't exist
  if (!fs.existsSync(dir)) return results;
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      // Skip certain directories
      if (['node_modules', 'venv', '.git'].includes(item.name)) continue;
      
      // Skip our target directories to avoid moving files we've already organized
      if (directories.includes(fullPath)) continue;
      
      results.push(...findScripts(fullPath));
    } else {
      // Check if it's a script file
      const ext = path.extname(item.name).toLowerCase();
      if (['.js', '.sh', '.py', '.rb', '.pl'].includes(ext)) {
        results.push(fullPath);
      }
    }
  }
  
  return results;
}

/**
 * Move scripts to their appropriate directories
 * @returns {Object[]} - Array of moved script information
 */
function organizeScripts() {
  // Find all scripts directly in the scripts directory (not in subdirectories)
  const scripts = fs.readdirSync(SCRIPTS_ROOT)
    .filter(item => {
      const fullPath = path.join(SCRIPTS_ROOT, item);
      const ext = path.extname(item).toLowerCase();
      return fs.statSync(fullPath).isFile() && 
             ['.js', '.sh', '.py', '.rb', '.pl'].includes(ext);
    })
    .map(item => path.join(SCRIPTS_ROOT, item));
  
  console.log(`Found ${scripts.length} scripts to organize`);
  
  const moved = [];
  
  scripts.forEach(scriptPath => {
    const category = categorizeScript(scriptPath);
    const filename = path.basename(scriptPath);
    const destPath = path.join(SCRIPTS_ROOT, category, filename);
    
    // Skip if source and destination are the same
    if (scriptPath === destPath) {
      console.log(`Skipping ${filename} - already in correct location`);
      return;
    }
    
    console.log(`Moving ${scriptPath} to ${destPath}`);
    
    try {
      // Move the file instead of copying
      fs.renameSync(scriptPath, destPath);
      moved.push({
        original: scriptPath,
        destination: destPath,
        category
      });
    } catch (error) {
      console.error(`Error moving ${scriptPath}: ${error.message}`);
    }
  });
  
  return moved;
}

/**
 * Generate a report of moved files
 * @param {Object[]} moved - Array of moved script information
 */
function generateReport(moved) {
  const reportPath = path.join(SCRIPTS_ROOT, 'script-organization-report.md');
  
  let report = `# Script Organization Report\n\n`;
  report += `Generated on: ${new Date().toLocaleString()}\n\n`;
  report += `## Moved Scripts\n\n`;
  
  const byCategory = {};
  moved.forEach(item => {
    byCategory[item.category] = byCategory[item.category] || [];
    byCategory[item.category].push(item);
  });
  
  Object.keys(byCategory).sort().forEach(category => {
    report += `### ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;
    report += `| Original Location | New Location |\n`;
    report += `|------------------|-------------|\n`;
    
    byCategory[category].forEach(item => {
      report += `| \`${item.original}\` | \`${item.destination}\` |\n`;
    });
    
    report += `\n`;
  });
  
  report += `## Next Steps\n\n`;
  report += `1. Review the moved scripts to ensure they're in the correct categories\n`;
  report += `2. Update any references to these scripts in your code or documentation\n`;
  report += `3. Run \`./general/update_readme.sh\` to generate a comprehensive README\n`;
  
  fs.writeFileSync(reportPath, report);
  console.log(`Report generated at ${reportPath}`);
}

/**
 * Main function
 */
function main() {
  console.log('Starting script organization...');
  const moved = organizeScripts();
  generateReport(moved);
  console.log(`Script organization complete! ${moved.length} scripts organized.`);
}

// Run the main function
main();
