import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Mail, Lock, ArrowRight, ShieldCheck, UserCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = location.state?.from || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');

    try {
      const res = await login(email.trim(), password);
      if (res.success) {
        if (res.user?.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate(redirectPath);
        }
      } else {
        setError(res.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError('Connection error while logging in. Please verify backend is running on http://localhost:5000.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (type) => {
    if (type === 'admin') {
      setEmail('admin@greenfresh.com');
      setPassword('admin123');
    } else if (type === 'admin-user') {
      setEmail('saikumarreddy4681@gmail.com');
      setPassword('admin123');
    } else {
      setEmail('customer@greenfresh.com');
      setPassword('user123');
    }
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-emerald-100 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900 font-serif">
            Welcome to Green Fresh
          </h1>
          <p className="text-xs text-gray-500">
            Sign in to access your farm grocery basket & orders
          </p>
        </div>

        {/* Demo Fast-Login Pills */}
        <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100 space-y-2">
          <p className="text-[11px] font-bold text-emerald-900 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Instant Demo Accounts:
            </span>
            <span className="text-[10px] text-emerald-700 font-normal">Click to auto-fill</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('customer')}
              className="py-1.5 px-3 bg-white hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] rounded-xl border border-emerald-200 transition text-center shadow-xs"
            >
              Customer Demo
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('admin')}
              className="py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] rounded-xl transition text-center shadow-xs"
            >
              Admin Demo
            </button>
          </div>
          <button
            type="button"
            onClick={() => handleFillDemo('admin-user')}
            className="w-full py-1 px-2.5 bg-emerald-100/70 hover:bg-emerald-200/80 text-emerald-900 font-semibold text-[10px] rounded-lg transition text-center"
          >
            Admin: saikumarreddy4681@gmail.com
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2">
            <span className="text-rose-600 font-bold">✕</span>
            <div>
              <p className="font-semibold">{error}</p>
              <p className="text-[10px] text-rose-600 mt-0.5">Use password <code className="bg-rose-100 px-1 py-0.5 rounded font-mono font-bold">admin123</code> for admin or <code className="bg-rose-100 px-1 py-0.5 rounded font-mono font-bold">user123</code> for customer.</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 focus:bg-white focus:outline-none focus:border-emerald-500 font-medium"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 focus:bg-white focus:outline-none focus:border-emerald-500 font-medium"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Verifying Credentials...' : 'Sign In to Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2">
          <p className="text-[11px] text-gray-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-emerald-700 font-bold hover:underline">
              Create an Account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
