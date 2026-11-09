import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer',
    adminSecretKey: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await register(formData);
      if (res.success) {
        if (res.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(res.message || 'Could not register');
      }
    } catch (err) {
      setError('Connection error while registering');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-emerald-100 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900 font-serif">
            Create Your Account
          </h1>
          <p className="text-xs text-gray-500">
            Join 25,000+ happy families enjoying farm fresh organic groceries
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Full Name *</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. Aarav Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Email Address *</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="aarav@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Password (min 6 characters) *</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="Create a secure password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Account Type</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-700 focus:outline-none focus:border-emerald-500"
            >
              <option value="customer">Regular Customer (Shopping & Orders)</option>
              <option value="admin">Store Administrator (Full Inventory & Order Mgmt)</option>
            </select>
          </div>

          {formData.role === 'admin' && (
            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 space-y-1">
              <label className="font-bold text-amber-900 block text-[11px]">
                Admin Setup Passkey *
              </label>
              <input
                type="password"
                required
                placeholder="Enter admin setup passkey"
                value={formData.adminSecretKey}
                onChange={(e) => setFormData({ ...formData, adminSecretKey: e.target.value })}
                className="w-full bg-white border border-amber-300 rounded-xl p-2 text-xs focus:outline-none focus:border-emerald-600"
              />
              <p className="text-[10px] text-amber-700">
                Setup key: <code className="font-bold bg-amber-100 px-1 py-0.5 rounded">green_fresh_admin_setup_key_2026</code>
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs py-3.5 rounded-2xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-1.5"
          >
            {loading ? 'Registering...' : 'Create My Account'} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-emerald-700 hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}

