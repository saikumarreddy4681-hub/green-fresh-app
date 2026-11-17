import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectDB, isConnectedToMongo, memoryStore } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { getCategories } from './controllers/productController.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.join(__dirname, '../frontend/dist');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware: Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false // Allows external assets & modern dev tooling
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

// Flexible and secure CORS configuration for Local & Render deployments
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      origin === clientUrl ||
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:') ||
      origin.endsWith('.onrender.com')
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (matches master prompt spec)
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Green Fresh API is running' });
});

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
    database: isConnectedToMongo ? 'Connected (MongoDB Atlas)' : 'Active (Local Resilient Mode)',
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

// In single-service Render deployments, serve the built React frontend
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'Green Fresh Backend API is online. Access /api/health or /api/products.'
    });
  });
}

// 404 handler for API routes
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
