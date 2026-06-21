import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Heart, ShoppingBag, ArrowLeft, Star, MessageSquare, ShieldCheck, RefreshCw } from 'lucide-react';
import { fetchProductDetails, submitReview, clearCurrentProduct } from '../redux/slices/catalogSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import { toast } from 'sonner';

export const ProductDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentProduct: product, detailLoading: loading, error } = useSelector((state) => state.catalog);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    dispatch(fetchProductDetails(slug));
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, slug]);

  useEffect(() => {
    if (product) {
      const priImage = product.images?.find(img => img.is_primary)?.image_url 
        || product.images?.[0]?.image_url 
        || product.image_url 
        || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';
      setActiveImage(priImage);

      if (product.variants?.length > 0) {
        const defaults = {};
        product.variants.forEach(v => {
          if (!defaults[v.type]) {
            defaults[v.type] = v.value;
          }
        });
        setSelectedVariants(defaults);
      }
    }
  }, [product]);

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <RefreshCw className="h-10 w-10 text-[#E63946] animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-md text-center py-16 px-4">
        <h3 className="text-lg font-bold text-red-600 font-poppins">Product Not Found</h3>
        <p className="mt-2 text-sm text-gray-500 font-inter">{error || "The requested design could not be loaded."}</p>
        <Link 
          to="/shop" 
          className="mt-6 inline-flex items-center space-x-1 rounded-full bg-[#E63946] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#C1121F]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  // Group variants by type
  const variantGroups = {};
  product.variants?.forEach(v => {
    if (!variantGroups[v.type]) {
      variantGroups[v.type] = [];
    }
    if (!variantGroups[v.type].some(item => item.value === v.value)) {
      variantGroups[v.type].push(v);
    }
  });

  // Calculate dynamic price modifiers
  const basePrice = parseFloat(product.discount_price ?? product.price);
  let priceModifierTotal = 0;
  let stockLimit = product.stock_quantity;

  Object.entries(selectedVariants).forEach(([type, value]) => {
    const matched = product.variants?.find(v => v.type === type && v.value === value);
    if (matched) {
      priceModifierTotal += parseFloat(matched.price_modifier || 0);
      stockLimit = Math.min(stockLimit, matched.stock_quantity);
    }
  });

  const finalUnitPrice = basePrice + priceModifierTotal;
  const isOutOfStock = stockLimit <= 0;
  const wishlistActive = wishlistItems.some(item => (item.product?.id === product.id || item.id === product.id));

  const handleAddToCart = async () => {
    try {
      await dispatch(addToCart({ product, quantity, variantDetails: selectedVariants })).unwrap();
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      toast.error('Failed to add item');
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.warning('Please sign in to update your wishlist');
      navigate('/login');
      return;
    }
    try {
      await dispatch(toggleWishlist(product)).unwrap();
      toast.success('Wishlist updated');
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setSubmittingReview(true);
    try {
      await dispatch(submitReview({ productId: product.id, rating: reviewRating, reviewText })).unwrap();
      toast.success('Review submitted successfully for moderation');
      setReviewText('');
      setReviewRating(5);
      dispatch(fetchProductDetails(slug)); // Refetch reviews list
    } catch (err) {
      toast.error(err || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      <Helmet>
        <title>{product.name} | NexaCommerce Premium</title>
        <meta name="description" content={product.description} />
      </Helmet>

      {/* Back to shop navigation */}
      <div>
        <Link 
          to="/shop" 
          className="inline-flex items-center space-x-1 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Shop Catalog</span>
        </Link>
      </div>

      {/* Presentation view */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
        {/* Images Columns */}
        <div className="space-y-4">
          <div className="h-96 w-full rounded-2xl bg-white border border-gray-150 overflow-hidden flex items-center justify-center p-4">
            <img 
              src={activeImage} 
              alt={product.name} 
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Thumbnails list */}
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img.image_url)}
                  className={`h-16 w-16 flex-shrink-0 rounded-lg bg-white border p-1 overflow-hidden transition-all ${
                    activeImage === img.image_url ? 'border-[#E63946] ring-1 ring-[#E63946]' : 'border-gray-200'
                  }`}
                >
                  <img src={img.image_url} alt="" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Configurations column */}
        <div className="space-y-6 mt-8 lg:mt-0">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#E63946] uppercase font-poppins">
              <span>{product.brand?.name || 'Nexa'}</span>
              <span className="text-gray-400 font-medium normal-case font-inter">• {product.category?.name}</span>
            </div>
            <h1 className="font-poppins text-3xl font-bold tracking-tight text-gray-900 mt-2">{product.name}</h1>
            <p className="text-xs text-gray-500 font-inter mt-1.5">
              SKU: <strong className="text-gray-800">{product.sku}</strong> • Availability: {
                isOutOfStock ? (
                  <span className="font-semibold text-red-600">Out of Stock</span>
                ) : (
                  <span className="font-semibold text-emerald-600">In Stock ({stockLimit} units)</span>
                )
              }
            </p>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-baseline space-x-3">
              <span className="font-poppins text-3xl font-bold text-gray-950">${finalUnitPrice.toFixed(2)}</span>
              {product.discount_price && (
                <span className="font-poppins text-lg text-gray-400 line-through">
                  ${(parseFloat(product.price) + priceModifierTotal).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <p className="text-sm leading-relaxed text-gray-600 font-inter">{product.description}</p>

          {/* Variants pickers */}
          {Object.entries(variantGroups).map(([type, options]) => (
            <div key={type} className="space-y-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 font-poppins">
                Select {type}
              </span>
              <div className="flex flex-wrap gap-2">
                {options.map((opt) => {
                  const isSelected = selectedVariants[type] === opt.value;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedVariants(prev => ({ ...prev, [type]: opt.value }))}
                      className={`rounded-lg px-4 py-2 text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'border-[#E63946] bg-red-50 text-[#E63946]'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {opt.value}
                      {opt.price_modifier > 0 && ` (+$${parseFloat(opt.price_modifier).toFixed(2)})`}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Add to Cart Actions */}
          <div className="flex flex-wrap gap-4 items-center border-t border-gray-100 pt-6">
            {!isOutOfStock && (
              <div className="flex items-center rounded-lg border border-gray-200 p-1">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-1 font-bold text-gray-600 hover:bg-gray-50 rounded"
                >
                  -
                </button>
                <span className="w-10 text-center text-sm font-bold text-gray-900 font-poppins">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => Math.min(stockLimit, q + 1))}
                  className="px-3 py-1 font-bold text-gray-600 hover:bg-gray-50 rounded"
                >
                  +
                </button>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex-1 flex items-center justify-center space-x-2 rounded-xl bg-[#E63946] h-12 text-sm font-semibold text-white hover:bg-[#C1121F] disabled:bg-gray-200 disabled:text-gray-400 shadow-lg shadow-red-200/50 cursor-pointer transition-colors"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
            </button>

            <button
              onClick={handleToggleWishlist}
              className={`flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors ${
                wishlistActive ? 'text-[#E63946] border-[#E63946]/50 bg-red-50' : 'text-gray-500'
              }`}
            >
              <Heart className={`h-5 w-5 ${wishlistActive ? 'fill-[#E63946]' : ''}`} />
            </button>
          </div>

          {/* Trust points */}
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 border-t border-gray-100 pt-4">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-[#E63946]" />
              <span>100% Original Products</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-[#E63946]" />
              <span>Concierge Protected Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Grid Section */}
      <div className="border-t border-gray-200 pt-12 lg:grid lg:grid-cols-3 lg:gap-x-12">
        {/* Left Side: Reviews log list */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-poppins text-lg font-bold text-gray-900 flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-[#E63946]" />
            <span>Product Reviews ({product.reviews?.length || 0})</span>
          </h3>

          {(!product.reviews || product.reviews.length === 0) ? (
            <div className="rounded-xl border border-gray-100 p-8 text-center text-sm text-gray-500 bg-white">
              No reviews registered yet. Be the first to share your thoughts!
            </div>
          ) : (
            <div className="space-y-4">
              {product.reviews.map((rev) => (
                <div key={rev.id} className="rounded-xl border border-gray-100 p-5 bg-white space-y-2">
                  <div className="flex justify-between items-center">
                    <strong className="text-sm font-semibold text-gray-900">{rev.user?.name || 'Customer'}</strong>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < rev.rating ? 'fill-current' : 'text-gray-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed font-inter">{rev.review_text}</p>
                  <span className="block text-[10px] text-gray-400 font-inter">
                    Posted on {new Date(rev.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Write review form */}
        <div className="rounded-xl bg-white border border-gray-100 p-6 h-fit mt-8 lg:mt-0">
          <h3 className="font-poppins font-bold text-gray-900 mb-4 text-md">Write a Review</h3>

          {isAuthenticated ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase font-poppins mb-2">Rating</label>
                <div className="flex space-x-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="cursor-pointer"
                    >
                      <Star className={`h-6 w-6 ${star <= reviewRating ? 'fill-current' : 'text-gray-200'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase font-poppins mb-2">Comments</label>
                <textarea
                  rows={4}
                  placeholder="Share details of your experience with this design..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#E63946] focus:bg-white focus:outline-none transition-colors resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full flex items-center justify-center rounded-xl bg-[#E63946] py-2.5 text-sm font-semibold text-white hover:bg-[#C1121F] disabled:opacity-50 cursor-pointer transition-colors"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <div className="text-center text-sm text-gray-500 py-4 font-inter">
              Please <Link to="/login" className="text-[#E63946] font-semibold underline">sign in</Link> to submit a product review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProductDetails;
