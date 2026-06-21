import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Heart, ShoppingBag, ArrowLeft, Star, MessageSquare, ShieldCheck, RefreshCw } from 'lucide-react';

export const ProductDetails = () => {
  const { selectedProductSlug, navigate, addToCart, toggleWishlist, isProductInWishlist, user } = useApp();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  // Track selected variants, e.g. { color: 'Blue Titanium', storage: '256GB' }
  const [selectedVariants, setSelectedVariants] = useState({});
  
  // Review submission state
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  // Load product details
  const loadProductDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getProductDetails(selectedProductSlug);
      if (res.status === 'success') {
        const prod = res.data;
        setProduct(prod);
        
        // Set default active image
        const priImage = prod.images && prod.images.find(img => img.is_primary)?.image_url 
          || (prod.images && prod.images[0]?.image_url) 
          || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';
        setActiveImage(priImage);

        // Pre-select first options of variants if any
        if (prod.variants && prod.variants.length > 0) {
          const defaults = {};
          prod.variants.forEach(v => {
            if (!defaults[v.type]) {
              defaults[v.type] = v.value;
            }
          });
          setSelectedVariants(defaults);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load product details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProductSlug) {
      loadProductDetails();
    }
  }, [selectedProductSlug]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '1rem' }}>
        <RefreshCw size={40} className="animate-spin" color="var(--primary)" style={{ animation: 'spin 1.5s linear infinite' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', margin: '2rem auto', maxWidth: '600px' }}>
        <h3 style={{ color: 'var(--accent-rose)', fontSize: '1.25rem', marginBottom: '1rem' }}>Error</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{error || 'Product not found.'}</p>
        <button className="btn btn-primary" onClick={() => navigate('catalog')}>
          <ArrowLeft size={16} />
          <span>Back to Catalog</span>
        </button>
      </div>
    );
  }

  // Group variants by type (e.g. color, storage, size)
  const variantGroups = {};
  if (product.variants) {
    product.variants.forEach(v => {
      if (!variantGroups[v.type]) {
        variantGroups[v.type] = [];
      }
      if (!variantGroups[v.type].some(item => item.value === v.value)) {
        variantGroups[v.type].push(v);
      }
    });
  }

  // Calculate price dynamically based on selected variants modifiers
  const basePrice = product.discount_price ?? product.price;
  let priceModifierTotal = 0;
  let stockLimit = product.stock_quantity;

  Object.entries(selectedVariants).forEach(([type, value]) => {
    const matched = product.variants.find(v => v.type === type && v.value === value);
    if (matched) {
      priceModifierTotal += parseFloat(matched.price_modifier || 0);
      // Stock limit is the minimum of main product stock and the specific variant stock
      stockLimit = Math.min(stockLimit, matched.stock_quantity);
    }
  });

  const finalUnitPrice = basePrice + priceModifierTotal;
  const isOutOfStock = stockLimit <= 0;
  const wishlistActive = isProductInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product.id, quantity, selectedVariants);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setSubmittingReview(true);
    try {
      const res = await api.submitReview(product.id, reviewRating, reviewText);
      if (res.status === 'success') {
        // Success toast is shown in API / AppContext
        setReviewText('');
        setReviewRating(5);
        // Refresh product details to show pending/updated reviews (note: pending won't show for guest/users unless approved, but let's refresh anyway)
        loadProductDetails();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const images = product.images || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }} className="animate-slide-up">
      {/* Back button */}
      <div>
        <button className="btn btn-secondary" onClick={() => navigate('catalog')} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Catalog</span>
        </button>
      </div>

      {/* Main product presentation grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1.2fr)', gap: '3rem' }}>
        
        {/* Gallery column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Main Display Image */}
          <div className="glass-card" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.01)', overflow: 'hidden' }}>
            <img 
              src={activeImage} 
              alt={product.name} 
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', padding: '0.25rem' }}>
              {images.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveImage(img.image_url)}
                  className="glass-card"
                  style={{
                    width: '70px',
                    height: '70px',
                    padding: '0.25rem',
                    cursor: 'pointer',
                    flexShrink: 0,
                    border: activeImage === img.image_url ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    background: 'rgba(255,255,255,0.02)'
                  }}
                >
                  <img src={img.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-primary">{product.brand?.name || 'Nexa'}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{product.category?.name}</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>{product.name}</h1>
            
            {/* SKU and Stock info */}
            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>SKU: <strong style={{ color: 'var(--text-primary)' }}>{product.sku}</strong></span>
              <span>
                Availability: {isOutOfStock ? (
                  <strong style={{ color: 'var(--accent-rose)' }}>Out of Stock</strong>
                ) : (
                  <strong style={{ color: 'var(--accent-emerald)' }}>In Stock ({stockLimit} units)</strong>
                )}
              </span>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

          {/* Pricing area */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>৳{finalUnitPrice.toFixed(2)}</span>
              {product.discount_price && (
                <span style={{ fontSize: '1.3rem', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>৳{(parseFloat(product.price) + priceModifierTotal).toFixed(2)}</span>
              )}
            </div>
            {product.discount_price && (
              <div style={{ color: 'var(--accent-emerald)', fontSize: '0.85rem', fontWeight: 600, marginTop: '0.25rem' }}>
                You save: ৳{(product.price - product.discount_price).toFixed(2)}!
              </div>
            )}
          </div>

          {/* Description */}
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>{product.description}</p>

          {/* Variants Selectors */}
          {Object.keys(variantGroups).length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {Object.entries(variantGroups).map(([type, options]) => (
                <div key={type}>
                  <span style={{ textTransform: 'capitalize', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                    Select {type}
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {options.map(opt => {
                      const isSelected = selectedVariants[type] === opt.value;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setSelectedVariants(prev => ({ ...prev, [type]: opt.value }))}
                          className="btn"
                          style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.85rem',
                            borderRadius: 'var(--radius-sm)',
                            border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                            background: isSelected ? 'var(--primary-glow)' : 'rgba(255,255,255,0.02)',
                            color: isSelected ? '#fff' : 'var(--text-primary)',
                            fontWeight: isSelected ? 700 : 500,
                          }}
                        >
                          {opt.value}
                          {opt.price_modifier > 0 && ` (+৳${opt.price_modifier})`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity Selector & Actions */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '1rem' }}>
            {!isOutOfStock && (
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.25rem' }}>
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="btn btn-secondary"
                  style={{ width: '36px', height: '36px', padding: 0, minWidth: 0, borderRadius: 'var(--radius-sm)' }}
                >
                  -
                </button>
                <span style={{ width: '40px', textAlign: 'center', fontWeight: 700 }}>{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => Math.min(stockLimit, q + 1))}
                  className="btn btn-secondary"
                  style={{ width: '36px', height: '36px', padding: 0, minWidth: 0, borderRadius: 'var(--radius-sm)' }}
                >
                  +
                </button>
              </div>
            )}

            <button 
              onClick={handleAddToCart}
              className="btn btn-primary"
              style={{ flex: 1, height: '48px' }}
              disabled={isOutOfStock}
            >
              <ShoppingBag size={18} />
              <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
            </button>

            <button 
              onClick={() => toggleWishlist(product.id)}
              className="btn btn-secondary"
              style={{ width: '48px', height: '48px', padding: 0, minWidth: 0 }}
              title="Add to Wishlist"
            >
              <Heart size={20} fill={wishlistActive ? 'var(--accent-rose)' : 'none'} color={wishlistActive ? 'var(--accent-rose)' : 'var(--text-primary)'} />
            </button>
          </div>

          {/* Badges/Trust seals */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} color="var(--primary)" />
              <span>100% Original Products</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} color="var(--primary)" />
              <span>Secure Transactions</span>
            </div>
          </div>

        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

      {/* Reviews section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(300px, 400px)', gap: '3rem' }}>
        
        {/* Approved reviews list */}
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={20} color="var(--primary)" />
            <span>Customer Reviews ({product.reviews?.length || 0})</span>
          </h3>

          {(!product.reviews || product.reviews.length === 0) ? (
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No reviews yet. Be the first to share your experience!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {product.reviews.map(review => (
                <div key={review.id} className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '0.95rem' }}>{review.user?.name || 'Customer'}</strong>
                    <div style={{ display: 'flex', color: 'var(--secondary)' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < review.rating ? 'var(--secondary)' : 'none'} color="var(--secondary)" />
                      ))}
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>{review.review_text}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>
                    Posted on {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Review Column */}
        <div className="glass-card" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Write a Review</h3>
          
          {user ? (
            <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Rating select */}
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Your Rating</label>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary)' }}
                    >
                      <Star size={24} fill={star <= reviewRating ? 'var(--secondary)' : 'none'} color="var(--secondary)" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Area */}
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Your Comments</label>
                <textarea
                  rows={4}
                  placeholder="Share details of your experience with this product..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%', resize: 'none' }}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submittingReview}
                style={{ width: '100%' }}
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Please <button onClick={() => navigate('profile')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Sign In</button> to submit a product review.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
