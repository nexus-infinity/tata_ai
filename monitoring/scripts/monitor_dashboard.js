#!/usr/bin/env node

const http = require("http")
const fs = require("fs").promises
const path = require("path")
const { monitorSystem, loadConfig } = require("./monitor_system")

// Configuration
const PORT = process.env.MONITOR_PORT || 8080
const PROJECT_ROOT = process.env.PROJECT_ROOT || path.resolve(__dirname, "..")
const LOG_DIR = path.join(PROJECT_ROOT, "logs")

// HTML template
const HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tata AI System Monitor</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1, h2, h3 {
      color: #2c3e50;
    }
    .dashboard {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 20px;
      transition: transform 0.3s ease;
    }
    .card:hover {
      transform: translateY(-5px);
    }
    .card h3 {
      margin-top: 0;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
    .status {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 4px;
      font-weight: bold;
    }
    .status.healthy {
      background-color: #d4edda;
      color: #155724;
    }
    .status.warning {
      background-color: #fff3cd;
      color: #856404;
    }
    .status.error {
      background-color: #f8d7da;
      color: #721c24;
    }
    .alerts {
      margin-top: 20px;
    }
    .alert {
      padding: 10px;
      margin-bottom: 10px;
      border-radius: 4px;
    }
    .alert.error {
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
    }
    .alert.warning {
      background-color: #fff3cd;
      border: 1px solid #ffeeba;
    }
    .alert.info {
      background-color: #d1ecf1;
      border: 1px solid #bee5eb;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    table, th, td {
      border: 1px solid #ddd;
    }
    th, td {
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
    .refresh-button {
      background-color: #4CAF50;
      color: white;
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }
    .refresh-button:hover {
      background-color: #45a049;
    }
    .timestamp {
      color: #666;
      font-style: italic;
      margin-bottom: 20px;
    }
    .resource-meter {
      height: 20px;
      background-color: #e9ecef;
      border-radius: 4px;
      margin-top: 5px;
      overflow: hidden;
    }
    .resource-meter-fill {
      height: 100%;
      background-color: #4CAF50;
      transition: width 0.3s ease;
    }
    .resource-meter-fill.warning {
      background-color: #ffc107;
    }
    .resource-meter-fill.danger {
      background-color: #dc3545;
    }
  </style>
</head>
<body>
  <h1>Tata AI System Monitor</h1>
  <p class="timestamp">Last updated: <span id="timestamp">-</span></p>
  <button class="refresh-button" onclick="refreshData()">Refresh Data</button>
  
  <div class="dashboard" id="dashboard">
    <!-- Dashboard cards will be inserted here -->
  </div>
  
  <div class="alerts" id="alerts">
    <h2>Alerts</h2>
    <!-- Alerts will be inserted here -->
  </div>
  
  <script>
    // Function to refresh data
    async function refreshData() {
      try {
        const response = await fetch('/api/monitor');
        const data = await response.json();
        updateDashboard(data);
      } catch (error) {
        console.error('Error fetching monitoring data:', error);
        alert('Error fetching monitoring data. See console for details.');
      }
    }
    
    // Function to update the dashboard
    function updateDashboard(data) {
      // Update timestamp
      document.getElementById('timestamp').textContent = new Date(data.timestamp).toLocaleString();
      
      // Clear dashboard
      const dashboard = document.getElementById('dashboard');
      dashboard.innerHTML = '';
      
      // Services card
      const servicesCard = document.createElement('div');
      servicesCard.className = 'card';
      servicesCard.innerHTML = '<h3>Services</h3>';
      
      const servicesTable = document.createElement('table');
      servicesTable.innerHTML = '<tr><th>Service</th><th>Status</th></tr>';
      
      for (const [serviceName, serviceData] of Object.entries(data.services)) {
        const row = document.createElement('tr');
        const statusClass = serviceData.success ? 'healthy' : 'error';
        const statusText = serviceData.success ? 'Healthy' : 'Error';
        
        row.innerHTML = \`
          <td>\${serviceName}</td>
          <td><span class="status \${statusClass}">\${statusText}</span></td>
        \`;
        
        servicesTable.appendChild(row);
      }
      
      servicesCard.appendChild(servicesTable);
      dashboard.appendChild(servicesCard);
      
      // Docker card
      if (data.docker && Object.keys(data.docker).length > 0) {
        const dockerCard = document.createElement('div');
        dockerCard.className = 'card';
        dockerCard.innerHTML = '<h3>Docker Containers</h3>';
        
        const dockerTable = document.createElement('table');
        dockerTable.innerHTML = '<tr><th>Container</th><th>Status</th></tr>';
        
        for (const [containerName, containerData] of Object.entries(data.docker.containerStatus || {})) {
          const row = document.createElement('tr');
          const statusClass = containerData.running ? 'healthy' : 'error';
          const statusText = containerData.running ? 'Running' : 'Stopped';
          
          row.innerHTML = \`
            <td>\${containerName}</td>
            <td><span class="status \${statusClass}">\${statusText}</span></td>
          \`;
          
          dockerTable.appendChild(row);
        }
        
        dockerCard.appendChild(dockerTable);
        dashboard.appendChild(dockerCard);
      }
      
      // Resources card
      if (data.resources && Object.keys(data.resources).length > 0) {
        const resourcesCard = document.createElement('div');
        resourcesCard.className = 'card';
        resourcesCard.innerHTML = '<h3>System Resources</h3>';
        
        // CPU
        if (data.resources.cpu) {
          const cpuUsage = parseFloat(data.resources.cpu.usage);
          const cpuClass = cpuUsage > 80 ? 'danger' : cpuUsage > 60 ? 'warning' : '';
          
          resourcesCard.innerHTML += \`
            <div>
              <strong>CPU Usage:</strong> \${data.resources.cpu.usage} (\${data.resources.cpu.cores} cores)
              <div class="resource-meter">
                <div class="resource-meter-fill \${cpuClass}" style="width: \${cpuUsage}%"></div>
              </div>
            </div>
          \`;
        }
        
        // Memory
        if (data.resources.memory) {
          const memoryUsage = parseFloat(data.resources.memory.usage);
          const memoryClass = memoryUsage > 80 ? 'danger' : memoryUsage > 60 ? 'warning' : '';
          
          resourcesCard.innerHTML += \`
            <div>
              <strong>Memory Usage:</strong> \${data.resources.memory.usage} (\${data.resources.memory.used} / \${data.resources.memory.total})
              <div class="resource-meter">
                <div class="resource-meter-fill \${memoryClass}" style="width: \${memoryUsage}%"></div>
              </div>
            </div>
          \`;
        }
        
        // Disk
        if (data.resources.disk) {
          const diskUsage = parseFloat(data.resources.disk.usage);
          const diskClass = diskUsage > 80 ? 'danger' : diskUsage > 60 ? 'warning' : '';
          
          resourcesCard.innerHTML += \`
            <div>
              <strong>Disk Usage:</strong> \${data.resources.disk.usage}
              <div class="resource-meter">
                <div class="resource-meter-fill \${diskClass}" style="width: \${diskUsage}%"></div>
              </div>
            </div>
          \`;
        }
        
        dashboard.appendChild(resourcesCard);
      }
      
      // Alerts
      const alertsContainer = document.getElementById('alerts');
      alertsContainer.innerHTML = '<h2>Alerts</h2>';
      
      if (data.alerts && data.alerts.length > 0) {
        for (const alert of data.alerts) {
          const alertElement = document.createElement('div');
          alertElement.className = \`alert \${alert.level.toLowerCase()}\`;
          alertElement.innerHTML = \`
            <strong>\${alert.level}:</strong> \${alert.message}
            <div><small>\${new Date(alert.timestamp).toLocaleString()}</small></div>
          \`;
          
          alertsContainer.appendChild(alertElement);
        }
      } else {
        alertsContainer.innerHTML += '<p>No alerts at this time.</p>';
      }
    }
    
    // Load data on page load
    document.addEventListener('DOMContentLoaded', refreshData);
    
    // Refresh data every 60 seconds
    setInterval(refreshData, 60000);
  </script>
</body>
</html>
`

// Create HTTP server
const server = http.createServer(async (req, res) => {
  try {
    // API endpoint for monitoring data
    if (req.url === "/api/monitor") {
      const config = await loadConfig()
      const results = await monitorSystem(config)

      res.writeHead(200, { "Content-Type": "application/json" })
      res.end(JSON.stringify(results))
      return
    }

    // Serve HTML dashboard
    if (req.url === "/" || req.url === "/index.html") {
      res.writeHead(200, { "Content-Type": "text/html" })
      res.end(HTML_TEMPLATE)
      return
    }

    // Handle 404
    res.writeHead(404, { "Content-Type": "text/plain" })
    res.end("Not Found")
  } catch (error) {
    console.error("Server error:", error)
    res.writeHead(500, { "Content-Type": "text/plain" })
    res.end("Internal Server Error")
  }
})

// Start server
server.listen(PORT, () => {
  console.log(`Monitor dashboard running at http://localhost:${PORT}`)
})

