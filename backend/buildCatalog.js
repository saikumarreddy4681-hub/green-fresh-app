import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { categoriesData, productsData as origProducts } from './seedData.js';
import { expandedCategoriesData, expandedProductsData } from './seedDataExpanded.js';

// 12 definitive categories with icon and HD unsplash banner
const finalCategories = [
  { id: 'fruits', name: 'Fresh Fruits', slug: 'fresh-fruits', icon: '🍎', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80', description: 'Sun-ripened, orchard-fresh fruits packed with natural vitamins.' },
  { id: 'vegetables', name: 'Fresh Vegetables', slug: 'fresh-vegetables', icon: '🥦', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', description: 'Farm-picked crunchy greens and earthy vegetables harvested at dawn.' },
  { id: 'organic', name: 'Organic Products', slug: 'organic-products', icon: '🌿', image: 'https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&w=600&q=80', description: 'Certified 100% organic, zero pesticide natural grains, honey, and pulses.' },
  { id: 'dry-fruits', name: 'Dry Fruits & Nuts', slug: 'dry-fruits-nuts', icon: '🥜', image: 'https://images.unsplash.com/photo-1536591375667-7b6d4e9b5940?auto=format&fit=crop&w=600&q=80', description: 'Premium quality dry fruits, nuts, and seeds for healthy snacking.' },
  { id: 'dairy', name: 'Dairy Products', slug: 'dairy-products', icon: '🥛', image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=600&q=80', description: 'Pure Gir cow A2 milk, cultured curd, butter, and artisanal cottage paneer.' },
  { id: 'breakfast', name: 'Breakfast Essentials', slug: 'breakfast-essentials', icon: '🥣', image: 'https://images.unsplash.com/photo-1517093611494-5de44c6b56b3?auto=format&fit=crop&w=600&q=80', description: 'Oats, cornflakes, muesli, and wholesome morning breakfast essentials.' },
  { id: 'juices', name: 'Fresh Juices', slug: 'fresh-juices', icon: '🍊', image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80', description: 'Cold-pressed raw fruit juices with zero artificial preservatives.' },
  { id: 'beverages', name: 'Beverages', slug: 'beverages', icon: '☕', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80', description: 'Premium teas, coffees, coconut water, and energy drinks.' },
  { id: 'rice-grains', name: 'Rice & Grains', slug: 'rice-grains', icon: '🌾', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', description: 'Aromatic basmati, brown rice, millets, quinoa, and whole grains.' },
  { id: 'pulses', name: 'Pulses & Lentils', slug: 'pulses-lentils', icon: '🫘', image: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=600&q=80', description: 'High-protein lentils, chickpeas, kidney beans, and split peas.' },
  { id: 'snacks', name: 'Snacks & Bakery', slug: 'snacks-bakery', icon: '🍪', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80', description: 'Healthy chips, biscuits, cookies, breads, and baked snacks.' },
  { id: 'household', name: 'Household Essentials', slug: 'household-essentials', icon: '🏠', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=600&q=80', description: 'Dish soaps, detergents, floor cleaners, and home care essentials.' }
];

// Helper to deduce realistic brand and subcategory
function enrichProduct(p) {
  let cat = p.category;
  let slug = p.categorySlug;

  // Remap legacy 'Daily Staples'
  if (cat === 'Daily Staples' || slug === 'daily-staples') {
    if (p.name.includes('Rice') || p.name.includes('Flour')) {
      cat = 'Rice & Grains';
      slug = 'rice-grains';
    } else if (p.name.includes('Dal')) {
      cat = 'Pulses & Lentils';
      slug = 'pulses-lentils';
    } else {
      cat = 'Breakfast Essentials';
      slug = 'breakfast-essentials';
    }
  }

  // Determine Subcategory
  let subcategory = p.subcategory || 'General';
  if (!p.subcategory || p.subcategory === 'General') {
    if (cat === 'Fresh Fruits') {
      if (/apple|pear/i.test(p.name)) subcategory = 'Apples & Pears';
      else if (/orange|lime|lemon/i.test(p.name)) subcategory = 'Citrus Fruits';
      else if (/strawberr|grape|kiwi/i.test(p.name)) subcategory = 'Berries & Exotic';
      else subcategory = 'Seasonal Fruits';
    } else if (cat === 'Fresh Vegetables') {
      if (/spinach|lettuce|cabbage/i.test(p.name)) subcategory = 'Leafy Greens';
      else if (/potato|onion|carrot|beetroot|radish/i.test(p.name)) subcategory = 'Root Vegetables';
      else if (/tomato|capsicum|gourd|okra/i.test(p.name)) subcategory = 'Daily Veggies';
      else subcategory = 'Exotic Veggies';
    } else if (cat === 'Dry Fruits & Nuts') {
      if (/almond|cashew|walnut|pista/i.test(p.name)) subcategory = 'Nuts & Kernels';
      else if (/chia|flax|sunflower|sesame/i.test(p.name)) subcategory = 'Super Seeds';
      else subcategory = 'Dry Fruits';
    } else if (cat === 'Dairy Products') {
      if (/milk|powder/i.test(p.name)) subcategory = 'Milk & Powder';
      else if (/paneer|cheese/i.test(p.name)) subcategory = 'Paneer & Cheese';
      else subcategory = 'Curd & Ghee';
    } else if (cat === 'Breakfast Essentials') {
      if (/oat|flake|muesli/i.test(p.name)) subcategory = 'Cereals & Flakes';
      else if (/poha|rava|dalia|flour/i.test(p.name)) subcategory = 'Traditional Staples';
      else subcategory = 'Spreads & Quick Bites';
    } else if (cat === 'Fresh Juices') {
      subcategory = /coconut|sugarcane/i.test(p.name) ? 'Natural Water' : 'Cold-Pressed Juices';
    } else if (cat === 'Beverages') {
      if (/tea|chai/i.test(p.name)) subcategory = 'Tea & Chai';
      else if (/coffee/i.test(p.name)) subcategory = 'Coffee Blends';
      else subcategory = 'Healthy Drinks';
    } else if (cat === 'Rice & Grains') {
      subcategory = /rice/i.test(p.name) ? 'Rice Varieties' : 'Whole Grains & Flours';
    } else if (cat === 'Pulses & Lentils') {
      subcategory = /dal/i.test(p.name) ? 'Split Lentils' : 'Whole Gram & Beans';
    } else if (cat === 'Snacks & Bakery') {
      if (/biscuit|cookie|rusk/i.test(p.name)) subcategory = 'Biscuits & Cookies';
      else if (/bhujia|namkeen|murukku|chips/i.test(p.name)) subcategory = 'Crispy Namkeen';
      else subcategory = 'Chocolates & Sweets';
    } else if (cat === 'Household Essentials') {
      if (/dish|laundry|cleaner/i.test(p.name)) subcategory = 'Cleaning & Care';
      else subcategory = 'Hygiene & Paper';
    } else if (cat === 'Organic Products') {
      subcategory = 'Certified Organic Staples';
    }
  }

  // Determine Brand
  let brand = p.brand || 'Green Fresh';
  if (!p.brand || p.brand === 'Green Fresh') {
    if (cat === 'Fresh Fruits' || cat === 'Fresh Vegetables') {
      brand = 'Green Fresh Organic';
    } else if (cat === 'Dairy Products') {
      if (/milk/i.test(p.name)) brand = 'Country Delight';
      else if (/paneer|butter|cheese/i.test(p.name)) brand = 'Amul';
      else if (/yogurt/i.test(p.name)) brand = 'Epigamia';
      else brand = 'Gir Cow Organics';
    } else if (cat === 'Dry Fruits & Nuts') {
      brand = 'Happilo';
    } else if (cat === 'Breakfast Essentials') {
      if (/oat/i.test(p.name)) brand = 'Quaker';
      else if (/cornflake/i.test(p.name)) brand = 'Kellogg\'s';
      else if (/noodle/i.test(p.name)) brand = 'Maggi';
      else if (/bread/i.test(p.name)) brand = 'Britannia';
      else if (/honey/i.test(p.name)) brand = 'Dabur';
      else brand = 'Aashirvaad';
    } else if (cat === 'Fresh Juices') {
      brand = 'RAW Pressery';
    } else if (cat === 'Beverages') {
      if (/tea/i.test(p.name)) brand = 'Tata Tea';
      else if (/coffee/i.test(p.name)) brand = 'Nescafe';
      else brand = 'Green Fresh Squeeze';
    } else if (cat === 'Rice & Grains') {
      brand = /basmati/i.test(p.name) ? 'Daawat' : 'Fortune';
    } else if (cat === 'Pulses & Lentils') {
      brand = 'Tata Sampann';
    } else if (cat === 'Snacks & Bakery') {
      if (/bhujia|namkeen|soan/i.test(p.name)) brand = 'Haldiram\'s';
      else if (/biscuit|rusk/i.test(p.name)) brand = 'Britannia';
      else if (/popcorn/i.test(p.name)) brand = 'ACT II';
      else brand = 'Parle';
    } else if (cat === 'Household Essentials') {
      if (/vim/i.test(p.name)) brand = 'Vim';
      else if (/surf/i.test(p.name)) brand = 'Surf Excel';
      else if (/lizol/i.test(p.name)) brand = 'Lizol';
      else if (/harpic/i.test(p.name)) brand = 'Harpic';
      else if (/dettol/i.test(p.name)) brand = 'Dettol';
      else if (/colgate/i.test(p.name)) brand = 'Colgate';
      else brand = 'Godrej';
    } else if (cat === 'Organic Products') {
      brand = 'Organic India';
    }
  }

  return {
    ...p,
    category: cat,
    categorySlug: slug,
    subcategory,
    brand,
    isFeatured: p.isFeatured !== undefined ? p.isFeatured : Boolean(p.isBestseller || p.isDailyDeal),
    isAvailable: p.isAvailable !== undefined ? p.isAvailable : true
  };
}

// Combine all products while deduplicating by ID
const seenIds = new Set();
const allProducts = [];

for (const p of origProducts) {
  if (!seenIds.has(p.id)) {
    seenIds.add(p.id);
    allProducts.push(enrichProduct(p));
  }
}

for (const p of expandedProductsData) {
  if (!seenIds.has(p.id)) {
    seenIds.add(p.id);
    allProducts.push(enrichProduct(p));
  }
}

console.log(`Generated ${allProducts.length} total products across ${finalCategories.length} categories.`);

// Generate the output JS content
const fileContent = `// GREEN FRESH APP - MASTER PRODUCT CATALOG & CATEGORIES
// Total Products: ${allProducts.length}
// Total Categories: ${finalCategories.length}

export const categoriesData = ${JSON.stringify(finalCategories, null, 2)};

export const productsData = ${JSON.stringify(allProducts, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, 'seedData.js'), fileContent, 'utf-8');
console.log('Successfully wrote backend/seedData.js');

// Also update frontend fallbackProducts.js
const frontendFallbackPath = path.join(__dirname, '../frontend/src/data/fallbackProducts.js');
fs.writeFileSync(frontendFallbackPath, fileContent, 'utf-8');
console.log('Successfully synced frontend/src/data/fallbackProducts.js');

