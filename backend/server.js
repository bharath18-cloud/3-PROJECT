const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Establish database connection
connectDB();

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json()); // Body parser

// Mount API Route Mappings
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/products', require('./src/routes/productRoutes'));
app.use('/api/orders', require('./src/routes/orderRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));
app.use('/api/payment', require('./src/routes/paymentRoutes'));

// Root Status Check
app.get('/status', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Sai Teja Traders API Server online and running.',
    time: new Date(),
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Promise Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
