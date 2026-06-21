import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { fetchAddresses, addAddress, updateAddress, deleteAddress } from '../redux/slices/authSlice';
import { MapPin, Plus, Edit2, Trash2, CheckCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const addressSchema = z.object({
  address_line_1: z.string().min(3, 'Address is required'),
  address_line_2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State/Division is required'),
  postal_code: z.string().min(4, 'Valid postal code is required'),
  country: z.string().min(2, 'Country is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  is_default: z.boolean().default(false),
});

export const Addresses = () => {
  const dispatch = useDispatch();

  const { user, addresses, loading } = useSelector((state) => state.auth);

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'Bangladesh',
      phone: '',
      is_default: false,
    }
  });

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleEditClick = (addr) => {
    setEditingAddress(addr);
    setValue('address_line_1', addr.address_line_1);
    setValue('address_line_2', addr.address_line_2 || '');
    setValue('city', addr.city);
    setValue('state', addr.state);
    setValue('postal_code', addr.postal_code);
    setValue('country', addr.country);
    setValue('phone', addr.phone);
    setValue('is_default', !!addr.is_default);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this shipping address?')) return;
    try {
      await dispatch(deleteAddress(id)).unwrap();
      toast.success('Address removed successfully');
    } catch (err) {
      toast.error('Failed to delete address');
    }
  };

  const handleCancel = () => {
    setEditingAddress(null);
    setShowForm(false);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      if (editingAddress) {
        await dispatch(updateAddress({ id: editingAddress.id, address: data })).unwrap();
        toast.success('Address updated successfully');
      } else {
        await dispatch(addAddress(data)).unwrap();
        toast.success('New address added successfully');
      }
      handleCancel();
      dispatch(fetchAddresses());
    } catch (err) {
      toast.error(err || 'Failed to save address');
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="font-poppins text-lg font-bold text-gray-900">Address Book</h2>
          <p className="text-xs text-gray-500 font-inter mt-1">Configure your default shipping locations.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center space-x-1 rounded-lg bg-[#E63946] px-4 py-2 text-xs font-semibold text-white hover:bg-[#C1121F] cursor-pointer transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Location</span>
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-gray-150 p-6 space-y-4 max-w-2xl bg-white shadow-sm">
          <h3 className="font-poppins font-bold text-gray-900 text-sm">
            {editingAddress ? 'Update Location Details' : 'Register New Location'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase font-poppins mb-1.5">Address Line 1*</label>
              <input
                type="text"
                {...register('address_line_1')}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#E63946] focus:bg-white focus:outline-none transition-colors"
              />
              {errors.address_line_1 && <p className="text-xs text-red-500 mt-1">{errors.address_line_1.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase font-poppins mb-1.5">Address Line 2 (Optional)</label>
              <input
                type="text"
                {...register('address_line_2')}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#E63946] focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase font-poppins mb-1.5">City*</label>
              <input
                type="text"
                {...register('city')}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#E63946] focus:bg-white focus:outline-none transition-colors"
              />
              {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase font-poppins mb-1.5">State/Division*</label>
              <input
                type="text"
                {...register('state')}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#E63946] focus:bg-white focus:outline-none transition-colors"
              />
              {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase font-poppins mb-1.5">Postal Code*</label>
              <input
                type="text"
                {...register('postal_code')}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#E63946] focus:bg-white focus:outline-none transition-colors"
              />
              {errors.postal_code && <p className="text-xs text-red-500 mt-1">{errors.postal_code.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase font-poppins mb-1.5">Phone Number*</label>
              <input
                type="text"
                {...register('phone')}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#E63946] focus:bg-white focus:outline-none transition-colors"
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase font-poppins mb-1.5">Country*</label>
              <input
                type="text"
                {...register('country')}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#E63946] focus:bg-white focus:outline-none transition-colors"
              />
              {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country.message}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_default"
              {...register('is_default')}
              className="h-4 w-4 rounded border-gray-300 text-[#E63946] focus:ring-[#E63946] cursor-pointer"
            />
            <label htmlFor="is_default" className="text-xs font-semibold text-gray-600 cursor-pointer">
              Set as primary/default delivery address
            </label>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-[#E63946] text-white px-5 py-2 text-xs font-semibold hover:bg-[#C1121F] disabled:opacity-50 transition-colors cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : 'Save Location'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border border-gray-200 text-gray-700 px-5 py-2 text-xs font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Address cards list */}
      {loading && addresses.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-6 w-6 text-[#E63946] animate-spin" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 p-12 text-center text-sm text-gray-500">
          No delivery locations saved yet. Add one above.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div 
              key={addr.id}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm flex justify-between items-start"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4.5 w-4.5 text-[#E63946]" />
                  <strong className="text-sm font-semibold text-gray-900">{user?.name}</strong>
                  {addr.is_default && (
                    <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-inter">
                  {addr.address_line_1}, {addr.address_line_2 && `${addr.address_line_2}, `}{addr.city} • {addr.state} • {addr.postal_code}, {addr.country}
                </p>
                <span className="block text-[11px] text-gray-400 font-inter">Phone: {addr.phone}</span>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => handleEditClick(addr)}
                  className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors cursor-pointer"
                  title="Edit Address"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                  title="Delete Address"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Addresses;
