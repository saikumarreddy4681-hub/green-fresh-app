import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Clock,
  Flame,
  Star,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Percent,
  RotateCcw,
  ShoppingBag
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { recentlyViewed } = useCart();

  // Countdown timer for Today's Offers
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 8, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.getProducts(),
          api.getCategories()
        ]);
        if (prodRes.success && prodRes.products) setProducts(prodRes.products);
        if (catRes.success && catRes.categories) setCategories(catRes.categories);
      } catch (err) {
        console.error('Home page data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtered slices
  const fruits = products.filter(p => p.categorySlug === 'fresh-fruits' || p.category === 'Fresh Fruits');
  const vegetables = products.filter(p => p.categorySlug === 'fresh-vegetables' || p.category === 'Fresh Vegetables');
  const dairy = products.filter(p => p.categorySlug === 'milk-dairy' || p.category === 'Milk & Dairy');
  const bestsellers = products.filter(p => p.isBestseller).slice(0, 8);
  const dailyDeals = products.filter(p => p.isDailyDeal || (p.discountPrice && p.discountPrice < p.price)).slice(0, 8);
  const frequentlyBought = products.filter(p =>
    ['Apples', 'Bananas', 'Tomatoes', 'Potatoes', 'Onions', 'Fresh Cow Milk', 'Paneer', 'Curd'].includes(p.name)
  ).slice(0, 8);

  const fallbackRecent = products.slice(0, 6);
  const displayRecentlyViewed = recentlyViewed.length > 0 ? recentlyViewed : fallbackRecent;

  return (
    <div className="bg-[#f8faf8] min-h-screen pb-16 space-y-8">
      {/* ============================================================ */}
      {/* 1. HERO PROMOTIONAL BANNERS (Blinkit 3-Card Layout)          */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Banner 1: Fruits & Vegetables */}
          <div className="relative rounded-3xl p-6 bg-gradient-to-br from-[#0c831f] to-[#045d13] text-white overflow-hidden shadow-sm flex flex-col justify-between min-h-[190px] group">
            <div className="relative z-10 max-w-[65%]">
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full inline-block mb-2">
                ⚡ 10-15 Min Delivery
              </span>
              <h2 className="text-xl sm:text-2xl font-black leading-tight mb-2">
                Fresh Fruits & Greens
              </h2>
              <p className="text-xs text-white/90 font-medium mb-4">
                Crisp apples, sweet mangoes & daily veggies picked at dawn.
              </p>
              <Link
                to="/fruits"
                className="inline-flex items-center gap-1.5 bg-white text-[#0c831f] hover:bg-gray-100 font-extrabold text-xs px-4 py-2 rounded-xl transition shadow-xs group-hover:scale-105"
              >
                Order Now <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </Link>
            </div>
            <img
              src="/images/products/banners/banner-fruits.jpg"
              alt="Fruits"
              className="absolute -right-4 -bottom-4 w-40 h-40 object-cover rounded-2xl pointer-events-none opacity-85 group-hover:scale-105 transition-transform duration-500 shadow-md"
            />
          </div>

          {/* Banner 2: Milk & Dairy */}
          <div className="relative rounded-3xl p-6 bg-gradient-to-br from-[#0284c7] to-[#0369a1] text-white overflow-hidden shadow-sm flex flex-col justify-between min-h-[190px] group">
            <div className="relative z-10 max-w-[65%]">
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full inline-block mb-2">
                🥛 Daily Farm Dairy
              </span>
              <h2 className="text-xl sm:text-2xl font-black leading-tight mb-2">
                Milk, Paneer & Ghee
              </h2>
              <p className="text-xs text-white/90 font-medium mb-4">
                100% pure whole cow milk, soft paneer & bilona ghee.
              </p>
              <Link
                to="/milk-dairy"
                className="inline-flex items-center gap-1.5 bg-white text-[#0284c7] hover:bg-gray-100 font-extrabold text-xs px-4 py-2 rounded-xl transition shadow-xs group-hover:scale-105"
              >
                Order Now <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </Link>
            </div>
            <img
              src="/images/products/banners/banner-dairy.jpg"
              alt="Dairy"
              className="absolute -right-4 -bottom-4 w-40 h-40 object-cover rounded-2xl pointer-events-none opacity-85 group-hover:scale-105 transition-transform duration-500 shadow-md"
            />
          </div>

          {/* Banner 3: Best Deals */}
          <div className="relative rounded-3xl p-6 bg-gradient-to-br from-[#d97706] to-[#b45309] text-white overflow-hidden shadow-sm flex flex-col justify-between min-h-[190px] group">
            <div className="relative z-10 max-w-[65%]">
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full inline-block mb-2">
                🏷️ Up to 35% OFF
              </span>
              <h2 className="text-xl sm:text-2xl font-black leading-tight mb-2">
                Today's Mandi Deals
              </h2>
              <p className="text-xs text-white/90 font-medium mb-4">
                Unbeatable daily discounts with zero middleman markups.
              </p>
              <Link
                to="/products?offers=true"
                className="inline-flex items-center gap-1.5 bg-white text-[#b45309] hover:bg-gray-100 font-extrabold text-xs px-4 py-2 rounded-xl transition shadow-xs group-hover:scale-105"
              >
                Explore Deals <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </Link>
            </div>
            <img
              src="/images/products/banners/banner-farm.jpg"
              alt="Vegetables"
              className="absolute -right-4 -bottom-4 w-40 h-40 object-cover rounded-2xl pointer-events-none opacity-85 group-hover:scale-105 transition-transform duration-500 shadow-md"
            />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. SHOP BY CATEGORY (3 Core Categories)                     */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">Shop by Category</h2>
            <p className="text-xs text-gray-500 font-medium">Strictly curated organic fruits, vegetables & pure dairy</p>
          </div>
          <Link to="/products" className="text-xs font-bold text-[#0c831f] hover:underline flex items-center gap-1">
            All Products <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Category A: Fruits */}
          <Link
            to="/fruits"
            className="group relative bg-white rounded-3xl p-5 border border-gray-100 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 flex items-center gap-4 overflow-hidden"
          >
            <div className="w-20 h-20 rounded-2xl bg-rose-50 p-1 shrink-0 flex items-center justify-center border border-rose-100 group-hover:scale-105 transition-transform overflow-hidden">
              <img src="/images/products/fruits/apple.jpg" alt="Fruits" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <span className="text-[10px] font-black text-rose-600 uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded-md">
                15 VARIETIES
              </span>
              <h3 className="text-base font-black text-gray-900 mt-1 group-hover:text-[#0c831f] transition">
                Fresh Fruits
              </h3>
              <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">Apples, bananas, mangoes & berries</p>
            </div>
          </Link>

          {/* Category B: Vegetables */}
          <Link
            to="/vegetables"
            className="group relative bg-white rounded-3xl p-5 border border-gray-100 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 flex items-center gap-4 overflow-hidden"
          >
            <div className="w-20 h-20 rounded-2xl bg-emerald-50 p-1 shrink-0 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform overflow-hidden">
              <img src="/images/products/vegetables/tomato.jpg" alt="Vegetables" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <span className="text-[10px] font-black text-[#0c831f] uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md">
                20 VARIETIES
              </span>
              <h3 className="text-base font-black text-gray-900 mt-1 group-hover:text-[#0c831f] transition">
                Fresh Vegetables
              </h3>
              <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">Tomatoes, potatoes, greens & roots</p>
            </div>
          </Link>

          {/* Category C: Milk & Dairy */}
          <Link
            to="/milk-dairy"
            className="group relative bg-white rounded-3xl p-5 border border-gray-100 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 flex items-center gap-4 overflow-hidden"
          >
            <div className="w-20 h-20 rounded-2xl bg-sky-50 p-1 shrink-0 flex items-center justify-center border border-sky-100 group-hover:scale-105 transition-transform overflow-hidden">
              <img src="/images/products/dairy/freshmilk.jpg" alt="Milk & Dairy" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <span className="text-[10px] font-black text-sky-600 uppercase tracking-wider bg-sky-50 px-2 py-0.5 rounded-md">
                12 VARIETIES
              </span>
              <h3 className="text-base font-black text-gray-900 mt-1 group-hover:text-[#0c831f] transition">
                Milk & Dairy
              </h3>
              <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">Whole milk, paneer, curd & ghee</p>
            </div>
          </Link>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. TODAY'S OFFERS (Flash Deals with Live Timer)              */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 border border-amber-200/80 rounded-3xl p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black shadow-sm">
                <Flame className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">Today's Deals & Offers</h2>
                <p className="text-xs text-gray-500 font-medium">Daily discounted prices on farm fresh groceries</p>
              </div>
            </div>

            {/* Live Countdown Timer */}
            <div className="flex items-center gap-1.5 bg-white border border-amber-200 px-3 py-1.5 rounded-xl shadow-2xs text-xs font-bold text-amber-900">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Ends in:</span>
              <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-black">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span>:</span>
              <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-black">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span>:</span>
              <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-black">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {dailyDeals.map(product => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. FRUITS SHOWCASE                                           */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span>🍎</span> Fresh Orchard Fruits
            </h2>
            <p className="text-xs text-gray-500 font-medium">Naturally tree-ripened, handpicked and delivered in 12 mins</p>
          </div>
          <Link to="/fruits" className="text-xs font-bold text-[#0c831f] hover:underline flex items-center gap-1">
            See All (20) <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {fruits.slice(0, 6).map(product => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. VEGETABLES SHOWCASE                                       */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span>🥦</span> Daily Fresh Vegetables
            </h2>
            <p className="text-xs text-gray-500 font-medium">Farm-picked crunchy greens and essential cooking staples</p>
          </div>
          <Link to="/vegetables" className="text-xs font-bold text-[#0c831f] hover:underline flex items-center gap-1">
            See All (20) <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {vegetables.slice(0, 6).map(product => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. MILK & DAIRY SHOWCASE                                     */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span>🥛</span> Fresh Milk & Artisanal Dairy
            </h2>
            <p className="text-xs text-gray-500 font-medium">Pure farm milk, thick curd, fresh paneer and bilona cow ghee</p>
          </div>
          <Link to="/milk-dairy" className="text-xs font-bold text-[#0c831f] hover:underline flex items-center gap-1">
            See All (15) <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {dairy.slice(0, 6).map(product => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. BEST SELLERS                                              */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span className="text-amber-500 font-black">★</span> Customer Bestsellers
            </h2>
            <p className="text-xs text-gray-500 font-medium">Most loved household items by thousands of happy families</p>
          </div>
          <Link to="/products" className="text-xs font-bold text-[#0c831f] hover:underline flex items-center gap-1">
            View All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {bestsellers.slice(0, 6).map(product => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. FREQUENTLY BOUGHT TOGETHER                                */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#0c831f]" /> Frequently Bought Products
            </h2>
            <p className="text-xs text-gray-500 font-medium">Daily essentials ordered together by neighboring kitchens</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {frequentlyBought.slice(0, 6).map(product => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. RECENTLY VIEWED PRODUCTS                                  */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" /> Recently Viewed
            </h2>
            <p className="text-xs text-gray-500 font-medium">Continue where you left off</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {displayRecentlyViewed.map(product => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 10. QUICK COMMERCE TRUST & GUARANTEE BADGES                  */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0c831f] flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900">10-15 Min Delivery</h4>
              <p className="text-xs text-gray-500 mt-0.5">Direct from local micro-fulfillment hubs</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0c831f] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900">100% Quality Checked</h4>
              <p className="text-xs text-gray-500 mt-0.5">Zero synthetic chemicals or artificial ripening</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0c831f] flex items-center justify-center shrink-0">
              <Percent className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900">Best Mandi Prices</h4>
              <p className="text-xs text-gray-500 mt-0.5">Fair farm pricing with daily deals</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0c831f] flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900">Instant Replacement</h4>
              <p className="text-xs text-gray-500 mt-0.5">No questions asked instant doorstep return</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
