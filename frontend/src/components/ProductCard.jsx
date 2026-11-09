import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Heart, Clock, Star, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FALLBACK_IMAGE = '/images/categories/vegetables.svg';

export default function ProductCard({ product }) {
  const {
    addToCart,
    getItemQuantity,
    updateQuantity,
    toggleWishlist,
    isInWishlist
  } = useCart();

  const id = product.id || product._id;
  const inWish = isInWishlist(id);
  const qty = getItemQuantity(id);

  const price = product.discountPrice || product.price;
  const originalPrice = product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const inStock = product.stock === undefined || product.stock > 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 p-3 shadow-2xs hover:shadow-md hover:border-gray-200 transition-all duration-200 flex flex-col justify-between h-full">
      {/* Top Media Block */}
      <div className="relative">
        {/* Badges: Discount on Left, Wishlist on Right */}
        <div className="absolute top-1.5 left-1.5 right-1.5 z-10 flex items-center justify-between pointer-events-none">
          {hasDiscount ? (
            <span className="bg-[#256fef] text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-2xs pointer-events-auto">
              {discountPercent}% OFF
            </span>
          ) : (
            <span></span>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            aria-label="Wishlist"
            className={`p-1.5 rounded-full transition pointer-events-auto cursor-pointer ${
              inWish
                ? 'bg-rose-50 text-rose-500 scale-110'
                : 'bg-white/80 backdrop-blur-xs text-gray-400 hover:text-rose-500 hover:bg-white shadow-xs'
            }`}
            title={inWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 ${inWish ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Product Image Link (1:1 Aspect Ratio) */}
        <Link
          to={`/product/${id}`}
          className="block relative overflow-hidden rounded-xl bg-gray-50/50 aspect-square p-2 group-hover:scale-102 transition-transform duration-300"
        >
          <img
            src={product.image || FALLBACK_IMAGE}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
            className="w-full h-full object-contain mix-blend-multiply"
            loading="lazy"
          />
        </Link>
      </div>

      {/* Product Details */}
      <div className="mt-2.5 flex flex-col flex-1">
        {/* Delivery Time Badge (Blinkit Style) */}
        <div className="flex items-center gap-1 text-[10px] font-extrabold text-gray-500 mb-1">
          <Clock className="w-3 h-3 text-[#0c831f]" />
          <span>12 MINS</span>
          {product.rating && (
            <>
              <span className="opacity-40">•</span>
              <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                {product.rating}
              </span>
            </>
          )}
        </div>

        {/* Product Name */}
        <Link
          to={`/product/${id}`}
          className="text-xs sm:text-[13px] font-bold text-gray-900 hover:text-[#0c831f] transition line-clamp-2 leading-snug mb-1"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Unit / Weight */}
        <div className="text-[11px] font-medium text-gray-500 mb-3 truncate">
          {product.unit || '500 g'}
        </div>

        {/* Bottom Price & ADD Action Button */}
        <div className="mt-auto pt-2 border-t border-gray-50 flex items-center justify-between gap-2">
          {/* Price */}
          <div className="flex flex-col leading-none">
            <span className="text-sm font-black text-gray-900">₹{price}</span>
            {hasDiscount && (
              <span className="text-[10px] text-gray-400 line-through mt-0.5">₹{originalPrice}</span>
            )}
          </div>

          {/* Action Button: ADD vs [-] Qty [+] */}
          <div>
            {!inStock ? (
              <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                Out of Stock
              </span>
            ) : qty === 0 ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product);
                }}
                className="text-xs font-black text-[#0c831f] border border-[#0c831f] bg-white hover:bg-emerald-50 active:bg-emerald-100 px-4 py-1.5 rounded-lg uppercase tracking-wider transition-all shadow-2xs hover:shadow-xs cursor-pointer"
              >
                ADD
              </button>
            ) : (
              <div className="flex items-center bg-[#0c831f] text-white rounded-lg px-2 py-1 text-xs font-bold shadow-2xs">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    updateQuantity(id, qty - 1);
                  }}
                  className="p-0.5 hover:opacity-80 active:scale-90 transition cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[3]" />
                </button>
                <span className="px-2 font-black text-xs min-w-[16px] text-center">{qty}</span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    updateQuantity(id, qty + 1);
                  }}
                  className="p-0.5 hover:opacity-80 active:scale-90 transition cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
