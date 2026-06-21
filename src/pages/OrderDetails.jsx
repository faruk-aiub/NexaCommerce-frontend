import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderDetails, payForOrder } from '../redux/slices/orderSlice';
import { ArrowLeft, CreditCard, Calendar, Download, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { toast } from 'sonner';

export const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentOrder: order, loading } = useSelector((state) => state.order);

  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [transactionId, setTransactionId] = useState('');
  const [submittingPayment, setSubmittingPayment] = useState(false);

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  const handleDownloadInvoice = async (invoice) => {
    if (!invoice) return;
    try {
      toast.success('Downloading invoice PDF...');
      const blob = await api.getInvoiceBlob(invoice.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${invoice.invoice_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      toast.error('Failed to download invoice. Generating in background...');
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      toast.warning('Transaction reference cannot be empty');
      return;
    }
    setSubmittingPayment(true);
    try {
      await dispatch(payForOrder({ 
        id: order.id, 
        paymentMethod, 
        transactionId: transactionId.trim() 
      })).unwrap();
      toast.success('Payment simulated successfully! Order is paid.');
      setTransactionId('');
      dispatch(fetchOrderDetails(id));
    } catch (err) {
      toast.error(err || 'Payment settlement failed');
    } finally {
      setSubmittingPayment(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <span className="rounded bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">Unpaid</span>;
      case 'paid':
      case 'confirmed':
        return <span className="rounded bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Paid & Confirmed</span>;
      case 'processing':
        return <span className="rounded bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">Processing</span>;
      case 'shipped':
        return <span className="rounded bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">Shipped</span>;
      case 'delivered':
        return <span className="rounded bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Delivered</span>;
      case 'cancelled':
        return <span className="rounded bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">Cancelled</span>;
      default:
        return <span className="rounded bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700">{status}</span>;
    }
  };

  if (loading && !order) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <RefreshCw className="h-6 w-6 text-[#E63946] animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500 font-inter">Failed to retrieve order parameters.</p>
        <Link to="/dashboard/orders" className="text-xs font-semibold text-[#E63946] underline mt-2 block">
          Return to Orders List
        </Link>
      </div>
    );
  }

  const isPending = order.status?.toLowerCase() === 'pending';

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link 
          to="/dashboard/orders" 
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Order History</span>
        </Link>
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:items-start">
        {/* Left Side: Order breakdown details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Header summary */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <span className="text-[10px] text-gray-400 font-inter">Reference Code</span>
                <h3 className="font-poppins font-bold text-gray-900 text-lg">{order.order_number}</h3>
              </div>
              <div>{getStatusBadge(order.status)}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-inter text-gray-600">
              <div>
                <span className="block text-gray-400">Order Placed</span>
                <span className="font-semibold text-gray-950">{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="block text-gray-400">Payment Status</span>
                {order.payment ? (
                  <span className="font-semibold text-emerald-600 flex items-center space-x-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Paid via {order.payment.payment_method?.toUpperCase()}</span>
                  </span>
                ) : (
                  <span className="font-semibold text-red-500 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>Unpaid</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Items log */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-poppins font-bold text-gray-900 text-md">Items Detail</h3>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-none">
                  <div>
                    <h4 className="font-poppins text-sm font-semibold text-gray-900">{item.product_name}</h4>
                    {item.variant_details && Object.keys(item.variant_details).length > 0 && (
                      <div className="flex gap-1.5 mt-1">
                        {Object.entries(item.variant_details).map(([k, v]) => (
                          <span key={k} className="inline-block rounded bg-red-50 px-1.5 py-0.5 text-[9px] font-medium text-[#E63946]">
                            {k}: {v}
                          </span>
                        ))}
                      </div>
                    )}
                    <span className="text-xs text-gray-400 font-inter">${parseFloat(item.price).toFixed(2)} x {item.quantity}</span>
                  </div>
                  <strong className="font-poppins text-sm text-gray-950">${(parseFloat(item.price) * item.quantity).toFixed(2)}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm space-y-3">
            <h3 className="font-poppins font-bold text-gray-900 text-md">Delivery Address</h3>
            {order.address_details && (
              <div className="text-xs font-inter text-gray-600 leading-relaxed">
                <strong className="block text-sm font-semibold text-gray-900 mb-1">{order.address_details.name}</strong>
                <p>{order.address_details.address_line_1}</p>
                {order.address_details.address_line_2 && <p>{order.address_details.address_line_2}</p>}
                <p>{order.address_details.city}, {order.address_details.state} {order.address_details.postal_code}</p>
                <p>{order.address_details.country}</p>
                <span className="block mt-2 text-gray-400">Phone: <strong className="text-gray-900">{order.address_details.phone}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Price Details & Payments */}
        <aside className="space-y-6 mt-6 lg:mt-0">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-poppins font-bold text-gray-900 border-b border-gray-100 pb-3 text-lg">Billing summary</h3>

            <div className="space-y-2 text-sm text-gray-600 font-inter">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${parseFloat(order.subtotal).toFixed(2)}</span>
              </div>
              {parseFloat(order.discount) > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-${parseFloat(order.discount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping cost</span>
                <span>${parseFloat(order.shipping_cost).toFixed(2)}</span>
              </div>
            </div>

            <hr className="border-gray-150" />

            <div className="flex justify-between font-poppins font-bold text-lg text-gray-950">
              <span>Total Amount</span>
              <span className="text-[#E63946]">${parseFloat(order.total_amount).toFixed(2)}</span>
            </div>

            {!isPending && order.invoice && (
              <button
                onClick={() => handleDownloadInvoice(order.invoice)}
                className="w-full flex items-center justify-center space-x-1.5 rounded-xl bg-[#E63946] py-3 text-sm font-semibold text-white hover:bg-[#C1121F] shadow-lg shadow-red-200/50 cursor-pointer transition-colors"
              >
                <Download className="h-4.5 w-4.5" />
                <span>Download Invoice PDF</span>
              </button>
            )}
          </div>

          {/* Payment gateway simulator */}
          {isPending && (
            <div className="rounded-xl border border-red-200 bg-red-50/10 p-6 space-y-4 shadow-sm">
              <h3 className="font-poppins font-bold text-[#E63946] text-md flex items-center space-x-1.5">
                <CreditCard className="h-5 w-5" />
                <span>Simulate Wallet Payment</span>
              </h3>
              <p className="text-[10px] leading-relaxed text-gray-500 font-inter">
                NexaCommerce operates in simulated secure test mode. Choose a wallet route, define a mock transaction ID (e.g. <i>TX-777</i>), and submit.
              </p>

              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase font-poppins mb-1">Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs focus:border-[#E63946] focus:outline-none transition-colors"
                  >
                    <option value="bkash">bKash Mobile Wallet</option>
                    <option value="nagad">Nagad Mobile Wallet</option>
                    <option value="card">Visa / Mastercard credit card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase font-poppins mb-1">Transaction reference ID*</label>
                  <input
                    type="text"
                    placeholder="e.g. TXN-1002"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs focus:border-[#E63946] focus:outline-none transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingPayment}
                  className="w-full flex items-center justify-center rounded-xl bg-[#E63946] py-2 text-xs font-semibold text-white hover:bg-[#C1121F] disabled:opacity-50 cursor-pointer transition-colors"
                >
                  {submittingPayment ? 'Processing...' : `Submit Payment $${parseFloat(order.total_amount).toFixed(2)}`}
                </button>
              </form>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
export default OrderDetails;
