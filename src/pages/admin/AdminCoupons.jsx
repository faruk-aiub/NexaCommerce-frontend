import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { fetchAdminCoupons, createCoupon, updateCoupon, deleteCoupon } from '../../redux/slices/adminSlice';
import { Plus, Trash2, Tag, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const couponSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters'),
  type: z.enum(['percentage', 'fixed']),
  value: z.preprocess((val) => parseFloat(val), z.number().min(1, 'Value must be positive')),
  expiry_date: z.string().min(1, 'Expiry date is required'),
  usage_limit: z.preprocess((val) => val === '' ? null : parseInt(val, 10), z.number().nullable().optional()),
  usage_limit_per_user: z.preprocess((val) => parseInt(val, 10), z.number().default(1)),
});

export const AdminCoupons = () => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);

  const { coupons, loading } = useSelector((state) => state.admin);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: '',
      type: 'percentage',
      value: '',
      expiry_date: '',
      usage_limit: '',
      usage_limit_per_user: '1',
    }
  });

  useEffect(() => {
    dispatch(fetchAdminCoupons());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await dispatch(deleteCoupon(id)).unwrap();
      toast.success('Coupon removed successfully');
    } catch (err) {
      toast.error('Failed to delete coupon');
    }
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(createCoupon(data)).unwrap();
      toast.success('Coupon created successfully');
      setShowForm(false);
      reset();
    } catch (err) {
      toast.error(err || 'Failed to create coupon');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-gray-200">
      <div className="flex justify-between items-center pb-4 border-b border-gray-800">
        <div>
          <h1 className="font-poppins text-2xl font-bold text-white">Coupons Editor</h1>
          <p className="text-xs text-gray-500 font-inter mt-1">Manage and allocate promo codes for shoppers.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center space-x-1 rounded-lg bg-[#E63946] px-4 py-2 text-xs font-semibold text-white hover:bg-[#C1121F] cursor-pointer transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Coupon</span>
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-gray-800 bg-[#0E1322] p-6 space-y-4 max-w-2xl shadow-lg">
          <h3 className="font-poppins font-bold text-white text-sm">Create New Promo Coupon</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-gray-400 uppercase font-poppins mb-1.5">Coupon Code*</label>
              <input
                type="text"
                placeholder="e.g. SAVE20"
                {...register('code')}
                className="w-full rounded-lg border border-gray-800 bg-[#0A0E1A] px-3 py-2 text-sm text-white focus:border-[#E63946] focus:outline-none transition-colors"
              />
              {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code.message}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-400 uppercase font-poppins mb-1.5">Discount Mode*</label>
              <select
                {...register('type')}
                className="w-full rounded-lg border border-gray-800 bg-[#0A0E1A] px-3 py-2 text-sm text-white focus:border-[#E63946] focus:outline-none transition-colors"
              >
                <option value="percentage">Percentage discount (%)</option>
                <option value="fixed">Fixed cash discount ($)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-gray-400 uppercase font-poppins mb-1.5">Rate/Value*</label>
              <input
                type="number" step="0.01"
                {...register('value')}
                className="w-full rounded-lg border border-gray-800 bg-[#0A0E1A] px-3 py-2 text-sm text-white focus:border-[#E63946] focus:outline-none transition-colors"
              />
              {errors.value && <p className="text-xs text-red-500 mt-1">{errors.value.message}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-400 uppercase font-poppins mb-1.5">Expiration Date*</label>
              <input
                type="date"
                {...register('expiry_date')}
                className="w-full rounded-lg border border-gray-800 bg-[#0A0E1A] px-3 py-2 text-sm text-white focus:border-[#E63946] focus:outline-none transition-colors"
              />
              {errors.expiry_date && <p className="text-xs text-red-500 mt-1">{errors.expiry_date.message}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-400 uppercase font-poppins mb-1.5">Usage Limit (Total)</label>
              <input
                type="number"
                {...register('usage_limit')}
                className="w-full rounded-lg border border-gray-800 bg-[#0A0E1A] px-3 py-2 text-sm text-white focus:border-[#E63946] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              className="rounded-lg bg-[#E63946] text-white px-5 py-2 text-xs font-semibold hover:bg-[#C1121F] transition-colors cursor-pointer"
            >
              Save Coupon
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-gray-800 text-gray-400 px-5 py-2 text-xs font-semibold hover:bg-gray-850 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <RefreshCw className="h-6 w-6 text-[#E63946] animate-spin" />
        </div>
      ) : coupons.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-250 border-gray-200 p-12 text-center text-sm text-gray-500">
          No coupons registered. Add one above.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coupons.map((c) => (
            <div 
              key={c.id}
              className="rounded-xl border border-gray-800 bg-[#0E1322] p-5 shadow-sm flex justify-between items-center"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Tag className="h-4.5 w-4.5 text-[#E63946]" />
                  <strong className="text-sm font-semibold text-white font-poppins">{c.code}</strong>
                </div>
                <div className="text-xs text-gray-500 font-inter space-y-1">
                  <p>Discount: <strong className="text-gray-300">{c.type === 'percentage' ? `${c.value}%` : `$${c.value}`} Off</strong></p>
                  <p>Expiry: {new Date(c.expiry_date).toLocaleDateString()}</p>
                  {c.usage_limit && <p>Limit: {c.usage_limit} total uses</p>}
                </div>
              </div>

              <button
                onClick={() => handleDelete(c.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-950/20 rounded transition-colors cursor-pointer"
                title="Delete Coupon"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default AdminCoupons;
