import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { fetchProducts, fetchCategories, fetchBrands } from '../../redux/slices/catalogSlice';
import { createProduct, updateProduct, deleteProduct } from '../../redux/slices/adminSlice';
import { Plus, Edit2, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const productSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  sku: z.string().min(3, 'SKU code is required'),
  description: z.string().min(5, 'Description is required'),
  price: z.preprocess((val) => parseFloat(val), z.number().min(1, 'Price must be positive')),
  discount_price: z.preprocess((val) => val === '' ? null : parseFloat(val), z.number().nullable().optional()),
  stock_quantity: z.preprocess((val) => parseInt(val, 10), z.number().min(0, 'Stock cannot be negative')),
  category_id: z.string().min(1, 'Category is required'),
  brand_id: z.string().min(1, 'Brand is required'),
  status: z.enum(['active', 'draft']).default('active'),
});

export const AdminProducts = () => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [page, setPage] = useState(1);

  const { products, categories, brands, loading, meta } = useSelector((state) => state.catalog);
  const { loading: adminLoading } = useSelector((state) => state.admin);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      sku: '',
      description: '',
      price: '',
      discount_price: '',
      stock_quantity: '',
      category_id: '',
      brand_id: '',
      status: 'active',
    }
  });

  useEffect(() => {
    dispatch(fetchProducts({ page, per_page: 8 }));
    dispatch(fetchCategories());
    dispatch(fetchBrands());
  }, [dispatch, page]);

  const handleEditClick = (prod) => {
    setEditingProduct(prod);
    setValue('name', prod.name);
    setValue('sku', prod.sku);
    setValue('description', prod.description || '');
    setValue('price', prod.price);
    setValue('discount_price', prod.discount_price || '');
    setValue('stock_quantity', prod.stock_quantity);
    setValue('category_id', String(prod.category_id));
    setValue('brand_id', String(prod.brand_id));
    setValue('status', prod.status || 'active');
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await dispatch(deleteProduct(id)).unwrap();
      toast.success('Product deleted successfully');
      dispatch(fetchProducts({ page, per_page: 8 }));
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setShowForm(false);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      if (editingProduct) {
        await dispatch(updateProduct({ id: editingProduct.id, productData: data })).unwrap();
        toast.success('Product updated successfully');
      } else {
        await dispatch(createProduct(data)).unwrap();
        toast.success('Product created successfully');
      }
      handleCancel();
      dispatch(fetchProducts({ page, per_page: 8 }));
    } catch (err) {
      toast.error(err || 'Failed to save product');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-gray-200">
      <div className="flex justify-between items-center pb-4 border-b border-gray-800">
        <div>
          <h1 className="font-poppins text-2xl font-bold text-white">Catalog Products</h1>
          <p className="text-xs text-gray-500 font-inter mt-1">Manage database records for eCommerce items.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center space-x-1 rounded-lg bg-[#E63946] px-4 py-2 text-xs font-semibold text-white hover:bg-[#C1121F] cursor-pointer transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Product</span>
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-gray-800 bg-[#0E1322] p-6 space-y-4 max-w-4xl shadow-lg">
          <h3 className="font-poppins font-bold text-white text-sm">
            {editingProduct ? 'Edit Product Parameters' : 'Register New Catalog Entry'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-semibold text-gray-400 uppercase font-poppins mb-1.5">Product Title*</label>
              <input
                type="text"
                {...register('name')}
                className="w-full rounded-lg border border-gray-800 bg-[#0A0E1A] px-3 py-2 text-sm text-white focus:border-[#E63946] focus:outline-none transition-colors"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-400 uppercase font-poppins mb-1.5">SKU Code*</label>
              <input
                type="text"
                {...register('sku')}
                className="w-full rounded-lg border border-gray-800 bg-[#0A0E1A] px-3 py-2 text-sm text-white focus:border-[#E63946] focus:outline-none transition-colors"
              />
              {errors.sku && <p className="text-xs text-red-500 mt-1">{errors.sku.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase font-poppins mb-1.5">Description*</label>
            <textarea
              rows={4}
              {...register('description')}
              className="w-full rounded-lg border border-gray-800 bg-[#0A0E1A] px-3 py-2 text-sm text-white focus:border-[#E63946] focus:outline-none transition-colors resize-none"
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-gray-400 uppercase font-poppins mb-1.5">Price ($)*</label>
              <input
                type="number" step="0.01"
                {...register('price')}
                className="w-full rounded-lg border border-gray-800 bg-[#0A0E1A] px-3 py-2 text-sm text-white focus:border-[#E63946] focus:outline-none transition-colors"
              />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-400 uppercase font-poppins mb-1.5">Discount Price ($)</label>
              <input
                type="number" step="0.01"
                {...register('discount_price')}
                className="w-full rounded-lg border border-gray-800 bg-[#0A0E1A] px-3 py-2 text-sm text-white focus:border-[#E63946] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-400 uppercase font-poppins mb-1.5">Stock Count*</label>
              <input
                type="number"
                {...register('stock_quantity')}
                className="w-full rounded-lg border border-gray-800 bg-[#0A0E1A] px-3 py-2 text-sm text-white focus:border-[#E63946] focus:outline-none transition-colors"
              />
              {errors.stock_quantity && <p className="text-xs text-red-500 mt-1">{errors.stock_quantity.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-gray-400 uppercase font-poppins mb-1.5">Category*</label>
              <select
                {...register('category_id')}
                className="w-full rounded-lg border border-gray-800 bg-[#0A0E1A] px-3 py-2 text-sm text-white focus:border-[#E63946] focus:outline-none transition-colors"
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.category_id && <p className="text-xs text-red-500 mt-1">{errors.category_id.message}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-400 uppercase font-poppins mb-1.5">Brand*</label>
              <select
                {...register('brand_id')}
                className="w-full rounded-lg border border-gray-800 bg-[#0A0E1A] px-3 py-2 text-sm text-white focus:border-[#E63946] focus:outline-none transition-colors"
              >
                <option value="">Select Brand</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              {errors.brand_id && <p className="text-xs text-red-500 mt-1">{errors.brand_id.message}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-400 uppercase font-poppins mb-1.5">Status*</label>
              <select
                {...register('status')}
                className="w-full rounded-lg border border-gray-800 bg-[#0A0E1A] px-3 py-2 text-sm text-white focus:border-[#E63946] focus:outline-none transition-colors"
              >
                <option value="active">Active (Visible)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              disabled={adminLoading}
              className="rounded-lg bg-[#E63946] text-white px-5 py-2 text-xs font-semibold hover:bg-[#C1121F] disabled:opacity-50 transition-colors cursor-pointer"
            >
              Save Product
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

      {/* Products list grid */}
      {loading && products.length === 0 ? (
        <div className="flex justify-center py-12">
          <RefreshCw className="h-6 w-6 text-[#E63946] animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div 
              key={p.id}
              className="flex justify-between items-center rounded-xl border border-gray-800 bg-[#0E1322] p-4 shadow-sm"
            >
              <div>
                <strong className="text-sm font-semibold text-white font-poppins">{p.name}</strong>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 font-inter mt-1.5">
                  <span>SKU: {p.sku}</span>
                  <span>Price: ${parseFloat(p.price).toFixed(2)}</span>
                  <span>Stock: <strong className={p.stock_quantity <= 10 ? 'text-red-500' : 'text-gray-300'}>{p.stock_quantity} units</strong></span>
                  <span>Status: <span className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-semibold ${
                    p.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-800 text-gray-400'
                  }`}>{p.status}</span></span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditClick(p)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors cursor-pointer"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-950/20 rounded transition-colors cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {meta.last_page > 1 && (
            <div className="flex justify-center space-x-3 pt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded border border-gray-800 px-3 py-1 text-xs font-semibold text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-xs text-gray-500 font-inter flex items-center">Page {page} of {meta.last_page}</span>
              <button
                onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                disabled={page === meta.last_page}
                className="rounded border border-gray-800 px-3 py-1 text-xs font-semibold text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50"
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
export default AdminProducts;
