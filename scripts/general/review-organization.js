#!/usr/bin/env node

/**
 * Script Name: Review Organization
 * 
 * Description: Reviews the script organization and helps identify
 * duplicate files to clean up.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const SCRIPTS_ROOT = process.env.SCRIPTS_ROOT || '.';
const REPORT_PATH = path.join(SCRIPTS_ROOT, 'script-organization-report.md');
const CLEANUP_SCRIPT_PATH = path.join(SCRIPTS_ROOT, 'cleanup-scripts.sh');

// Categories to check
const categories = [
  'frontend',
  'backend',
  'general',
  'docker',
  'deployment',
  'setup',
  'testing',
  'model'
];

// Function to calculate file hash
function calculateFileHash(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
  } catch (error) {
    console.error(`Error calculating hash for ${filePath}: ${error.message}`);
    return null;
  }
}

// Function to find all script files
function findScripts(dir) {
  const results = [];
  
  // Skip if directory doesn't exist
  if (!fs.existsSync(dir)) return results;
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      // Skip certain directories
      if (['node_modules', 'venv', '.git', 'docker/reports'].includes(fullPath.replace(`${SCRIPTS_ROOT}/`, ''))) continue;
      
      results.push(...findScripts(fullPath));
    } else {
      // Check if it's a script file
      const ext = path.extname(item.name).toLowerCase();
      if (['.js', '.sh', '.py', '.rb', '.pl'].includes(ext)) {
        results.push({
          path: fullPath,
          name: item.name,
          category: fullPath.replace(`${SCRIPTS_ROOT}/`, '').split('/')[0],
          hash: calculateFileHash(fullPath)
        });
      }
    }
  }
  
  return results;
}

// Function to find duplicate files
function findDuplicates(scripts) {
  const hashMap = {};
  const duplicates = [];
  
  scripts.forEach(script => {
    if (!script.hash) return;
    
    if (hashMap[script.hash]) {
      hashMap[script.hash].push(script);
    } else {
      hashMap[script.hash] = [script];
    }
  });
  
  // Filter out unique files
  Object.keys(hashMap).forEach(hash => {
    if (hashMap[hash].length > 1) {
      duplicates.push(hashMap[hash]);
    }
  });
  
  return duplicates;
}

// Function to generate cleanup script
function generateCleanupScript(duplicates) {
  let script = `#!/bin/bash\n\n`;
  script += `# Script to clean up duplicate script files\n`;
  script += `# Generated on: ${new Date().toLocaleString()}\n\n`;
  
  script += `# Make sure you've reviewed these commands before running this script!\n\n`;
  
  duplicates.forEach(group => {
    script += `# Duplicate group: ${group[0].name}\n`;
    
    // Keep the file in the category directory, remove the one in the root
    const rootFiles = group.filter(file => file.category === '');
    const categoryFiles = group.filter(file => file.category !== '');
    
    if (categoryFiles.length > 0 && rootFiles.length > 0) {
      rootFiles.forEach(file => {
        script += `rm "${file.path}" # Same as ${categoryFiles[0].path}\n`;
      });
    }
    
    // If multiple files in categories, keep one and suggest reviewing others
    if (categoryFiles.length > 1) {
      script += `# Multiple copies in different categories - review these manually:\n`;
      categoryFiles.forEach(file => {
        script += `# - ${file.path}\n`;
      });
    }
    
    script += `\n`;
  });
  
  return script;
}

// Function to generate report
function generateReport(scripts, duplicates) {
  let report = `# Script Organization Review\n\n`;
  report += `Generated on: ${new Date().toLocaleString()}\n\n`;
  
  // Summary
  report += `## Summary\n\n`;
  report += `- Total scripts: ${scripts.length}\n`;
  report += `- Duplicate groups: ${duplicates.length}\n`;
  report += `- Scripts in root directory: ${scripts.filter(s => s.category === '').length}\n\n`;
  
  // Scripts by category
  report += `## Scripts by Category\n\n`;
  
  categories.forEach(category => {
    const categoryScripts = scripts.filter(s => s.category === category);
    report += `### ${category.charAt(0).toUpperCase() + category.slice(1)} (${categoryScripts.length})\n\n`;
    
    if (categoryScripts.length > 0) {
      report += `| Script | Path |\n`;
      report += `|--------|------|\n`;
      
      categoryScripts.forEach(script => {
        report += `| \`${script.name}\` | \`${script.path}\` |\n`;
      });
      
      report += `\n`;
    } else {
      report += `No scripts in this category yet.\n\n`;
    }
  });
  
  // Scripts in root directory
  const rootScripts = scripts.filter(s => s.category === '');
  if (rootScripts.length > 0) {
    report += `### Root Directory (${rootScripts.length})\n\n`;
    report += `| Script | Path |\n`;
    report += `|--------|------|\n`;
    
    rootScripts.forEach(script => {
      report += `| \`${script.name}\` | \`${script.path}\` |\n`;
    });
    
    report += `\n`;
  }
  
  // Duplicate files
  report += `## Duplicate Files\n\n`;
  
  if (duplicates.length > 0) {
    duplicates.forEach((group, index) => {
      report += `### Group ${index + 1}: ${group[0].name}\n\n`;
      report += `| Path | Category |\n`;
      report += `|------|----------|\n`;
      
      group.forEach(script => {
        report += `| \`${script.path}\` | ${script.category || 'root'} |\n`;
      });
      
      report += `\n`;
    });
  } else {
    report += `No duplicate files found.\n\n`;
  }
  
  // Next steps
  report += `## Next Steps\n\n`;
  report += `1. Review the duplicate files and decide which ones to keep\n`;
  report += `2. Run the cleanup script to remove duplicate files: \`bash cleanup-scripts.sh\`\n`;
  report += `3. Update the README with \`./scripts/general/update_readme.sh\`\n`;
  
  return report;
}

// Main function
function main() {
  console.log('Starting script organization review...');
  
  // Find all scripts
  const scripts = findScripts(SCRIPTS_ROOT);
  console.log(`Found ${scripts.length} scripts`);
  
  // Find duplicates
  const duplicates = findDuplicates(scripts);
  console.log(`Found ${duplicates.length} duplicate groups`);
  
  // Generate cleanup script
  const cleanupScript = generateCleanupScript(duplicates);
  fs.writeFileSync(CLEANUP_SCRIPT_PATH, cleanupScript);
  console.log(`Cleanup script generated at ${CLEANUP_SCRIPT_PATH}`);
  
  // Generate report
  const report = generateReport(scripts, duplicates);
  fs.writeFileSync(REPORT_PATH.replace('.md', '-review.md'), report);
  console.log(`Review report generated at ${REPORT_PATH.replace('.md', '-review.md')}`);
  
  console.log('Script organization review complete!');
}

main();
