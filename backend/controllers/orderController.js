import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { isConnectedToMongo, memoryStore } from '../config/db.js';

export const createOrder = async (req, res) => {
  try {
    const {
      customer,
      shippingAddress,
      deliverySlot,
      orderItems,
      paymentMethod,
      paymentDetails,
      subtotal,
      deliveryFee,
      discount,
      totalAmount,
      notes
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Your shopping cart is empty.' });
    }

    if (!customer || !customer.name || !customer.phone || !shippingAddress || !shippingAddress.street) {
      return res.status(400).json({ success: false, message: 'Please provide full contact and delivery address information.' });
    }

    const orderNumber = 'GF-' + Math.floor(100000 + Math.random() * 900000);
    const userId = req.user ? (req.user._id || req.user.id) : null;

    let paymentStatus = 'Pending';
    if (paymentMethod === 'UPI' || paymentMethod === 'CARD') {
      paymentStatus = 'Paid';
    }

    const orderData = {
      orderNumber,
      user: userId,
      customer,
      shippingAddress,
      deliverySlot: deliverySlot || 'Standard Delivery',
      orderItems,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus,
      paymentDetails: paymentDetails || {},
      subtotal: Number(subtotal),
      deliveryFee: Number(deliveryFee || 0),
      discount: Number(discount || 0),
      totalAmount: Number(totalAmount),
      orderStatus: 'Placed',
      statusTimeline: [
        {
          status: 'Placed',
          timestamp: new Date(),
          description: 'Order placed successfully. We are preparing your fresh basket.'
        }
      ],
      notes: notes || ''
    };

    if (isConnectedToMongo) {
      const order = await Order.create(orderData);

      // Decrement stock in MongoDB
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity }
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully!',
        order
      });
    } else {
      const order = {
        ...orderData,
        _id: 'ord-' + Date.now(),
        createdAt: new Date().toISOString()
      };

      // Decrement in memory
      for (const item of orderItems) {
        const prod = memoryStore.products.find(p => p.id === item.productId || p._id === item.productId);
        if (prod && prod.stock >= item.quantity) {
          prod.stock -= item.quantity;
        }
      }

      memoryStore.orders.unshift(order);

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully!',
        order
      });
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const userEmail = req.user.email;

    if (isConnectedToMongo) {
      const orders = await Order.find({
        $or: [
          { user: userId },
          { 'customer.email': userEmail }
        ]
      }).sort({ createdAt: -1 });

      return res.json({ success: true, count: orders.length, orders });
    } else {
      const orders = memoryStore.orders.filter(o => 
        (o.user && (o.user === userId || o.user._id === userId)) ||
        (o.customer && o.customer.email && o.customer.email.toLowerCase() === userEmail.toLowerCase())
      );
      return res.json({ success: true, count: orders.length, orders });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isConnectedToMongo) {
      const order = await Order.findOne({
        $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { orderNumber: id }]
      });
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      return res.json({ success: true, order });
    } else {
      const order = memoryStore.orders.find(o => o._id === id || o.orderNumber === id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      return res.json({ success: true, order });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (isConnectedToMongo) {
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

      if (['Shipped', 'Out For Delivery', 'Delivered'].includes(order.orderStatus)) {
        return res.status(400).json({ success: false, message: 'Order is already in transit or delivered and cannot be cancelled.' });
      }

      order.orderStatus = 'Cancelled';
      order.statusTimeline.push({
        status: 'Cancelled',
        timestamp: new Date(),
        description: 'Order cancelled by customer.'
      });
      await order.save();

      return res.json({ success: true, message: 'Order cancelled successfully', order });
    } else {
      const order = memoryStore.orders.find(o => o._id === id || o.orderNumber === id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

      if (['Shipped', 'Out For Delivery', 'Delivered'].includes(order.orderStatus)) {
        return res.status(400).json({ success: false, message: 'Order is already in transit or delivered and cannot be cancelled.' });
      }

      order.orderStatus = 'Cancelled';
      order.statusTimeline.push({
        status: 'Cancelled',
        timestamp: new Date(),
        description: 'Order cancelled by customer.'
      });

      return res.json({ success: true, message: 'Order cancelled successfully', order });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

