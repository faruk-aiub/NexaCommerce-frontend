import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminStats } from '../../redux/slices/adminSlice';
import { Archive, TrendingUp, Users, MessageSquare, AlertTriangle, RefreshCw } from 'lucide-react';

export const AdminStats = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  if (loading && !stats) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <RefreshCw className="h-8 w-8 text-[#E63946] animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-sm font-inter">Failed to load system statistics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="font-poppins text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-xs text-gray-500 font-inter mt-1">Real-time metrics from the Laravel commerce database.</p>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Count Widget: Products */}
        <div className="rounded-xl border border-gray-800 bg-[#0E1322] p-5 flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
            <Archive className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-inter">Products Count</span>
            <h4 className="font-poppins text-2xl font-bold text-white mt-1">{stats.counts?.products || 0}</h4>
          </div>
        </div>

        {/* Count Widget: Revenue */}
        <div className="rounded-xl border border-gray-800 bg-[#0E1322] p-5 flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-inter">Total Revenue</span>
            <h4 className="font-poppins text-2xl font-bold text-white mt-1">${parseFloat(stats.revenue?.total || 0).toFixed(2)}</h4>
          </div>
        </div>

        {/* Count Widget: Customers */}
        <div className="rounded-xl border border-gray-800 bg-[#0E1322] p-5 flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-inter">Users Count</span>
            <h4 className="font-poppins text-2xl font-bold text-white mt-1">{stats.counts?.customers || 0}</h4>
          </div>
        </div>

        {/* Count Widget: Reviews */}
        <div className="rounded-xl border border-gray-800 bg-[#0E1322] p-5 flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-inter">Pending Reviews</span>
            <h4 className="font-poppins text-2xl font-bold text-white mt-1">{stats.counts?.reviews_pending || 0}</h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock Warns */}
        <div className="rounded-xl border border-gray-800 bg-[#0E1322] p-6 space-y-4">
          <h3 className="font-poppins font-bold text-amber-500 text-sm flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Low Stock Warnings</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-inter text-gray-400 border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-left text-gray-500">
                  <th className="pb-3 font-semibold">Product Design</th>
                  <th className="pb-3 font-semibold">SKU Code</th>
                  <th className="pb-3 font-semibold text-right">Units Remaining</th>
                </tr>
              </thead>
              <tbody>
                {stats.top_products?.map((p) => (
                  <tr key={p.id} className="border-b border-gray-800/40 last:border-none">
                    <td className="py-3.5 font-semibold text-white truncate max-w-[150px]">{p.name}</td>
                    <td className="py-3.5 text-gray-500">{p.sku}</td>
                    <td className={`py-3.5 text-right font-bold ${p.stock_quantity <= 15 ? 'text-red-500' : 'text-amber-500'}`}>
                      {p.stock_quantity} units
                    </td>
                  </tr>
                ))}
                {(!stats.top_products || stats.top_products.length === 0) && (
                  <tr>
                    <td colSpan="3" className="py-6 text-center text-gray-600">Inventory levels are healthy.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders log */}
        <div className="rounded-xl border border-gray-800 bg-[#0E1322] p-6 space-y-4">
          <h3 className="font-poppins font-bold text-white text-sm">Recent Store Invoices</h3>
          <div className="space-y-4">
            {stats.recent_orders?.map((o) => (
              <div 
                key={o.id} 
                className="flex items-center justify-between border-b border-gray-800/50 pb-3 last:border-none last:pb-0 text-xs font-inter"
              >
                <div>
                  <strong className="block text-gray-250 font-poppins">{o.order_number}</strong>
                  <span className="text-[10px] text-gray-500 mt-0.5 block truncate max-w-[160px]">Client: {o.user?.name}</span>
                </div>
                <div className="text-right">
                  <strong className="block text-white">${parseFloat(o.total_amount).toFixed(2)}</strong>
                  <span className="inline-block mt-1 rounded bg-[#E63946]/10 px-1.5 py-0.5 text-[9px] font-semibold text-[#E63946] uppercase font-poppins">
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
            {(!stats.recent_orders || stats.recent_orders.length === 0) && (
              <p className="text-center text-gray-600 py-6">No recent invoices filed.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminStats;
