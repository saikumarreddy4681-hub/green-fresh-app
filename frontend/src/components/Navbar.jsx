import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Phone,
  Truck,
  ShieldCheck,
  LogOut,
  LayoutDashboard,
  PackageCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount, openCartDrawer, wishlist, subtotal } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  useEffect(() => {
    // Preload products for rapid client-side live search autocomplete
    api.getProducts().then(res => {
      if (res.success && res.products) {
        setAllProducts(res.products);
      }
    }).catch(err => console.log('Products preload note:', err));
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      const filtered = allProducts.filter(p =>
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

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowSearchDropdown(false);
    setUserMenuOpen(false);
    setCategoryDropdownOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchDropdown(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-emerald-100">
      {/* Top Banner Bar */}
      <div className="bg-emerald-800 text-emerald-50 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-emerald-300" />
              Free express delivery on orders over ₹350
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              100% Certified Organic & Chemical-Free
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1 text-emerald-200">
              <Phone className="w-3.5 h-3.5" /> Support: 1800-GREEN-FRESH
            </span>
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-0.5 rounded-full font-medium text-[11px] flex items-center gap-1 transition shadow-xs"
              >
                <LayoutDashboard className="w-3 h-3" /> Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 shrink-0 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-700 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-emerald-950 font-serif leading-none">
                Green<span className="text-emerald-600">Fresh</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700/80 mt-0.5">
                Farm to Doorstep
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-xs font-bold text-gray-700">
            <Link
              to="/"
              className={`hover:text-emerald-600 transition py-2 ${
                location.pathname === '/' ? 'text-emerald-700 font-extrabold border-b-2 border-emerald-600' : ''
              }`}
            >
              Home
            </Link>
            
            <Link
              to="/products"
              className={`hover:text-emerald-600 transition py-2 ${
                location.pathname === '/products' ? 'text-emerald-700 font-extrabold border-b-2 border-emerald-600' : ''
              }`}
            >
              Shop All
            </Link>

            <Link
              to="/fruits"
              className={`hover:text-emerald-600 transition py-2 flex items-center gap-1 ${
                location.pathname === '/fruits' ? 'text-emerald-700 font-extrabold border-b-2 border-emerald-600' : ''
              }`}
            >
              <span>🍎</span> Fruits
            </Link>

            <Link
              to="/vegetables"
              className={`hover:text-emerald-600 transition py-2 flex items-center gap-1 ${
                location.pathname === '/vegetables' ? 'text-emerald-700 font-extrabold border-b-2 border-emerald-600' : ''
              }`}
            >
              <span>🥦</span> Vegetables
            </Link>

            <Link
              to="/milk-dairy"
              className={`hover:text-emerald-600 transition py-2 flex items-center gap-1 ${
                location.pathname === '/milk-dairy' ? 'text-emerald-700 font-extrabold border-b-2 border-emerald-600' : ''
              }`}
            >
              <span>🥛</span> Milk & Dairy
            </Link>

            {/* Categories Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-1 hover:text-emerald-600 transition py-2 cursor-pointer"
              >
                Categories
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 w-72 bg-white rounded-2xl shadow-xl border border-emerald-100 p-2.5 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50 space-y-1">
                <Link
                  to="/category/fresh-fruits"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50 text-gray-800 hover:text-emerald-800 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🍎</span>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Fresh Fruits</p>
                      <p className="text-[10px] text-gray-500">Apples, Bananas, Mangoes & more</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">20</span>
                </Link>

                <Link
                  to="/category/fresh-vegetables"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50 text-gray-800 hover:text-emerald-800 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🥦</span>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Fresh Vegetables</p>
                      <p className="text-[10px] text-gray-500">Tomatoes, Potatoes, Spinach & more</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">25</span>
                </Link>

                <Link
                  to="/category/milk-dairy"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50 text-gray-800 hover:text-emerald-800 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🥛</span>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Milk & Dairy</p>
                      <p className="text-[10px] text-gray-500">Cow Milk, Paneer, Curd, Ghee</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">15</span>
                </Link>
              </div>
            </div>

            <Link
              to="/contact"
              className={`hover:text-emerald-600 transition py-2 ${
                location.pathname === '/contact' ? 'text-emerald-600 font-bold' : ''
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-sm hidden sm:block" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search fresh apples, tomatoes, paneer, milk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-emerald-50/50 hover:bg-emerald-50 focus:bg-white text-gray-800 text-xs pl-9 pr-8 py-2.5 rounded-full border border-emerald-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                />
                <Search className="w-3.5 h-3.5 text-emerald-600 absolute left-3 top-3" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </form>

            {/* Quick Live Search Results Dropdown */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden z-50 divide-y divide-gray-50">
                {searchResults.map((item) => (
                  <Link
                    key={item.id || item._id}
                    to={`/product/${item.id || item._id}`}
                    onClick={() => setShowSearchDropdown(false)}
                    className="flex items-center gap-3 p-2.5 hover:bg-emerald-50/70 transition group"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 group-hover:text-emerald-700 truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-gray-500">{item.category} • {item.unit}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700">₹{item.discountPrice || item.price}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            
            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-full hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 transition"
              title="Saved Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Icon / Button */}
            <button
              onClick={openCartDrawer}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-full shadow-md shadow-emerald-600/20 transition cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-400 text-emerald-950 text-[9px] font-black rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold hidden sm:inline">
                {cartCount > 0 ? `₹${subtotal}` : 'Cart'}
              </span>
            </button>

            {/* User Account / Sign In */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 p-1.5 rounded-full hover:bg-emerald-50 text-gray-700 transition cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200">
                      {user?.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-emerald-100 py-1.5 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                            Admin Account
                          </span>
                        )}
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-xs text-emerald-700 font-bold hover:bg-emerald-50 transition"
                        >
                          <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition"
                      >
                        <User className="w-4 h-4 text-gray-400" /> My Profile
                      </Link>

                      <Link
                        to="/my-orders"
                        className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition"
                      >
                        <PackageCheck className="w-4 h-4 text-gray-400" /> My Orders
                      </Link>

                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Link
                    to="/login"
                    className="text-xs font-bold text-gray-700 hover:text-emerald-700 px-3 py-2 rounded-xl hover:bg-emerald-50 transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="hidden sm:inline-block text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-full transition shadow-xs"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-emerald-50 text-gray-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-emerald-100 px-4 pt-2 pb-6 space-y-3">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="mb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search fresh groceries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-emerald-50/50 text-gray-800 text-xs pl-9 pr-4 py-2.5 rounded-full border border-emerald-200"
              />
              <Search className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
            </div>
          </form>

          <nav className="flex flex-col space-y-1 text-xs font-semibold text-gray-700">
            <Link to="/" className="px-3 py-2 rounded-xl hover:bg-emerald-50">Home</Link>
            <Link to="/products" className="px-3 py-2 rounded-xl hover:bg-emerald-50">Shop All Groceries (60 items)</Link>
            
            <div className="pt-2 pb-1 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              3 Main Categories
            </div>
            
            <Link
              to="/fruits"
              className="px-3 py-2 rounded-xl hover:bg-emerald-50 text-emerald-900 flex justify-between items-center"
            >
              <span>🍎 Fresh Fruits</span>
              <span className="font-bold text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">20 items</span>
            </Link>

            <Link
              to="/vegetables"
              className="px-3 py-2 rounded-xl hover:bg-emerald-50 text-emerald-900 flex justify-between items-center"
            >
              <span>🥦 Fresh Vegetables</span>
              <span className="font-bold text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">25 items</span>
            </Link>

            <Link
              to="/milk-dairy"
              className="px-3 py-2 rounded-xl hover:bg-emerald-50 text-emerald-900 flex justify-between items-center"
            >
              <span>🥛 Milk & Dairy</span>
              <span className="font-bold text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">15 items</span>
            </Link>

            <Link to="/wishlist" className="px-3 py-2 rounded-xl hover:bg-emerald-50 flex justify-between items-center">
              <span>❤️ Saved Wishlist</span>
              <span className="font-bold text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">{wishlist.length}</span>
            </Link>

            <Link to="/contact" className="px-3 py-2 rounded-xl hover:bg-emerald-50">Contact & Support</Link>

            {isAdmin && (
              <Link to="/admin/dashboard" className="px-3 py-2 rounded-xl bg-emerald-100 text-emerald-900 font-bold">
                Admin Dashboard
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
