import { categoriesData, productsData } from '../data/fallbackProducts';

const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('greenfresh_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Intelligent offline fallback handler if backend is offline or starting up
const handleOfflineFallback = (url, options = {}) => {
  const method = (options.method || 'GET').toUpperCase();
  const parsedUrl = new URL(url, 'http://localhost');
  const pathname = parsedUrl.pathname;
  const searchParams = parsedUrl.searchParams;

  console.warn(`[GreenFresh] Backend unreachable at ${url}. Serving graceful fallback data.`);

  // 1. Health endpoint
  if (pathname === '/api/health') {
    return {
      success: false,
      isOffline: true,
      message: 'Backend server is not running on http://localhost:5000'
    };
  }

  // 2. Categories
  if (pathname === '/api/categories' || pathname === '/api/products/categories') {
    return {
      success: true,
      count: categoriesData.length,
      categories: categoriesData,
      isOffline: true
    };
  }

  // 3. Products list
  if (pathname === '/api/products' && method === 'GET') {
    let list = [...productsData];
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const subcategory = searchParams.get('subcategory');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');
    const isOrganic = searchParams.get('isOrganic');
    const isFeatured = searchParams.get('isFeatured');

    if (category && category !== 'all') {
      const catLower = category.toLowerCase().replace(/s$/, '');
      list = list.filter(p => {
        const pSlug = (p.categorySlug || '').toLowerCase();
        const pCat = (p.category || '').toLowerCase();
        return (
          pSlug === category.toLowerCase() ||
          pCat === category.toLowerCase() ||
          pSlug.includes(catLower) ||
          pCat.includes(catLower)
        );
      });
    }

    if (subcategory && subcategory !== 'all') {
      const subLow = subcategory.toLowerCase();
      list = list.filter(p => p.subcategory && p.subcategory.toLowerCase().includes(subLow));
    }

    if (brand && brand !== 'all') {
      const brandLow = brand.toLowerCase();
      list = list.filter(p => p.brand && p.brand.toLowerCase() === brandLow);
    }

    if (isOrganic === 'true') {
      list = list.filter(p => p.isOrganic === true);
    }

    if (isFeatured === 'true') {
      list = list.filter(p => p.isFeatured || p.isBestseller || p.isDailyDeal);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.farmOrigin && p.farmOrigin.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (sort) {
      if (sort === 'price-low' || sort === 'price-asc') {
        list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
      } else if (sort === 'price-high' || sort === 'price-desc') {
        list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
      } else if (sort === 'rating') {
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (sort === 'freshness') {
        list.sort((a, b) => (b.freshnessScore || 0) - (a.freshnessScore || 0));
      }
    }

    return {
      success: true,
      count: list.length,
      products: list,
      isOffline: true
    };
  }

  // 4. Single product by ID
  const productMatch = pathname.match(/^\/api\/products\/([^\/]+)$/);
  if (productMatch && method === 'GET') {
    const productId = productMatch[1];
    const product = productsData.find(p => p.id === productId || p._id === productId);
    if (product) {
      return { success: true, product, isOffline: true };
    }
    return { success: false, message: 'Product not found', isOffline: true };
  }

  // 5. Auth Login fallback
  if (pathname === '/api/auth/login' && method === 'POST') {
    let body = {};
    try { body = JSON.parse(options.body || '{}'); } catch {}
    const { email, password } = body;

    // Check demo accounts
    if (email === 'admin@greenfresh.com') {
      const adminUser = {
        _id: 'admin-offline-id',
        name: 'Green Fresh Administrator',
        email: 'admin@greenfresh.com',
        role: 'admin',
        phone: '1800-473-363'
      };
      return {
        success: true,
        message: 'Admin demo login successful (Offline Mode)',
        token: 'offline-admin-token-' + Date.now(),
        user: adminUser,
        isOffline: true
      };
    }

    // Default regular customer fallback
    const offlineUser = {
      _id: 'cust-offline-' + Date.now(),
      name: email ? email.split('@')[0] : 'Sai Kumar Reddy',
      email: email || 'customer@greenfresh.com',
      role: 'customer',
      phone: '6300574681'
    };

    return {
      success: true,
      message: 'Demo login successful (Offline Mode)',
      token: 'offline-customer-token-' + Date.now(),
      user: offlineUser,
      isOffline: true
    };
  }

  // 6. Auth Register fallback
  if (pathname === '/api/auth/register' && method === 'POST') {
    let body = {};
    try { body = JSON.parse(options.body || '{}'); } catch {}
    const { name, email, role, phone } = body;

    const registeredUser = {
      _id: 'usr-reg-' + Date.now(),
      name: name || 'Sai Kumar Reddy Peddireddy',
      email: email || 'saikumarreddy4681@gmail.com',
      role: role || 'customer',
      phone: phone || '6300574681'
    };

    return {
      success: true,
      message: 'Account created successfully (Offline Preview Mode). Connect backend for persistent database storage.',
      token: 'offline-registered-token-' + Date.now(),
      user: registeredUser,
      isOffline: true
    };
  }

  // 7. Orders fallback
  if (pathname === '/api/orders' && method === 'POST') {
    let body = {};
    try { body = JSON.parse(options.body || '{}'); } catch {}
    const mockOrder = {
      _id: 'GF-ORD-' + Math.floor(100000 + Math.random() * 900000),
      orderId: 'GF-' + Date.now().toString().slice(-6),
      orderItems: body.orderItems || [],
      shippingAddress: body.shippingAddress || {},
      paymentMethod: body.paymentMethod || 'COD',
      totalPrice: body.totalPrice || 0,
      orderStatus: 'Confirmed',
      isPaid: body.paymentMethod !== 'COD',
      createdAt: new Date().toISOString()
    };

    try {
      const stored = JSON.parse(localStorage.getItem('greenfresh_offline_orders') || '[]');
      stored.unshift(mockOrder);
      localStorage.setItem('greenfresh_offline_orders', JSON.stringify(stored));
    } catch {}

    return {
      success: true,
      message: 'Order placed successfully (Offline Mode)',
      order: mockOrder,
      isOffline: true
    };
  }

  if (pathname === '/api/orders/my-orders' && method === 'GET') {
    let orders = [];
    try {
      orders = JSON.parse(localStorage.getItem('greenfresh_offline_orders') || '[]');
    } catch {}
    return {
      success: true,
      orders,
      isOffline: true
    };
  }

  // 8. Generic fallback
  return {
    success: false,
    isOffline: true,
    message: 'Backend server is not running on http://localhost:5000.'
  };
};

const handleFetch = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    // If backend replied with 502/504 Bad Gateway / Proxy error from Vite
    if (!res.ok && (res.status === 502 || res.status === 504 || res.status === 500)) {
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return handleOfflineFallback(url, options);
      }
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`API Fetch Error [${url}]:`, err);
    return handleOfflineFallback(url, options);
  }
};

