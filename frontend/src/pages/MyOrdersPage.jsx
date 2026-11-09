import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PackageCheck, Truck, Clock, ArrowRight, Eye, ShoppingBag } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MyOrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        if (isAuthenticated) {
          const res = await api.getMyOrders();
          if (res.success && res.orders) {
            setOrders(res.orders);
          }
        }
      } catch (err) {
        console.error('Fetch my orders error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <PackageCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Please Sign In</h2>
        <p className="text-xs text-gray-500">
          Sign in to your Green Fresh account to see your order history and track deliveries.
        </p>
        <Link
          to="/login"
          className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-full transition"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-serif">
            My Orders
          </h1>
          <p className="text-xs text-gray-500">
            Track and view previous grocery orders delivered to your doorstep
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 px-4 py-2.5 rounded-full transition"
        >
          <ShoppingBag className="w-3.5 h-3.5" /> Order More Fresh Produce
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="bg-white rounded-3xl p-6 h-36 animate-pulse border border-gray-100"></div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-emerald-100 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <PackageCheck className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-gray-900">No orders placed yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Your fresh grocery basket awaits! Browse our seasonal fruits and farm veggies today.
          </p>
          <Link
            to="/products"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-full transition shadow-md shadow-emerald-600/20"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord._id || ord.orderNumber}
              className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm hover:border-emerald-300 transition space-y-4"
            >
              {/* Order Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-gray-900 font-mono">
                      #{ord.orderNumber}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-500">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Slot: {ord.deliverySlot}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    ord.orderStatus === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : ord.orderStatus === 'Cancelled'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}>
                    {ord.orderStatus}
                  </span>

                  <Link
                    to={`/orders/track/${ord._id || ord.orderNumber}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition"
                  >
                    <Truck className="w-3.5 h-3.5" /> Track <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Items Thumbnails list */}
              <div className="flex flex-wrap items-center gap-4">
                {ord.orderItems?.slice(0, 4).map((it, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                    <img src={it.image} alt={it.name} className="w-10 h-10 object-cover rounded-xl" />
                    <div className="text-xs">
                      <p className="font-bold text-gray-900 max-w-[120px] truncate">{it.name}</p>
                      <p className="text-[10px] text-gray-400">Qty: {it.quantity}</p>
                    </div>
                  </div>
                ))}
                {ord.orderItems?.length > 4 && (
                  <span className="text-xs text-gray-400 font-bold">
                    +{ord.orderItems.length - 4} more
                  </span>
                )}
              </div>

              {/* Total footer */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                <span className="text-gray-500">
                  Payment: <strong className="text-gray-800">{ord.paymentMethod}</strong> ({ord.paymentStatus})
                </span>
                <span className="font-extrabold text-gray-900 text-sm">
                  Total Paid: <span className="text-emerald-700">₹{ord.totalAmount}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

