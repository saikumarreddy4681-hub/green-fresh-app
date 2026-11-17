// Updated DB connection with proper error handling, retry logic, and safe seeding.
import mongoose from 'mongoose';
import { productsData, categoriesData } from '../seedData.js';
import bcrypt from 'bcryptjs';

export let isConnectedToMongo = false;

// In‑memory fallback (used only when `USE_IN_MEMORY=true`).
export const memoryStore = {
  users: [
    {
      _id: 'user-admin-01',
      name: 'Green Fresh Admin',
      email: 'admin@greenfresh.com',
      password: '', // will be hashed at init
      role: 'admin',
      phone: '+91 98765 43210',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'user-admin-02',
      name: 'Sai Kumar Reddy (Admin)',
      email: 'saikumarreddy4681@gmail.com',
      password: '', // will be hashed at init
      role: 'admin',
      phone: '+91 98765 00000',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'user-cust-01',
      name: 'Aarav Sharma',
      email: 'customer@greenfresh.com',
      password: '', // will be hashed at init
      role: 'customer',
      phone: '+91 98123 45678',
      createdAt: new Date().toISOString()
    }
  ],
  products: [...productsData.map(p => ({ ...p, _id: p.id }))],
  categories: [...categoriesData.map(c => ({ ...c, _id: c.id }))],
  orders: [] // start empty – real orders live in MongoDB
};

// Hash default passwords for the in‑memory accounts (development only).
const devHash = await bcrypt.hash('admin123', 10);
const devUserHash = await bcrypt.hash('user123', 10);
memoryStore.users[0].password = devHash;
memoryStore.users[1].password = devHash;
memoryStore.users[2].password = devUserHash;

/** Connect to MongoDB.
 *  Attempts connection with retry; if unreachable, falls back to memoryStore without crashing.
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️ MONGODB_URI is not set. Running in resilient local mode.');
    return;
  }

  const maxAttempts = 2;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 4000 // 4s timeout
      });
      isConnectedToMongo = true;
      console.log(`🌿 MongoDB Connected: ${conn.connection.host}`);
      await autoSeedMongo();
      return;
    } catch (err) {
      console.warn(`⚠️ MongoDB connection attempt ${attempt}/${maxAttempts} failed: ${err.message}`);
      if (attempt < maxAttempts) {
        console.log(`⏳ Retrying in 2s...`);
        await new Promise(res => setTimeout(res, 2000));
      } else {
        isConnectedToMongo = false;
        console.error('❌ Could not connect to MongoDB with provided MONGODB_URI.');
        console.warn('👉 For MongoDB Atlas, set your Atlas connection string in backend/.env:');
        console.warn('   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/green_fresh_app?retryWrites=true&w=majority');
        console.warn('⚡ Active in local resilient mode so the server and APIs remain responsive.');
      }
    }
  }
};

/** Seed / upsert the required collections.
 *  DOES NOT delete any existing documents – only ensures the seed data exists.
 */
export async function autoSeedMongo() {
  try {
    const Product = mongoose.models.Product;
    const Category = mongoose.models.Category;
    const User = mongoose.models.User;

    if (!Product || !Category || !User) {
      console.warn('⚠️ Models not loaded – skipping seeding.');
      return;
    }

    // Categories – upsert only.
    for (const cat of categoriesData) {
      await Category.findOneAndUpdate({ slug: cat.slug }, { $set: cat }, { upsert: true, new: true });
    }
    console.log(`📦 ${await Category.countDocuments()} categories in DB.`);

    // Products – upsert only (match by name).
    for (const prod of productsData) {
      await Product.findOneAndUpdate({ name: prod.name }, { $set: prod }, { upsert: true, new: true });
    }
    console.log(`📦 ${await Product.countDocuments()} products in DB.`);

    // Admin / demo users – create only if they don't exist.
    const adminPasswordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
    const userPasswordHash = await bcrypt.hash(process.env.USER_PASSWORD || 'user123', 10);
    const defaultAccounts = [
      {
        name: 'Green Fresh Admin',
        email: 'admin@greenfresh.com',
        password: adminPasswordHash,
        role: 'admin',
        phone: '+91 98765 43210'
      },
      {
        name: 'Sai Kumar Reddy (Admin)',
        email: 'saikumarreddy4681@gmail.com',
        password: adminPasswordHash,
        role: 'admin',
        phone: '+91 98765 00000'
      },
      {
        name: 'Aarav Sharma',
        email: 'customer@greenfresh.com',
        password: userPasswordHash,
        role: 'customer',
        phone: '+91 98123 45678'
      }
    ];

    for (const acc of defaultAccounts) {
      await User.findOneAndUpdate(
        { email: acc.email.toLowerCase() },
        { $setOnInsert: acc }, // only insert if missing
        { upsert: true, new: true }
      );
    }
    console.log(`📦 ${await User.countDocuments()} user accounts in DB.`);
  } catch (e) {
    console.error('Error during autoSeedMongo:', e.message);
  }
}
