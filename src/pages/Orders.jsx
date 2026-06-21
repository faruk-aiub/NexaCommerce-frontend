import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../redux/slices/orderSlice';
import { Receipt, Eye, Download, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { toast } from 'sonner';

export const Orders = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  const { orders, loading, meta } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrders({ page }));
  }, [dispatch, page]);

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
      toast.error('Failed to download invoice. Generation might be in progress.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <span className="rounded bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">Pending</span>;
      case 'paid':
      case 'confirmed':
        return <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">Confirmed</span>;
      case 'processing':
        return <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">Processing</span>;
      case 'shipped':
        return <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">Shipped</span>;
      case 'delivered':
        return <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">Delivered</span>;
      case 'cancelled':
        return <span className="rounded bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">Cancelled</span>;
      default:
        return <span className="rounded bg-gray-50 px-2 py-0.5 text-xs font-semibold text-gray-700">{status}</span>;
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <RefreshCw className="h-6 w-6 text-[#E63946] animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <h3 className="font-poppins font-bold text-gray-900 text-md">No orders cataloged</h3>
        <p className="text-xs text-gray-500 font-inter max-w-xs mx-auto">You have not completed any purchases yet.</p>
        <Link to="/shop" className="inline-flex rounded-full bg-[#E63946] px-5 py-2 text-xs font-semibold text-white hover:bg-[#C1121F]">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="font-poppins text-lg font-bold text-gray-900">Order History</h2>
          <p className="text-xs text-gray-500 font-inter mt-1">Review your invoices and track progress details.</p>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div 
            key={order.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm space-y-4 sm:space-y-0"
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Receipt className="h-4.5 w-4.5 text-[#E63946]" />
                <span className="font-poppins text-sm font-bold text-gray-900">Order #{order.id}</span>
                {getStatusBadge(order.status)}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 font-inter">
                <span>Date: {new Date(order.created_at).toLocaleDateString()}</span>
                <span>Items: {order.items?.length || 0}</span>
                <span>Total: <strong className="text-gray-900">${parseFloat(order.total_amount).toFixed(2)}</strong></span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Link
                to={`/dashboard/orders/${order.id}`}
                className="inline-flex items-center space-x-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Details</span>
              </Link>
              {order.invoice && (
                <button
                  onClick={() => handleDownloadInvoice(order.invoice)}
                  className="inline-flex items-center space-x-1 rounded-lg bg-[#E63946] text-white px-3 py-1.5 text-xs font-semibold hover:bg-[#C1121F] cursor-pointer transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Invoice</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {meta.last_page > 1 && (
        <div className="flex items-center justify-center space-x-3 pt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded border border-gray-250 border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-xs text-gray-500 font-inter">Page {page} of {meta.last_page}</span>
          <button
            onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
            disabled={page === meta.last_page}
            className="rounded border border-gray-250 border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
export default Orders;
