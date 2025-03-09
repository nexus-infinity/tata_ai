#!/usr/bin/env node

const fs = require("fs").promises
const path = require("path")
const http = require("http")
const https = require("https")
const { exec } = require("child_process")
const os = require("os")

// Configuration
const PROJECT_ROOT = process.env.PROJECT_ROOT || path.resolve(__dirname, "..")
const FRONTEND_DIR = process.env.FRONTEND_DIR || path.join(PROJECT_ROOT, "frontend/tata-ai-dashboard")
const CONFIG_PATH = path.join(PROJECT_ROOT, "configs/monitor_config.json")
const LOG_DIR = path.join(PROJECT_ROOT, "logs")
const LOG_FILE = path.join(LOG_DIR, `system_monitor_${new Date().toISOString().split("T")[0]}.log`)

// Default configuration
const DEFAULT_CONFIG = {
  services: [
    {
      name: "Tata Core API",
      url: "http://localhost:8000/api/health",
      type: "http",
      expectedStatus: 200,
      expectedResponse: { status: "healthy" },
    },
    {
      name: "Tata Flow API",
      url: "http://localhost:8001/api/health",
      type: "http",
      expectedStatus: 200,
      expectedResponse: { status: "healthy" },
    },
    {
      name: "Tata Memex API",
      url: "http://localhost:8002/api/health",
      type: "http",
      expectedStatus: 200,
      expectedResponse: { status: "healthy" },
    },
    {
      name: "Tata ZKP API",
      url: "http://localhost:8003/api/health",
      type: "http",
      expectedStatus: 200,
      expectedResponse: { status: "healthy" },
    },
    {
      name: "Frontend Dashboard",
      url: "http://localhost:3000",
      type: "http",
      expectedStatus: 200,
    },
  ],
  docker: {
    enabled: true,
    containers: ["tata-core", "tata-flow", "tata-memex", "tata-zkp", "mongodb", "postgres"],
  },
  database: {
    mongodb: {
      enabled: true,
      connectionString: "mongodb://localhost:27017",
      database: "tata_ai",
    },
    postgres: {
      enabled: true,
      connectionString: "postgresql://postgres:postgres@localhost:5432/tata_ai",
    },
  },
  resources: {
    checkCpu: true,
    checkMemory: true,
    checkDisk: true,
    cpuThreshold: 80, // percentage
    memoryThreshold: 80, // percentage
    diskThreshold: 80, // percentage
  },
  alerts: {
    enabled: true,
    logToFile: true,
    logToConsole: true,
    sendEmail: false,
    emailConfig: {
      from: "monitor@tata-ai.com",
      to: "admin@tata-ai.com",
      smtpServer: "smtp.example.com",
      smtpPort: 587,
      username: "monitor@tata-ai.com",
      password: "your-password",
    },
  },
  checkInterval: 300000, // 5 minutes in milliseconds
}

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

// Utility functions
async function fileExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function ensureDirectoryExists(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true })
    return true
  } catch (error) {
    console.error(`${colors.red}Error creating directory ${dirPath}:${colors.reset}`, error.message)
    return false
  }
}

async function loadConfig() {
  try {
    if (await fileExists(CONFIG_PATH)) {
      const configData = await fs.readFile(CONFIG_PATH, "utf8")
      const config = JSON.parse(configData)
      console.log(`${colors.green}✓ Loaded configuration from ${CONFIG_PATH}${colors.reset}`)
      return { ...DEFAULT_CONFIG, ...config }
    } else {
      console.log(`${colors.yellow}⚠ Configuration file not found, creating default at ${CONFIG_PATH}${colors.reset}`)
      await ensureDirectoryExists(path.dirname(CONFIG_PATH))
      await fs.writeFile(CONFIG_PATH, JSON.stringify(DEFAULT_CONFIG, null, 2))
      return DEFAULT_CONFIG
    }
  } catch (error) {
    console.error(`${colors.red}Error loading configuration:${colors.reset}`, error.message)
    return DEFAULT_CONFIG
  }
}

async function logMessage(message, level = "INFO") {
  const timestamp = new Date().toISOString()
  const logMessage = `[${timestamp}] [${level}] ${message}`

  // Log to console
  const consoleColor =
    level === "ERROR"
      ? colors.red
      : level === "WARNING"
        ? colors.yellow
        : level === "SUCCESS"
          ? colors.green
          : colors.white

  console.log(`${consoleColor}${logMessage}${colors.reset}`)

  // Log to file
  try {
    await ensureDirectoryExists(LOG_DIR)
    await fs.appendFile(LOG_FILE, logMessage + "\n")
  } catch (error) {
    console.error(`${colors.red}Error writing to log file:${colors.reset}`, error.message)
  }

  return logMessage
}

