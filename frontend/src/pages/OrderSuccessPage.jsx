import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle2, ArrowRight, Truck, MapPin, PackageCheck, Clock } from 'lucide-react';
import { api } from '../services/api';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    api.getOrderById(id).then(res => {
      if (res.success && res.order) {
        setOrder(res.order);
      }
    }).catch(err => console.log('Order fetch note:', err));
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
      {/* Success Badge */}
      <div className="relative inline-block">
        <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
          <CheckCircle2 className="w-14 h-14" />
        </div>
      </div>

      <div className="space-y-3">
        <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-700 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
          Order Successfully Confirmed
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-serif">
          Thank you for choosing Green Fresh!
        </h1>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          Our partner farms are already harvesting and packing your order. We are maintaining temperature-controlled cold chain for maximum vitality.
        </p>
      </div>

      {/* Order Quick Summary Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm text-left space-y-4 max-w-xl mx-auto">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <span className="text-[11px] text-gray-400 font-medium">Order Reference</span>
            <p className="text-base font-extrabold text-gray-900 font-mono">
              {order ? order.orderNumber : id}
            </p>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
            Status: {order ? order.orderStatus : 'Placed'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
          <div>
            <span className="text-gray-400 block mb-0.5">Estimated Delivery</span>
            <p className="font-bold text-gray-900 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              {order?.deliverySlot || 'Express (Within 45 mins)'}
            </p>
          </div>
          <div>
            <span className="text-gray-400 block mb-0.5">Payment Method</span>
            <p className="font-bold text-gray-900">
              {order?.paymentMethod || 'UPI / COD'} ({order?.paymentStatus || 'Confirmed'})
            </p>
          </div>
        </div>

        {order?.shippingAddress && (
          <div className="pt-3 border-t border-gray-100 text-xs text-gray-600">
            <span className="text-gray-400 block mb-0.5">Delivering to</span>
            <p className="font-medium text-gray-900 flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              {order.shippingAddress.street}, {order.shippingAddress.apartment ? order.shippingAddress.apartment + ', ' : ''}
              {order.shippingAddress.city} - {order.shippingAddress.postalCode}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <Link
          to={`/orders/track/${order?._id || order?.orderNumber || id}`}
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs px-8 py-4 rounded-full shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2"
        >
          <Truck className="w-4 h-4" /> Track Live Order Status <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          to="/products"
          className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs px-8 py-4 rounded-full transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

