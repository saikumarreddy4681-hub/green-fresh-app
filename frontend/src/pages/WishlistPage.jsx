import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowLeft, Trash2, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/products" className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Groceries
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-serif flex items-center gap-2 mt-1">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
            My Saved Wishlist
          </h1>
          <p className="text-xs text-gray-500">
            {wishlist.length} item{wishlist.length === 1 ? '' : 's'} saved for later
          </p>
        </div>

        {wishlist.length > 0 && (
          <button
            onClick={() => {
              wishlist.forEach(item => addToCart(item, 1));
            }}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 transition"
          >
            <ShoppingBag className="w-4 h-4" />
            Add All to Cart
          </button>
        )}
      </div>

      {/* Wishlist Items */}
      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 max-w-md mx-auto p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 font-serif">Your Wishlist is Empty</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Explore our farm-fresh fruits, crisp vegetables, and dairy to save your favorites with the heart icon.
          </p>
          <Link
            to="/products"
            className="inline-block px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            Explore Fresh Groceries
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {wishlist.map(product => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
