import React from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, ShoppingBag, ArrowRight, RefreshCw, ShoppingCart } from 'lucide-react';

export const CartView = () => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, navigate } = useApp();

  const handleQtyChange = (itemId, currentQty, amount) => {
    const newQty = currentQty + amount;
    if (newQty < 1) return;
    updateCartQuantity(itemId, newQty);
  };

  const cartItems = cart.items || [];
  const isEmpty = cartItems.length === 0;

  if (isEmpty) {
    return (
      <div className="glass-card animate-slide-up" style={{ textAlign: 'center', padding: '5rem 2rem', maxWidth: '600px', margin: '2rem auto' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          color: 'var(--primary)'
        }}>
          <ShoppingCart size={40} />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Your Cart is Empty</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>Looks like you haven't added any luxury items to your cart yet.</p>
        <button className="btn btn-primary" onClick={() => navigate('catalog')}>
          <ShoppingBag size={18} />
          <span>Shop Products</span>
        </button>
      </div>
    );
  }

  // Calculate totals locally for precision/display
  const subtotal = cartItems.reduce((acc, item) => {
    // Add variant modifiers to product unit price
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

  // Flat rate: Free shipping over 1000, else 50
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + shipping;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem' }} className="animate-slide-up">
      {/* Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Your Shopping Cart</h2>
          <button 
            className="btn btn-secondary" 
            onClick={clearCart}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderColor: 'rgba(244, 63, 94, 0.2)', color: 'var(--accent-rose)' }}
          >
            Clear Cart
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cartItems.map(item => {
            const product = item.product;
            const primaryImage = product.images && product.images.find(img => img.is_primary)?.image_url 
              || (product.images && product.images[0]?.image_url) 
              || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';

            // Calculate unit price with modifiers
            let unitPrice = product.discount_price ?? product.price;
            if (item.variant_details) {
              Object.entries(item.variant_details).forEach(([type, value]) => {
                const variant = product.variants?.find(v => v.type === type && v.value === value);
                if (variant) {
                  unitPrice += parseFloat(variant.price_modifier || 0);
                }
              });
            }

            return (
              <div key={item.id} className="glass-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '1.25rem' }}>
                {/* Image */}
                <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <img src={primaryImage} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 
                    onClick={() => navigate('product', product.slug)} 
                    style={{ fontSize: '1rem', fontWeight: 600, cursor: 'pointer', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {product.name}
                  </h3>
                  
                  {/* Selected Variants badges */}
                  {item.variant_details && Object.keys(item.variant_details).length > 0 && (
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                      {Object.entries(item.variant_details).map(([type, value]) => (
                        <span key={type} className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                          {type}: {value}
                        </span>
                      ))}
                    </div>
                  )}

                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>৳{unitPrice.toFixed(2)}</span>
                </div>

                {/* Qty Selector */}
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                  <button 
                    onClick={() => handleQtyChange(item.id, item.quantity, -1)}
                    className="btn btn-secondary" 
                    style={{ width: '28px', height: '28px', padding: 0, minWidth: 0, borderRadius: 'var(--radius-sm)', border: 'none' }}
                  >
                    -
                  </button>
                  <span style={{ width: '32px', textAlign: 'center', fontWeight: 700, fontSize: '0.85rem' }}>{item.quantity}</span>
                  <button 
                    onClick={() => handleQtyChange(item.id, item.quantity, 1)}
                    className="btn btn-secondary" 
                    style={{ width: '28px', height: '28px', padding: 0, minWidth: 0, borderRadius: 'var(--radius-sm)', border: 'none' }}
                  >
                    +
                  </button>
                </div>

                {/* Total per item */}
                <div style={{ width: '100px', textAlign: 'right', fontWeight: 700 }}>
                  ৳{(unitPrice * item.quantity).toFixed(2)}
                </div>

                {/* Delete */}
                <button 
                  onClick={() => removeFromCart(item.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color var(--transition-fast)' }}
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-rose)'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary sidebar panel */}
      <aside style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Order Summary</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
            <span>৳{subtotal.toFixed(2)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Shipping Cost</span>
            <span>{shipping === 0 ? (
              <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>FREE</span>
            ) : `৳${shipping.toFixed(2)}`}</span>
          </div>

          {shipping > 0 && (
            <p style={{ fontSize: '0.75rem', color: 'var(--primary)', fontStyle: 'italic', marginTop: '-0.25rem' }}>
              Tip: Add ৳{(1000 - subtotal).toFixed(2)} more to get Free Shipping!
            </p>
          )}

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem' }}>
            <span>Total</span>
            <span style={{ color: 'var(--primary)' }}>৳{total.toFixed(2)}</span>
          </div>

          <button 
            className="btn btn-primary" 
            onClick={() => navigate('checkout')}
            style={{ width: '100%', height: '48px', marginTop: '0.5rem' }}
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </aside>
    </div>
  );
};
