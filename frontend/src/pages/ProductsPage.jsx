import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Sparkles, RefreshCcw, Heart, AlertCircle, CheckCircle2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { wishlist } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [isOffline, setIsOffline] = useState(false);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('featured');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(700);
  const [showWishlistOnly, setShowWishlistOnly] = useState(searchParams.get('wishlist') === 'true');

  const categories = [
    { id: 'all', label: 'All Groceries (60)' },
    { id: 'fresh-fruits', label: '🍎 Fresh Fruits (20)' },
    { id: 'fresh-vegetables', label: '🥦 Fresh Vegetables (25)' },
    { id: 'milk-dairy', label: '🥛 Milk & Dairy (15)' }
  ];

  // Sync state if URL query params change
  useEffect(() => {
    const cat = searchParams.get('category');
    const q = searchParams.get('search');
    const wish = searchParams.get('wishlist');
    if (cat) setSelectedCategory(cat);
    if (q !== null) setSearchQuery(q);
    if (wish === 'true') setShowWishlistOnly(true);
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy, organicOnly]);

  const fetchProducts = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const params = {};
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (sortBy !== 'featured') params.sort = sortBy;
      if (organicOnly) params.isOrganic = 'true';

      const res = await api.getProducts(params);
      if (res && res.success && Array.isArray(res.products)) {
        setProducts(res.products);
        setIsOffline(!!res.isOffline);
      } else {
        setFetchError(res?.message || 'Could not load products from backend.');
      }
    } catch (err) {
      console.error('Fetch products error:', err);
      setFetchError('Backend connection error. Please verify the Express backend is running on http://localhost:5000.');
    } finally {
      setLoading(false);
    }
  };

  const subcategories = ['all', ...Array.from(new Set(products.map(p => p.subcategory).filter(Boolean)))];
  const brands = ['all', ...Array.from(new Set(products.map(p => p.brand).filter(Boolean)))];

  // Client side filtering for quick search, brand, subcategory, price slider, and wishlist toggle
  let filtered = products;

  if (selectedSubcategory !== 'all') {
    filtered = filtered.filter(p => p.subcategory === selectedSubcategory);
  }

  if (selectedBrand !== 'all') {
    filtered = filtered.filter(p => p.brand === selectedBrand);
  }

  if (featuredOnly) {
    filtered = filtered.filter(p => p.isFeatured || p.isBestseller || p.isDailyDeal);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  filtered = filtered.filter(p => {
    const price = p.discountPrice || p.price;
    return price <= maxPrice;
  });

  if (showWishlistOnly) {
    const wishIds = new Set(wishlist.map(w => w.id || w._id));
    filtered = filtered.filter(p => wishIds.has(p.id || p._id));
  }

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSelectedBrand('all');
    setSearchQuery('');
    setSortBy('featured');
    setOrganicOnly(false);
    setFeaturedOnly(false);
    setMaxPrice(700);
    setShowWishlistOnly(false);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-700 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-lg shadow-emerald-950/10">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-300">
            FARM-FRESH MARKETPLACE
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-serif">
            Browse Organic Groceries
          </h1>
          <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed">
            100% natural, farm-inspected fruits, vegetables, and dairy essentials harvested daily.
          </p>
        </div>

        {/* Quick Wishlist Toggle Pill */}
        <div className="absolute top-6 right-6">
          <button
            onClick={() => setShowWishlistOnly(!showWishlistOnly)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 backdrop-blur-md cursor-pointer ${
              showWishlistOnly
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${showWishlistOnly ? 'fill-white' : ''}`} />
            Saved Items ({wishlist.length})
          </button>
        </div>
      </div>

      {/* Main Filter & Search Bar */}
      <div className="bg-white rounded-3xl border border-emerald-100 p-5 shadow-xs space-y-4">
        
        {/* Row 1: Search, Sort & Organic Toggle */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search apples, tomatoes, paneer, milk, carrots..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-xs pl-9 pr-8 py-2.5 rounded-2xl focus:bg-white focus:outline-none focus:border-emerald-500 font-medium"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-2.5 rounded-2xl focus:outline-none focus:border-emerald-500"
            >
              <option value="featured">✨ Featured Harvest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>

            {/* Organic Toggle */}
            <button
              onClick={() => setOrganicOnly(!organicOnly)}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                organicOnly
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              100% Organic Only
            </button>

            {/* Reset Filters */}
            <button
              onClick={handleResetFilters}
              title="Reset all filters"
              className="p-2.5 rounded-2xl bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 border border-gray-200 transition"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Row 2: Category Chips (Focused 3 categories) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSelectedSubcategory('all');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Row 3: Secondary Filters: Subcategory, Brand & Price Slider */}
        <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Subcategory dropdown */}
            {subcategories.length > 2 && (
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500 font-semibold text-[11px]">Type:</span>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded-xl"
                >
                  <option value="all">All Types</option>
                  {subcategories.filter(s => s !== 'all').map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Brand dropdown */}
            {brands.length > 2 && (
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500 font-semibold text-[11px]">Brand:</span>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded-xl"
                >
                  <option value="all">All Brands</option>
                  {brands.filter(b => b !== 'all').map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Featured toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer text-gray-700 font-semibold">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(e) => setFeaturedOnly(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Featured Only</span>
            </label>
          </div>

          {/* Price Range Slider */}
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-semibold text-[11px]">Max Price:</span>
            <input
              type="range"
              min="20"
              max="700"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-24 accent-emerald-600 cursor-pointer"
            />
            <span className="font-bold text-emerald-800 text-xs">₹{maxPrice}</span>
          </div>
        </div>
      </div>

      {/* Product Results Header */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>Showing <strong className="text-gray-900">{filtered.length}</strong> fresh grocery items</span>
        {filtered.length < products.length && (
          <button
            onClick={handleResetFilters}
            className="text-emerald-700 font-bold hover:underline"
          >
            Clear applied filters
          </button>
        )}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl h-80 border border-gray-100 animate-pulse p-4 space-y-3">
              <div className="bg-gray-100 rounded-2xl h-40 w-full" />
              <div className="bg-gray-100 h-4 w-3/4 rounded" />
              <div className="bg-gray-100 h-4 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 p-8 space-y-3">
          <p className="text-gray-500 text-sm">No grocery items match your selected filters.</p>
          <button
            onClick={handleResetFilters}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
