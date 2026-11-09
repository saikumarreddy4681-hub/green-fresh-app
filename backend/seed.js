import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Category from './models/Category.js';
import User from './models/User.js';
import { productsData, categoriesData } from './seedData.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedDatabase = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ Error: MONGODB_URI is not set in backend/.env');
    console.log('Please set MONGODB_URI=your_mongodb_connection_string in backend/.env before running seed.');
    process.exit(1);
  }

  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('🌿 Connected to MongoDB successfully.');

    // 1. Clean obsolete categories and upsert the 3 main categories
    const validCategorySlugs = categoriesData.map(c => c.slug);
    const delCat = await Category.deleteMany({ slug: { $nin: validCategorySlugs } });
    if (delCat.deletedCount > 0) {
      console.log(`🧹 Removed ${delCat.deletedCount} non-grocery / obsolete categories.`);
    }

    let categoriesUpserted = 0;
    for (const cat of categoriesData) {
      await Category.findOneAndUpdate(
        { slug: cat.slug },
        { $set: cat },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      categoriesUpserted++;
    }
    const totalCategoriesInDb = await Category.countDocuments();
    console.log(`✅ Upserted ${categoriesUpserted} categories (Total in DB: ${totalCategoriesInDb}).`);

    // 2. Clean obsolete products and upsert the 60 organic grocery products
    const validProductNames = productsData.map(p => p.name);
    const delProd = await Product.deleteMany({ name: { $nin: validProductNames } });
    if (delProd.deletedCount > 0) {
      console.log(`🧹 Removed ${delProd.deletedCount} non-grocery / obsolete products.`);
    }

    let productsUpserted = 0;
    for (const prod of productsData) {
      await Product.findOneAndUpdate(
        { name: prod.name },
        { $set: prod },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      productsUpserted++;
    }
    const totalProductsInDb = await Product.countDocuments();
    console.log(`✅ Upserted ${productsUpserted} grocery products (Total in DB: ${totalProductsInDb}).`);

    // 3. Upsert Admin and Customer Accounts
    const adminPass = await bcrypt.hash('admin123', 10);
    const userPass = await bcrypt.hash('user123', 10);

    const accounts = [
      {
        name: 'Green Fresh Admin',
        email: 'admin@greenfresh.com',
        password: adminPass,
        role: 'admin',
        phone: '+91 98765 43210'
      },
      {
        name: 'Sai Kumar Reddy (Admin)',
        email: 'saikumarreddy4681@gmail.com',
        password: adminPass,
        role: 'admin',
        phone: '+91 98765 00000'
      },
      {
        name: 'Aarav Sharma',
        email: 'customer@greenfresh.com',
        password: userPass,
        role: 'customer',
        phone: '+91 98123 45678'
      }
    ];

    for (const acc of accounts) {
      await User.findOneAndUpdate(
        { email: acc.email.toLowerCase() },
        { $set: acc },
        { upsert: true, new: true }
      );
    }
    console.log('✅ Admin (admin@greenfresh.com, saikumarreddy4681@gmail.com) and Customer accounts verified.');

    console.log(`\n🎉 Database seeding completed! Active products: ${totalProductsInDb}, Active categories: ${totalCategoriesInDb}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed with error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