// Monitoring functions
function checkHttpService(service) {
  return new Promise((resolve) => {
    const { url, expectedStatus, expectedResponse } = service
    const protocol = url.startsWith("https") ? https : http

    const req = protocol.get(url, (res) => {
      let data = ""

      res.on("data", (chunk) => {
        data += chunk
      })

      res.on("end", () => {
        const statusOk = res.statusCode === expectedStatus
        let responseOk = true

        if (expectedResponse) {
          try {
            const responseData = JSON.parse(data)
            responseOk = Object.entries(expectedResponse).every(([key, value]) => responseData[key] === value)
          } catch (error) {
            responseOk = false
          }
        }

        resolve({
          success: statusOk && responseOk,
          statusCode: res.statusCode,
          data: data.substring(0, 200), // Limit response data length
        })
      })
    })

    req.on("error", (error) => {
      resolve({
        success: false,
        error: error.message,
      })
    })

    req.setTimeout(10000, () => {
      req.abort()
      resolve({
        success: false,
        error: "Request timed out",
      })
    })
  })
}

function checkDockerContainers(containers) {
  return new Promise((resolve) => {
    exec('docker ps --format "{{.Names}},{{.Status}}"', (error, stdout, stderr) => {
      if (error) {
        resolve({
          success: false,
          error: error.message,
        })
        return
      }

      const containerStatus = {}
      const runningContainers = stdout
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map((line) => {
          const [name, status] = line.split(",")
          return { name, status, isRunning: status.includes("Up") }
        })

      for (const container of containers) {
        const found = runningContainers.find((c) => c.name === container || c.name.includes(container))
        containerStatus[container] = found
          ? { running: found.isRunning, status: found.status }
          : { running: false, status: "Not found" }
      }

      resolve({
        success: containers.every((container) => containerStatus[container]?.running),
        containerStatus,
      })
    })
  })
}

function checkSystemResources() {
  return new Promise((resolve) => {
    try {
      // CPU usage (average load)
      const cpuCount = os.cpus().length
      const loadAvg = os.loadavg()[0] // 1 minute load average
      const cpuUsagePercent = (loadAvg / cpuCount) * 100

      // Memory usage
      const totalMemory = os.totalmem()
      const freeMemory = os.freemem()
      const usedMemory = totalMemory - freeMemory
      const memoryUsagePercent = (usedMemory / totalMemory) * 100

      // Disk usage (using df command)
      exec("df -h / | tail -1 | awk '{print $5}'", (error, stdout, stderr) => {
        let diskUsagePercent = 0

        if (!error) {
          diskUsagePercent = Number.parseInt(stdout.trim().replace("%", ""))
        }

        resolve({
          success: true,
          cpu: {
            usage: cpuUsagePercent.toFixed(2) + "%",
            cores: cpuCount,
          },
          memory: {
            total: (totalMemory / (1024 * 1024 * 1024)).toFixed(2) + " GB",
            used: (usedMemory / (1024 * 1024 * 1024)).toFixed(2) + " GB",
            usage: memoryUsagePercent.toFixed(2) + "%",
          },
          disk: {
            usage: diskUsagePercent + "%",
          },
        })
      })
    } catch (error) {
      resolve({
        success: false,
        error: error.message,
      })
    }
  })
}

