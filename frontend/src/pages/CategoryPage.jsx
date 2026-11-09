import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Filter, Leaf } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';

export default function CategoryPage({ initialCategory }) {
  const params = useParams();
  let categorySlug = initialCategory || params.categorySlug;

  // Handle common aliases
  if (categorySlug === 'fruits') categorySlug = 'fresh-fruits';
  if (categorySlug === 'vegetables') categorySlug = 'fresh-vegetables';
  if (categorySlug === 'milk' || categorySlug === 'dairy' || categorySlug === 'dairy-products') categorySlug = 'milk-dairy';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryTitles = {
    'fresh-fruits': {
      title: 'Fresh Orchard Fruits',
      subtitle: 'Sun-ripened, 100% natural, sweet and vitamin-rich fruits harvested daily from certified orchards',
      image: '🍎',
      itemTarget: '20+ Fresh Fruits'
    },
    'fresh-vegetables': {
      title: 'Fresh Garden Vegetables',
      subtitle: 'Crisp, chemical-free greens, roots, and aromatics delivered farm-fresh to your doorstep',
      image: '🥦',
      itemTarget: '20+ Fresh Vegetables'
    },
    'milk-dairy': {
      title: 'Fresh Milk & Dairy',
      subtitle: 'Pure pasteurized cow milk, farm-fresh malai paneer, thick dahi, butter, and bilona ghee',
      image: '🥛',
      itemTarget: '15+ Dairy Essentials'
    }
  };

  const currentMeta = categoryTitles[categorySlug] || {
    title: categorySlug ? categorySlug.replace(/-/g, ' ').toUpperCase() : 'Category',
    subtitle: 'Pure farm-to-doorstep organic groceries',
    image: '🌱',
    itemTarget: ''
  };

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const res = await api.getProducts({ category: categorySlug });
        if (res.success && res.products) {
          setProducts(res.products);
        }
      } catch (err) {
        console.error('Fetch category error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
    window.scrollTo(0, 0);
  }, [categorySlug]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Link */}
      <Link to="/products" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition">
        <ArrowLeft className="w-4 h-4" /> Back to All Groceries
      </Link>

      {/* Category Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-700 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-lg shadow-emerald-950/10">
        <div className="absolute -right-8 -bottom-8 text-9xl opacity-15 select-none pointer-events-none">
          {currentMeta.image}
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-emerald-100 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>GreenFresh Verified Harvest</span>
            {currentMeta.itemTarget && <span className="text-white font-bold ml-1">• {currentMeta.itemTarget}</span>}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-serif flex items-center gap-3">
            <span>{currentMeta.image}</span>
            <span>{currentMeta.title}</span>
          </h1>
          <p className="text-emerald-100/90 text-sm leading-relaxed">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Quick Category Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Link
          to="/category/fresh-fruits"
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
            categorySlug === 'fresh-fruits'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-emerald-50'
          }`}
        >
          🍎 Fresh Fruits (20)
        </Link>
        <Link
          to="/category/fresh-vegetables"
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
            categorySlug === 'fresh-vegetables'
              ? 'bg-[#0c831f] text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-emerald-50'
          }`}
        >
          🥦 Fresh Vegetables (20)
        </Link>
        <Link
          to="/category/milk-dairy"
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
            categorySlug === 'milk-dairy'
              ? 'bg-[#0c831f] text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-emerald-50'
          }`}
        >
          🥛 Milk & Dairy (15)
        </Link>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-64 border border-gray-100 animate-pulse p-3 space-y-3">
              <div className="bg-gray-100 rounded-xl h-36 w-full" />
              <div className="bg-gray-100 h-3.5 w-3/4 rounded" />
              <div className="bg-gray-100 h-3 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Showing {products.length} farm items</span>
            <span className="flex items-center gap-1 text-[#0c831f] font-bold">⚡ 12-Min Delivery</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
            {products.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200 space-y-3">
          <p className="text-gray-500 text-sm">No products found in this category right now.</p>
          <Link to="/products" className="inline-block bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl">
            Browse All Products
          </Link>
        </div>
      )}
    </div>
  );
}