export const api = {
  // Health
  async getHealth() {
    return handleFetch(`${API_BASE}/health`);
  },

  // Auth
  async login(email, password) {
    return handleFetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
  },

  async register(userData) {
    return handleFetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
  },

  async getProfile() {
    return handleFetch(`${API_BASE}/auth/profile`, {
      headers: getHeaders()
    });
  },

  async updateProfile(profileData) {
    return handleFetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData)
    });
  },

  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return handleFetch(`${API_BASE}/products${query ? `?${query}` : ''}`);
  },

  async getProductById(id) {
    return handleFetch(`${API_BASE}/products/${id}`);
  },

  async getCategories() {
    return handleFetch(`${API_BASE}/categories`);
  },

  async addReview(productId, reviewData) {
    return handleFetch(`${API_BASE}/products/${productId}/reviews`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reviewData)
    });
  },

  // Orders
  async createOrder(orderData) {
    return handleFetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData)
    });
  },

  async getMyOrders() {
    return handleFetch(`${API_BASE}/orders/my-orders`, {
      headers: getHeaders()
    });
  },

  async getOrderById(id) {
    return handleFetch(`${API_BASE}/orders/${id}`, {
      headers: getHeaders()
    });
  },

  async cancelOrder(id) {
    return handleFetch(`${API_BASE}/orders/${id}/cancel`, {
      method: 'PUT',
      headers: getHeaders()
    });
  },

  // Admin APIs
  async getAdminDashboard() {
    return handleFetch(`${API_BASE}/admin/dashboard`, {
      headers: getHeaders()
    });
  },

  async getAdminOrders(status = '') {
    const query = status ? `?status=${status}` : '';
    return handleFetch(`${API_BASE}/admin/orders${query}`, {
      headers: getHeaders()
    });
  },

  async updateOrderStatus(id, status, note = '') {
    return handleFetch(`${API_BASE}/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status, note })
    });
  },

  async createProduct(productData) {
    return handleFetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(productData)
    });
  },

  async updateProduct(id, productData) {
    return handleFetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(productData)
    });
  },

  async deleteProduct(id) {
    return handleFetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
  },

  async getAdminUsers() {
    return handleFetch(`${API_BASE}/admin/users`, {
      headers: getHeaders()
    });
  }
};
