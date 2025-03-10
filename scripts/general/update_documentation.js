const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PROJECT_ROOT = process.env.PROJECT_ROOT || '/Volumes/Akron/tata-ai';
const CONFIG_DIR = path.join(PROJECT_ROOT, 'configs');
const TEMPLATES_DIR = path.join(CONFIG_DIR, 'templates');
const GENERATED_DIR = path.join(CONFIG_DIR, 'generated');
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

// Directory descriptions - customize these for your project
const directoryDescriptions = {
  // Root level directories
  'configs': {
    emoji: '⚙️',
    title: 'Configurations',
    description: 'Configuration files for various components of the Tata AI platform.',
    contents: ['templates', 'generated']
  },
  'configs/templates': {
    emoji: '📝',
    title: 'Templates',
    description: 'Template files used to generate node and cluster configurations.',
    contents: []
  },
  'configs/generated': {
    emoji: '🔧',
    title: 'Generated Configurations',
    description: 'Automatically generated configuration files for nodes and clusters.',
    contents: []
  },
  'scripts': {
    emoji: '🛠️',
    title: 'Scripts',
    description: 'Utility scripts for development, deployment, and maintenance of the Tata AI platform.',
    contents: ['setup', 'general', 'docs']
  },
  
  // Default for unknown directories
  'default': {
    emoji: '📁',
    title: 'Directory',
    description: 'A component of the Tata AI platform.',
    contents: []
  }
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

async function isDirectory(dirPath) {
  try {
    const stats = await fs.stat(dirPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

// Get project tree
function getProjectTree(maxDepth = 3) {
  try {
    return execSync(`tree -L ${maxDepth} ${PROJECT_ROOT} --noreport`, { encoding: 'utf8' });
  } catch (error) {
    try {
      return execSync(`find ${PROJECT_ROOT} -maxdepth ${maxDepth} -type d | sort`, { encoding: 'utf8' });
    } catch (error) {
      return "Could not generate project tree. Install 'tree' command for better results.";
    }
  }
}

// Count template and generated files
async function countFiles() {
  let templateCount = 0;
  let generatedCount = 0;

  try {
    if (await fileExists(TEMPLATES_DIR)) {
      const templateFiles = await fs.readdir(TEMPLATES_DIR);
      templateCount = templateFiles.filter(file => file.endsWith('.json')).length;
    }
    
    if (await fileExists(GENERATED_DIR)) {
      const generatedFiles = await fs.readdir(GENERATED_DIR);
      generatedCount = generatedFiles.filter(file => file.endsWith('.json')).length;
    }
  } catch (error) {
    console.log(`${colors.yellow}⚠️ Could not count template or generated files: ${error.message}${colors.reset}`);
  }

  return { templateCount, generatedCount };
}

// Generate the main README
async function generateMainReadme() {
  console.log(`${colors.blue}Generating main README.md...${colors.reset}`);
  
  // Get project tree
  const projectTree = getProjectTree();
  
  // Count template and generated files
  const { templateCount, generatedCount } = await countFiles();
  
  // Generate README content
  const content = `# Tata AI

🚀 **Tata AI** is an advanced AI-powered framework for distributed computing and intelligent data processing.

## 🌟 Features

- **Distributed Processing**: Scalable architecture for distributed computing
- **Fault Tolerance**: Enhanced fault tolerance mechanisms
- **Self-Balancing**: Adaptive load balancing across nodes
- **Template-Based Configuration**: Easy configuration using templates
- **Secure Communication**: End-to-end encrypted communication between nodes

## 📂 Project Structure

\`\`\`plaintext
${projectTree}
\`\`\`

## 🔧 Configuration System

The Tata AI system uses a template-based configuration system:

- **${templateCount}** template files available
- **${generatedCount}** configuration files generated

Templates use placeholders like \`{{placeholder}}\` that are replaced with values from config files.
Special functions include \`{{generate_random_password()}}\`, \`{{generate_unique_id()}}\`, and \`{{get_current_timestamp()}}\`.

### Generating Configurations

\`\`\`bash
# Generate all configurations
python scripts/setup/template_generator.py --all

# Generate configuration for a specific node
python scripts/setup/template_generator.py --node "Universal.Tata-CORE.JB.5.0"
\`\`\`

## 📚 Documentation

Documentation is automatically generated and maintained across the project.

## ✅ Automated Updates

This README and other documentation files are automatically updated when the project structure changes.

---

*Last updated: ${new Date().toISOString().split('T')[0]}*
`;

  // Write README file
  const readmePath = path.join(PROJECT_ROOT, "README.md");
  await fs.writeFile(readmePath, content);
  
  console.log(`${colors.green}✅ Main README.md generated: ${readmePath}${colors.reset}`);
  return true;
}

// Get subdirectories of a directory
async function getSubdirectories(dirPath) {
  try {
    const items = await fs.readdir(dirPath);
    const subdirs = [];
    
    for (const item of items) {
      if (item.startsWith('.')) continue; // Skip hidden files/directories
      
      const itemPath = path.join(dirPath, item);
      if (await isDirectory(itemPath)) {
        subdirs.push(item);
      }
    }
    
    return subdirs;
  } catch (error) {
    console.error(`${colors.red}Error reading directory ${dirPath}:${colors.reset}`, error.message);
    return [];
  }
}

// Generate README for a directory
async function generateDirectoryReadme(dirPath, relativePath, force = false) {
  const readmePath = path.join(dirPath, 'README.md');
  
  // Skip if README already exists and force is false
  if (await fileExists(readmePath) && !force) {
    console.log(`${colors.yellow}Skipping existing README: ${readmePath}${colors.reset}`);
    return false;
  }
  
  // Get directory info
  const dirInfo = directoryDescriptions[relativePath] || directoryDescriptions['default'];
  const dirName = path.basename(dirPath);
  const title = dirInfo.title || dirName.charAt(0).toUpperCase() + dirName.slice(1);
  
  // Get subdirectories
  const subdirs = await getSubdirectories(dirPath);
  
  // Generate README content
  let content = `# ${dirInfo.emoji} ${title}

## Purpose

${dirInfo.description || `This directory contains components for the ${title} module of the Tata AI platform.`}

## Contents
`;

  // Add file counts
  try {
    const files = await fs.readdir(dirPath);
    const fileTypes = {};
    
    for (const file of files) {
      if (file === 'README.md') continue;
      
      const filePath = path.join(dirPath, file);
      const stats = await fs.stat(filePath);
      
      if (stats.isFile()) {
        const ext = path.extname(file).toLowerCase() || 'no-extension';
        fileTypes[ext] = (fileTypes[ext] || 0) + 1;
      }
    }
    
    if (Object.keys(fileTypes).length > 0) {
      content += "\n### Files\n\n";
      for (const [ext, count] of Object.entries(fileTypes)) {
        const extName = ext === 'no-extension' ? 'No extension' : ext.substring(1).toUpperCase();
        content += `- ${count} ${extName} file(s)\n`;
      }
      content += "\n";
    }
  } catch (error) {
    console.error(`${colors.red}Error counting files in ${dirPath}:${colors.reset}`, error.message);
  }
  
  // Add subdirectories
  if (subdirs.length > 0) {
    content += "\n### Subdirectories\n\n";
    for (const subdir of subdirs) {
      const subdirPath = path.join(relativePath, subdir);
      const subdirInfo = directoryDescriptions[subdirPath] || directoryDescriptions['default'];
      const emoji = subdirInfo.emoji || '📁';
      const description = subdirInfo.description || `Components for the ${subdir} module.`;
      
      content += `- ${emoji} **[${subdir}](./${subdir})**: ${description}\n`;
    }
    content += "\n";
  }
  
  // Add special sections based on directory type
  if (relativePath === 'configs/templates') {
    content += `
## Template System

The template system uses JSON files with placeholders in the format \`{{placeholder}}\` that are replaced with values from configuration files. The system also supports special functions:

- \`{{generate_random_password()}}\` - Generates a random secure password
- \`{{generate_unique_id()}}\` - Generates a unique ID
- \`{{get_current_timestamp()}}\` - Gets the current timestamp
- \`{{get_current_date()}}\` - Gets the current date

## Usage

Templates are used by the \`template_generator.py\` script to generate node and cluster configurations.
`;
  } else if (relativePath === 'configs/generated') {
    content += `
## Generated Configurations

These configuration files are automatically generated from templates and should not be edited directly. To update these files, modify the templates and configuration files, then run the generator script.

## Regenerating Configurations

To regenerate all configurations:

\`\`\`bash
python scripts/setup/template_generator.py --all
\`\`\`

To regenerate a specific node configuration:

\`\`\`bash
python scripts/setup/template_generator.py --node "Universal.Tata-CORE.JB.5.0"
\`\`\`
`;
  }
  
  // Add metadata
  content += `
## Metadata

- **Type**: ${relativePath.includes('configs') ? 'Configuration' : relativePath.includes('scripts') ? 'Script' : 'Component'}
- **Last Updated**: ${new Date().toISOString().split('T')[0]}
- **Status**: Active
`;

  // Write README file
  try {
    await fs.writeFile(readmePath, content);
    console.log(`${colors.green}✅ ${force ? 'Updated' : 'Created'} README: ${readmePath}${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Error updating README for ${dirPath}: ${error.message}${colors.reset}`);
    return false;
  }
}

// Process a directory and its subdirectories recursively
async function processDirectory(dirPath, relativePath = '', depth = 0, maxDepth = 3, force = false) {
  if (depth > maxDepth) return;
  
  // Skip node_modules, .git, etc.
  if (path.basename(dirPath).startsWith('.') || 
      path.basename(dirPath) === 'node_modules' ||
      path.basename(dirPath) === 'venv') {
    return;
  }
  
  // Generate README for this directory
  await generateDirectoryReadme(dirPath, relativePath, force);
  
  // Process subdirectories
  const subdirs = await getSubdirectories(dirPath);
  
  for (const subdir of subdirs) {
    const subdirPath = path.join(dirPath, subdir);
    const subdirRelativePath = relativePath ? path.join(relativePath, subdir) : subdir;
    
    await processDirectory(subdirPath, subdirRelativePath, depth + 1, maxDepth, force);
  }
}

// Commit changes to Git
async function commitChanges() {
  try {
    // Check if in a Git repository
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    
    // Add and commit changes
    console.log(`${colors.blue}Committing changes to Git...${colors.reset}`);
    execSync('git add . && git commit -m "Auto-update documentation"', { stdio: 'inherit' });
    
    // Try to push changes
    try {
      execSync('git push origin main', { stdio: 'inherit' });
      console.log(`${colors.green}✅ Changes pushed to GitHub.${colors.reset}`);
    } catch (error) {
      console.log(`${colors.yellow}⚠️ Could not push to GitHub. Changes are committed locally.${colors.reset}`);
    }
    
    return true;
  } catch (error) {
    console.log(`${colors.yellow}⚠️ Git commit failed. Either this is not a Git repository or the remote is missing.${colors.reset}`);
    return false;
  }
}

// Main function
async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const noGit = args.includes('--no-git');
  const maxDepth = args.find(arg => arg.startsWith('--depth='))
    ? parseInt(args.find(arg => arg.startsWith('--depth=')).split('=')[1])
    : 3;
  
  console.log(`${colors.magenta}=== Tata AI Documentation Generator ===${colors.reset}`);
  
  // Generate main README
  await generateMainReadme();
  
  // Process all directories
  console.log(`${colors.blue}Generating directory READMEs (max depth: ${maxDepth})...${colors.reset}`);
  await processDirectory(PROJECT_ROOT, '', 0, maxDepth, force);
  
  // Commit changes if not disabled
  if (!noGit) {
    await commitChanges();
  }
  
  console.log(`${colors.magenta}Documentation generation complete!${colors.reset}`);
}

// Run the script
main().catch(error => {
  console.error(`${colors.red}Error generating documentation:${colors.reset}`, error);
  process.exit(1);
});
