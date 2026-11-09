import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { isConnectedToMongo, memoryStore } from '../config/db.js';

export const getDashboardStats = async (req, res) => {
  try {
    if (isConnectedToMongo) {
      const totalOrders = await Order.countDocuments();
      const totalProducts = await Product.countDocuments();
      const totalCustomers = await User.countDocuments({ role: 'customer' });

      const allOrders = await Order.find();
      const totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const pendingOrders = allOrders.filter(o => ['Placed', 'Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out For Delivery'].includes(o.orderStatus)).length;
      const completedOrders = allOrders.filter(o => o.orderStatus === 'Delivered').length;

      const allProducts = await Product.find();
      const lowStockProducts = allProducts.filter(p => (p.stock || 0) < 35).length;
      const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(6);

      return res.json({
        success: true,
        stats: {
          totalRevenue: Math.round(totalRevenue),
          totalOrders,
          totalProducts,
          activeCustomers: totalCustomers || 1,
          pendingOrders,
          completedOrders,
          lowStockProducts,
          recentOrders,
          salesByCategory: [
            { category: 'Fresh Fruits', percentage: 42, amount: Math.round(totalRevenue * 0.42) },
            { category: 'Fresh Vegetables', percentage: 38, amount: Math.round(totalRevenue * 0.38) },
            { category: 'Milk & Dairy', percentage: 20, amount: Math.round(totalRevenue * 0.20) }
          ],
          weeklyTrend: [
            { day: 'Mon', revenue: 4200 },
            { day: 'Tue', revenue: 5800 },
            { day: 'Wed', revenue: 4900 },
            { day: 'Thu', revenue: 7100 },
            { day: 'Fri', revenue: 8400 },
            { day: 'Sat', revenue: 11200 },
            { day: 'Sun', revenue: 9600 }
          ]
        }
      });
    } else {
      const allOrders = memoryStore.orders || [];
      const totalOrders = allOrders.length;
      const totalProducts = memoryStore.products.length;
      const activeCustomers = memoryStore.users.filter(u => u.role === 'customer').length || 2;
      const totalRevenue = allOrders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);
      const pendingOrders = allOrders.filter(o => ['Placed', 'Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out For Delivery'].includes(o.orderStatus)).length;
      const completedOrders = allOrders.filter(o => o.orderStatus === 'Delivered').length;
      const lowStockProducts = memoryStore.products.filter(p => (p.stock || 0) < 35).length;

      return res.json({
        success: true,
        stats: {
          totalRevenue: Math.round(totalRevenue),
          totalOrders,
          totalProducts,
          activeCustomers,
          pendingOrders,
          completedOrders,
          lowStockProducts,
          recentOrders: allOrders.slice(0, 6),
          salesByCategory: [
            { category: 'Fresh Fruits', percentage: 42, amount: Math.round(totalRevenue * 0.42) },
            { category: 'Fresh Vegetables', percentage: 38, amount: Math.round(totalRevenue * 0.38) },
            { category: 'Milk & Dairy', percentage: 20, amount: Math.round(totalRevenue * 0.20) }
          ],
          weeklyTrend: [
            { day: 'Mon', revenue: 4200 },
            { day: 'Tue', revenue: 5800 },
            { day: 'Wed', revenue: 4900 },
            { day: 'Thu', revenue: 7100 },
            { day: 'Fri', revenue: 8400 },
            { day: 'Sat', revenue: 11200 },
            { day: 'Sun', revenue: 9600 }
          ]
        }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;

    if (isConnectedToMongo) {
      let filter = {};
      if (status && status !== 'all') {
        filter.orderStatus = status;
      }
      const orders = await Order.find(filter).sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, orders });
    } else {
      let orders = [...memoryStore.orders];
      if (status && status !== 'all') {
        orders = orders.filter(o => o.orderStatus.toLowerCase() === status.toLowerCase());
      }
      return res.json({ success: true, count: orders.length, orders });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const allowed = [
      'Placed',
      'Pending',
      'Confirmed',
      'Processing',
      'Packed',
      'Shipped',
      'Out For Delivery',
      'Delivered',
      'Cancelled'
    ];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status value. Allowed: ${allowed.join(', ')}` });
    }

    if (isConnectedToMongo) {
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

      order.orderStatus = status;
      if (status === 'Delivered') {
        order.paymentStatus = 'Paid';
      }

      order.statusTimeline.push({
        status,
        timestamp: new Date(),
        description: note || `Order updated to ${status} by admin.`
      });

      await order.save();
      return res.json({ success: true, message: 'Order status updated successfully', order });
    } else {
      const order = memoryStore.orders.find(o => o._id === id || o.orderNumber === id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

      order.orderStatus = status;
      if (status === 'Delivered') {
        order.paymentStatus = 'Paid';
      }

      order.statusTimeline.push({
        status,
        timestamp: new Date(),
        description: note || `Order updated to ${status} by admin.`
      });

      return res.json({ success: true, message: 'Order status updated successfully', order });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    if (isConnectedToMongo) {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      return res.json({ success: true, count: users.length, users });
    } else {
      const safeUsers = memoryStore.users.map(({ password, ...rest }) => rest);
      return res.json({ success: true, count: safeUsers.length, users: safeUsers });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
