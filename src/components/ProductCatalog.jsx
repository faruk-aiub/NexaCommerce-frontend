import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Heart, ShoppingBag, Eye, SlidersHorizontal, RefreshCw } from 'lucide-react';

export const ProductCatalog = ({ searchFilter }) => {
  const { navigate, addToCart, toggleWishlist, isProductInWishlist } = useApp();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Load categories and brands once on mount
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const catRes = await api.getCategories();
        if (catRes.status === 'success') {
          setCategories(catRes.data || []);
        }
        const brandRes = await api.getBrands();
        if (brandRes.status === 'success') {
          setBrands(brandRes.data || []);
        }
      } catch (err) {
        console.error("Failed to load catalog filters", err);
      }
    };
    loadFilters();
  }, []);

  // Fetch products when page, searchFilter, category, brand, or price constraints change
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          search: searchFilter,
          category_id: selectedCategory,
          brand_id: selectedBrand,
          min_price: minPrice,
          max_price: maxPrice,
          per_page: 8
        };
        const res = await api.getProducts(params);
        if (res.status === 'success') {
          setProducts(res.data.data || []);
          setLastPage(res.data.last_page || 1);
        }
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [page, searchFilter, selectedCategory, selectedBrand, minPrice, maxPrice]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }} className="animate-slide-up">
      {/* Sidebar Filters */}
      <aside className="glass-card" style={{ height: 'fit-content', position: 'sticky', top: '100px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
            <SlidersHorizontal size={18} color="var(--primary)" />
            <span>Filters</span>
          </div>
          <button 
            onClick={handleResetFilters}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
          >
            Reset
          </button>
        </div>

        {/* Categories */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>Categories</h4>
          <select 
            value={selectedCategory} 
            onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }} 
            className="glass-input" 
            style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-surface)' }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <React.Fragment key={cat.id}>
                <option value={cat.id}>{cat.name}</option>
                {cat.children && cat.children.map(subcat => (
                  <option key={subcat.id} value={subcat.id}>&nbsp;&nbsp;— {subcat.name}</option>
                ))}
              </React.Fragment>
            ))}
          </select>
        </div>

        {/* Brands */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>Brands</h4>
          <select 
            value={selectedBrand} 
            onChange={(e) => { setSelectedBrand(e.target.value); setPage(1); }} 
            className="glass-input" 
            style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-surface)' }}
          >
            <option value="">All Brands</option>
            {brands.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>Price Range (৳)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <input 
              type="number" 
              placeholder="Min" 
              value={minPrice} 
              onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
              className="glass-input" 
              style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem' }}
            />
            <input 
              type="number" 
              placeholder="Max" 
              value={maxPrice} 
              onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
              className="glass-input" 
              style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem' }}
            />
          </div>
        </div>
      </aside>

      {/* Products list area */}
      <div>
        {/* Header summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            {searchFilter ? `Search results for "${searchFilter}"` : 'Discover Premium Products'}
          </h2>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {products.length} Products Available
          </span>
        </div>

        {/* Catalog grid loader */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '1rem' }}>
            <RefreshCw size={40} className="animate-spin" color="var(--primary)" style={{ animation: 'spin 1.5s linear infinite' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Loading premium products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', borderStyle: 'dashed' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Products Found</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Try clearing filters or search parameter to view our latest catalogue.</p>
            <button className="btn btn-primary" onClick={handleResetFilters}>Clear Filters</button>
          </div>
        ) : (
          <div>
            {/* Products grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {products.map(product => {
                const primaryImage = product.images && product.images.find(img => img.is_primary)?.image_url 
                  || (product.images && product.images[0]?.image_url) 
                  || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';
                
                const hasDiscount = product.discount_price !== null && product.discount_price !== undefined;
                const wishlistActive = isProductInWishlist(product.id);

                return (
                  <div key={product.id} className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
                    {/* Wishlist quick toggle */}
                    <button 
                      onClick={() => toggleWishlist(product.id)}
                      style={{
                        position: 'absolute',
                        top: '1.5rem',
                        right: '1.5rem',
                        background: 'rgba(6, 9, 19, 0.65)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 2,
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <Heart size={16} fill={wishlistActive ? 'var(--accent-rose)' : 'none'} color={wishlistActive ? 'var(--accent-rose)' : 'var(--text-primary)'} />
                    </button>

                    {/* Image Area */}
                    <div 
                      onClick={() => navigate('product', product.slug)}
                      style={{ height: '200px', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.02)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.02)' }}
                    >
                      <img 
                        src={primaryImage} 
                        alt={product.name} 
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transition: 'transform var(--transition-normal)' }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    </div>

                    {/* Meta info */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      <span>{product.brand?.name || 'Nexa'}</span>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{product.category?.name || 'General'}</span>
                    </div>

                    <h3 
                      onClick={() => navigate('product', product.slug)}
                      style={{ fontSize: '1rem', fontWeight: 600, cursor: 'pointer', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      {product.name}
                    </h3>

                    {/* Pricing */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: 'auto', marginBottom: '1rem' }}>
                      {hasDiscount ? (
                        <>
                          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>৳{product.discount_price}</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>৳{product.price}</span>
                        </>
                      ) : (
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>৳{product.price}</span>
                      )}
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem' }}>
                      <button 
                        onClick={() => navigate('product', product.slug)} 
                        className="btn btn-secondary" 
                        style={{ padding: '0.5rem', fontSize: '0.8rem' }}
                      >
                        <Eye size={14} />
                        <span>Details</span>
                      </button>
                      <button 
                        onClick={() => addToCart(product.id, 1)}
                        className="btn btn-primary" 
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
                        disabled={product.stock_quantity <= 0}
                      >
                        <ShoppingBag size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {lastPage > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  Previous
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Page <strong style={{ color: 'var(--text-primary)' }}>{page}</strong> of <strong>{lastPage}</strong>
                </div>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setPage(p => Math.min(lastPage, p + 1))}
                  disabled={page === lastPage}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
