import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  ChevronDown,
  X,
  LogOut,
  LayoutDashboard,
  Package,
  Clock,
  Sparkles,
  MapPin,
  Plus,
  Minus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

const ROTATING_SEARCH_PLACEHOLDERS = [
  'Search "milk"',
  'Search "apples"',
  'Search "tomatoes"',
  'Search "paneer"',
  'Search "bananas"',
  'Search "ghee"',
  'Search "carrots"'
];

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const {
    cartCount,
    subtotal,
    openCartDrawer,
    wishlist,
    selectedAddress,
    setIsLocationModalOpen,
    addToCart,
    getItemQuantity,
    updateQuantity
  } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  // Rotate search placeholder every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % ROTATING_SEARCH_PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Preload products for live autocomplete search
  useEffect(() => {
    api.getProducts().then((res) => {
      if (res.success && res.products) {
        setAllProducts(res.products);
      }
    }).catch(err => console.log('Products preload note:', err));
  }, []);

  // Handle live search
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      const filtered = allProducts.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(q))
      ).slice(0, 6);
      setSearchResults(filtered);
      setShowSearchDropdown(true);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  }, [searchQuery, allProducts]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { label: 'All Groceries', path: '/products', icon: '🛒' },
    { label: 'Fresh Fruits', path: '/fruits', icon: '🍎' },
    { label: 'Fresh Vegetables', path: '/vegetables', icon: '🥦' },
    { label: 'Milk & Dairy', path: '/milk-dairy', icon: '🥛' },
    { label: "Today's Offers", path: '/products?offers=true', icon: '🏷️' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-xs">
      {/* Top Banner (Blinkit delivery announcement) */}
      <div className="bg-[#0c831f] text-white text-[11px] font-semibold py-1 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <span className="flex items-center gap-1 font-bold">
          ⚡ Delivery in 10-15 minutes
        </span>
        <span className="opacity-70">•</span>
        <span>Free express delivery on orders above ₹350</span>
        <span className="opacity-70">•</span>
        <span className="bg-white/20 px-2 py-0.2 rounded-full font-bold">100% Farm Inspected</span>
      </div>

      {/* Main Quick-Commerce Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 py-3.5">
          {/* 1. Brand Logo */}
          <Link to="/" className="flex items-center gap-1.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-[#0c831f] text-white flex items-center justify-center font-black text-xl shadow-sm group-hover:scale-105 transition-transform">
              G
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight leading-none text-gray-900">
                green<span className="text-[#0c831f]">fresh</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest font-extrabold text-[#0c831f]/90 mt-0.5">
                Quick Commerce
              </span>
            </div>
          </Link>

          {/* 2. Delivery Location Selector (Blinkit Style) */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition text-left cursor-pointer group shrink-0"
            title="Click to change delivery location"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-gray-900 tracking-tight flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#0c831f]" />
                  Delivery in {selectedAddress?.timeEstimate || '12 mins'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700 transition" />
              </div>
              <span className="text-[11px] font-medium text-gray-500 max-w-[210px] truncate">
                {selectedAddress?.address || 'Flat 402, Green Glen Layout, Bengaluru'}
              </span>
            </div>
          </button>

          {/* 3. Central Search Bar (Blinkit Style) */}
          <div ref={searchRef} className="flex-1 max-w-2xl relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={ROTATING_SEARCH_PLACEHOLDERS[placeholderIndex]}
                  className="w-full pl-10 pr-9 py-2.5 text-sm bg-gray-50 hover:bg-gray-100/70 focus:bg-white text-gray-900 placeholder-gray-400 rounded-xl border border-gray-200 focus:border-[#0c831f] focus:ring-2 focus:ring-[#0c831f]/10 focus:outline-none transition-all shadow-2xs font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>

            {/* Instant Search Suggestions Dropdown */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
                <div className="p-2 border-b border-gray-50 flex items-center justify-between text-xs font-bold text-gray-400 px-3">
                  <span>Suggested Products</span>
                  <button
                    onClick={() => {
                      setShowSearchDropdown(false);
                      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                    }}
                    className="text-[#0c831f] hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>
                <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
                  {searchResults.map((product) => {
                    const id = product.id || product._id;
                    const qty = getItemQuantity(id);
                    const price = product.discountPrice || product.price;

                    return (
                      <div
                        key={id}
                        className="p-2.5 px-3 flex items-center justify-between hover:bg-gray-50 transition"
                      >
                        <Link
                          to={`/product/${id}`}
                          onClick={() => setShowSearchDropdown(false)}
                          className="flex items-center gap-3 min-w-0 flex-1 mr-3"
                        >
                          <img
                            src={product.image || '/images/products/vegetables/tomato.jpg'}
                            alt={product.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/images/products/vegetables/tomato.jpg';
                            }}
                            className="w-11 h-11 object-cover rounded-lg bg-gray-50 shrink-0 border border-gray-100"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-gray-900 truncate">{product.name}</h4>
                            <p className="text-[11px] text-gray-500 font-medium">{product.unit || '1 unit'}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs font-black text-gray-900">₹{price}</span>
                              {product.discountPrice && (
                                <span className="text-[10px] text-gray-400 line-through">₹{product.price}</span>
                              )}
                            </div>
                          </div>
                        </Link>

                        {/* Quick ADD Button */}
                        <div className="shrink-0">
                          {qty === 0 ? (
                            <button
                              onClick={() => addToCart(product)}
                              className="text-xs font-black text-[#0c831f] border border-[#0c831f] bg-white hover:bg-emerald-50 px-3 py-1 rounded-lg uppercase tracking-wider transition shadow-2xs cursor-pointer"
                            >
                              ADD
                            </button>
                          ) : (
                            <div className="flex items-center bg-[#0c831f] text-white rounded-lg px-2 py-0.5 text-xs font-bold shadow-2xs">
                              <button
                                onClick={() => updateQuantity(id, qty - 1)}
                                className="p-1 hover:opacity-80 cursor-pointer"
                                aria-label="Decrease"
                              >
                                <Minus className="w-3 h-3 stroke-[3]" />
                              </button>
                              <span className="px-2 font-black">{qty}</span>
                              <button
                                onClick={() => updateQuantity(id, qty + 1)}
                                className="p-1 hover:opacity-80 cursor-pointer"
                                aria-label="Increase"
                              >
                                <Plus className="w-3 h-3 stroke-[3]" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 4. Action Buttons (Login, Wishlist, Cart) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-xl text-gray-600 hover:text-rose-600 hover:bg-rose-50/60 transition hidden sm:flex items-center justify-center"
              title="Saved Items"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white font-extrabold text-[10px] flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* User Account / Profile */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 hover:border-gray-300 bg-white text-xs font-bold text-gray-800 transition cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-[#0c831f] text-white flex items-center justify-center font-black text-xs">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden md:inline max-w-[100px] truncate">{user?.name || 'Account'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fadeIn text-xs font-medium">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="font-bold text-gray-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-[#0c831f] font-bold hover:bg-emerald-50 transition"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/my-orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition"
                    >
                      <Package className="w-4 h-4 text-gray-400" /> My Orders
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition"
                    >
                      <User className="w-4 h-4 text-gray-400" /> Account Settings
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-rose-600 hover:bg-rose-50 text-left border-t border-gray-50 transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-bold text-gray-800 hover:text-[#0c831f] px-3 py-2 rounded-xl hover:bg-gray-50 transition cursor-pointer"
              >
                Login
              </Link>
            )}

            {/* Signature Blinkit Green "My Cart" Button */}
            <button
              onClick={openCartDrawer}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#0c831f] hover:bg-[#0a6f1a] text-white font-extrabold text-xs sm:text-sm tracking-tight transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
              title="Open Cart"
            >
              <ShoppingBag className="w-5 h-5 fill-white/20" />
              <div className="flex flex-col items-start leading-tight">
                {cartCount === 0 ? (
                  <span>My Cart</span>
                ) : (
                  <>
                    <span className="text-[11px] font-bold opacity-90">{cartCount} items</span>
                    <span className="font-black text-sm">₹{subtotal}</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* 5. Second Navigation Bar: Category Pills */}
        <div className="flex items-center gap-2 py-2 overflow-x-auto no-scrollbar border-t border-gray-100 text-xs">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#0c831f] text-white shadow-xs'
                    : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/70 hover:text-gray-900'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
