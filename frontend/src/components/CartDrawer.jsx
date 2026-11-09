import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
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
    deliveryFee,
    deliveryThreshold,
    grandTotal
  } = useCart();

  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  const freeDeliveryDiff = deliveryThreshold - subtotal;
  const progressPercent = Math.min(100, Math.round((subtotal / deliveryThreshold) * 100));

  const handleCheckoutClick = () => {
    closeCartDrawer();
    navigate('/checkout');
  };

  const handleViewCartClick = () => {
    closeCartDrawer();
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCartDrawer}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-emerald-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Shopping Cart</h2>
                <p className="text-xs text-gray-500">{cartCount} fresh {cartCount === 1 ? 'item' : 'items'} in your basket</p>
              </div>
            </div>

            <button
              onClick={closeCartDrawer}
              className="p-2 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-emerald-50/30 border-b border-emerald-100">
            {freeDeliveryDiff > 0 ? (
              <div>
                <div className="flex justify-between text-xs font-semibold text-emerald-900 mb-1.5">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Add ₹{freeDeliveryDiff} more for <strong className="text-emerald-700">FREE delivery</strong>
                  </span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Congratulations! You unlocked FREE Express Delivery!
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-gray-100">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Your cart is empty</h3>
                <p className="text-xs text-gray-500 max-w-xs mb-6">
                  Look through our farm-fresh fruits, vegetables, and organic groceries to fill your basket!
                </p>
                <button
                  onClick={() => {
                    closeCartDrawer();
                    navigate('/products');
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-md shadow-emerald-600/20 transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.productId} className="py-4 flex gap-3.5 items-center group">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/categories/vegetables.svg';
                    }}
                    className="w-16 h-16 object-cover rounded-2xl bg-gray-50 border border-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate">{item.name}</h4>
                    <p className="text-xs text-gray-500">{item.unit} • ₹{item.price} each</p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-emerald-100 transition"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-bold text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-emerald-100 transition"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-gray-400 hover:text-red-500 p-1 transition"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-gray-900">₹{item.total}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-gray-100 bg-gray-50/60 space-y-3">
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? <strong className="text-emerald-600 font-bold">FREE</strong> : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-1.5 border-t border-gray-200">
                  <span>Estimated Total</span>
                  <span className="text-emerald-700 text-base">₹{grandTotal}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  onClick={handleViewCartClick}
                  className="w-full bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 font-bold text-xs py-3 rounded-2xl transition shadow-sm text-center"
                >
                  View Full Cart
                </button>
                <button
                  onClick={handleCheckoutClick}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs py-3 rounded-2xl transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5"
                >
                  Checkout <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

