import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Search, Loader2, Package, CheckCircle2, Clock, Truck, ShieldAlert } from 'lucide-react';
import { trackOrderById, clearTrackedOrder } from '../redux/slices/orderSlice';

export const TrackOrder = () => {
  const dispatch = useDispatch();
  const [orderIdInput, setOrderIdInput] = useState('');

  const { trackedOrder: order, trackingLoading: loading, trackingError: error } = useSelector((state) => state.order);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!orderIdInput.trim()) return;
    dispatch(trackOrderById(orderIdInput.trim()));
  };

  const handleClear = () => {
    setOrderIdInput('');
    dispatch(clearTrackedOrder());
  };

  // Helper to determine active step styling
  const getStepStatus = (status, stepName) => {
    const steps = ['created', 'paid', 'shipped', 'delivered', 'cancelled'];
    const currentIdx = steps.indexOf(status.toLowerCase());
    
    if (status.toLowerCase() === 'cancelled') {
      return stepName === 'cancelled' ? 'active-error' : 'disabled';
    }

    const stepIdx = steps.indexOf(stepName);
    if (stepIdx === -1) return 'disabled';
    
    if (currentIdx >= stepIdx) {
      return 'completed';
    } else if (currentIdx + 1 === stepIdx) {
      return 'active';
    }
    return 'disabled';
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <Helmet>
        <title>Track Your Order | NexaCommerce Premium</title>
      </Helmet>

      <div className="text-center space-y-2">
        <h2 className="font-poppins text-3xl font-bold tracking-tight text-gray-900">Track Your Shipment</h2>
        <p className="text-sm text-gray-500 font-inter max-w-sm mx-auto">
          Enter your unique invoice serial number or Order ID to query real-time shipping parameters.
        </p>
      </div>

      {/* Tracker search query bar */}
      <form onSubmit={handleTrackSubmit} className="flex gap-2 rounded-xl bg-white p-2 border border-gray-150 shadow-sm">
        <input
          type="text"
          placeholder="e.g. 1 (Enter Order ID)"
          value={orderIdInput}
          onChange={(e) => setOrderIdInput(e.target.value)}
          className="flex-1 rounded-lg bg-gray-50 px-4 py-2 text-sm focus:bg-white focus:outline-none transition-colors border-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[#E63946] text-white px-5 py-2 text-sm font-semibold hover:bg-[#C1121F] disabled:opacity-50 flex items-center space-x-1 cursor-pointer transition-colors"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          <span>Query</span>
        </button>
      </form>

      {/* Error block */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center space-x-2 text-sm text-red-700">
          <ShieldAlert className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Tracking results breakdown */}
      {order && (
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm space-y-8 animate-fadeIn">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div>
              <h3 className="font-poppins font-bold text-gray-900">Order #{order.id}</h3>
              <p className="text-xs text-gray-500 font-inter mt-1">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-[#E63946] uppercase font-poppins">
              {order.status}
            </span>
          </div>

          {/* Stepper Timeline */}
          <div className="relative">
            {/* Background line */}
            <div className="absolute top-5 left-4 right-4 h-0.5 bg-gray-200 -z-10 hidden sm:block"></div>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
              {/* Step 1: Created */}
              <div className="flex sm:flex-col items-center space-x-4 sm:space-x-0">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  getStepStatus(order.status, 'created') === 'completed' 
                    ? 'bg-[#E63946] border-[#E63946] text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  <Clock className="h-5 w-5" />
                </div>
                <div className="sm:mt-2 text-left sm:text-center">
                  <h4 className="text-xs font-bold text-gray-900 font-poppins">Order Placed</h4>
                  <p className="text-[10px] text-gray-400 font-inter">Details parsed</p>
                </div>
              </div>

              {/* Step 2: Paid */}
              <div className="flex sm:flex-col items-center space-x-4 sm:space-x-0">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  getStepStatus(order.status, 'paid') === 'completed' 
                    ? 'bg-[#E63946] border-[#E63946] text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="sm:mt-2 text-left sm:text-center">
                  <h4 className="text-xs font-bold text-gray-900 font-poppins">Payment Settled</h4>
                  <p className="text-[10px] text-gray-400 font-inter">Funds verified</p>
                </div>
              </div>

              {/* Step 3: Shipped */}
              <div className="flex sm:flex-col items-center space-x-4 sm:space-x-0">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  getStepStatus(order.status, 'shipped') === 'completed' 
                    ? 'bg-[#E63946] border-[#E63946] text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  <Truck className="h-5 w-5" />
                </div>
                <div className="sm:mt-2 text-left sm:text-center">
                  <h4 className="text-xs font-bold text-gray-900 font-poppins">Dispatched</h4>
                  <p className="text-[10px] text-gray-400 font-inter">Courier routing</p>
                </div>
              </div>

              {/* Step 4: Delivered */}
              <div className="flex sm:flex-col items-center space-x-4 sm:space-x-0">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  getStepStatus(order.status, 'delivered') === 'completed' 
                    ? 'bg-emerald-600 border-emerald-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  <Package className="h-5 w-5" />
                </div>
                <div className="sm:mt-2 text-left sm:text-center">
                  <h4 className="text-xs font-bold text-gray-900 font-poppins">Completed</h4>
                  <p className="text-[10px] text-gray-400 font-inter">Package delivered</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing detail items review */}
          <div className="border-t border-gray-100 pt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 font-poppins mb-3">Courier Specs</h4>
            <div className="grid grid-cols-2 gap-4 text-xs font-inter text-gray-600">
              <div>
                <span className="block text-gray-400">Total Items Cost</span>
                <span className="font-semibold text-gray-900">${parseFloat(order.total_amount).toFixed(2)}</span>
              </div>
              <div>
                <span className="block text-gray-400">Shipping Mode</span>
                <span className="font-semibold text-gray-900">Nexa Air Courier Courier (Fully Tracked)</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleClear}
              className="text-xs font-semibold text-[#E63946] hover:underline"
            >
              Clear Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default TrackOrder;
