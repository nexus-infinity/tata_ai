#!/usr/bin/env node

const fs = require("fs").promises
const path = require("path")
const { exec } = require("child_process")
const os = require("os")

// Configuration
const PROJECT_ROOT = process.env.PROJECT_ROOT || path.resolve(__dirname, "..")
const SCRIPTS_DIR = path.join(PROJECT_ROOT, "scripts")
const MONITOR_SCRIPT = path.join(SCRIPTS_DIR, "monitor_system.js")
const DASHBOARD_SCRIPT = path.join(SCRIPTS_DIR, "monitor_dashboard.js")

// ANSI color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
}

// Utility function to execute shell commands
function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error)
        return
      }
      resolve(stdout.trim())
    })
  })
}

// Function to check if running as root
function isRoot() {
  return process.getuid && process.getuid() === 0
}

// Function to create systemd service file
async function createSystemdService() {
  if (!isRoot()) {
    console.error(`${colors.red}This script must be run as root to create systemd services${colors.reset}`)
    console.log(`${colors.yellow}Try running with: sudo node ${path.basename(__filename)}${colors.reset}`)
    return false
  }

  console.log(`${colors.cyan}Creating systemd service files...${colors.reset}`)

  // Create monitor service file
  const monitorServiceContent = `[Unit]
Description=Tata AI System Monitor
After=network.target

[Service]
ExecStart=/usr/bin/node ${MONITOR_SCRIPT} --daemon
Restart=always
User=root
Environment=NODE_ENV=production
Environment=PROJECT_ROOT=${PROJECT_ROOT}
Environment=FRONTEND_DIR=${path.join(PROJECT_ROOT, "frontend/tata-ai-dashboard")}

[Install]
WantedBy=multi-user.target
`

  // Create dashboard service file
  const dashboardServiceContent = `[Unit]
Description=Tata AI Monitor Dashboard
After=network.target

[Service]
ExecStart=/usr/bin/node ${DASHBOARD_SCRIPT}
Restart=always
User=root
Environment=NODE_ENV=production
Environment=PROJECT_ROOT=${PROJECT_ROOT}
Environment=FRONTEND_DIR=${path.join(PROJECT_ROOT, "frontend/tata-ai-dashboard")}
Environment=MONITOR_PORT=8080

[Install]
WantedBy=multi-user.target
`

  try {
    // Write service files
    await fs.writeFile("/etc/systemd/system/tata-ai-monitor.service", monitorServiceContent)
    await fs.writeFile("/etc/systemd/system/tata-ai-dashboard.service", dashboardServiceContent)

    console.log(`${colors.green}✓ Service files created${colors.reset}`)

    // Reload systemd
    await execCommand("systemctl daemon-reload")
    console.log(`${colors.green}✓ Systemd daemon reloaded${colors.reset}`)

    // Enable and start services
    await execCommand("systemctl enable tata-ai-monitor.service")
    await execCommand("systemctl start tata-ai-monitor.service")
    console.log(`${colors.green}✓ Tata AI Monitor service enabled and started${colors.reset}`)

    await execCommand("systemctl enable tata-ai-dashboard.service")
    await execCommand("systemctl start tata-ai-dashboard.service")
    console.log(`${colors.green}✓ Tata AI Dashboard service enabled and started${colors.reset}`)

    console.log(`${colors.green}✓ Services installed successfully${colors.reset}`)
    console.log(`${colors.cyan}Monitor dashboard available at: http://localhost:8080${colors.reset}`)

    return true
  } catch (error) {
    console.error(`${colors.red}Error creating systemd services:${colors.reset}`, error.message)
    return false
  }
}

// Function to create PM2 configuration
async function createPM2Config() {
  console.log(`${colors.cyan}Creating PM2 configuration...${colors.reset}`)

  const pm2Config = {
    apps: [
      {
        name: "tata-ai-monitor",
        script: MONITOR_SCRIPT,
        args: "--daemon",
        watch: false,
        env: {
          NODE_ENV: "production",
          PROJECT_ROOT: PROJECT_ROOT,
          FRONTEND_DIR: path.join(PROJECT_ROOT, "frontend/tata-ai-dashboard"),
        },
      },
      {
        name: "tata-ai-dashboard",
        script: DASHBOARD_SCRIPT,
        watch: false,
        env: {
          NODE_ENV: "production",
          PROJECT_ROOT: PROJECT_ROOT,
          FRONTEND_DIR: path.join(PROJECT_ROOT, "frontend/tata-ai-dashboard"),
          MONITOR_PORT: 8080,
        },
      },
    ],
  }

  try {
    const pm2ConfigPath = path.join(SCRIPTS_DIR, "monitor-pm2.json")
    await fs.writeFile(pm2ConfigPath, JSON.stringify(pm2Config, null, 2))

    console.log(`${colors.green}✓ PM2 configuration created at ${pm2ConfigPath}${colors.reset}`)
    console.log(`${colors.cyan}To start with PM2, run:${colors.reset}`)
    console.log(`pm2 start ${pm2ConfigPath}`)

    return true
  } catch (error) {
    console.error(`${colors.red}Error creating PM2 configuration:${colors.reset}`, error.message)
    return false
  }
}

// Main function
async function main() {
  console.log(`${colors.magenta}=== Tata AI Monitor Service Installer ===${colors.reset}`)

  // Check if scripts exist
  try {
    await fs.access(MONITOR_SCRIPT)
    await fs.access(DASHBOARD_SCRIPT)
  } catch (error) {
    console.error(`${colors.red}Monitor scripts not found. Make sure they exist at:${colors.reset}`)
    console.error(`${colors.red}- ${MONITOR_SCRIPT}${colors.reset}`)
    console.error(`${colors.red}- ${DASHBOARD_SCRIPT}${colors.reset}`)
    process.exit(1)
  }

  // Make scripts executable
  try {
    await fs.chmod(MONITOR_SCRIPT, 0o755)
    await fs.chmod(DASHBOARD_SCRIPT, 0o755)
    console.log(`${colors.green}✓ Made scripts executable${colors.reset}`)
  } catch (error) {
    console.warn(`${colors.yellow}⚠ Could not make scripts executable:${colors.reset}`, error.message)
  }

  // Determine installation method
  if (process.argv.includes("--systemd")) {
    await createSystemdService()
  } else if (process.argv.includes("--pm2")) {
    await createPM2Config()
  } else {
    console.log(`${colors.cyan}Please specify an installation method:${colors.reset}`)
    console.log(`${colors.cyan}- For systemd: sudo node ${path.basename(__filename)} --systemd${colors.reset}`)
    console.log(`${colors.cyan}- For PM2: node ${path.basename(__filename)} --pm2${colors.reset}`)
  }
}

// Run the script
main().catch((error) => {
  console.error(`${colors.red}Error:${colors.reset}`, error.message)
  process.exit(1)
})

