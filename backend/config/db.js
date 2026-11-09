import mongoose from 'mongoose';
import { productsData, categoriesData } from '../seedData.js';
import bcrypt from 'bcryptjs';

export let isConnectedToMongo = false;

// In-memory resilient storage if MongoDB is offline / connecting
export const memoryStore = {
  users: [
    {
      _id: 'user-admin-01',
      name: 'Green Fresh Admin',
      email: 'admin@greenfresh.com',
      password: '', // will be hashed during init
      role: 'admin',
      phone: '+91 98765 43210',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'user-admin-02',
      name: 'Sai Kumar Reddy (Admin)',
      email: 'saikumarreddy4681@gmail.com',
      password: '', // will be hashed during init
      role: 'admin',
      phone: '+91 98765 00000',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'user-cust-01',
      name: 'Aarav Sharma',
      email: 'customer@greenfresh.com',
      password: '', // will be hashed during init
      role: 'customer',
      phone: '+91 98123 45678',
      createdAt: new Date().toISOString()
    }
  ],
  products: [...productsData.map(p => ({ ...p, _id: p.id }))],
  categories: [...categoriesData.map(c => ({ ...c, _id: c.id }))],
  orders: [
    {
      _id: 'ord-1001',
      orderNumber: 'GF-98234',
      user: 'user-cust-01',
      customer: {
        name: 'Aarav Sharma',
        email: 'customer@greenfresh.com',
        phone: '+91 98123 45678'
      },
      shippingAddress: {
        street: '42 Orchid Residency, MG Road',
        apartment: 'Tower B, Flat 402',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560001',
        country: 'India'
      },
      deliverySlot: 'Express Delivery (Within 45 mins)',
      orderItems: [
        {
          productId: 'gf-fruit-01',
          name: 'Apples',
          image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
          price: 140,
          unit: '1 kg',
          quantity: 2,
          total: 280
        },
        {
          productId: 'gf-dairy-01',
          name: 'Fresh Cow Milk',
          image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
          price: 58,
          unit: '1 L Bottle',
          quantity: 2,
          total: 116
        }
      ],
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      paymentDetails: {
        transactionId: 'UPI-TXN-874298124',
        upiId: 'aarav@okaxis'
      },
      subtotal: 396,
      deliveryFee: 0,
      discount: 36,
      totalAmount: 360,
      orderStatus: 'Shipped',
      statusTimeline: [
        { status: 'Placed', timestamp: new Date(Date.now() - 3600000 * 3), description: 'Order received and confirmed.' },
        { status: 'Packed', timestamp: new Date(Date.now() - 3600000 * 2), description: 'Hand-picked from Green Valley Farms & packed.' },
        { status: 'Shipped', timestamp: new Date(Date.now() - 3600000 * 1), description: 'In temperature-controlled cold chain transit.' }
      ],
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
    }
  ]
};

// Initialize hashed passwords for default memory store accounts
const hash = await bcrypt.hash('admin123', 10);
const userHash = await bcrypt.hash('user123', 10);
memoryStore.users[0].password = hash;
memoryStore.users[1].password = hash;
memoryStore.users[2].password = userHash;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('⚡ No MONGODB_URI in .env. Serving sample data from fast, resilient in-memory storage.');
    isConnectedToMongo = false;
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    isConnectedToMongo = true;
    console.log(`🌿 MongoDB Connected: ${conn.connection.host}`);
    await autoSeedMongo();
  } catch (error) {
    console.warn(`⚠️ MongoDB connection note: ${error.message}`);
    console.log(`⚡ Green Fresh App initialized using resilient in-memory storage (${memoryStore.products.length} products loaded across 3 categories).`);
    isConnectedToMongo = false;
  }
};

export async function autoSeedMongo() {
  try {
    const Product = mongoose.models.Product;
    const Category = mongoose.models.Category;
    const User = mongoose.models.User;
    
    if (Product && Category && User) {
      // 1. Sync the 3 categories and remove obsolete categories
      const validCategorySlugs = categoriesData.map(c => c.slug);
      await Category.deleteMany({ slug: { $nin: validCategorySlugs } });
      for (const cat of categoriesData) {
        await Category.findOneAndUpdate(
          { slug: cat.slug },
          { $set: cat },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
      const cCount = await Category.countDocuments();
      console.log(`📦 MongoDB contains ${cCount} categories synced.`);

      // 2. Sync the 60 products and remove obsolete non-grocery products
      const validProductNames = productsData.map(p => p.name);
      await Product.deleteMany({ name: { $nin: validProductNames } });
      for (const prod of productsData) {
        await Product.findOneAndUpdate(
          { name: prod.name },
          { $set: prod },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
      const pCount = await Product.countDocuments();
      console.log(`📦 MongoDB contains ${pCount} grocery products synced.`);

      // 3. Ensure admin and demo users exist
      const adminAccounts = [
        {
          name: 'Green Fresh Admin',
          email: 'admin@greenfresh.com',
          password: hash,
          role: 'admin',
          phone: '+91 98765 43210'
        },
        {
          name: 'Sai Kumar Reddy (Admin)',
          email: 'saikumarreddy4681@gmail.com',
          password: hash,
          role: 'admin',
          phone: '+91 98765 00000'
        },
        {
          name: 'Aarav Sharma',
          email: 'customer@greenfresh.com',
          password: userHash,
          role: 'customer',
          phone: '+91 98123 45678'
        }
      ];

      for (const acc of adminAccounts) {
        await User.findOneAndUpdate(
          { email: acc.email.toLowerCase() },
          { $set: acc },
          { upsert: true, new: true }
        );
      }
      const uCount = await User.countDocuments();
      console.log(`📦 MongoDB verified with ${uCount} user accounts.`);
    }
  } catch (err) {
    console.error('Error during autoSeedMongo:', err.message);
  }
}
