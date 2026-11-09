import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  icon: {
    type: String,
    default: 'Leaf'
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
export default Category;

