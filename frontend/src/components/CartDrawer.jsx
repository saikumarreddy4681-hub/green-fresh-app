import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Clock,
  CheckCircle2,
  Sparkles,
  MapPin,
  Tag
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const {
    isCartDrawerOpen,
    closeCartDrawer,
    cartItems,
    cartCount,
    updateQuantity,
    removeFromCart,
    subtotal,
    savings,
    deliveryFee,
    deliveryThreshold,
    handlingFee,
    grandTotal,
    discountAmount,
    selectedAddress,
    setIsLocationModalOpen
  } = useCart();

  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  const freeDeliveryDiff = Math.max(0, deliveryThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / deliveryThreshold) * 100));

  const handleCheckoutClick = () => {
    closeCartDrawer();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={closeCartDrawer}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* 1. Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-extrabold text-gray-900">My Cart</h2>
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
            </div>

            <button
              onClick={closeCartDrawer}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 2. Blinkit Quick Delivery Location Banner */}
          <div className="px-5 py-2.5 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#0c831f] text-white flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-extrabold text-emerald-950 flex items-center gap-1">
                  <span>Delivery in {selectedAddress?.timeEstimate || '12 mins'}</span>
                </div>
                <p className="text-[11px] text-emerald-800 truncate">
                  Ship to: {selectedAddress?.address || 'Bellandur, Bengaluru'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                closeCartDrawer();
                setIsLocationModalOpen(true);
              }}
              className="text-[11px] font-bold text-[#0c831f] hover:underline shrink-0 ml-2 cursor-pointer"
            >
              Change
            </button>
          </div>

          {/* 3. Free Delivery Threshold Meter */}
          <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-100 text-xs">
            {freeDeliveryDiff > 0 ? (
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px] font-bold text-gray-700">
                  <span className="flex items-center gap-1 text-[#0c831f]">
                    <Sparkles className="w-3.5 h-3.5" />
                    Add ₹{freeDeliveryDiff} more for <strong>FREE delivery</strong>
                  </span>
                  <span className="text-gray-400">{progressPercent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#0c831f] h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0c831f]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>You unlocked FREE Express 12-Min Delivery!</span>
              </div>
            )}
          </div>

          {/* 4. Cart Items List */}
          <div className="flex-1 overflow-y-auto px-5 divide-y divide-gray-100">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-20 h-20 rounded-full bg-emerald-50 text-[#0c831f] flex items-center justify-center mb-4">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Your cart is empty</h3>
                <p className="text-xs text-gray-500 max-w-xs mb-6">
                  Add fresh fruits, vegetables, and milk to get fast 10-minute doorstep delivery!
                </p>
                <button
                  onClick={() => {
                    closeCartDrawer();
                    navigate('/products');
                  }}
                  className="bg-[#0c831f] hover:bg-[#0a6f1a] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.productId} className="py-3.5 flex gap-3 items-center group">
                  <img
                    src={item.image || '/images/products/vegetables/tomato.jpg'}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/products/vegetables/tomato.jpg';
                    }}
                    className="w-14 h-14 object-cover rounded-xl bg-gray-50 border border-gray-100 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate leading-tight">{item.name}</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">{item.unit || '1 unit'}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs font-black text-gray-900">₹{item.price}</span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-[10px] text-gray-400 line-through">₹{item.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls (Blinkit Green Pill) */}
                  <div className="flex items-center bg-[#0c831f] text-white rounded-lg px-2 py-1 text-xs font-bold shadow-2xs shrink-0">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-0.5 hover:opacity-80 active:scale-90 transition cursor-pointer"
                      aria-label="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                    <span className="px-2 font-black min-w-[16px] text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-0.5 hover:opacity-80 active:scale-90 transition cursor-pointer"
                      aria-label="Increase"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 5. Bill Details & Sticky Checkout Footer */}
          {cartItems.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50/80 space-y-3">
              {/* Bill Details */}
              <div className="bg-white p-3 rounded-2xl border border-gray-100 space-y-2 text-xs text-gray-600">
                <span className="font-extrabold text-[11px] text-gray-400 uppercase tracking-wider block">
                  Bill Details
                </span>
                <div className="flex justify-between">
                  <span>Items Total</span>
                  <span className="font-bold text-gray-900">₹{subtotal}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-[#0c831f]">
                    <span>Product Savings</span>
                    <span className="font-bold">-₹{savings}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#0c831f]">
                    <span>Promo Discount</span>
                    <span className="font-bold">-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charge (12 mins)</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-[#0c831f] font-black uppercase text-[11px]">FREE</span>
                    ) : (
                      <span className="font-bold text-gray-900">₹{deliveryFee}</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Handling Charge</span>
                  <span className="font-bold text-gray-900">₹{handlingFee}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-100">
                  <span>Grand Total</span>
                  <span className="text-[#0c831f]">₹{grandTotal}</span>
                </div>
              </div>

              {/* Blinkit Green Checkout Bar */}
              <button
                onClick={handleCheckoutClick}
                className="w-full bg-[#0c831f] hover:bg-[#0a6f1a] active:scale-98 text-white rounded-2xl p-3.5 flex items-center justify-between font-black text-sm shadow-md transition cursor-pointer"
              >
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-base">₹{grandTotal}</span>
                  <span className="text-[10px] font-bold opacity-80 uppercase tracking-wider">TOTAL</span>
                </div>
                <div className="flex items-center gap-1.5 font-extrabold text-sm">
                  <span>Proceed to Pay</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
