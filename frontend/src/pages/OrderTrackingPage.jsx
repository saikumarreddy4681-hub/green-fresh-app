import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Package,
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export default function OrderTrackingPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelMessage, setCancelMessage] = useState('');

  const steps = [
    { key: 'Placed', label: 'Order Placed', desc: 'Order received & confirmed' },
    { key: 'Packed', label: 'Packed at Farm', desc: 'Hand-picked from organic fields' },
    { key: 'Shipped', label: 'Cold-Chain Transit', desc: 'Chilled transit in EV cargo' },
    { key: 'Out For Delivery', label: 'Out For Delivery', desc: 'Delivery partner on route' },
    { key: 'Delivered', label: 'Delivered Fresh', desc: 'Handed over at doorstep' }
  ];

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await api.getOrderById(id);
      if (res.success && res.order) {
        setOrder(res.order);
      }
    } catch (err) {
      console.error('Fetch order error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (stepKey) => {
    if (!order) return 'upcoming';
    const statusOrder = ['Placed', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered'];
    const currentIdx = statusOrder.indexOf(order.orderStatus);
    const stepIdx = statusOrder.indexOf(stepKey);

    if (order.orderStatus === 'Cancelled') return 'cancelled';
    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'active';
    return 'upcoming';
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await api.cancelOrder(order._id || order.id);
      if (res.success) {
        setCancelMessage('Order has been cancelled successfully.');
        fetchOrder();
      } else {
        alert(res.message || 'Could not cancel order');
      }
    } catch (err) {
      alert('Error cancelling order');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-gray-500">Locating your fresh shipment...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Order Not Found</h2>
        <p className="text-xs text-gray-500">We could not find the order reference #{id}.</p>
        <Link to="/products" className="inline-block bg-emerald-600 text-white text-xs font-bold px-6 py-2.5 rounded-full">
          Shop More Fresh Produce
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <Link to="/my-orders" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition">
        <ArrowLeft className="w-4 h-4" /> Back to My Orders
      </Link>

      {/* Main Order Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Live Shipment Tracking
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-serif">
              Order #{order.orderNumber}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Slot: <strong>{order.deliverySlot}</strong>
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-bold ${
              order.orderStatus === 'Delivered'
                ? 'bg-emerald-100 text-emerald-800'
                : order.orderStatus === 'Cancelled'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-amber-100 text-amber-900'
            }`}>
              {order.orderStatus}
            </span>
            <p className="text-[11px] text-gray-400 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {cancelMessage && (
          <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-200">
            {cancelMessage}
          </div>
        )}

        {/* Live Timeline Tracker */}
        {order.orderStatus !== 'Cancelled' ? (
          <div className="py-4">
            <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" /> Dispatch Progress
            </h3>

            {/* Stepper horizontal */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
              {steps.map((st, i) => {
                const status = getStepStatus(st.key);
                return (
                  <div key={st.key} className="flex sm:flex-col items-center sm:items-center text-left sm:text-center gap-3 sm:gap-2">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        status === 'completed'
                          ? 'bg-emerald-600 text-white'
                          : status === 'active'
                          ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        i + 1
                      )}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${status === 'active' ? 'text-amber-700' : 'text-gray-900'}`}>
                        {st.label}
                      </p>
                      <p className="text-[10px] text-gray-400">{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-900 rounded-2xl flex items-center gap-3 text-xs">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            <span>This order was cancelled. Any pre-paid UPI/Card amount will be refunded within 24 hours.</span>
          </div>
        )}

        {/* Courier / Driver Note */}
        <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold">
              GF
            </div>
            <div>
              <p className="font-bold text-gray-900">Green Fresh Fleet Partner: Ramesh K.</p>
              <p className="text-[11px] text-gray-500">Eco-friendly EV Cold Van • Reg #KA-01-GF-2026</p>
            </div>
          </div>
          <span className="font-bold text-emerald-800 bg-white px-3 py-1.5 rounded-xl border border-emerald-200">
            Internal Temp: 4.2°C (Optimal)
          </span>
        </div>

        {/* Order Items Breakdown */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-600" /> Items in this Order ({order.orderItems?.length || 0})
          </h3>

          <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
            {order.orderItems?.map((item, idx) => (
              <div key={idx} className="p-3.5 flex items-center justify-between text-xs bg-white">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-11 h-11 object-cover rounded-xl bg-gray-50" />
                  <div>
                    <p className="font-bold text-gray-900">{item.name}</p>
                    <p className="text-[10px] text-gray-400">{item.unit} • Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-extrabold text-gray-900">₹{item.total}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs font-bold text-gray-700 pt-2 px-1">
            <span>Total Paid ({order.paymentMethod}):</span>
            <span className="text-base text-emerald-700 font-black">₹{order.totalAmount}</span>
          </div>
        </div>

        {/* Cancel button if order is still fresh */}
        {['Placed', 'Packed'].includes(order.orderStatus) && (
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              onClick={handleCancel}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-4 py-2 rounded-xl transition border border-rose-200"
            >
              Cancel This Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

