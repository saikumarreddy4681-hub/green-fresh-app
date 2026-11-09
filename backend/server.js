import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB, isConnectedToMongo, memoryStore } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { getCategories } from './controllers/productController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware: Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false // Allows Unsplash external images and modern dev tooling
}));

// Security Middleware: Rate Limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', generalLimiter);

// CORS configuration
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: [
    clientUrl,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174'
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root and Health check endpoints
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Green Fresh Backend API is online. Access /api/health or /api/products.'
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Green Fresh API is running'
  });
});

// Health check endpoint (matches master prompt spec)
app.get('/api/health', async (req, res) => {
  let prodCount = memoryStore.products.length;
  let catCount = memoryStore.categories.length;
  if (isConnectedToMongo) {
    try {
      const Product = (await import('./models/Product.js')).default;
      const Category = (await import('./models/Category.js')).default;
      prodCount = await Product.countDocuments();
      catCount = await Category.countDocuments();
    } catch {}
  }
  res.json({
    success: true,
    message: 'Green Fresh API is running',
    database: isConnectedToMongo ? 'Connected (MongoDB Atlas)' : 'Active (In-Memory Resilient Storage)',
    productsCount: prodCount,
    categoriesCount: catCount,
    timestamp: new Date().toISOString()
  });
});

// Direct Categories endpoint
app.get('/api/categories', getCategories);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start listening on all network interfaces with robust error handling
const server = app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 Green Fresh Server running on http://localhost:${PORT}`);
  await connectDB();
});

// Graceful Port Conflict (EADDRINUSE) & Error Handling
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use by another running process.`);
    console.error(`👉 Tip: Run 'npm run clean-ports' to free up port ${PORT}, or close the existing server process before restarting.\n`);
    process.exit(1);
  } else {
    console.error('Server execution error:', err);
    process.exit(1);
  }
});

// Graceful process shutdown
const handleShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}. Gracefully stopping Green Fresh backend server...`);
  server.close(() => {
    console.log('✅ Server stopped cleanly.');
    process.exit(0);
  });
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

export default app;
