import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { fetchBrands } from '../../redux/slices/catalogSlice';
import { createBrand, updateBrand, deleteBrand } from '../../redux/slices/adminSlice';
import { Plus, Edit2, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const brandSchema = z.object({
  name: z.string().min(2, 'Brand name is required'),
  description: z.string().optional().nullable(),
});

export const AdminBrands = () => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);

  const { brands, loading } = useSelector((state) => state.catalog);
  const { loading: adminLoading } = useSelector((state) => state.admin);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    resolver: zodResolver(brandSchema),
    defaultValues: { name: '', description: '' }
  });

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  const handleEditClick = (b) => {
    setEditingBrand(b);
    setValue('name', b.name);
    setValue('description', b.description || '');
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this brand? Associated products will lose brand links.')) return;
    try {
      await dispatch(deleteBrand(id)).unwrap();
      toast.success('Brand removed successfully');
      dispatch(fetchBrands());
    } catch (err) {
      toast.error('Failed to delete brand');
    }
  };

  const handleCancel = () => {
    setEditingBrand(null);
    setShowForm(false);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.description) {
        formData.append('description', data.description);
      }

      if (editingBrand) {
        await dispatch(updateBrand({ id: editingBrand.id, formData })).unwrap();
        toast.success('Brand updated successfully');
      } else {
        await dispatch(createBrand(formData)).unwrap();
        toast.success('Brand created successfully');
      }
      handleCancel();
      dispatch(fetchBrands());
    } catch (err) {
      toast.error(err || 'Failed to save brand');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-gray-200">
      <div className="flex justify-between items-center pb-4 border-b border-gray-800">
        <div>
          <h1 className="font-poppins text-2xl font-bold text-white">Brands CRUD</h1>
          <p className="text-xs text-gray-500 font-inter mt-1">Manage brand labels and descriptions.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center space-x-1 rounded-lg bg-[#E63946] px-4 py-2 text-xs font-semibold text-white hover:bg-[#C1121F] cursor-pointer transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Brand</span>
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-gray-800 bg-[#0E1322] p-6 space-y-4 max-w-2xl shadow-lg">
          <h3 className="font-poppins font-bold text-white text-sm">
            {editingBrand ? 'Edit Brand Parameters' : 'Create New Brand'}
          </h3>

          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase font-poppins mb-1.5">Brand Name*</label>
            <input
              type="text"
              {...register('name')}
              className="w-full rounded-lg border border-gray-800 bg-[#0A0E1A] px-3 py-2 text-sm text-white focus:border-[#E63946] focus:outline-none transition-colors"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase font-poppins mb-1.5">Description</label>
            <textarea
              rows={3}
              {...register('description')}
              className="w-full rounded-lg border border-gray-800 bg-[#0A0E1A] px-3 py-2 text-sm text-white focus:border-[#E63946] focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              disabled={adminLoading}
              className="rounded-lg bg-[#E63946] text-white px-5 py-2 text-xs font-semibold hover:bg-[#C1121F] disabled:opacity-50 transition-colors cursor-pointer"
            >
              Save Brand
            </button>
            <button
              type="button"
              onClick={handleCancel}
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
      ) : (
        <div className="space-y-3">
          {brands.map((b) => (
            <div 
              key={b.id}
              className="flex justify-between items-center rounded-xl border border-gray-800 bg-[#0E1322] p-4 shadow-sm"
            >
              <div>
                <strong className="text-sm font-semibold text-white font-poppins">{b.name}</strong>
                {b.description && <p className="text-xs text-gray-500 font-inter mt-1">{b.description}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditClick(b)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors cursor-pointer"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-950/20 rounded transition-colors cursor-pointer"
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
export default AdminBrands;
