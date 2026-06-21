import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { CreditCard, Download, ExternalLink, Calendar, Receipt, ShoppingBag, Eye, RefreshCw, FileText, CheckCircle } from 'lucide-react';

export const OrdersView = () => {
  const { navigate, selectedOrderId, showToast } = useApp();
  
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Single order details state
  const [orderDetail, setOrderDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [transactionId, setTransactionId] = useState('');
  const [submittingPayment, setSubmittingPayment] = useState(false);

  // Fetch orders list
  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await api.getOrders(page);
      if (res.status === 'success') {
        setOrders(res.data.data || []);
        setLastPage(res.data.last_page || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch single order details
  const loadOrderDetail = async (id) => {
    setLoadingDetail(true);
    try {
      const res = await api.getOrderDetails(id);
      if (res.status === 'success') {
        setOrderDetail(res.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load order details.', 'danger');
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    if (selectedOrderId) {
      loadOrderDetail(selectedOrderId);
    } else {
      setOrderDetail(null);
      loadOrders();
    }
  }, [selectedOrderId, page]);

  // Handle Download Invoice PDF
  const handleDownloadInvoice = async (invoice) => {
    if (!invoice) return;
    try {
      showToast('Downloading invoice PDF...', 'success');
      const blob = await api.getInvoiceBlob(invoice.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${invoice.invoice_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error(err);
      showToast('Failed to download invoice. It might still be generating in the background.', 'danger');
    }
  };

  // Submit Simulated Payment
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      showToast('Please enter the transaction ID.', 'warning');
      return;
    }
    setSubmittingPayment(true);
    try {
      const res = await api.payOrder(orderDetail.id, paymentMethod, transactionId);
      if (res.status === 'success') {
        showToast('Payment successful! Your order has been confirmed.', 'success');
        setTransactionId('');
        // Reload order details to show confirmed status and invoice
        await loadOrderDetail(orderDetail.id);
      }
    } catch (err) {
      showToast(err.message || 'Payment simulation failed.', 'danger');
    } finally {
      setSubmittingPayment(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <span className="badge badge-warning">Pending Payment</span>;
      case 'confirmed': return <span className="badge badge-success">Confirmed</span>;
      case 'processing': return <span className="badge badge-primary">Processing</span>;
      case 'shipped': return <span className="badge badge-primary">Shipped</span>;
      case 'delivered': return <span className="badge badge-success">Delivered</span>;
      case 'cancelled': return <span className="badge badge-danger">Cancelled</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  // --- Single Order Details View ---
  if (selectedOrderId && orderDetail) {
    const isPending = orderDetail.status === 'pending';
    const invoice = orderDetail.invoice;
    const payment = orderDetail.payment;

    return (
      <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <button className="btn btn-secondary" onClick={() => navigate('orders', null)} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <ArrowLeftIcon size={16} />
            <span>Back to Orders List</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
          {/* Order info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Summary card */}
            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Order Number</span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{orderDetail.order_number}</h3>
                </div>
                <div>{getStatusBadge(orderDetail.status)}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Date Placed</span>
                  <strong style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={14} color="var(--primary)" />
                    <span>{new Date(orderDetail.created_at).toLocaleDateString()}</span>
                  </strong>
                </div>
                <div>
                  <span style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Payment Status</span>
                  <strong>{payment ? (
                    <span style={{ color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CheckCircle size={14} /> Paid via {payment.payment_method.toUpperCase()}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--secondary)' }}>Unpaid</span>
                  )}</strong>
                </div>
              </div>
            </div>

            {/* Items list */}
            <div className="glass-card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Order Items</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {orderDetail.items && orderDetail.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justify: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.product_name}</div>
                      {item.variant_details && Object.keys(item.variant_details).length > 0 && (
                        <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.15rem' }}>
                          {Object.entries(item.variant_details).map(([type, val]) => (
                            <span key={type} className="badge badge-primary" style={{ fontSize: '0.6rem', padding: '0.05rem 0.3rem' }}>
                              {type}: {val}
                            </span>
                          ))}
                        </div>
                      )}
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>৳{item.price} x {item.quantity}</span>
                    </div>
                    <div style={{ fontWeight: 700 }}>৳{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping address details */}
            <div className="glass-card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Delivery Address</h3>
              {orderDetail.address_details && (
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.25rem' }}>{orderDetail.address_details.name}</div>
                  <div>{orderDetail.address_details.address_line_1}</div>
                  {orderDetail.address_details.address_line_2 && <div>{orderDetail.address_details.address_line_2}</div>}
                  <div>{orderDetail.address_details.city} - {orderDetail.address_details.postal_code}, {orderDetail.address_details.country}</div>
                  <div style={{ marginTop: '0.5rem' }}>Phone: <span style={{ color: 'var(--text-primary)' }}>{orderDetail.address_details.phone}</span></div>
                </div>
              )}
            </div>
          </div>

          {/* Checkout Totals / Payment Column */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Price Details</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justify: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                  <span>৳{parseFloat(orderDetail.subtotal).toFixed(2)}</span>
                </div>
                {parseFloat(orderDetail.discount) > 0 && (
                  <div style={{ display: 'flex', justify: 'space-between', color: 'var(--accent-emerald)' }}>
                    <span>Promo Discount</span>
                    <span>-৳{parseFloat(orderDetail.discount).toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justify: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                  <span>৳{parseFloat(orderDetail.shipping_cost).toFixed(2)}</span>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />
                <div style={{ display: 'flex', justify: 'space-between', fontWeight: 800, fontSize: '1.15rem' }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--primary)' }}>৳{parseFloat(orderDetail.total_amount).toFixed(2)}</span>
                </div>
              </div>

              {/* Action buttons based on status */}
              {!isPending && invoice && (
                <button 
                  className="btn btn-primary"
                  onClick={() => handleDownloadInvoice(invoice)}
                  style={{ width: '100%', height: '44px', marginTop: '0.5rem' }}
                >
                  <Download size={16} />
                  <span>Download Invoice PDF</span>
                </button>
              )}
            </div>

            {/* Simulated Payment Gateway for unpaid orders */}
            {isPending && (
              <div className="glass-card animate-glow" style={{ border: '1px solid var(--primary-glow)', animation: 'glowPulse 3s infinite' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                  <CreditCard size={18} />
                  <span>Simulate Payment Gateway</span>
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Enter any mock transaction reference (e.g. TRX999) to verify and confirm the order.
                </p>

                <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="glass-input"
                      style={{ width: '100%', padding: '0.4rem', fontSize: '0.85rem', background: 'var(--bg-surface)' }}
                    >
                      <option value="bkash">bKash Mobile Wallet</option>
                      <option value="nagad">Nagad Wallet</option>
                      <option value="card">Visa / Mastercard</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Transaction ID*</label>
                    <input
                      type="text"
                      placeholder="e.g. TRX10293"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="glass-input"
                      style={{ width: '100%', padding: '0.4rem', fontSize: '0.85rem' }}
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={submittingPayment}
                    style={{ width: '100%', height: '40px', marginTop: '0.25rem' }}
                  >
                    {submittingPayment ? 'Processing...' : `Pay ৳${parseFloat(orderDetail.total_amount).toFixed(2)}`}
                  </button>
                </form>
              </div>
            )}
          </aside>
        </div>
      </div>
    );
  }

  // --- Orders List View ---
  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>Your Orders</h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Track history and downloads</span>
      </div>

      {loadingOrders ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <RefreshCw className="animate-spin" size={32} style={{ animation: 'spin 1.5s linear infinite' }} color="var(--primary)" />
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No Orders Found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>You haven't placed any orders yet.</p>
          <button className="btn btn-primary" onClick={() => navigate('catalog')}>Explore products</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map(order => (
            <div key={order.id} className="glass-card" style={{ display: 'flex', justify: 'space-between', alignItems: 'center', padding: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <Receipt size={16} color="var(--primary)" />
                  <strong style={{ fontSize: '0.95rem' }}>{order.order_number}</strong>
                  {getStatusBadge(order.status)}
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span>Date: {new Date(order.created_at).toLocaleDateString()}</span>
                  <span>Items: {order.items ? order.items.length : 0}</span>
                  <span>Amount: <strong style={{ color: 'var(--text-primary)' }}>৳{parseFloat(order.total_amount).toFixed(2)}</strong></span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button 
                  onClick={() => navigate('orders', order.id)}
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                >
                  <Eye size={14} />
                  <span>View Details</span>
                </button>
                {order.invoice && (
                  <button 
                    onClick={() => handleDownloadInvoice(order.invoice)}
                    className="btn btn-primary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                  >
                    <Download size={14} />
                    <span>Invoice</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Pagination Controls */}
          {lastPage > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              >
                Previous
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Page <strong>{page}</strong> of <strong>{lastPage}</strong>
              </div>
              <button 
                className="btn btn-secondary" 
                onClick={() => setPage(p => Math.min(lastPage, p + 1))}
                disabled={page === lastPage}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Internal Back Arrow Icon component to avoid import issues
const ArrowLeftIcon = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);
