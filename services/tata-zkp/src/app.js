const express = require('express');
const app = express();
const PORT = process.env.PORT || 8003;

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// API routes
app.get('/api/status', (req, res) => {
  res.json({
    service: 'tata-zkp',
    status: 'active',
    uptime: process.uptime(),
  });
});

app.listen(PORT, () => {
  console.log(`Tata-zkp service running on port ${PORT}`);
});
