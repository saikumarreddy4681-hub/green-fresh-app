import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Package,
  Smile,
  Clock,
  Flame,
  Star,
  CheckCircle2,
  ChevronRight,
  Leaf,
  Mail,
  Send
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Live countdown timer for Today's Special Deals
  const [timeLeft, setTimeLeft] = useState({ hours: 6, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
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

  const freshFruits = products.filter(p => p.categorySlug === 'fresh-fruits' || p.category === 'Fresh Fruits').slice(0, 4);
  const freshVegetables = products.filter(p => p.categorySlug === 'fresh-vegetables' || p.category === 'Fresh Vegetables').slice(0, 4);
  const milkDairy = products.filter(p => p.categorySlug === 'milk-dairy' || p.category === 'Milk & Dairy').slice(0, 4);
  const bestSellers = products.filter(p => p.isBestseller).slice(0, 4);
  const dailyDeals = products.filter(p => p.isDailyDeal).slice(0, 4);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubscribed(false), 5000);
    }
  };

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-6 pb-12 lg:py-16 bg-gradient-to-b from-[#f5f9f3] via-[#f7faf5] to-white rounded-b-[3rem] border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 bg-white/90 border border-emerald-200 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-bold shadow-xs">
                <Leaf className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                <span>Good for You. Good for Nature.</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
                Fresh From <span className="text-emerald-700 italic font-serif">Nature,</span><br />
                Delivered to You
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Discover 100% organic groceries, farm-fresh fruits, crunchy vegetables, and wholesome dairy delivered daily to your doorstep in pristine condition.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/products"
                  className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm px-8 py-4 rounded-full shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2"
                >
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/fruits"
                  className="bg-amber-400 hover:bg-amber-300 active:scale-95 text-amber-950 font-bold text-sm px-7 py-4 rounded-full shadow-md transition-all flex items-center gap-2"
                >
                  Explore Fruits (20+) <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Mini Highlights */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-600 font-medium">
                <span className="flex items-center gap-1.5 text-emerald-900 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Zero Synthetic Pesticides
                </span>
                <span className="flex items-center gap-1.5 text-emerald-900 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Cold-Chain Fresh
                </span>
                <span className="flex items-center gap-1.5 text-emerald-900 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Free Returns at Delivery
                </span>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-emerald-50">
                  <img
                    src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1000&q=80"
                    alt="Fresh organic harvest basket"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white p-3 rounded-2xl bg-black/30 backdrop-blur-md">
                    <p className="text-xs font-bold text-emerald-300">TODAY'S MORNING HARVEST</p>
                    <p className="text-sm font-extrabold">Alphonso Mangoes, Roma Tomatoes & Gir A2 Milk</p>
                  </div>
                </div>

                {/* Floating Badge 1: 100% Natural */}
                <div className="absolute -top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-emerald-100 flex items-center gap-2.5 hidden sm:flex">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">100% Certified Natural</p>
                    <p className="text-[10px] text-gray-500">Zero synthetic chemicals</p>
                  </div>
                </div>

                {/* Floating Badge 2: Same Day Delivery */}
                <div className="absolute -bottom-5 right-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-emerald-100 flex items-center gap-2.5 hidden sm:flex">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Same Day Delivery</p>
                    <p className="text-[10px] text-gray-500">Direct from local farms</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Trust Badges Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-emerald-100 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">100% Organic</h4>
              <p className="text-[11px] text-gray-500">Certified natural produce</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Secure Payments</h4>
              <p className="text-[11px] text-gray-500">Safe & encrypted checkout</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Eco-Friendly</h4>
              <p className="text-[11px] text-gray-500">Biodegradable packaging</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Smile className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Happy Customers</h4>
              <p className="text-[11px] text-gray-500">Trusted by 25k+ families</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 3 Main Categories Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-600 block mb-1">
            FOCUSED PRODUCE
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-serif">
            Our 3 Core Categories
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Carefully curated, 100% pure organic fruits, fresh garden vegetables, and natural dairy essentials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Fruits Card */}
          <Link
            to="/fruits"
            className="group relative bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-3xl p-6 border border-amber-200/80 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">🍎</span>
                <span className="text-xs font-black bg-amber-200/70 text-amber-900 px-2.5 py-1 rounded-full">
                  20 Products
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-amber-800 transition font-serif">
                Fresh Fruits
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Apples, Bananas, Oranges, Alphonso Mangoes, Pomegranates, Kiwi, Strawberries, Dragon Fruit, and more.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-amber-200/60 text-xs font-bold text-amber-900">
              <span>Explore Orchard Picks</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>

          {/* Vegetables Card */}
          <Link
            to="/vegetables"
            className="group relative bg-gradient-to-br from-emerald-50 to-green-50/50 rounded-3xl p-6 border border-emerald-200/80 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">🥦</span>
                <span className="text-xs font-black bg-emerald-200/70 text-emerald-900 px-2.5 py-1 rounded-full">
                  25 Products
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-emerald-800 transition font-serif">
                Fresh Vegetables
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Tomatoes, Potatoes, Onions, Carrots, Spinach, Cauliflower, Capsicum, Green Peas, Broccoli, and herbs.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-emerald-200/60 text-xs font-bold text-emerald-900">
              <span>Explore Garden Greens</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>

          {/* Milk & Dairy Card */}
          <Link
            to="/milk-dairy"
            className="group relative bg-gradient-to-br from-blue-50 to-cyan-50/50 rounded-3xl p-6 border border-blue-200/80 hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">🥛</span>
                <span className="text-xs font-black bg-blue-200/70 text-blue-900 px-2.5 py-1 rounded-full">
                  15 Products
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-blue-800 transition font-serif">
                Milk & Dairy
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Fresh Cow Milk, Buffalo Milk, Gir A2 Milk, Malai Paneer, Creamy Curd, Butter, and Pure Desi Ghee.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-blue-200/60 text-xs font-bold text-blue-900">
              <span>Explore Dairy Basket</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* 4. Fresh Fruits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full mb-1">
              <span>🍎</span> Orchard-Fresh Harvest
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-serif">
              Sun-Ripened Fresh Fruits
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">20 varieties of naturally sweet, vitamin-packed fresh fruits</p>
          </div>
          <Link
            to="/fruits"
            className="inline-flex items-center gap-1 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 px-4 py-2.5 rounded-full transition"
          >
            View All 20 Fruits <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {freshFruits.map(product => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Fresh Vegetables Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-1">
              <span>🥦</span> Daily Garden Greens
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-serif">
              Fresh Garden Vegetables
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">25 varieties of crunchy, chemical-free greens, roots & herbs</p>
          </div>
          <Link
            to="/vegetables"
            className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 px-4 py-2.5 rounded-full transition"
          >
            View All 25 Vegetables <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {freshVegetables.map(product => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Fresh Milk & Dairy Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full mb-1">
              <span>🥛</span> Pure Dairy Goodness
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-serif">
              Fresh Milk & Dairy Essentials
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">15 varieties of pure milk, artisanal malai paneer, thick curd & bilona ghee</p>
          </div>
          <Link
            to="/milk-dairy"
            className="inline-flex items-center gap-1 text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-900 px-4 py-2.5 rounded-full transition"
          >
            View All 15 Dairy Items <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {milkDairy.map(product => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Today's Super Harvest Deals with Countdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 bg-amber-400 text-amber-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 fill-amber-950" /> Special Offers & Deals
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif">
                Up to 25% OFF on Morning Harvest!
              </h2>
              <p className="text-emerald-200 text-xs sm:text-sm max-w-lg">
                Freshly picked Kinnaur apples, vine tomatoes, and farm milk. Order before the timer resets!
              </p>
            </div>

            {/* Countdown Box */}
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 text-center min-w-[70px] border border-white/10">
                <span className="text-2xl sm:text-3xl font-black font-mono block">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-300">Hours</span>
              </div>
              <span className="text-2xl font-bold">:</span>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 text-center min-w-[70px] border border-white/10">
                <span className="text-2xl sm:text-3xl font-black font-mono block">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-300">Mins</span>
              </div>
              <span className="text-2xl font-bold">:</span>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 text-center min-w-[70px] border border-white/10">
                <span className="text-2xl sm:text-3xl font-black font-mono block text-amber-300">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-300">Secs</span>
              </div>
            </div>
          </div>

          {/* Daily Deals Products Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {dailyDeals.map(prod => (
              <ProductCard key={prod.id || prod._id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-50/60 rounded-3xl p-8 sm:p-12 border border-emerald-100">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-700 block mb-1">
              COMMUNITY LOVE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-serif">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-emerald-100/60 space-y-3">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                "The freshness of the organic spinach and vine tomatoes is unmatched! You can immediately tell they weren't stored in cold rooms for weeks. Truly farm fresh!"
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                  SM
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Dr. Sneha Mehta</h4>
                  <p className="text-[10px] text-gray-400">Nutritionist & Verified Customer</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xs border border-emerald-100/60 space-y-3">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                "The Gir A2 cow milk and malai paneer are the purest I've had in years. Morning delivery arrives right on time before 7:30 AM every single morning!"
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs">
                  RK
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Rajesh Kulkarni</h4>
                  <p className="text-[10px] text-gray-400">Verified Resident, Bengaluru</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xs border border-emerald-100/60 space-y-3">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                "The sweet Alphonso mangoes and Kinnaur apples were delivered spotless in biodegradable cartons. Super slick website and wonderful customer service!"
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                  AP
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Ananya Pandey</h4>
                  <p className="text-[10px] text-gray-400">Home Chef & Regular Buyer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Newsletter Subscription Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-800 rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md text-emerald-300 mx-auto flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif">
              Get Harvest Updates & 20% OFF
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Subscribe to the GreenFresh weekly farm newsletter. Get seasonal crop alerts, recipe inspirations, and ₹100 discount coupon on your first order.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="bg-white/15 border border-white/20 text-white placeholder-emerald-200 text-xs px-4 py-3 rounded-xl focus:bg-white focus:text-gray-900 focus:outline-none flex-1 font-medium"
              />
              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs px-6 py-3 rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Subscribe
              </button>
            </form>

            {newsletterSubscribed && (
              <p className="text-xs text-amber-300 font-bold animate-fadeIn">
                🎉 Thank you for subscribing! Use coupon code <span className="underline font-mono">WELCOME20</span> for 20% OFF.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
