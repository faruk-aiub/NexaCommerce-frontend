import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { fetchCategories } from '../../redux/slices/catalogSlice';
import { createCategory, updateCategory, deleteCategory } from '../../redux/slices/adminSlice';
import { Plus, Edit2, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const categorySchema = z.object({
  name: z.string().min(3, 'Name is required'),
  description: z.string().optional().nullable(),
  parent_id: z.preprocess((val) => val === '' ? null : parseInt(val, 10), z.number().nullable().optional()),
});

export const AdminCategories = () => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const { categories, loading } = useSelector((state) => state.catalog);
  const { loading: adminLoading } = useSelector((state) => state.admin);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '', description: '', parent_id: '' }
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleEditClick = (cat) => {
    setEditingCategory(cat);
    setValue('name', cat.name);
    setValue('description', cat.description || '');
    setValue('parent_id', cat.parent_id ? String(cat.parent_id) : '');
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? Subcategories will be unlinked.')) return;
    try {
      await dispatch(deleteCategory(id)).unwrap();
      toast.success('Category removed successfully');
      dispatch(fetchCategories());
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setShowForm(false);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      const payload = { ...data };
      if (!payload.parent_id) delete payload.parent_id;

      if (editingCategory) {
        await dispatch(updateCategory({ id: editingCategory.id, category: payload })).unwrap();
        toast.success('Category updated successfully');
      } else {
        await dispatch(createCategory(payload)).unwrap();
        toast.success('Category created successfully');
      }
      handleCancel();
      dispatch(fetchCategories());
    } catch (err) {
      toast.error(err || 'Failed to save category');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-gray-200">
      <div className="flex justify-between items-center pb-4 border-b border-gray-800">
        <div>
          <h1 className="font-poppins text-2xl font-bold text-white">Categories CRUD</h1>
          <p className="text-xs text-gray-500 font-inter mt-1">Manage parent/child catalog departments.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center space-x-1 rounded-lg bg-[#E63946] px-4 py-2 text-xs font-semibold text-white hover:bg-[#C1121F] cursor-pointer transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Category</span>
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-gray-800 bg-[#0E1322] p-6 space-y-4 max-w-2xl shadow-lg">
          <h3 className="font-poppins font-bold text-white text-sm">
            {editingCategory ? 'Edit Category Parameters' : 'Create New Category'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-gray-400 uppercase font-poppins mb-1.5">Category Name*</label>
              <input
                type="text"
                {...register('name')}
                className="w-full rounded-lg border border-gray-800 bg-[#0A0E1A] px-3 py-2 text-sm text-white focus:border-[#E63946] focus:outline-none transition-colors"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-400 uppercase font-poppins mb-1.5">Parent Category (Optional)</label>
              <select
                {...register('parent_id')}
                className="w-full rounded-lg border border-gray-800 bg-[#0A0E1A] px-3 py-2 text-sm text-white focus:border-[#E63946] focus:outline-none transition-colors"
              >
                <option value="">None (Top level)</option>
                {categories.filter(c => !editingCategory || c.id !== editingCategory.id).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
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
              Save Category
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
          {categories.map((c) => (
            <div 
              key={c.id}
              className="flex justify-between items-center rounded-xl border border-gray-800 bg-[#0E1322] p-4 shadow-sm"
            >
              <div>
                <strong className="text-sm font-semibold text-white font-poppins">{c.name}</strong>
                {c.description && <p className="text-xs text-gray-500 font-inter mt-1">{c.description}</p>}
                {c.parent && (
                  <span className="inline-block mt-2 rounded bg-indigo-500/10 px-1.5 py-0.5 text-[9px] font-medium text-indigo-400 font-poppins">
                    Sub of: {c.parent.name}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditClick(c)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors cursor-pointer"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
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
export default AdminCategories;
