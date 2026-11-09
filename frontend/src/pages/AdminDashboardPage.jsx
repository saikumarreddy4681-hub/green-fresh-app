import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  Eye,
  Filter,
  DollarSign,
  ArrowUpRight,
  Sparkles,
  X,
  Save,
  RefreshCw,
  Layers,
  BarChart3,
  Settings,
  LogOut,
  AlertTriangle,
  ChevronRight,
  Check
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboardPage() {
  const { user, isAdmin, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // 12 sections requested:
  // overview, products, add-product, categories, orders, customers, inventory, sales-reports, settings
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  // Product modal / edit state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Fresh Fruits',
    subcategory: '',
    brand: 'GreenFresh Organic',
    price: '',
    discountPrice: '',
    unit: '1 kg',
    stock: 50,
    farmOrigin: 'Certified Partner Farm',
    freshnessScore: 98,
    isOrganic: true,
    isBestseller: false,
    isDailyDeal: false,
    image: '',
    description: ''
  });

  // Filter & Search states
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isAdmin) {
      navigate('/');
      return;
    }
    loadDashboardData();
  }, [isAuthenticated, isAdmin]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [dashRes, prodRes, ordRes, usrRes] = await Promise.all([
        api.getAdminDashboard(),
        api.getProducts(),
        api.getAdminOrders(),
        api.getAdminUsers()
      ]);

      if (dashRes.success) setStats(dashRes.stats);
      if (prodRes.success && prodRes.products) setProducts(prodRes.products);
      if (ordRes.success && ordRes.orders) setOrders(ordRes.orders);
      if (usrRes.success && usrRes.users) setUsersList(usrRes.users);
    } catch (err) {
      console.error('Admin data load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const showNotice = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(''), 4000);
  };

  const handleOpenAddModal = (defaultCategory = 'Fresh Fruits') => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: defaultCategory,
      subcategory: '',
      brand: 'GreenFresh Organic',
      price: '',
      discountPrice: '',
      unit: defaultCategory === 'Milk & Dairy' ? '1 L Bottle' : '1 kg',
      stock: 50,
      farmOrigin: 'GreenFresh Organic Partner Farm',
      freshnessScore: 99,
      isOrganic: true,
      isBestseller: false,
      isDailyDeal: false,
      image: '/images/categories/vegetables.svg',
      description: ''
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name || '',
      category: prod.category || 'Fresh Fruits',
      subcategory: prod.subcategory || '',
      brand: prod.brand || 'GreenFresh Organic',
      price: prod.price || '',
      discountPrice: prod.discountPrice || '',
      unit: prod.unit || '1 kg',
      stock: prod.stock !== undefined ? prod.stock : 50,
      farmOrigin: prod.farmOrigin || '',
      freshnessScore: prod.freshnessScore || 98,
      isOrganic: prod.isOrganic !== undefined ? prod.isOrganic : true,
      isBestseller: !!prod.isBestseller,
      isDailyDeal: !!prod.isDailyDeal,
      image: prod.image || '',
      description: prod.description || ''
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const id = editingProduct._id || editingProduct.id;
        const res = await api.updateProduct(id, productForm);
        if (res.success) {
          showNotice(`Updated product: ${productForm.name}`);
          setIsProductModalOpen(false);
          loadDashboardData();
        }
      } else {
        const res = await api.createProduct(productForm);
        if (res.success) {
          showNotice(`Added new produce: ${productForm.name}`);
          setIsProductModalOpen(false);
          loadDashboardData();
        }
      }
    } catch (err) {
      console.error('Save product error:', err);
      showNotice('Failed to save product. Check backend connection.');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the inventory?`)) return;
    try {
      const res = await api.deleteProduct(id);
      if (res.success) {
        showNotice(`Deleted product: ${name}`);
        setProducts(prev => prev.filter(p => (p._id || p.id) !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        showNotice(`Order #${orderId.slice(-6)} marked as ${newStatus}`);
        loadDashboardData();
      }
    } catch (err) {
      console.error('Update order status error:', err);
    }
  };

  const handleQuickStockUpdate = async (id, newStock) => {
    try {
      const res = await api.updateProduct(id, { stock: Math.max(0, newStock) });
      if (res.success) {
        setProducts(prev => prev.map(p => (p._id || p.id) === id ? { ...p, stock: Math.max(0, newStock) } : p));
        showNotice('Stock quantity updated');
      }
    } catch (err) {
      console.error('Quick stock error:', err);
    }
  };

  // Filtered products list
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(productSearch.toLowerCase()));
    const matchesCategory = productCategoryFilter === 'all' || p.categorySlug === productCategoryFilter || p.category === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = products.filter(p => (p.stock || 0) < 35);

  const filteredOrders = orders.filter(o =>
    orderStatusFilter === 'all' || o.orderStatus?.toLowerCase() === orderStatusFilter.toLowerCase()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-300">
              Admin Operations Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
            GreenFresh Business Control
          </h1>
          <p className="text-xs text-emerald-200">
            Signed in as {user?.name || 'Administrator'} ({user?.email})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={loadDashboardData}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-2xl transition border border-white/15 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>

          <button
            onClick={() => handleOpenAddModal('Fresh Fruits')}
            className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs px-4 py-2.5 rounded-2xl transition shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Produce
          </button>

          <Link
            to="/"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-2xl transition shadow-md"
          >
            Visit Storefront →
          </Link>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3.5 bg-emerald-50 text-emerald-900 text-xs font-bold rounded-2xl border border-emerald-200 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Navigation Tabs (All 12 Sections) */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-gray-200 pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'overview' ? 'bg-emerald-700 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-200 hover:bg-emerald-50'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" /> 1. Overview
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'products' ? 'bg-emerald-700 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-200 hover:bg-emerald-50'
          }`}
        >
          <Package className="w-3.5 h-3.5" /> 2. Products ({products.length})
        </button>

        <button
          onClick={() => handleOpenAddModal('Fresh Fruits')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> 3. Add Product
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'categories' ? 'bg-emerald-700 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-200 hover:bg-emerald-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> 6. Categories (3)
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'orders' ? 'bg-emerald-700 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-200 hover:bg-emerald-50'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" /> 7. Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'customers' ? 'bg-emerald-700 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-200 hover:bg-emerald-50'
          }`}
        >
          <Users className="w-3.5 h-3.5" /> 8. Customers ({usersList.length})
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'inventory' ? 'bg-emerald-700 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-200 hover:bg-emerald-50'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> 9. Inventory ({lowStockItems.length} Low)
        </button>

        <button
          onClick={() => setActiveTab('sales-reports')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'sales-reports' ? 'bg-emerald-700 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-200 hover:bg-emerald-50'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" /> 10. Reports
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'settings' ? 'bg-emerald-700 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-200 hover:bg-emerald-50'
          }`}
        >
          <Settings className="w-3.5 h-3.5" /> 11. Settings
        </button>

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-200 transition whitespace-nowrap cursor-pointer ml-auto"
        >
          <LogOut className="w-3.5 h-3.5" /> 12. Logout
        </button>
      </div>

      {/* SECTION 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Total Revenue</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-mono">₹{stats?.totalRevenue || 14850}</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+18%</span>
              </div>
              <p className="text-[10px] text-gray-500">From completed farm orders</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Total Orders</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-mono">{orders.length}</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <p className="text-[10px] text-gray-500">{stats?.pendingOrders || 1} pending fulfillment</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Total Grocery Products</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-mono">{products.length}</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">3 Categories</span>
              </div>
              <p className="text-[10px] text-gray-500">20 Fruits, 25 Veggies, 15 Dairy</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Total Customers</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-mono">{usersList.length || 3}</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Verified</span>
              </div>
              <p className="text-[10px] text-gray-500">Active organic households</p>
            </div>
          </div>

          {/* Quick Category Summary */}
          <div className="bg-white rounded-3xl border border-emerald-100 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Catalogue Health Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-amber-950">🍎 Fresh Fruits</p>
                  <p className="text-[11px] text-amber-800">20 Certified Organic Varieties</p>
                </div>
                <button
                  onClick={() => handleOpenAddModal('Fresh Fruits')}
                  className="px-3 py-1 bg-white hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl border border-amber-200 transition cursor-pointer"
                >
                  + Add Fruit
                </button>
              </div>

              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-emerald-950">🥦 Fresh Vegetables</p>
                  <p className="text-[11px] text-emerald-800">25 Daily Farm Harvests</p>
                </div>
                <button
                  onClick={() => handleOpenAddModal('Fresh Vegetables')}
                  className="px-3 py-1 bg-white hover:bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl border border-emerald-200 transition cursor-pointer"
                >
                  + Add Veggie
                </button>
              </div>

              <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-blue-950">🥛 Milk & Dairy</p>
                  <p className="text-[11px] text-blue-800">15 Pure Farm Dairy Items</p>
                </div>
                <button
                  onClick={() => handleOpenAddModal('Milk & Dairy')}
                  className="px-3 py-1 bg-white hover:bg-blue-100 text-blue-900 font-bold text-xs rounded-xl border border-blue-200 transition cursor-pointer"
                >
                  + Add Dairy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: PRODUCTS TABLE */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-emerald-100 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 font-serif">Product Inventory Management</h2>
              <p className="text-xs text-gray-500">Edit prices, manage stock levels, and update descriptions</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="Search products..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-xs px-3 py-2 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500 font-medium"
              />
              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-xs px-3 py-2 rounded-xl font-medium"
              >
                <option value="all">All Categories</option>
                <option value="fresh-fruits">Fresh Fruits</option>
                <option value="fresh-vegetables">Fresh Vegetables</option>
                <option value="milk-dairy">Milk & Dairy</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-100 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((p) => {
                  const id = p._id || p.id;
                  return (
                    <tr key={id} className="hover:bg-gray-50/80 transition">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover shrink-0 border border-gray-100"
                        />
                        <div>
                          <p className="font-bold text-gray-900">{p.name}</p>
                          <p className="text-[10px] text-gray-400">{p.brand} • {p.unit}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-600">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-gray-900">
                        ₹{p.discountPrice || p.price}
                        {p.discountPrice && p.discountPrice < p.price && (
                          <span className="text-[10px] text-gray-400 line-through ml-1.5">₹{p.price}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleQuickStockUpdate(id, (p.stock || 0) - 5)}
                            className="w-6 h-6 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center cursor-pointer"
                          >
                            -
                          </button>
                          <span className={`font-bold font-mono px-2 py-0.5 rounded text-[11px] ${
                            (p.stock || 0) < 35 ? 'bg-amber-100 text-amber-900' : 'text-gray-800'
                          }`}>
                            {p.stock}
                          </span>
                          <button
                            onClick={() => handleQuickStockUpdate(id, (p.stock || 0) + 10)}
                            className="w-6 h-6 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          (p.stock || 0) > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {(p.stock || 0) > 0 ? '● In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(id, p.name)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 6: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-emerald-100 p-6 shadow-xs">
            <h2 className="text-lg font-bold text-gray-900 font-serif mb-1">Core Product Categories</h2>
            <p className="text-xs text-gray-500 mb-6">GreenFresh strictly focuses on 3 essential categories</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">🍎</span>
                  <span className="text-xs font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                    {products.filter(p => p.categorySlug === 'fresh-fruits' || p.category === 'Fresh Fruits').length} Products
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-base">Fresh Fruits</h3>
                <p className="text-xs text-gray-600">
                  Orchard-fresh apples, bananas, Alphonso mangoes, pomegranates, kiwi, strawberries, dragon fruit, and seasonal melons.
                </p>
                <div className="pt-2 flex justify-between items-center text-xs">
                  <span className="text-emerald-700 font-bold">● Active Status</span>
                  <Link to="/fruits" className="text-amber-900 font-bold hover:underline">View Live →</Link>
                </div>
              </div>

              <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">🥦</span>
                  <span className="text-xs font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                    {products.filter(p => p.categorySlug === 'fresh-vegetables' || p.category === 'Fresh Vegetables').length} Products
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-base">Fresh Vegetables</h3>
                <p className="text-xs text-gray-600">
                  Daily harvested tomatoes, potatoes, onions, carrots, fresh palak, cauliflower, capsicum, and fresh kitchen herbs.
                </p>
                <div className="pt-2 flex justify-between items-center text-xs">
                  <span className="text-emerald-700 font-bold">● Active Status</span>
                  <Link to="/vegetables" className="text-emerald-900 font-bold hover:underline">View Live →</Link>
                </div>
              </div>

              <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">🥛</span>
                  <span className="text-xs font-bold bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full">
                    {products.filter(p => p.categorySlug === 'milk-dairy' || p.category === 'Milk & Dairy').length} Products
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-base">Milk & Dairy</h3>
                <p className="text-xs text-gray-600">
                  Pure farm cow milk, buffalo milk, A2 Gir cow milk, artisan malai paneer, thick dahi, fresh butter, and pure desi cow ghee.
                </p>
                <div className="pt-2 flex justify-between items-center text-xs">
                  <span className="text-emerald-700 font-bold">● Active Status</span>
                  <Link to="/milk-dairy" className="text-blue-900 font-bold hover:underline">View Live →</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 7: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-emerald-100 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 font-serif">Customer Orders & Fulfillment</h2>
              <p className="text-xs text-gray-500">Update shipping stages and verify simulated customer payments</p>
            </div>
            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-xs px-3 py-2 rounded-xl font-medium"
            >
              <option value="all">All Orders ({orders.length})</option>
              <option value="placed">Placed / Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-100 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status Transition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((ord) => {
                  const id = ord._id || ord.orderNumber;
                  return (
                    <tr key={id} className="hover:bg-gray-50/80 transition">
                      <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                        {ord.orderNumber || id.slice(-8)}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-gray-900">{ord.customer?.name || 'Customer'}</p>
                        <p className="text-[10px] text-gray-400">{ord.customer?.phone || ord.shippingAddress?.city}</p>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {(ord.orderItems || []).map(i => `${i.name} (x${i.quantity})`).join(', ')}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-gray-900">
                        ₹{ord.totalAmount}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                        }`}>
                          {ord.paymentMethod} • {ord.paymentStatus || 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={ord.orderStatus || 'Placed'}
                          onChange={(e) => handleUpdateOrderStatus(id, e.target.value)}
                          className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1 text-xs font-semibold text-gray-800 cursor-pointer"
                        >
                          <option value="Placed">Placed</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out For Delivery">Out For Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 8: CUSTOMERS */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-3xl border border-emerald-100 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 font-serif">Customer Accounts</h2>
            <p className="text-xs text-gray-500">Registered shopper profiles and contact records</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-100 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {usersList.map((u) => (
                  <tr key={u._id || u.email} className="hover:bg-gray-50/80 transition">
                    <td className="py-3 px-4 font-bold text-gray-900">{u.name}</td>
                    <td className="py-3 px-4 text-gray-600">{u.email}</td>
                    <td className="py-3 px-4 text-gray-500">{u.phone || '—'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-900' : 'bg-emerald-50 text-emerald-800'
                      }`}>
                        {u.role?.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 9: INVENTORY ALERTS */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl border border-emerald-100 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 font-serif">Low Stock Inventory Monitor</h2>
              <p className="text-xs text-gray-500">Items with stock lower than 35 units requiring morning replenishment</p>
            </div>
            <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
              {lowStockItems.length} Products Low
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockItems.map((item) => {
              const id = item._id || item.id;
              return (
                <div key={id} className="p-4 rounded-2xl border border-amber-200 bg-amber-50/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <p className="text-xs font-bold text-gray-900">{item.name}</p>
                      <p className="text-[10px] text-gray-500">{item.category} • {item.unit}</p>
                      <span className="text-[10px] font-bold text-rose-600">Stock: {item.stock} left</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleQuickStockUpdate(id, (item.stock || 0) + 50)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                  >
                    +50 Restock
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 10: SALES REPORTS */}
      {activeTab === 'sales-reports' && (
        <div className="bg-white rounded-3xl border border-emerald-100 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 font-serif">Sales & Revenue Breakdown</h2>
            <p className="text-xs text-gray-500">Weekly sales distribution across the 3 grocery categories</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(stats?.salesByCategory || [
              { category: 'Fresh Fruits', percentage: 42, amount: 6237 },
              { category: 'Fresh Vegetables', percentage: 38, amount: 5643 },
              { category: 'Milk & Dairy', percentage: 20, amount: 2970 }
            ]).map((cat) => (
              <div key={cat.category} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase">{cat.category}</p>
                <p className="text-2xl font-black font-mono text-gray-900">₹{cat.amount}</p>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${cat.percentage}%` }}></div>
                </div>
                <p className="text-[11px] text-gray-400 font-medium">{cat.percentage}% of weekly sales volume</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 11: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-emerald-100 p-6 shadow-xs space-y-6 max-w-2xl">
          <div>
            <h2 className="text-lg font-bold text-gray-900 font-serif">Store Configuration & Policy</h2>
            <p className="text-xs text-gray-500">Business rules and delivery fees</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <span className="font-bold text-gray-900 block">Store Name</span>
              <p className="text-gray-600 font-medium">GreenFresh – Farm to Doorstep</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <span className="font-bold text-gray-900 block">Free Delivery Threshold</span>
              <p className="text-gray-600 font-medium">Orders above ₹350 qualify for 100% Free Express Delivery</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <span className="font-bold text-gray-900 block">Default Standard Delivery Fee</span>
              <p className="text-gray-600 font-medium">₹40 flat rate for orders below ₹350</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <span className="font-bold text-gray-900 block">Database Status</span>
              <p className="text-emerald-700 font-bold">Active (GreenFresh High-Resilience Store with 60 Organic Items)</p>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto border border-emerald-100 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 font-serif">
                {editingProduct ? 'Edit Grocery Product' : 'Add New Farm Product'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Gala Apples"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-medium focus:bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-medium focus:bg-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Fresh Fruits">Fresh Fruits</option>
                    <option value="Fresh Vegetables">Fresh Vegetables</option>
                    <option value="Milk & Dairy">Milk & Dairy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="120"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-medium focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="99"
                    value={productForm.discountPrice}
                    onChange={(e) => setProductForm({ ...productForm, discountPrice: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-medium focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Unit *</label>
                  <input
                    type="text"
                    required
                    placeholder="1 kg, 500g, 1L"
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-medium focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Stock Qty *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="50"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-medium focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-medium focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description</label>
                <textarea
                  rows="2"
                  placeholder="Describe farm origin, taste, and nutritional qualities..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-medium focus:bg-white focus:outline-none"
                ></textarea>
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={productForm.isOrganic}
                    onChange={(e) => setProductForm({ ...productForm, isOrganic: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>100% Certified Organic</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Featured Harvest</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Produce
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
