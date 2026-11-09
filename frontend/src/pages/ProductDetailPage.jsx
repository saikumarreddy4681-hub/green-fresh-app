import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Heart,
  Plus,
  Minus,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Leaf,
  Sparkles,
  MapPin,
  Clock,
  ArrowLeft,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Review form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.getProductById(id);
        if (res.success && res.product) {
          setProduct(res.product);

          // Fetch related products
          const relRes = await api.getProducts({ category: res.product.categorySlug || res.product.category });
          if (relRes.success && relRes.products) {
            setRelatedProducts(relRes.products.filter(p => (p.id || p._id) !== id).slice(0, 4));
          }
        }
      } catch (err) {
        console.error('Fetch product detail error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-gray-500 font-medium">Harvesting product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
        <p className="text-xs text-gray-500">The product you are looking for might have been harvested out of season.</p>
        <Link to="/products" className="inline-block bg-emerald-600 text-white text-xs font-bold px-6 py-2.5 rounded-full">
          Back to Store
        </Link>
      </div>
    );
  }

  const inWish = isInWishlist(product.id || product._id);
  const price = product.discountPrice || product.price;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await api.addReview(product.id || product._id, {
        rating,
        comment,
        userName: user ? user.name : 'Verified Customer'
      });
      if (res.success && res.product) {
        setProduct(res.product);
        setComment('');
        setReviewMessage('Thank you! Your verified review has been published.');
        setTimeout(() => setReviewMessage(''), 4000);
      }
    } catch (err) {
      console.error('Review submit error:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb */}
      <Link to="/products" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition">
        <ArrowLeft className="w-4 h-4" /> Back to All Groceries
      </Link>

      {/* Main Product Info Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Product Image */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-gray-50 aspect-square border border-gray-100 shadow-inner">
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/images/categories/vegetables.svg';
              }}
              className="w-full h-full object-cover"
            />
            {product.isOrganic && (
              <span className="absolute top-4 left-4 bg-emerald-700 text-white text-xs font-black tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5 fill-white" /> 100% ORGANIC
              </span>
            )}
            {product.freshnessScore && (
              <span className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm text-emerald-950 text-xs font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                {product.freshnessScore}% Freshness Score
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Origin & Harvest Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {product.farmOrigin}
              </span>
              <span className="bg-amber-50 text-amber-800 font-medium px-3 py-1 rounded-full flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> {product.harvestDate}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 font-serif">
              {product.name}
            </h1>

            {/* Rating & Stock */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1 bg-amber-50 text-amber-900 font-bold px-2.5 py-1 rounded-lg border border-amber-200">
                <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                <span>{product.rating || '4.9'}</span>
                <span className="text-gray-400 font-normal">({product.reviewsCount || 1} reviews)</span>
              </div>

              <span className="text-gray-300">•</span>
              <span className="text-emerald-700 font-bold">
                {product.stock > 0 ? `In Stock (${product.stock} units available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl sm:text-4xl font-black text-gray-900">₹{price}</span>
              {product.discountPrice && product.discountPrice < product.price && (
                <span className="text-lg text-gray-400 line-through">₹{product.price}</span>
              )}
              <span className="text-xs text-gray-500 font-medium">/ {product.unit}</span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pt-2">
              {product.description}
            </p>

            {/* Farm Trust highlights */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-xs">
              <div className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero synthetic chemicals</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Temperature controlled</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Certified Farm Source</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>100% Biodegradable Pack</span>
              </div>
            </div>
          </div>

          {/* Action Row: Quantity + Add to Cart + Wishlist */}
          <div className="pt-6 border-t border-gray-100 space-y-4">
            <div className="flex items-center gap-4">
              {/* Quantity Picker */}
              <div className="flex items-center border border-gray-200 rounded-2xl overflow-hidden bg-gray-50 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-white rounded-xl transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm font-extrabold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-white rounded-xl transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => addToCart(product, quantity)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Add {quantity} to Basket • ₹{price * quantity}
              </button>

              {/* Wishlist toggle */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-2xl border transition ${
                  inWish
                    ? 'bg-rose-50 border-rose-200 text-rose-500'
                    : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-rose-500'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${inWish ? 'fill-rose-500' : ''}`} />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Customer Reviews & Feedback Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-gray-900 font-serif">Customer Reviews</h3>
            <p className="text-xs text-gray-500">Verified thoughts from real household kitchens</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <span className="text-sm font-bold text-gray-900">{product.rating} / 5.0</span>
          </div>
        </div>

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev, idx) => (
              <div key={idx} className="bg-gray-50/70 p-4 rounded-2xl border border-gray-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{rev.userName}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Verified Buyer
                    </span>
                  </div>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i <= rev.rating ? 'fill-amber-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 italic">Be the first to leave a review for this fresh harvest!</p>
          )}
        </div>

        {/* Add Review Form */}
        <div className="pt-4 border-t border-gray-100">
          <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" /> Write a Review
          </h4>

          {reviewMessage && (
            <div className="mb-3 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200">
              {reviewMessage}
            </div>
          )}

          <form onSubmit={handleReviewSubmit} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Your Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setRating(s)}
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        s <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              required
              rows={3}
              placeholder="How was the freshness, taste, and packaging?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs focus:bg-white focus:outline-none focus:border-emerald-500"
            ></textarea>

            <button
              type="submit"
              disabled={submittingReview}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-full transition shadow-sm"
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 font-serif">
            More Fresh Picks in this Category
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id || p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

