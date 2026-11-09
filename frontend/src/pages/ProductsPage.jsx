import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Sparkles, RefreshCcw, Heart, Clock, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { wishlist, selectedAddress } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('featured');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(700);
  const [showWishlistOnly, setShowWishlistOnly] = useState(searchParams.get('wishlist') === 'true');

  const categories = [
    { id: 'all', label: 'All Groceries', count: 55, icon: '🛒' },
    { id: 'fresh-fruits', label: 'Fresh Fruits', count: 20, icon: '🍎' },
    { id: 'fresh-vegetables', label: 'Fresh Vegetables', count: 20, icon: '🥦' },
    { id: 'milk-dairy', label: 'Milk & Dairy', count: 15, icon: '🥛' }
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
      } else {
        setFetchError(res?.message || 'Could not load products.');
      }
    } catch (err) {
      console.error('Fetch products error:', err);
      setFetchError('Backend connection error. Please verify the Express backend is running on http://localhost:5000.');
    } finally {
      setLoading(false);
    }
  };

  // Client side filtering for search & price
  let filtered = products;

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
      (p.brand && p.brand.toLowerCase().includes(q))
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
    setSearchQuery('');
    setSortBy('featured');
    setOrganicOnly(false);
    setMaxPrice(700);
    setShowWishlistOnly(false);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* Search Header Bar (Blinkit Style matching Screenshot 2) */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Title & Results Counter */}
          <div>
            <h1 className="text-base sm:text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
              {searchQuery ? (
                <>
                  <span>Showing results for</span>
                  <span className="text-[#0c831f]">"{searchQuery}"</span>
                </>
              ) : selectedCategory !== 'all' ? (
                <span>
                  {categories.find(c => c.id === selectedCategory)?.label || 'Products'}
                </span>
              ) : (
                <span>All Fresh Produce</span>
              )}
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Showing {filtered.length} {filtered.length === 1 ? 'item' : 'items'} • Delivering to {selectedAddress?.tag || 'Home'} in {selectedAddress?.timeEstimate || '12 mins'}
            </p>
          </div>

          {/* Quick Search & Sort Controls */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Filter results..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs pl-8 pr-7 py-2 rounded-xl focus:bg-white focus:outline-none focus:border-[#0c831f] font-medium"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:border-[#0c831f] shrink-0"
            >
              <option value="featured">✨ Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  if (cat.id === 'all') {
                    searchParams.delete('category');
                  } else {
                    searchParams.set('category', cat.id);
                  }
                  setSearchParams(searchParams);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#0c831f] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200/70 hover:text-gray-900'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className={`text-[10px] ml-0.5 px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {cat.count}
                </span>
              </button>
            );
          })}

          {/* Organic Only Toggle */}
          <button
            onClick={() => setOrganicOnly(!organicOnly)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ml-auto cursor-pointer ${
              organicOnly
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-emerald-500" />
            100% Organic
          </button>
        </div>
      </div>

      {/* Product Grid (Blinkit Style matching Screenshot 2) */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-3 h-64 animate-pulse flex flex-col justify-between">
              <div className="aspect-square bg-gray-100 rounded-xl" />
              <div className="space-y-2 mt-3">
                <div className="h-3.5 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-6 bg-gray-100 rounded w-full mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#0c831f] flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-gray-900">No matching groceries found</h3>
          <p className="text-xs text-gray-500">
            We couldn't find any produce matching your filters. Try clearing your search query or switching categories.
          </p>
          <button
            onClick={handleResetFilters}
            className="bg-[#0c831f] hover:bg-[#0a6f1a] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
          {filtered.map(product => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
