const express = require('express');
const app = express();
const PORT = process.env.PORT || 8005;

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// API routes
app.get('/api/status', (req, res) => {
  res.json({
    service: 'tata-moto',
    status: 'active',
    uptime: process.uptime(),
  });
});

app.listen(PORT, () => {
  console.log(`Tata-moto service running on port ${PORT}`);
});