// Main monitoring function
async function monitorSystem(config) {
  const results = {
    timestamp: new Date().toISOString(),
    services: {},
    docker: {},
    resources: {},
    alerts: [],
  }

  // Check services
  for (const service of config.services) {
    await logMessage(`Checking service: ${service.name}`)

    if (service.type === "http") {
      const result = await checkHttpService(service)
      results.services[service.name] = result

      if (result.success) {
        await logMessage(`Service ${service.name} is healthy`, "SUCCESS")
      } else {
        const errorMsg = `Service ${service.name} is unhealthy: ${result.error || `Status code: ${result.statusCode}`}`
        await logMessage(errorMsg, "ERROR")
        results.alerts.push({
          level: "ERROR",
          message: errorMsg,
          timestamp: new Date().toISOString(),
        })
      }
    }
  }

  // Check Docker containers
  if (config.docker.enabled) {
    await logMessage("Checking Docker containers")

    const dockerResult = await checkDockerContainers(config.docker.containers)
    results.docker = dockerResult

    if (dockerResult.success) {
      await logMessage("All Docker containers are running", "SUCCESS")
    } else {
      const stoppedContainers = Object.entries(dockerResult.containerStatus)
        .filter(([_, status]) => !status.running)
        .map(([name]) => name)

      const errorMsg = `Some Docker containers are not running: ${stoppedContainers.join(", ")}`
      await logMessage(errorMsg, "ERROR")
      results.alerts.push({
        level: "ERROR",
        message: errorMsg,
        timestamp: new Date().toISOString(),
      })
    }
  }

  // Check system resources
  if (config.resources.checkCpu || config.resources.checkMemory || config.resources.checkDisk) {
    await logMessage("Checking system resources")

    const resourcesResult = await checkSystemResources()
    results.resources = resourcesResult

    if (resourcesResult.success) {
      // Check CPU threshold
      if (config.resources.checkCpu) {
        const cpuUsage = Number.parseFloat(resourcesResult.cpu.usage)
        if (cpuUsage > config.resources.cpuThreshold) {
          const warningMsg = `High CPU usage: ${resourcesResult.cpu.usage} (threshold: ${config.resources.cpuThreshold}%)`
          await logMessage(warningMsg, "WARNING")
          results.alerts.push({
            level: "WARNING",
            message: warningMsg,
            timestamp: new Date().toISOString(),
          })
        } else {
          await logMessage(`CPU usage is normal: ${resourcesResult.cpu.usage}`, "SUCCESS")
        }
      }

      // Check memory threshold
      if (config.resources.checkMemory) {
        const memoryUsage = Number.parseFloat(resourcesResult.memory.usage)
        if (memoryUsage > config.resources.memoryThreshold) {
          const warningMsg = `High memory usage: ${resourcesResult.memory.usage} (threshold: ${config.resources.memoryThreshold}%)`
          await logMessage(warningMsg, "WARNING")
          results.alerts.push({
            level: "WARNING",
            message: warningMsg,
            timestamp: new Date().toISOString(),
          })
        } else {
          await logMessage(`Memory usage is normal: ${resourcesResult.memory.usage}`, "SUCCESS")
        }
      }

      // Check disk threshold
      if (config.resources.checkDisk) {
        const diskUsage = Number.parseFloat(resourcesResult.disk.usage)
        if (diskUsage > config.resources.diskThreshold) {
          const warningMsg = `High disk usage: ${resourcesResult.disk.usage} (threshold: ${config.resources.diskThreshold}%)`
          await logMessage(warningMsg, "WARNING")
          results.alerts.push({
            level: "WARNING",
            message: warningMsg,
            timestamp: new Date().toISOString(),
          })
        } else {
          await logMessage(`Disk usage is normal: ${resourcesResult.disk.usage}`, "SUCCESS")
        }
      }
    } else {
      const errorMsg = `Error checking system resources: ${resourcesResult.error}`
      await logMessage(errorMsg, "ERROR")
      results.alerts.push({
        level: "ERROR",
        message: errorMsg,
        timestamp: new Date().toISOString(),
      })
    }
  }

  // Save results to file
  const resultsPath = path.join(LOG_DIR, `monitor_results_${new Date().toISOString().replace(/:/g, "-")}.json`)
  await fs.writeFile(resultsPath, JSON.stringify(results, null, 2))
  await logMessage(`Monitoring results saved to ${resultsPath}`)

  return results
}

// Main function
async function main() {
  console.log(`${colors.magenta}=== Tata AI System Monitor ===${colors.reset}`)

  // Load configuration
  const config = await loadConfig()

  // Run once or continuously
  if (process.argv.includes("--daemon")) {
    await logMessage("Starting monitor in daemon mode")

    // Run immediately
    await monitorSystem(config)

    // Then run at intervals
    setInterval(async () => {
      await monitorSystem(config)
    }, config.checkInterval)
  } else {
    await logMessage("Running system monitor once")
    await monitorSystem(config)
    await logMessage("Monitor run complete")
  }
}

// Run the script
if (require.main === module) {
  main().catch(async (error) => {
    await logMessage(`Error running system monitor: ${error.message}`, "ERROR")
    process.exit(1)
  })
}

module.exports = {
  monitorSystem,
  loadConfig,
}

