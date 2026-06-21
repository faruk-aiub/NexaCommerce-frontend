import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { MapPin, Plus, ArrowLeft, ShieldCheck, Ticket, Check, RefreshCw } from 'lucide-react';

export const CheckoutView = () => {
  const { user, cart, navigate, fetchCartData, showToast } = useApp();
  
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  
  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  
  // New address form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Bangladesh',
    phone: '',
    is_default: false
  });
  const [savingAddress, setSavingAddress] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Fetch user addresses
  const loadAddresses = async () => {
    if (!user) return;
    setLoadingAddresses(true);
    try {
      const res = await api.getAddresses();
      if (res.status === 'success') {
        const addrList = res.data || [];
        setAddresses(addrList);
        
        // Default select the default address
        const defAddr = addrList.find(a => a.is_default);
        if (defAddr) {
          setSelectedAddressId(defAddr.id);
        } else if (addrList.length > 0) {
          setSelectedAddressId(addrList[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="glass-card animate-slide-up" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '500px', margin: '2rem auto' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Please Sign In</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>You must be signed in as a customer to checkout.</p>
        <button className="btn btn-primary" onClick={() => navigate('profile')}>Sign In / Register</button>
      </div>
    );
  }

  const cartItems = cart.items || [];
  if (cartItems.length === 0) {
    return (
      <div className="glass-card animate-slide-up" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '500px', margin: '2rem auto' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Your Cart is Empty</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Please add some items to your cart before checking out.</p>
        <button className="btn btn-primary" onClick={() => navigate('catalog')}>Back to Shop</button>
      </div>
    );
  }

  // Calculate local subtotal
  const subtotal = cartItems.reduce((acc, item) => {
    let unitPrice = item.product.discount_price ?? item.product.price;
    if (item.variant_details) {
      Object.entries(item.variant_details).forEach(([type, value]) => {
        const variant = item.product.variants?.find(v => v.type === type && v.value === value);
        if (variant) {
          unitPrice += parseFloat(variant.price_modifier || 0);
        }
      });
    }
    return acc + (unitPrice * item.quantity);
  }, 0);

  // Local coupon simulation
  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'SAVE10') {
      setAppliedCoupon({ code, type: 'percentage', value: 10 });
      showToast('Coupon SAVE10 applied! (10% Off)', 'success');
    } else if (code === 'FLAT50') {
      setAppliedCoupon({ code, type: 'fixed', value: 50 });
      showToast('Coupon FLAT50 applied! (৳50 Off)', 'success');
    } else {
      showToast('Invalid or expired coupon code.', 'danger');
    }
  };

  const discount = appliedCoupon 
    ? (appliedCoupon.type === 'percentage' ? (subtotal * appliedCoupon.value) / 100 : appliedCoupon.value) 
    : 0;

  const shipping = subtotal > 1000 ? 0 : 50;
  const total = Math.max(0, (subtotal - discount) + shipping);

  // Address Submit
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      const res = await api.addAddress(newAddress);
      if (res.status === 'success') {
        showToast('Address added successfully.', 'success');
        setShowAddressForm(false);
        setNewAddress({
          address_line_1: '',
          address_line_2: '',
          city: '',
          state: '',
          postal_code: '',
          country: 'Bangladesh',
          phone: '',
          is_default: false
        });
        await loadAddresses();
      }
    } catch (err) {
      showToast(err.message || 'Failed to save address.', 'danger');
    } finally {
      setSavingAddress(false);
    }
  };

  // Place Order checkout
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      showToast('Please select a shipping address.', 'warning');
      return;
    }
    setCheckoutLoading(true);
    try {
      const res = await api.checkout(selectedAddressId, appliedCoupon?.code || null);
      if (res.status === 'success') {
        showToast('Order placed successfully! Redirecting to payment...', 'success');
        await fetchCartData(); // Clear local cart
        // Navigate to orders view, passing the order ID for payment
        navigate('orders', res.data.id);
      }
    } catch (err) {
      showToast(err.message || 'Checkout failed.', 'danger');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }} className="animate-slide-up">
      {/* Shipping Address panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Shipping & Checkout</h2>

        {/* Addresses selector */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="var(--primary)" />
              <span>Select Shipping Address</span>
            </h3>
            {!showAddressForm && (
              <button 
                onClick={() => setShowAddressForm(true)}
                className="btn btn-secondary" 
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              >
                <Plus size={14} />
                <span>New Address</span>
              </button>
            )}
          </div>

          {loadingAddresses ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <RefreshCw className="animate-spin" size={24} style={{ animation: 'spin 1.5s linear infinite' }} />
            </div>
          ) : addresses.length === 0 && !showAddressForm ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              No addresses saved. Please add a shipping address.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {addresses.map(addr => (
                <div 
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className="glass-card"
                  style={{
                    padding: '1rem',
                    cursor: 'pointer',
                    background: selectedAddressId === addr.id ? 'rgba(99, 102, 241, 0.05)' : 'rgba(255,255,255,0.01)',
                    border: selectedAddressId === addr.id ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <strong style={{ fontSize: '0.95rem' }}>{user.name}</strong>
                    {addr.is_default && <span className="badge badge-success" style={{ fontSize: '0.6rem' }}>Default</span>}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {addr.address_line_1}, {addr.address_line_2 && `${addr.address_line_2}, `}{addr.city} - {addr.postal_code}, {addr.country}
                  </p>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Phone: <span style={{ color: 'var(--text-primary)' }}>{addr.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Address addition Form inline */}
        {showAddressForm && (
          <form onSubmit={handleAddressSubmit} className="glass-card animate-slide-down" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Add New Shipping Address</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Address Line 1*</label>
                <input 
                  type="text" 
                  value={newAddress.address_line_1}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, address_line_1: e.target.value }))}
                  className="glass-input" 
                  style={{ width: '100%' }} 
                  required 
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Address Line 2 (Optional)</label>
                <input 
                  type="text" 
                  value={newAddress.address_line_2}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, address_line_2: e.target.value }))}
                  className="glass-input" 
                  style={{ width: '100%' }} 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>City*</label>
                <input 
                  type="text" 
                  value={newAddress.city}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                  className="glass-input" 
                  style={{ width: '100%' }} 
                  required 
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>State/Division*</label>
                <input 
                  type="text" 
                  value={newAddress.state}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                  className="glass-input" 
                  style={{ width: '100%' }} 
                  required 
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Postal Code*</label>
                <input 
                  type="text" 
                  value={newAddress.postal_code}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, postal_code: e.target.value }))}
                  className="glass-input" 
                  style={{ width: '100%' }} 
                  required 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Phone Number*</label>
                <input 
                  type="text" 
                  placeholder="e.g. 01712345678"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                  className="glass-input" 
                  style={{ width: '100%' }} 
                  required 
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Country*</label>
                <input 
                  type="text" 
                  value={newAddress.country}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, country: e.target.value }))}
                  className="glass-input" 
                  style={{ width: '100%' }} 
                  required 
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={savingAddress}
              >
                {savingAddress ? 'Saving...' : 'Save Address'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowAddressForm(false)} 
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Right Column Checkout summary */}
      <aside style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Order review */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Order Details</h3>
          
          <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '0.25rem' }}>
            {cartItems.map(item => (
              <div key={item.id} style={{ display: 'flex', justify: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                  {item.product.name} <strong style={{ color: 'var(--primary)' }}>x{item.quantity}</strong>
                </span>
                <span>৳{((item.product.discount_price ?? item.product.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

          {/* Coupon Entry */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Ticket size={14} color="var(--primary)" />
              <span>Promo Code</span>
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                placeholder="e.g. SAVE10"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="glass-input" 
                style={{ flex: 1, height: '36px', padding: '0 0.5rem', fontSize: '0.85rem' }}
                disabled={appliedCoupon !== null}
              />
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleApplyCoupon}
                style={{ height: '36px', padding: '0 1rem', fontSize: '0.85rem' }}
                disabled={appliedCoupon !== null}
              >
                Apply
              </button>
            </div>
            {appliedCoupon && (
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                <Check size={12} />
                <span>Coupon ({appliedCoupon.code}) Active!</span>
                <button 
                  onClick={() => { setAppliedCoupon(null); setCouponCode(''); }}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', textDecoration: 'underline', marginLeft: 'auto' }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

          {/* Pricing Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justify: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
              <span>৳{subtotal.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div style={{ display: 'flex', justify: 'space-between', color: 'var(--accent-emerald)' }}>
                <span>Discount</span>
                <span>-৳{discount.toFixed(2)}</span>
              </div>
            )}

            <div style={{ display: 'flex', justify: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `৳${shipping.toFixed(2)}`}</span>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

            <div style={{ display: 'flex', justify: 'space-between', fontWeight: 800, fontSize: '1.1rem' }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary)' }}>৳{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Place Order */}
          <button 
            type="button"
            className="btn btn-primary"
            onClick={handlePlaceOrder}
            disabled={checkoutLoading || !selectedAddressId}
            style={{ width: '100%', height: '48px', marginTop: '0.5rem' }}
          >
            {checkoutLoading ? 'Processing Order...' : 'Place Order'}
          </button>
        </div>

        {/* Secure seal */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem' }}>
          <ShieldCheck size={18} color="var(--accent-emerald)" />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>SSL encrypted checkout. Payment processed securely.</span>
        </div>
      </aside>
    </div>
  );
};
