import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Phone, MapPin, CheckCircle, ShieldCheck, Truck, RefreshCw, Heart } from 'lucide-react';

export default function Footer() {
  const [subscribedEmail, setSubscribedEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (subscribedEmail) {
      setSubscribed(true);
      setSubscribedEmail('');
    }
  };

  return (
    <footer className="bg-emerald-950 text-emerald-100 pt-16 pb-12 border-t border-emerald-900 mt-20">
      {/* 4 Feature Highlights Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-emerald-900">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-900/40 border border-emerald-800/50">
            <div className="w-12 h-12 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">100% Organic</h4>
              <p className="text-xs text-emerald-300/80">Certified pesticide-free produce</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-900/40 border border-emerald-800/50">
            <div className="w-12 h-12 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-300">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Cold-Chain Delivery</h4>
              <p className="text-xs text-emerald-300/80">Harvested & chilled to doorstep</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-900/40 border border-emerald-800/50">
            <div className="w-12 h-12 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-300">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Freshness Guarantee</h4>
              <p className="text-xs text-emerald-300/80">100% money back if not satisfied</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-900/40 border border-emerald-800/50">
            <div className="w-12 h-12 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-300">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Direct Farmer Fair Trade</h4>
              <p className="text-xs text-emerald-300/80">Empowering 500+ local farm families</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 group inline-block">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center text-emerald-950 font-bold shadow-md">
                <Sparkles className="w-5 h-5 text-emerald-950" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Green<span className="text-emerald-400">Fresh</span>
              </span>
            </Link>
            <p className="text-xs text-emerald-300/80 leading-relaxed max-w-sm">
              GreenFresh delivers 100% farm-inspected fruits, vegetables, and milk to your doorstep in 10-15 minutes. Pure quality, fair farmer pricing, and daily freshness.
            </p>
            <div className="space-y-2 text-xs text-emerald-200">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-400" /> 108 Green Valley Agro Park, Bangalore, India</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-400" /> +91 1800-473-3637 (Toll-Free)</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-emerald-400" /> support@greenfreshapp.com</p>
            </div>
          </div>

          {/* Quick Shop Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Categories</h4>
            <ul className="space-y-2 text-xs text-emerald-200/90">
              <li><Link to="/fruits" className="hover:text-white transition">🍎 Fresh Fruits (20)</Link></li>
              <li><Link to="/vegetables" className="hover:text-white transition">🥦 Fresh Vegetables (20)</Link></li>
              <li><Link to="/milk-dairy" className="hover:text-white transition">🥛 Milk & Dairy (15)</Link></li>
              <li><Link to="/products?offers=true" className="hover:text-white transition">🏷️ Today's Offers</Link></li>
              <li><Link to="/products" className="hover:text-white transition">🛒 All Groceries (55)</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Company & Trust</h4>
            <ul className="space-y-2 text-xs text-emerald-200/90">
              <li><Link to="/about" className="hover:text-white transition">About Green Fresh</Link></li>
              <li><Link to="/about#farms" className="hover:text-white transition">Our 500+ Partner Farms</Link></li>
              <li><Link to="/about#coldchain" className="hover:text-white transition">Cold Chain Technology</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Customer Support & FAQs</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Wholesale & B2B Supply</Link></li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Stay Fresh</h4>
            <p className="text-xs text-emerald-300/80">
              Subscribe to get secret weekly farm harvest deals and 10% off on your first order.
            </p>
            {subscribed ? (
              <div className="p-3 bg-emerald-900/60 rounded-xl border border-emerald-700 text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>You're subscribed! Use coupon code <strong>GREEN10</strong>.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={subscribedEmail}
                  onChange={(e) => setSubscribedEmail(e.target.value)}
                  className="w-full bg-emerald-900/60 border border-emerald-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-emerald-400/60 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs py-2.5 rounded-xl transition shadow-md"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-emerald-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-400/70 gap-4">
        <p>© 2026 Green Fresh App Inc. All rights reserved. Built with React, Vite, Node.js & MongoDB.</p>
        <div className="flex items-center space-x-4 text-emerald-300">
          <span className="font-semibold text-[11px] text-emerald-400/60 uppercase">Accepted Payments:</span>
          <span className="px-2 py-0.5 rounded bg-emerald-900 text-white font-medium text-[10px]">UPI / QR</span>
          <span className="px-2 py-0.5 rounded bg-emerald-900 text-white font-medium text-[10px]">Cards</span>
          <span className="px-2 py-0.5 rounded bg-emerald-900 text-white font-medium text-[10px]">NetBanking</span>
          <span className="px-2 py-0.5 rounded bg-emerald-900 text-white font-medium text-[10px]">Cash on Delivery</span>
        </div>
      </div>
    </footer>
  );
}

