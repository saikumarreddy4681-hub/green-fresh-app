import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Tag,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const {
    cartItems,
    cartCount,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    deliveryThreshold,
    promoCode,
    discountPercent,
    discountAmount,
    grandTotal,
    applyPromo,
    removePromo
  } = useCart();

  const [inputPromo, setInputPromo] = useState('');
  const [promoError, setPromoError] = useState('');
  const navigate = useNavigate();

  const handleApplyCode = (e) => {
    e.preventDefault();
    if (!inputPromo.trim()) return;
    const res = applyPromo(inputPromo);
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoError('');
      setInputPromo('');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-serif">
          Your Shopping Basket is Empty
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          You haven't added any fresh vegetables, fruits, or organic groceries yet. Check out our freshest harvests!
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-8 py-3.5 rounded-full shadow-lg shadow-emerald-600/25 transition"
        >
          Explore Fresh Produce <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const freeDeliveryDiff = deliveryThreshold - subtotal;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-serif">
            Your Shopping Cart
          </h1>
          <p className="text-xs text-gray-500">
            Review your selected farm items ({cartCount} items)
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Empty Entire Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items Table */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Alert */}
          {freeDeliveryDiff > 0 ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Add <strong>₹{freeDeliveryDiff}</strong> more to get <strong>FREE express delivery</strong>!
              </span>
              <Link to="/products" className="font-bold text-emerald-700 hover:underline">
                Add More +
              </Link>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              You qualify for FREE temperature-controlled doorstep delivery!
            </div>
          )}

          {/* Items Container */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm divide-y divide-gray-100">
            {cartItems.map((item) => (
              <div key={item.productId} className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/categories/vegetables.svg';
                    }}
                    className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-2xl bg-gray-50 border border-gray-100"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{item.name}</h3>
                    <p className="text-xs text-gray-500 mb-1">{item.unit}</p>
                    <span className="text-xs font-extrabold text-emerald-800">₹{item.price} each</span>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                  {/* Quantity controls */}
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="px-3 py-1.5 text-gray-600 hover:bg-emerald-100 transition"
                      aria-label="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-extrabold text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="px-3 py-1.5 text-gray-600 hover:bg-emerald-100 transition"
                      aria-label="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <span className="text-base font-black text-gray-900 min-w-[70px] text-right">
                    ₹{item.total}
                  </span>

                  {/* Delete button */}
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:underline pt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping for More Groceries
          </Link>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
              Order Summary
            </h2>

            {/* Price Calculations */}
            <div className="space-y-3 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal ({cartCount} items)</span>
                <span className="font-bold text-gray-900">₹{subtotal}</span>
              </div>

              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Promo ({promoCode} - {discountPercent}%)
                  </span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Doorstep Cold-Chain Delivery</span>
                <span>
                  {deliveryFee === 0 ? (
                    <strong className="text-emerald-600 font-bold">FREE</strong>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline text-sm font-black text-gray-900">
                <span>Total Amount</span>
                <span className="text-2xl text-emerald-700 font-black">₹{grandTotal}</span>
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="pt-2 border-t border-gray-100">
              {promoCode ? (
                <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-emerald-900 block">{promoCode} Applied!</span>
                    <span className="text-emerald-700 text-[11px]">{discountPercent}% savings on this basket</span>
                  </div>
                  <button
                    onClick={removePromo}
                    className="text-xs text-rose-600 hover:underline font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCode} className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 block">Have a coupon code?</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Try GREEN10 or WELCOME20"
                      value={inputPromo}
                      onChange={(e) => setInputPromo(e.target.value)}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs uppercase font-medium focus:bg-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && <p className="text-[11px] text-rose-500">{promoError}</p>}
                </form>
              )}
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm py-4 rounded-2xl shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe 256-bit encrypted checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

