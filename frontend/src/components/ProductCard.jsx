import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Heart, Star, Sparkles, Eye, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FALLBACK_IMAGE = '/images/categories/vegetables.svg';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist, cartItems } = useCart();
  const id = product.id || product._id;
  const inWish = isInWishlist(id);
  const cartItem = cartItems.find(item => item.productId === id);

  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const inStock = product.stock === undefined || product.stock > 0;

  return (
    <div className="group relative bg-white rounded-3xl border border-emerald-100/90 p-4 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between">
      {/* Top Badges & Wishlist */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          {product.isOrganic ? (
            <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              ORGANIC
            </span>
          ) : (
            <span className="text-[11px] text-gray-500 font-semibold">{product.category}</span>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            aria-label="Wishlist"
            className={`p-2 rounded-full transition-all ${
              inWish
                ? 'bg-rose-50 text-rose-500 scale-110'
                : 'bg-gray-50/80 text-gray-400 hover:text-rose-500 hover:bg-rose-50'
            }`}
            title={inWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${inWish ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Product Image with Fallback */}
        <Link to={`/product/${id}`} className="block relative overflow-hidden rounded-2xl bg-gray-50 aspect-square">
          <img
            src={product.image || FALLBACK_IMAGE}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {hasDiscount && (
            <span className="absolute top-2 left-2 bg-amber-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-sm">
              {discountPercent}% OFF
            </span>
          )}

          {/* Freshness score pill */}
          {product.freshnessScore && (
            <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>{product.freshnessScore}% Fresh</span>
            </div>
          )}
        </Link>
      </div>

      {/* Info Content */}
      <div className="mt-3.5 flex flex-col flex-1">
        {/* Brand & Subcategory / Origin Tag */}
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="font-bold text-emerald-800 tracking-wider uppercase text-[10px] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
            {product.brand || 'Green Fresh'}
          </span>
          <span className="text-gray-400 font-medium text-[10px] truncate max-w-[120px]">
            {product.subcategory || product.farmOrigin}
          </span>
        </div>

        {/* Product Title */}
        <Link
          to={`/product/${id}`}
          className="text-base font-bold text-gray-900 hover:text-emerald-700 transition line-clamp-1 mb-1"
        >
          {product.name}
        </Link>

        {/* Harvest Date / Description Preview */}
        <p className="text-xs text-gray-500 mb-2 truncate">
          {product.description || product.harvestDate || 'Fresh farm harvest'}
        </p>

        {/* Rating & Stock Status */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-1.5 text-gray-600">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              <span className="font-bold ml-1 text-gray-900">{product.rating || '4.8'}</span>
            </div>
            <span className="text-gray-400">({product.reviewsCount || 1})</span>
          </div>

          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
          }`}>
            {inStock ? '● In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Price & Unit */}
        <div className="pt-2 border-t border-gray-100 flex items-baseline justify-between mb-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-gray-900">₹{price}</span>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
              )}
            </div>
            <span className="text-[10px] text-gray-400 block -mt-0.5">per {product.unit || '500g'}</span>
          </div>
          <span className="text-[11px] text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">
            {product.category}
          </span>
        </div>

        {/* Dual Actions: View Details + Add to Cart */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <Link
            to={`/product/${id}`}
            className="bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 font-bold text-xs py-2.5 rounded-2xl border border-gray-200 hover:border-emerald-200 transition text-center flex items-center justify-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" /> Details
          </Link>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={!inStock}
            className={`font-bold text-xs py-2.5 rounded-2xl transition shadow-sm flex items-center justify-center gap-1.5 ${
              !inStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : cartItem
                ? 'bg-emerald-700 text-white shadow-emerald-700/20 hover:bg-emerald-800'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 active:scale-95'
            }`}
          >
            {cartItem ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> In Cart ({cartItem.quantity})
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
