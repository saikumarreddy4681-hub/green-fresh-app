import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: { type: String, default: 'cust-1' },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  categorySlug: {
    type: String,
    default: ''
  },
  subcategory: {
    type: String,
    default: 'General'
  },
  brand: {
    type: String,
    default: 'Green Fresh'
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  discountPrice: {
    type: Number,
    min: 0
  },
  unit: {
    type: String,
    default: '500g'
  },
  image: {
    type: String,
    required: [true, 'Image URL is required']
  },
  images: [String],
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  stock: {
    type: Number,
    default: 50,
    min: 0
  },
  rating: {
    type: Number,
    default: 4.8,
    min: 0,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 1
  },
  reviews: [reviewSchema],
  farmOrigin: {
    type: String,
    default: 'Green Valley Organic Farms'
  },
  harvestDate: {
    type: String,
    default: 'Harvested Today'
  },
  freshnessScore: {
    type: Number,
    default: 98
  },
  isOrganic: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isBestseller: {
    type: Boolean,
    default: false
  },
  isDailyDeal: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;

