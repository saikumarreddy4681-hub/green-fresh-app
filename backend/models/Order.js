import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false
  },
  productId: {
    type: String,
    required: true
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, default: 'item' },
  quantity: { type: Number, required: true, min: 1 },
  total: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  shippingAddress: {
    street: { type: String, required: true },
    apartment: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  deliverySlot: {
    type: String,
    default: 'Standard (Today 4:00 PM - 7:00 PM)'
  },
  orderItems: [orderItemSchema],
  paymentMethod: {
    type: String,
    enum: ['COD', 'UPI', 'CARD'],
    default: 'COD'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  paymentDetails: {
    transactionId: String,
    upiId: String,
    cardLast4: String,
    paymentDate: Date
  },
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  orderStatus: {
    type: String,
    enum: ['Placed', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancelled'],
    default: 'Placed'
  },
  statusTimeline: [
    {
      status: String,
      timestamp: { type: Date, default: Date.now },
      description: String
    }
  ],
  notes: String
}, {
  timestamps: true
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;

