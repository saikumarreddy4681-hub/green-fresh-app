import React from 'react';
import { Leaf, ShieldCheck, Truck, Heart, Users, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="space-y-16 lg:space-y-24">
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-emerald-50/70 to-white py-16 border-b border-emerald-100">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-700 bg-emerald-100 px-3.5 py-1 rounded-full">
            OUR ROOTS & STORY
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 font-serif">
            Reconnecting Families with Real, Chemical-Free Food
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Green Fresh was founded with a single mission: to eliminate intermediaries, restore mineral-rich organic soil practices, and deliver produce harvested at peak nutritional crispness straight to your kitchen.
          </p>
        </div>
      </section>

      {/* 3 Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 font-serif">100% Zero Pesticide Soil</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Every participating acre undergoes stringent soil testing. We use cold-pressed neem extracts, compost, and bio-nutrients, ensuring no neurotoxic pesticides or synthetic fertilizers touch your crops.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 font-serif">Cold-Chain Farm Gate Logistics</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Supermarket produce sits in warehouses for up to 3 weeks losing 50% of its vitamins. Our temperature-controlled electric vans pick up at dawn and deliver within 4 to 8 hours of harvest.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 font-serif">Fair Value to Farming Families</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              By removing five tiers of middlemen, our 500+ smallholder organic farmers earn 35% higher stable income, fostering sustainable rural livelihoods and land preservation.
            </p>
          </div>
        </div>
      </section>

      {/* Farm Visual Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 rounded-3xl p-8 sm:p-14 text-white shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              SUSTAINABILITY COMMITMENT
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-serif">
              Zero Plastic, Zero Compromise
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
              We pack all leafy greens, root vegetables, and fruits in unbleached kraft paper cartons, compostable cornstarch bags, and reusable glass bottles. Even our seal tape is water-activated plant cellulose.
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="inline-block bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-xs px-6 py-3 rounded-full transition shadow-md"
              >
                Experience the Freshness →
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
              <img
                src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1000&q=80"
                alt="Green Fresh Farmer hands holding organic soil"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

