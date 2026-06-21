const express = require('express');
const cors = require('cors');
require('dotenv').config();
const dbPool = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const aiRoutes = require('./routes/aiRoutes');
const locationRoutes = require('./routes/locationRoutes');
const wasteRoutes = require('./routes/wasteRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/waste', wasteRoutes);

// Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Welcome to Eco-Logic API' });
});

// Test Database Connection Route
app.get('/api/db-status', async (req, res) => {
  try {
    const connection = await dbPool.getConnection();
    connection.release();
    res.json({ status: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ status: 'Database connection failed', error: error.message });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
