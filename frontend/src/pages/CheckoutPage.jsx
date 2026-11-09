import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Calendar
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function CheckoutPage() {
  const { cartItems, subtotal, deliveryFee, discountAmount, grandTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Shipping state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.addresses?.[0]?.street || '',
    apartment: user?.addresses?.[0]?.apartment || '',
    city: user?.addresses?.[0]?.city || 'Bengaluru',
    state: user?.addresses?.[0]?.state || 'Karnataka',
    postalCode: user?.addresses?.[0]?.postalCode || '560001',
    deliverySlot: 'Express Delivery (Within 45 mins)',
    paymentMethod: 'UPI',
    upiId: 'customer@okaxis',
    cardNumber: '4532 •••• •••• 8892',
    cardExpiry: '12/28',
    cardCvv: '382',
    cardName: user?.name || 'Aarav Sharma',
    notes: 'Please ring bell and leave in safe cold-box if not home'
  });

  const slots = [
    { id: 'Express Delivery (Within 45 mins)', label: '⚡ Express Delivery (Within 45 mins)', desc: 'Direct from nearest hub' },
    { id: 'Today Evening (4:00 PM - 7:00 PM)', label: '🌆 Evening Slot (4:00 PM - 7:00 PM)', desc: 'Standard cold-chain run' },
    { id: 'Tomorrow Morning (7:00 AM - 10:00 AM)', label: '🌅 Tomorrow Morning (7:00 AM - 10:00 AM)', desc: 'Fresh morning harvest' }
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setError('Your shopping cart is empty.');
      return;
    }

    if (!formData.name || !formData.phone || !formData.street || !formData.postalCode) {
      setError('Please fill in all required shipping address fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderPayload = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        shippingAddress: {
          street: formData.street,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: 'India'
        },
        deliverySlot: formData.deliverySlot,
        orderItems: cartItems.map(item => ({
          productId: item.productId,
          name: item.name,
          image: item.image,
          price: item.price,
          unit: item.unit,
          quantity: item.quantity,
          total: item.total
        })),
        paymentMethod: formData.paymentMethod,
        paymentDetails: {
          transactionId: 'TXN-' + Math.floor(10000000 + Math.random() * 90000000),
          upiId: formData.paymentMethod === 'UPI' ? formData.upiId : '',
          cardLast4: formData.paymentMethod === 'CARD' ? formData.cardNumber.slice(-4) : ''
        },
        subtotal,
        deliveryFee,
        discount: discountAmount,
        totalAmount: grandTotal,
        notes: formData.notes
      };

      const res = await api.createOrder(orderPayload);
      if (res.success && res.order) {
        clearCart();
        navigate(`/order-success/${res.order._id || res.order.orderNumber}`);
      } else {
        setError(res.message || 'Could not place order. Please try again.');
      }
    } catch (err) {
      console.error('Order creation error:', err);
      setError('Connection error while placing order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-xs text-gray-500">Please add items to your cart before proceeding to checkout.</p>
        <Link to="/products" className="inline-block bg-emerald-600 text-white text-xs font-bold px-6 py-2.5 rounded-full">
          Browse Groceries
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Checkout Title */}
      <div className="pb-4 border-b border-gray-100">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-serif">
          Fresh Doorstep Checkout
        </h1>
        <p className="text-xs text-gray-500">
          Enter your delivery details and choose your preferred payment option
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl">
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Details, Slot, Payment */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Contact & Delivery Address */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">1</span>
              Contact & Delivery Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Phone Number (For Delivery SMS) *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-gray-700 block mb-1">Email Address (For Invoice)</label>
                <input
                  type="email"
                  name="email"
                  placeholder="customer@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-gray-700 block mb-1">Street Address / House No. *</label>
                <input
                  type="text"
                  name="street"
                  required
                  placeholder="Flat 402, Green Orchid Residency, 12th Main Road"
                  value={formData.street}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Landmark / Apartment</label>
                <input
                  type="text"
                  name="apartment"
                  placeholder="Near Apollo Clinic"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">PIN / Postal Code *</label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  placeholder="560001"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* 2. Delivery Time Slot */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">2</span>
              Choose Delivery Time Slot
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {slots.map((s) => (
                <label
                  key={s.id}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                    formData.deliverySlot === s.id
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-sm'
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <input
                      type="radio"
                      name="deliverySlot"
                      value={s.id}
                      checked={formData.deliverySlot === s.id}
                      onChange={handleInputChange}
                      className="accent-emerald-600 mt-1"
                    />
                    <Truck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="mt-2">
                    <p className="text-xs font-bold text-gray-900">{s.label}</p>
                    <p className="text-[10px] text-gray-500">{s.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">3</span>
              Select Payment Method
            </h2>

            <div className="grid grid-cols-3 gap-3">
              <label
                className={`p-4 rounded-2xl border text-center cursor-pointer transition ${
                  formData.paymentMethod === 'UPI'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="UPI"
                  checked={formData.paymentMethod === 'UPI'}
                  onChange={handleInputChange}
                  className="hidden"
                />
                <QrCode className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                <span className="text-xs block">UPI / QR</span>
              </label>

              <label
                className={`p-4 rounded-2xl border text-center cursor-pointer transition ${
                  formData.paymentMethod === 'CARD'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CARD"
                  checked={formData.paymentMethod === 'CARD'}
                  onChange={handleInputChange}
                  className="hidden"
                />
                <CreditCard className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                <span className="text-xs block">Card</span>
              </label>

              <label
                className={`p-4 rounded-2xl border text-center cursor-pointer transition ${
                  formData.paymentMethod === 'COD'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === 'COD'}
                  onChange={handleInputChange}
                  className="hidden"
                />
                <Banknote className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                <span className="text-xs block">Cash on Delivery</span>
              </label>
            </div>

            {/* Dynamic payment sub-view */}
            {formData.paymentMethod === 'UPI' && (
              <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-white p-2 rounded-xl border border-emerald-200 flex items-center justify-center shrink-0">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=greenfresh@okaxis&pn=GreenFreshApp"
                      alt="UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-900">Scan QR Code via GPay, PhonePe, or Paytm</p>
                    <p className="text-[11px] text-gray-500">Or pay using Virtual Payment Address (VPA):</p>
                    <input
                      type="text"
                      name="upiId"
                      placeholder="yourname@okaxis"
                      value={formData.upiId}
                      onChange={handleInputChange}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-800 w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.paymentMethod === 'CARD' && (
              <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="font-bold text-gray-700 block mb-1">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Expires (MM/YY)</label>
                    <input
                      type="text"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">CVV</label>
                    <input
                      type="password"
                      name="cardCvv"
                      maxLength={3}
                      value={formData.cardCvv}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.paymentMethod === 'COD' && (
              <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>You can pay cash or scan the delivery agent's UPI QR upon receiving your sealed freshness basket.</span>
              </div>
            )}
          </div>

        </div>

        {/* Right: Checkout Order Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Order Items ({cartItems.length})
            </h3>

            {/* Compact items list */}
            <div className="max-h-56 overflow-y-auto divide-y divide-gray-100 pr-1">
              {cartItems.map((item) => (
                <div key={item.productId} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-xl bg-gray-50" />
                    <div className="truncate">
                      <p className="font-bold text-gray-900 truncate">{item.name}</p>
                      <p className="text-[10px] text-gray-400">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-gray-900 ml-2">₹{item.total}</span>
                </div>
              ))}
            </div>

            {/* Calculation summary */}
            <div className="pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">₹{subtotal}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Cold-Chain Delivery</span>
                <span>{deliveryFee === 0 ? <strong className="text-emerald-600 font-bold">FREE</strong> : `₹${deliveryFee}`}</span>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline text-sm font-black text-gray-900">
                <span>Total Due</span>
                <span className="text-2xl text-emerald-700 font-black">₹{grandTotal}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-sm py-4 rounded-2xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Packing your order...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Place Order • ₹{grandTotal}
                </>
              )}
            </button>

            <p className="text-[11px] text-gray-400 text-center">
              By confirming, you agree to Green Fresh's 100% Quality & Freshness Guarantee.
            </p>
          </div>
        </div>

      </form>
    </div>
  );
}

