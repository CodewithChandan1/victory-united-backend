const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
let dbConnected = false;

mongoose.connect(process.env.ATLAS_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  retryWrites: true,
  w: 'majority'
})
  .then(() => {
    dbConnected = true;
    console.log('✅ Connected to MongoDB');
    console.log(`📡 Database: ${process.env.MONGODB_URI ? 'Remote Cluster' : 'Local Instance'}`);
  })
  .catch(err => {
    dbConnected = false;
    console.error('❌ MongoDB connection error:', err.message);
    console.error('🔍 Troubleshooting:');
    console.error('   1. Check if MONGODB_URI is correctly set in .env');
    console.error('   2. Verify if your IP is whitelisted in MongoDB Atlas');
    console.error('   3. Ensure you have a stable internet connection');
  });

// Health check endpoint (placed before DB check middleware)
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.json({
    status: 'OK',
    message: 'Victory United API is running',
    database: {
      status: dbStatusMap[dbStatus] || 'unknown',
      connected: dbStatus === 1
    },
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Database connection check middleware
app.use('/api/', (req, res, next) => {
  if (mongoose.connection.readyState !== 1 && req.path !== '/health') {
    return res.status(503).json({
      message: 'Database connection is not ready. If you just started the server, please wait a few seconds.',
      status: 'error',
      dbStatus: mongoose.connection.readyState
    });
  }
  next();
});

// Base API route
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Victory United API' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/players', require('./routes/players'));
app.use('/api/coaches', require('./routes/coaches'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/enquiries', require('./routes/enquiries'));
app.use('/api/upload', require('./routes/upload'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 API available at http://localhost:${PORT}/api`);
});