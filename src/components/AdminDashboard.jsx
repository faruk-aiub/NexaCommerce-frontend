import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  Users, BarChart3, Tag, MessageSquare, FileText, Plus, Trash2, Edit2, 
  Check, X, RefreshCw, Layers, Bookmark, Archive, TrendingUp, AlertTriangle, Download 
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user, showToast } = useApp();
  
  // Tab state: 'stats', 'products', 'categories', 'brands', 'reviews', 'coupons', 'invoices'
  const [activeTab, setActiveTab] = useState('stats');

  // Stats State
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Reviews Moderation State
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewLastPage, setReviewLastPage] = useState(1);

  // Coupons State
  const [coupons, setCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percentage',
    value: '',
    expiry_date: '',
    usage_limit: '',
    usage_limit_per_user: '1'
  });

  // Brands State
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [brandFields, setBrandFields] = useState({ name: '', description: '' });

  // Categories State
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFields, setCategoryFields] = useState({ name: '', description: '', parent_id: '' });

  // Products State
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productPage, setProductPage] = useState(1);
  const [productLastPage, setProductLastPage] = useState(1);
  const [productFields, setProductFields] = useState({
    name: '',
    description: '',
    price: '',
    discount_price: '',
    stock_quantity: '',
    sku: '',
    category_id: '',
    brand_id: '',
    status: 'active'
  });

  // Invoices State
  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [invoicePage, setInvoicePage] = useState(1);
  const [invoiceLastPage, setInvoiceLastPage] = useState(1);

  // Block non-admins
  const isAdmin = user && user.roles && user.roles.some(r => r.name === 'admin');

  // Load stats
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await api.getAdminStats();
      if (res.status === 'success') {
        setStats(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Load reviews moderation list
  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await api.getAdminReviews(reviewPage);
      if (res.status === 'success') {
        setReviews(res.data.data || []);
        setReviewLastPage(res.data.last_page || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Load coupons list
  const fetchCoupons = async () => {
    setLoadingCoupons(true);
    try {
      const res = await api.getAdminCoupons();
      if (res.status === 'success') {
        setCoupons(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCoupons(false);
    }
  };

  // Load brands list
  const fetchBrands = async () => {
    setLoadingBrands(true);
    try {
      const res = await api.getBrands();
      if (res.status === 'success') {
        setBrands(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBrands(false);
    }
  };

  // Load categories list
  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await api.getCategories();
      if (res.status === 'success') {
        setCategories(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Load products list
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await api.getProducts({ page: productPage, per_page: 8 });
      if (res.status === 'success') {
        setProducts(res.data.data || []);
        setProductLastPage(res.data.last_page || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Load invoices list
  const fetchInvoices = async () => {
    setLoadingInvoices(true);
    try {
      const res = await api.getAdminInvoices(invoicePage);
      if (res.status === 'success') {
        setInvoices(res.data.data || []);
        setInvoiceLastPage(res.data.last_page || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInvoices(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    
    if (activeTab === 'stats') fetchStats();
    if (activeTab === 'reviews') fetchReviews();
    if (activeTab === 'coupons') fetchCoupons();
    if (activeTab === 'brands') fetchBrands();
    if (activeTab === 'categories') fetchCategories();
    if (activeTab === 'products') {
      fetchProducts();
      fetchCategories();
      fetchBrands();
    }
    if (activeTab === 'invoices') fetchInvoices();
  }, [activeTab, reviewPage, productPage, invoicePage]);

  if (!isAdmin) {
    return (
      <div className="glass-card animate-slide-up" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '500px', margin: '3rem auto' }}>
        <h2 style={{ color: 'var(--accent-rose)', fontSize: '1.5rem', marginBottom: '1rem' }}>Unauthorized Action</h2>
        <p style={{ color: 'var(--text-secondary)' }}>You do not have the administrative privileges required to access the NexaCommerce management dashboard.</p>
      </div>
    );
  }

  // --- REVIEW MODERATION Actions ---
  const handleApproveReview = async (id) => {
    try {
      const res = await api.approveReview(id);
      if (res.status === 'success') {
        showToast('Review approved successfully.', 'success');
        await fetchReviews();
      }
    } catch (err) {
      showToast('Failed to approve review.', 'danger');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await api.deleteReview(id);
      if (res.status === 'success') {
        showToast('Review deleted successfully.', 'success');
        await fetchReviews();
      }
    } catch (err) {
      showToast('Failed to delete review.', 'danger');
    }
  };

  // --- COUPON Actions ---
  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createCoupon(newCoupon);
      if (res.status === 'success') {
        showToast('Coupon created successfully.', 'success');
        setShowCouponForm(false);
        setNewCoupon({ code: '', type: 'percentage', value: '', expiry_date: '', usage_limit: '', usage_limit_per_user: '1' });
        await fetchCoupons();
      }
    } catch (err) {
      showToast(err.message || 'Failed to save coupon.', 'danger');
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      const res = await api.deleteCoupon(id);
      if (res.status === 'success') {
        showToast('Coupon deleted.', 'success');
        await fetchCoupons();
      }
    } catch (err) {
      showToast('Failed to delete coupon.', 'danger');
    }
  };

  // --- BRAND Actions ---
  const handleBrandSubmit = async (e) => {
    e.preventDefault();
    try {
      // In a real app we might upload a file. For simulation, since brand creation logo is nullable:
      const formData = new FormData();
      formData.append('name', brandFields.name);
      formData.append('description', brandFields.description);

      let res;
      if (editingBrand) {
        res = await api.updateBrand(editingBrand.id, formData);
        showToast('Brand updated successfully.', 'success');
        setEditingBrand(null);
      } else {
        res = await api.createBrand(formData);
        showToast('Brand created successfully.', 'success');
      }

      if (res.status === 'success') {
        setShowBrandForm(false);
        setBrandFields({ name: '', description: '' });
        await fetchBrands();
      }
    } catch (err) {
      showToast(err.message || 'Failed to save brand.', 'danger');
    }
  };

  const handleEditBrandClick = (b) => {
    setEditingBrand(b);
    setBrandFields({ name: b.name, description: b.description || '' });
    setShowBrandForm(true);
  };

  const handleDeleteBrand = async (id) => {
    if (!confirm('Delete this brand? All products of this brand will be unlinked.')) return;
    try {
      const res = await api.deleteBrand(id);
      if (res.status === 'success') {
        showToast('Brand deleted.', 'success');
        await fetchBrands();
      }
    } catch (err) {
      showToast('Failed to delete brand.', 'danger');
    }
  };

  // --- CATEGORY Actions ---
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...categoryFields };
      if (payload.parent_id === '') delete payload.parent_id;

      let res;
      if (editingCategory) {
        res = await api.updateCategory(editingCategory.id, payload);
        showToast('Category updated successfully.', 'success');
        setEditingCategory(null);
      } else {
        res = await api.createCategory(payload);
        showToast('Category created successfully.', 'success');
      }

      if (res.status === 'success') {
        setShowCategoryForm(false);
        setCategoryFields({ name: '', description: '', parent_id: '' });
        await fetchCategories();
      }
    } catch (err) {
      showToast(err.message || 'Failed to save category.', 'danger');
    }
  };

  const handleEditCategoryClick = (c) => {
    setEditingCategory(c);
    setCategoryFields({ name: c.name, description: c.description || '', parent_id: c.parent_id || '' });
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Delete this category? All subcategories will be unlinked.')) return;
    try {
      const res = await api.deleteCategory(id);
      if (res.status === 'success') {
        showToast('Category deleted.', 'success');
        await fetchCategories();
      }
    } catch (err) {
      showToast('Failed to delete category.', 'danger');
    }
  };

  // --- PRODUCT Actions ---
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingProduct) {
        res = await api.updateProduct(editingProduct.id, productFields);
        showToast('Product updated successfully.', 'success');
        setEditingProduct(null);
      } else {
        res = await api.createProduct(productFields);
        showToast('Product created successfully.', 'success');
      }

      if (res.status === 'success') {
        setShowProductForm(false);
        setProductFields({
          name: '', description: '', price: '', discount_price: '',
          stock_quantity: '', sku: '', category_id: '', brand_id: '', status: 'active'
        });
        await fetchProducts();
      }
    } catch (err) {
      showToast(err.message || 'Failed to save product.', 'danger');
    }
  };

  const handleEditProductClick = (p) => {
    setEditingProduct(p);
    setProductFields({
      name: p.name,
      description: p.description || '',
      price: p.price,
      discount_price: p.discount_price || '',
      stock_quantity: p.stock_quantity,
      sku: p.sku,
      category_id: p.category_id || '',
      brand_id: p.brand_id || '',
      status: p.status || 'active'
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this product permanently?')) return;
    try {
      const res = await api.deleteProduct(id);
      if (res.status === 'success') {
        showToast('Product deleted.', 'success');
        await fetchProducts();
      }
    } catch (err) {
      showToast('Failed to delete product.', 'danger');
    }
  };

  // Download Invoice handler
  const handleDownloadInvoice = async (invoiceId, invoiceNumber) => {
    try {
      showToast('Downloading invoice PDF...', 'success');
      const blob = await api.getInvoiceBlob(invoiceId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error(err);
      showToast('Failed to download invoice.', 'danger');
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2rem' }} className="animate-slide-up">
      {/* Side Tabs */}
      <aside className="glass-card" style={{ height: 'fit-content', position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, padding: '0 0.5rem 0.5rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', color: 'var(--primary)' }}>Console Menu</h3>
        
        <button 
          onClick={() => setActiveTab('stats')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: 'none', background: activeTab === 'stats' ? 'rgba(99, 102, 241, 0.08)' : 'none', color: activeTab === 'stats' ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: activeTab === 'stats' ? 700 : 500, textAlign: 'left' }}
        >
          <BarChart3 size={16} />
          <span>Dashboard</span>
        </button>

        <button 
          onClick={() => setActiveTab('products')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: 'none', background: activeTab === 'products' ? 'rgba(99, 102, 241, 0.08)' : 'none', color: activeTab === 'products' ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: activeTab === 'products' ? 700 : 500, textAlign: 'left' }}
        >
          <Archive size={16} />
          <span>Products</span>
        </button>

        <button 
          onClick={() => setActiveTab('categories')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: 'none', background: activeTab === 'categories' ? 'rgba(99, 102, 241, 0.08)' : 'none', color: activeTab === 'categories' ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: activeTab === 'categories' ? 700 : 500, textAlign: 'left' }}
        >
          <Layers size={16} />
          <span>Categories</span>
        </button>

        <button 
          onClick={() => setActiveTab('brands')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: 'none', background: activeTab === 'brands' ? 'rgba(99, 102, 241, 0.08)' : 'none', color: activeTab === 'brands' ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: activeTab === 'brands' ? 700 : 500, textAlign: 'left' }}
        >
          <Bookmark size={16} />
          <span>Brands</span>
        </button>

        <button 
          onClick={() => setActiveTab('reviews')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: 'none', background: activeTab === 'reviews' ? 'rgba(99, 102, 241, 0.08)' : 'none', color: activeTab === 'reviews' ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: activeTab === 'reviews' ? 700 : 500, textAlign: 'left' }}
        >
          <MessageSquare size={16} />
          <span>Reviews</span>
        </button>

        <button 
          onClick={() => setActiveTab('coupons')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: 'none', background: activeTab === 'coupons' ? 'rgba(99, 102, 241, 0.08)' : 'none', color: activeTab === 'coupons' ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: activeTab === 'coupons' ? 700 : 500, textAlign: 'left' }}
        >
          <Tag size={16} />
          <span>Coupons</span>
        </button>

        <button 
          onClick={() => setActiveTab('invoices')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: 'none', background: activeTab === 'invoices' ? 'rgba(99, 102, 241, 0.08)' : 'none', color: activeTab === 'invoices' ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: activeTab === 'invoices' ? 700 : 500, textAlign: 'left' }}
        >
          <FileText size={16} />
          <span>Invoices</span>
        </button>
      </aside>

      {/* Main Console view */}
      <div>
        {/* --- STATS PANEL --- */}
        {activeTab === 'stats' && (
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '1.5rem' }}>Dashboard Overview</h2>
            
            {loadingStats ? (
              <RefreshCw className="animate-spin" size={24} style={{ animation: 'spin 1.5s linear infinite' }} />
            ) : stats && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Count grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
                  <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
                    <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}><Archive size={24} /></div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Products</span>
                      <h4 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.counts.products}</h4>
                    </div>
                  </div>

                  <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
                    <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)' }}><TrendingUp size={24} /></div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Revenue</span>
                      <h4 style={{ fontSize: '1.4rem', fontWeight: 800 }}>৳{stats.revenue.total.toFixed(2)}</h4>
                    </div>
                  </div>

                  <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
                    <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(251, 191, 36, 0.1)', color: 'var(--secondary)' }}><Users size={24} /></div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Customers</span>
                      <h4 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.counts.customers}</h4>
                    </div>
                  </div>

                  <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
                    <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent-rose)' }}><MessageSquare size={24} /></div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pending Reviews</span>
                      <h4 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.counts.reviews_pending}</h4>
                    </div>
                  </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="glass-card">
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)' }}>
                    <AlertTriangle size={18} />
                    <span>Low Stock / Warning Inventory</span>
                  </h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '0.5rem 0' }}>Product</th>
                        <th style={{ padding: '0.5rem 0' }}>SKU</th>
                        <th style={{ padding: '0.5rem 0', textAlign: 'right' }}>Stock left</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.top_products.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '0.75rem 0', fontWeight: 600 }}>{p.name}</td>
                          <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>{p.sku}</td>
                          <td style={{ padding: '0.75rem 0', textAlign: 'right', fontWeight: 700, color: p.stock_quantity <= 15 ? 'var(--accent-rose)' : 'var(--secondary)' }}>
                            {p.stock_quantity} units
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Recent Orders */}
                <div className="glass-card">
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Recent Order Submissions</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {stats.recent_orders.map(o => (
                      <div key={o.id} style={{ display: 'flex', justify: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.9rem' }}>
                        <div>
                          <strong style={{ display: 'block' }}>{o.order_number}</strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Customer: {o.user?.name} | {new Date(o.created_at).toLocaleDateString()}</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <strong style={{ display: 'block', color: 'var(--primary)' }}>৳{parseFloat(o.total_amount).toFixed(2)}</strong>
                          <span className="badge badge-primary" style={{ fontSize: '0.6rem', padding: '0.05rem 0.3rem' }}>{o.status.toUpperCase()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- PRODUCTS MANAGER --- */}
        {activeTab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Catalog Products Manager</h2>
              {!showProductForm && (
                <button 
                  onClick={() => { setEditingProduct(null); setProductFields({ name: '', description: '', price: '', discount_price: '', stock_quantity: '', sku: '', category_id: '', brand_id: '', status: 'active' }); setShowProductForm(true); }}
                  className="btn btn-primary"
                >
                  <Plus size={16} />
                  <span>Create Product</span>
                </button>
              )}
            </div>

            {showProductForm && (
              <form onSubmit={handleProductSubmit} className="glass-card animate-slide-down" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Product Name*</label>
                    <input 
                      type="text" 
                      value={productFields.name}
                      onChange={(e) => setProductFields(prev => ({ ...prev, name: e.target.value }))}
                      className="glass-input" 
                      style={{ width: '100%' }} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>SKU Code*</label>
                    <input 
                      type="text" 
                      value={productFields.sku}
                      onChange={(e) => setProductFields(prev => ({ ...prev, sku: e.target.value }))}
                      className="glass-input" 
                      style={{ width: '100%' }} 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Description*</label>
                  <textarea 
                    rows={4}
                    value={productFields.description}
                    onChange={(e) => setProductFields(prev => ({ ...prev, description: e.target.value }))}
                    className="glass-input" 
                    style={{ width: '100%', resize: 'none' }} 
                    required 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Base Price (৳)*</label>
                    <input 
                      type="number" step="0.01"
                      value={productFields.price}
                      onChange={(e) => setProductFields(prev => ({ ...prev, price: e.target.value }))}
                      className="glass-input" 
                      style={{ width: '100%' }} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Discount Price (৳)</label>
                    <input 
                      type="number" step="0.01"
                      value={productFields.discount_price}
                      onChange={(e) => setProductFields(prev => ({ ...prev, discount_price: e.target.value }))}
                      className="glass-input" 
                      style={{ width: '100%' }} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Stock Quantity*</label>
                    <input 
                      type="number" 
                      value={productFields.stock_quantity}
                      onChange={(e) => setProductFields(prev => ({ ...prev, stock_quantity: e.target.value }))}
                      className="glass-input" 
                      style={{ width: '100%' }} 
                      required 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Category*</label>
                    <select
                      value={productFields.category_id}
                      onChange={(e) => setProductFields(prev => ({ ...prev, category_id: e.target.value }))}
                      className="glass-input"
                      style={{ width: '100%', padding: '0.4rem', background: 'var(--bg-surface)' }}
                      required
                    >
                      <option value="">Choose category</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Brand*</label>
                    <select
                      value={productFields.brand_id}
                      onChange={(e) => setProductFields(prev => ({ ...prev, brand_id: e.target.value }))}
                      className="glass-input"
                      style={{ width: '100%', padding: '0.4rem', background: 'var(--bg-surface)' }}
                      required
                    >
                      <option value="">Choose brand</option>
                      {brands.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Status*</label>
                    <select
                      value={productFields.status}
                      onChange={(e) => setProductFields(prev => ({ ...prev, status: e.target.value }))}
                      className="glass-input"
                      style={{ width: '100%', padding: '0.4rem', background: 'var(--bg-surface)' }}
                      required
                    >
                      <option value="active">Active (Visible)</option>
                      <option value="draft">Draft (Hidden)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary">Save Product</button>
                  <button type="button" onClick={() => { setShowProductForm(false); setEditingProduct(null); }} className="btn btn-secondary">Cancel</button>
                </div>
              </form>
            )}

            {/* List products */}
            {loadingProducts ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}><RefreshCw className="animate-spin" /></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {products.map(p => (
                  <div key={p.id} className="glass-card" style={{ display: 'flex', justify: 'space-between', alignItems: 'center', padding: '1rem' }}>
                    <div>
                      <strong style={{ fontSize: '1rem' }}>{p.name}</strong>
                      <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        <span>SKU: {p.sku}</span>
                        <span>Price: ৳{parseFloat(p.price).toFixed(2)}</span>
                        <span>Stock: <strong style={{ color: p.stock_quantity <= 10 ? 'var(--accent-rose)' : 'var(--text-primary)' }}>{p.stock_quantity}</strong></span>
                        <span>Status: <span className={p.status === 'active' ? 'badge badge-success' : 'badge'} style={{ fontSize: '0.55rem', padding: '0.05rem 0.25rem' }}>{p.status}</span></span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEditProductClick(p)} className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)' }}><Edit2 size={14} /></button>
                      <button onClick={() => handleDeleteProduct(p.id)} className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', borderColor: 'rgba(244,63,94,0.2)', color: 'var(--accent-rose)' }}><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}

                {productLastPage > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem' }} onClick={() => setProductPage(p => Math.max(1, p - 1))} disabled={productPage === 1}>Prev</button>
                    <span style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>Page {productPage} of {productLastPage}</span>
                    <button className="btn btn-secondary" style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem' }} onClick={() => setProductPage(p => Math.min(productLastPage, p + 1))} disabled={productPage === productLastPage}>Next</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* --- CATEGORIES MANAGER --- */}
        {activeTab === 'categories' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Catalog Categories Manager</h2>
              {!showCategoryForm && (
                <button 
                  onClick={() => { setEditingCategory(null); setCategoryFields({ name: '', description: '', parent_id: '' }); setShowCategoryForm(true); }}
                  className="btn btn-primary"
                >
                  <Plus size={16} />
                  <span>Create Category</span>
                </button>
              )}
            </div>

            {showCategoryForm && (
              <form onSubmit={handleCategorySubmit} className="glass-card animate-slide-down" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Category Name*</label>
                    <input 
                      type="text" 
                      value={categoryFields.name}
                      onChange={(e) => setCategoryFields(prev => ({ ...prev, name: e.target.value }))}
                      className="glass-input" 
                      style={{ width: '100%' }} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Parent Category</label>
                    <select
                      value={categoryFields.parent_id}
                      onChange={(e) => setCategoryFields(prev => ({ ...prev, parent_id: e.target.value }))}
                      className="glass-input"
                      style={{ width: '100%', padding: '0.4rem', background: 'var(--bg-surface)' }}
                    >
                      <option value="">None (Top Level)</option>
                      {categories.filter(c => !c.parent_id).map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Description</label>
                  <textarea 
                    rows={3}
                    value={categoryFields.description}
                    onChange={(e) => setCategoryFields(prev => ({ ...prev, description: e.target.value }))}
                    className="glass-input" 
                    style={{ width: '100%', resize: 'none' }} 
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary">Save Category</button>
                  <button type="button" onClick={() => { setShowCategoryForm(false); setEditingCategory(null); }} className="btn btn-secondary">Cancel</button>
                </div>
              </form>
            )}

            {loadingCategories ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}><RefreshCw className="animate-spin" /></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {categories.map(c => (
                  <div key={c.id} className="glass-card" style={{ display: 'flex', justify: 'space-between', alignItems: 'center', padding: '1rem' }}>
                    <div>
                      <strong style={{ fontSize: '1rem' }}>{c.name}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.15rem' }}>
                        {c.description || 'No description provided.'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEditCategoryClick(c)} className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)' }}><Edit2 size={14} /></button>
                      <button onClick={() => handleDeleteCategory(c.id)} className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', borderColor: 'rgba(244,63,94,0.2)', color: 'var(--accent-rose)' }}><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- BRANDS MANAGER --- */}
        {activeTab === 'brands' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Catalog Brands Manager</h2>
              {!showBrandForm && (
                <button 
                  onClick={() => { setEditingBrand(null); setBrandFields({ name: '', description: '' }); setShowBrandForm(true); }}
                  className="btn btn-primary"
                >
                  <Plus size={16} />
                  <span>Create Brand</span>
                </button>
              )}
            </div>

            {showBrandForm && (
              <form onSubmit={handleBrandSubmit} className="glass-card animate-slide-down" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{editingBrand ? 'Edit Brand' : 'Add New Brand'}</h3>
                
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Brand Name*</label>
                  <input 
                    type="text" 
                    value={brandFields.name}
                    onChange={(e) => setBrandFields(prev => ({ ...prev, name: e.target.value }))}
                    className="glass-input" 
                    style={{ width: '100%' }} 
                    required 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Description</label>
                  <textarea 
                    rows={3}
                    value={brandFields.description}
                    onChange={(e) => setBrandFields(prev => ({ ...prev, description: e.target.value }))}
                    className="glass-input" 
                    style={{ width: '100%', resize: 'none' }} 
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary">Save Brand</button>
                  <button type="button" onClick={() => { setShowBrandForm(false); setEditingBrand(null); }} className="btn btn-secondary">Cancel</button>
                </div>
              </form>
            )}

            {loadingBrands ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}><RefreshCw className="animate-spin" /></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {brands.map(b => (
                  <div key={b.id} className="glass-card" style={{ display: 'flex', justify: 'space-between', alignItems: 'center', padding: '1rem' }}>
                    <div>
                      <strong style={{ fontSize: '1rem' }}>{b.name}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.15rem' }}>
                        {b.description || 'No description provided.'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEditBrandClick(b)} className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)' }}><Edit2 size={14} /></button>
                      <button onClick={() => handleDeleteBrand(b.id)} className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', borderColor: 'rgba(244,63,94,0.2)', color: 'var(--accent-rose)' }}><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- REVIEWS MODERATION PANEL --- */}
        {activeTab === 'reviews' && (
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '1.5rem' }}>Reviews Moderation panel</h2>
            
            {loadingReviews ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}><RefreshCw className="animate-spin" /></div>
            ) : reviews.length === 0 ? (
              <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No reviews require moderation. All approved or none exists.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reviews.map(r => (
                  <div key={r.id} className="glass-card" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div>
                        <strong style={{ fontSize: '0.95rem' }}>User: {r.user?.name} ({r.user?.email})</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Product: {r.product?.name}</div>
                      </div>
                      <span className={r.is_approved ? 'badge badge-success' : 'badge badge-warning'}>
                        {r.is_approved ? 'Approved' : 'Pending'}
                      </span>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.5rem 0' }}>"{r.review_text}"</p>

                    <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rating: {r.rating} stars</span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {!r.is_approved && (
                          <button 
                            onClick={() => handleApproveReview(r.id)} 
                            className="btn btn-primary" 
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                          >
                            <Check size={12} />
                            <span>Approve</span>
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteReview(r.id)} 
                          className="btn btn-secondary" 
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderColor: 'rgba(244,63,94,0.2)', color: 'var(--accent-rose)' }}
                        >
                          <X size={12} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- COUPONS PANEL --- */}
        {activeTab === 'coupons' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Coupons Campaign Manager</h2>
              {!showCouponForm && (
                <button 
                  onClick={() => setShowCouponForm(true)}
                  className="btn btn-primary"
                >
                  <Plus size={16} />
                  <span>Create Coupon</span>
                </button>
              )}
            </div>

            {showCouponForm && (
              <form onSubmit={handleCouponSubmit} className="glass-card animate-slide-down" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Create New Promo Code</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Coupon Code*</label>
                    <input 
                      type="text" 
                      placeholder="e.g. SAVE20"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, code: e.target.value }))}
                      className="glass-input" 
                      style={{ width: '100%' }} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Type*</label>
                    <select
                      value={newCoupon.type}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, type: e.target.value }))}
                      className="glass-input"
                      style={{ width: '100%', padding: '0.4rem', background: 'var(--bg-surface)' }}
                      required
                    >
                      <option value="percentage">Percentage Discount (%)</option>
                      <option value="fixed">Fixed Flat Discount (৳)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Value*</label>
                    <input 
                      type="number" step="0.01"
                      value={newCoupon.value}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, value: e.target.value }))}
                      className="glass-input" 
                      style={{ width: '100%' }} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Expiry Date*</label>
                    <input 
                      type="date"
                      value={newCoupon.expiry_date}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, expiry_date: e.target.value }))}
                      className="glass-input" 
                      style={{ width: '100%' }} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Usage Limit</label>
                    <input 
                      type="number"
                      value={newCoupon.usage_limit}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, usage_limit: e.target.value }))}
                      className="glass-input" 
                      style={{ width: '100%' }} 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary">Create Coupon</button>
                  <button type="button" onClick={() => setShowCouponForm(false)} className="btn btn-secondary">Cancel</button>
                </div>
              </form>
            )}

            {loadingCoupons ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}><RefreshCw className="animate-spin" /></div>
            ) : coupons.length === 0 ? (
              <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No active coupon campaigns.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {coupons.map(c => (
                  <div key={c.id} className="glass-card" style={{ display: 'flex', justify: 'space-between', alignItems: 'center', padding: '1rem' }}>
                    <div>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--primary)' }}>{c.code}</strong>
                      <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                        <span>Value: {c.type === 'percentage' ? `${c.value}%` : `৳${c.value}`}</span>
                        <span>Expires: {new Date(c.expiry_date).toLocaleDateString()}</span>
                        <span>Used: {c.used_count || 0} / {c.usage_limit || 'Unlimited'}</span>
                      </div>
                    </div>

                    <button onClick={() => handleDeleteCoupon(c.id)} className="btn btn-secondary" style={{ padding: '0.4rem', borderColor: 'rgba(244,63,94,0.2)', color: 'var(--accent-rose)' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- INVOICES PANEL --- */}
        {activeTab === 'invoices' && (
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '1.5rem' }}>Invoice Billing Logs</h2>
            
            {loadingInvoices ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}><RefreshCw className="animate-spin" /></div>
            ) : invoices.length === 0 ? (
              <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No invoices logged yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {invoices.map(inv => (
                  <div key={inv.id} className="glass-card" style={{ display: 'flex', justify: 'space-between', alignItems: 'center', padding: '1rem' }}>
                    <div>
                      <strong style={{ fontSize: '1rem' }}>{inv.invoice_number}</strong>
                      <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        <span>Order: {inv.order?.order_number}</span>
                        <span>Total: ৳{parseFloat(inv.total_amount).toFixed(2)}</span>
                        <span>User: {inv.user?.name}</span>
                        <span>Payment Status: <span className="badge badge-success" style={{ fontSize: '0.55rem', padding: '0.05rem 0.25rem' }}>{inv.payment_status}</span></span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDownloadInvoice(inv.id, inv.invoice_number)} 
                      className="btn btn-secondary"
                      style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}
                      title="Download PDF"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
