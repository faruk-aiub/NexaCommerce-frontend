import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminInvoices } from '../../redux/slices/adminSlice';
import { FileText, Download, RefreshCw, Eye } from 'lucide-react';
import { api } from '../../services/api';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export const AdminInvoices = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  const { invoices, loading, meta } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminInvoices(page));
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
      toast.error('Failed to download invoice. PDF might still be generating in the background.');
    }
  };

  const invoicesList = invoices?.data || invoices || [];

  return (
    <div className="space-y-6 animate-fadeIn text-gray-200">
      <div className="pb-4 border-b border-gray-800">
        <h1 className="font-poppins text-2xl font-bold text-white">Invoices Journal</h1>
        <p className="text-xs text-gray-500 font-inter mt-1">Review sales records, billing summaries, and download PDF copies.</p>
      </div>

      {loading && invoicesList.length === 0 ? (
        <div className="flex justify-center py-12">
          <RefreshCw className="h-6 w-6 text-[#E63946] animate-spin" />
        </div>
      ) : invoicesList.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-250 border-gray-200 p-12 text-center text-sm text-gray-500">
          No invoices registered.
        </div>
      ) : (
        <div className="space-y-3">
          {invoicesList.map((inv) => (
            <div 
              key={inv.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl border border-gray-800 bg-[#0E1322] p-5 shadow-sm space-y-4 sm:space-y-0"
            >
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4.5 w-4.5 text-[#E63946]" />
                  <strong className="text-sm font-semibold text-white font-poppins">{inv.invoice_number}</strong>
                  <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-500">
                    Paid
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 font-inter">
                  <span>Order Reference: #{inv.order_id}</span>
                  <span>Amount: <strong className="text-gray-300">${parseFloat(inv.amount_paid || inv.amount || 0).toFixed(2)}</strong></span>
                  <span>Date: {new Date(inv.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Link
                  to={`/dashboard/orders/${inv.order_id}`}
                  className="inline-flex items-center space-x-1.5 rounded-lg border border-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View Order</span>
                </Link>
                <button
                  onClick={() => handleDownloadInvoice(inv)}
                  className="inline-flex items-center space-x-1.5 rounded-lg bg-[#E63946] text-white px-3 py-1.5 text-xs font-semibold hover:bg-[#C1121F] cursor-pointer transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Invoice PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {invoices?.last_page > 1 && (
        <div className="flex justify-center space-x-3 pt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded border border-gray-800 px-3 py-1 text-xs font-semibold text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-xs text-gray-500 font-inter flex items-center">Page {page} of {invoices.last_page}</span>
          <button
            onClick={() => setPage(p => Math.min(invoices.last_page, p + 1))}
            disabled={page === invoices.last_page}
            className="rounded border border-gray-800 px-3 py-1 text-xs font-semibold text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
export default AdminInvoices;
