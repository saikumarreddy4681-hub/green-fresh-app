import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { isConnectedToMongo, memoryStore } from '../config/db.js';

export const getProducts = async (req, res) => {
  try {
    const { category, search, sort, isOrganic, isDailyDeal, isBestseller, isFeatured, brand, subcategory, minPrice, maxPrice } = req.query;

    if (isConnectedToMongo) {
      let filter = {};

      if (category && category !== 'all') {
        const catNormalized = category.replace(/-/g, ' ');
        filter.$or = [
          { category: new RegExp(catNormalized, 'i') },
          { categorySlug: category.toLowerCase() }
        ];
      }

      if (subcategory && subcategory !== 'all') {
        filter.subcategory = new RegExp(subcategory.replace(/-/g, ' '), 'i');
      }

      if (brand && brand !== 'all') {
        filter.brand = new RegExp(brand, 'i');
      }

      if (search) {
        filter.$or = [
          { name: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') },
          { brand: new RegExp(search, 'i') },
          { subcategory: new RegExp(search, 'i') },
          { farmOrigin: new RegExp(search, 'i') }
        ];
      }

      if (isOrganic === 'true') filter.isOrganic = true;
      if (isDailyDeal === 'true') filter.isDailyDeal = true;
      if (isBestseller === 'true') filter.isBestseller = true;
      if (isFeatured === 'true') filter.isFeatured = true;

      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }

      let query = Product.find(filter);

      if (sort === 'price-low') query = query.sort({ discountPrice: 1, price: 1 });
      else if (sort === 'price-high') query = query.sort({ discountPrice: -1, price: -1 });
      else if (sort === 'rating') query = query.sort({ rating: -1 });
      else if (sort === 'freshness') query = query.sort({ freshnessScore: -1 });
      else query = query.sort({ createdAt: -1 });

      const products = await query.exec();
      return res.json({ success: true, count: products.length, products });
    } else {
      let results = [...memoryStore.products];

      if (category && category !== 'all') {
        const catLow = category.toLowerCase().replace(/-/g, ' ');
        const slugLow = category.toLowerCase();
        results = results.filter(p => 
          p.category.toLowerCase().includes(catLow) || 
          (p.categorySlug && p.categorySlug.toLowerCase() === slugLow) ||
          (p.categorySlug && p.categorySlug.toLowerCase().includes(catLow))
        );
      }

      if (subcategory && subcategory !== 'all') {
        const subLow = subcategory.toLowerCase().replace(/-/g, ' ');
        results = results.filter(p => p.subcategory && p.subcategory.toLowerCase().includes(subLow));
      }

      if (brand && brand !== 'all') {
        const brandLow = brand.toLowerCase();
        results = results.filter(p => p.brand && p.brand.toLowerCase().includes(brandLow));
      }

      if (search) {
        const s = search.toLowerCase();
        results = results.filter(p => 
          p.name.toLowerCase().includes(s) || 
          p.description.toLowerCase().includes(s) ||
          (p.brand && p.brand.toLowerCase().includes(s)) ||
          (p.subcategory && p.subcategory.toLowerCase().includes(s)) ||
          (p.farmOrigin && p.farmOrigin.toLowerCase().includes(s))
        );
      }

      if (isOrganic === 'true') results = results.filter(p => p.isOrganic);
      if (isDailyDeal === 'true') results = results.filter(p => p.isDailyDeal);
      if (isBestseller === 'true') results = results.filter(p => p.isBestseller);
      if (isFeatured === 'true') results = results.filter(p => p.isFeatured || p.isBestseller || p.isDailyDeal);

      if (minPrice) results = results.filter(p => (p.discountPrice || p.price) >= Number(minPrice));
      if (maxPrice) results = results.filter(p => (p.discountPrice || p.price) <= Number(maxPrice));

      if (sort === 'price-low') {
        results.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
      } else if (sort === 'price-high') {
        results.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
      } else if (sort === 'rating') {
        results.sort((a, b) => b.rating - a.rating);
      } else if (sort === 'freshness') {
        results.sort((a, b) => b.freshnessScore - a.freshnessScore);
      }

      return res.json({ success: true, count: results.length, products: results });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isConnectedToMongo) {
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
      return res.json({ success: true, product });
    } else {
      const product = memoryStore.products.find(p => p.id === id || p._id === id);
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
      return res.json({ success: true, product });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, category, price, discountPrice, unit, image, description, stock, farmOrigin, freshnessScore, isOrganic, isDailyDeal, isBestseller, isFeatured, isAvailable, brand, subcategory } = req.body;

    if (!name || !price || !category || !image) {
      return res.status(400).json({ success: false, message: 'Name, price, category, and image are required.' });
    }

    const newProdData = {
      name,
      category,
      categorySlug: category.toLowerCase().replace(/\s+/g, '-'),
      subcategory: subcategory || 'General',
      brand: brand || 'Green Fresh',
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : Number(price),
      unit: unit || '500g',
      image,
      description: description || 'Fresh wholesome produce hand-picked for quality.',
      stock: stock ? Number(stock) : 50,
      rating: 5.0,
      reviewsCount: 1,
      farmOrigin: farmOrigin || 'Green Fresh Certified Partner Farm',
      freshnessScore: freshnessScore ? Number(freshnessScore) : 98,
      harvestDate: 'Harvested Today',
      isOrganic: isOrganic !== undefined ? Boolean(isOrganic) : true,
      isDailyDeal: Boolean(isDailyDeal),
      isBestseller: Boolean(isBestseller),
      isFeatured: Boolean(isFeatured),
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true
    };

    if (isConnectedToMongo) {
      const product = await Product.create(newProdData);
      return res.status(201).json({ success: true, message: 'Product created successfully', product });
    } else {
      const product = {
        ...newProdData,
        _id: 'gf-new-' + Date.now(),
        id: 'gf-new-' + Date.now(),
        createdAt: new Date().toISOString()
      };
      memoryStore.products.unshift(product);
      return res.status(201).json({ success: true, message: 'Product created successfully', product });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (isConnectedToMongo) {
      const product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
      return res.json({ success: true, message: 'Product updated successfully', product });
    } else {
      const index = memoryStore.products.findIndex(p => p.id === id || p._id === id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Product not found' });

      memoryStore.products[index] = {
        ...memoryStore.products[index],
        ...req.body
      };
      return res.json({ success: true, message: 'Product updated successfully', product: memoryStore.products[index] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (isConnectedToMongo) {
      const product = await Product.findByIdAndDelete(id);
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
      return res.json({ success: true, message: 'Product deleted successfully' });
    } else {
      const index = memoryStore.products.findIndex(p => p.id === id || p._id === id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Product not found' });

      memoryStore.products.splice(index, 1);
      return res.json({ success: true, message: 'Product deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addProductReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, userName } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and review comment are required.' });
    }

    const reviewObj = {
      userId: req.user ? (req.user._id || req.user.id) : 'guest-user',
      userName: userName || (req.user ? req.user.name : 'Verified Customer'),
      rating: Number(rating),
      comment,
      createdAt: new Date()
    };

    if (isConnectedToMongo) {
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

      product.reviews.push(reviewObj);
      product.reviewsCount = product.reviews.length;
      const totalScore = product.reviews.reduce((acc, r) => acc + r.rating, 0);
      product.rating = Number((totalScore / product.reviews.length).toFixed(1));

      await product.save();
      return res.json({ success: true, message: 'Review added successfully', product });
    } else {
      const prod = memoryStore.products.find(p => p.id === id || p._id === id);
      if (!prod) return res.status(404).json({ success: false, message: 'Product not found' });

      if (!prod.reviews) prod.reviews = [];
      prod.reviews.unshift(reviewObj);
      prod.reviewsCount = (prod.reviewsCount || 0) + 1;
      return res.json({ success: true, message: 'Review added successfully', product: prod });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    if (isConnectedToMongo) {
      const Category = (await import('../models/Category.js')).default;
      const categories = await Category.find({});
      return res.json({ success: true, count: categories.length, categories });
    } else {
      return res.json({ success: true, count: memoryStore.categories.length, categories: memoryStore.categories });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

