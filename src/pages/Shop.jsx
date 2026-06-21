import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Heart, ShoppingBag, Eye, SlidersHorizontal, RefreshCw, Star } from 'lucide-react';
import { fetchProducts, fetchCategories, fetchBrands } from '../redux/slices/catalogSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import { toast } from 'sonner';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, categories, brands, loading, error, meta } = useSelector((state) => state.catalog);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Read URL search states
  const searchParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  const brandParam = searchParams.get('brand') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  // Local state filters
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  // Trigger loads on mount
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBrands());
  }, [dispatch]);

  // Load products based on query states
  useEffect(() => {
    const params = {
      page: pageParam,
      search: searchParam,
      category_id: categoryParam,
      brand_id: brandParam,
      min_price: minPrice,
      max_price: maxPrice,
      sort: sort,
      per_page: 8,
    };
    dispatch(fetchProducts(params));
  }, [dispatch, pageParam, searchParam, categoryParam, brandParam, minPrice, maxPrice, sort]);

  const updateFilters = (newParams) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    });
    setSearchParams(nextParams);
  };

  const handleResetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setSearchParams({});
  };

  const handleAddToCart = async (product) => {
    try {
      await dispatch(addToCart({ product, quantity: 1 })).unwrap();
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      toast.error(err || 'Failed to add item');
    }
  };

  const handleToggleWishlist = async (product) => {
    if (!isAuthenticated) {
      toast.warning('Please sign in to update your wishlist');
      navigate('/login');
      return;
    }
    try {
      await dispatch(toggleWishlist(product)).unwrap();
      toast.success('Wishlist updated');
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  const isProductInWishlist = (productId) => {
    return wishlistItems.some(item => (item.product?.id === productId || item.id === productId));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Helmet>
        <title>Shop Collections | NexaCommerce Premium</title>
        <meta name="description" content="Explore and filter state-of-the-art products across our premium luxury collections." />
      </Helmet>

      <div className="lg:grid lg:grid-cols-4 lg:gap-x-8">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 rounded-xl bg-white p-6 shadow-sm border border-gray-100 h-fit sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h3 className="font-poppins text-md font-bold text-gray-900 flex items-center space-x-2">
              <SlidersHorizontal className="h-5 w-5 text-[#E63946]" />
              <span>Filters</span>
            </h3>
            <button 
              onClick={handleResetFilters}
              className="text-xs font-semibold text-[#E63946] hover:text-[#C1121F] transition-colors"
            >
              Reset All
            </button>
          </div>

          {/* Categories select */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 font-poppins mb-2">Categories</label>
            <select
              value={categoryParam}
              onChange={(e) => updateFilters({ category: e.target.value, page: 1 })}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#E63946] focus:bg-white focus:outline-none transition-colors"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Brands select */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 font-poppins mb-2">Brands</label>
            <select
              value={brandParam}
              onChange={(e) => updateFilters({ brand: e.target.value, page: 1 })}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#E63946] focus:bg-white focus:outline-none transition-colors"
            >
              <option value="">All Brands</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Pricing Range */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 font-poppins mb-2">Price Limit</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  updateFilters({ min_price: e.target.value, page: 1 });
                }}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs focus:border-[#E63946] focus:bg-white focus:outline-none transition-colors"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  updateFilters({ max_price: e.target.value, page: 1 });
                }}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs focus:border-[#E63946] focus:bg-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Sorting */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 font-poppins mb-2">Sort By</label>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                updateFilters({ sort: e.target.value });
              }}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#E63946] focus:bg-white focus:outline-none transition-colors"
            >
              <option value="newest">Newest Releases</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </aside>

        {/* Products Grid Area */}
        <div className="lg:col-span-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-200 mb-6">
            <h2 className="font-poppins text-2xl font-bold tracking-tight text-gray-900">
              {searchParam ? `Results for "${searchParam}"` : 'Premium Catalog'}
            </h2>
            <span className="text-sm text-gray-500 mt-1 sm:mt-0 font-inter">
              Showing {products.length} of {meta.total || products.length} products
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
              <RefreshCw className="h-10 w-10 text-[#E63946] animate-spin" />
              <p className="text-sm text-gray-500 font-inter">Searching collections...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-gray-200 p-16 text-center">
              <h3 className="font-poppins font-bold text-lg text-gray-900">No designs match</h3>
              <p className="mt-2 text-sm text-gray-500 font-inter max-w-sm mx-auto">
                No products match your current filtering selections. Try clearing your filters or search keywords.
              </p>
              <button 
                onClick={handleResetFilters}
                className="mt-6 inline-flex items-center space-x-1 rounded-full bg-[#E63946] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#C1121F] shadow-sm transition-all duration-200"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div>
              {/* Product cards */}
              <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                {products.map((product) => {
                  const image = product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';
                  const wishlistActive = isProductInWishlist(product.id);
                  const isOutOfStock = product.stock_quantity <= 0;

                  return (
                    <div 
                      key={product.id}
                      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    >
                      {/* Image container */}
                      <div className="relative h-64 overflow-hidden bg-gray-100 flex items-center justify-center">
                        <img 
                          src={image} 
                          alt={product.name} 
                          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                        />
                        {/* Wishlist toggle */}
                        <button
                          onClick={() => handleToggleWishlist(product)}
                          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 text-gray-600 hover:text-[#E63946] shadow-sm cursor-pointer transition-colors"
                        >
                          <Heart className={`h-4.5 w-4.5 ${wishlistActive ? 'fill-[#E63946] text-[#E63946]' : ''}`} />
                        </button>
                      </div>

                      {/* Info details */}
                      <div className="flex flex-1 flex-col p-4 space-y-2 justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs font-semibold text-[#E63946] uppercase font-poppins">
                            <span>{product.brand?.name || 'Nexa'}</span>
                            <span className="text-gray-400 font-medium normal-case font-inter">{product.category?.name}</span>
                          </div>
                          <h3 className="font-poppins font-semibold text-gray-900 mt-1 truncate">
                            <Link to={`/product/${product.slug}`}>
                              <span className="absolute inset-0"></span>
                              {product.name}
                            </Link>
                          </h3>
                        </div>

                        <div>
                          <div className="flex items-center justify-between pt-2">
                            <span className="font-poppins text-lg font-bold text-gray-950">${parseFloat(product.price).toFixed(2)}</span>
                            <div className="flex items-center text-xs text-amber-500">
                              <Star className="h-3.5 w-3.5 fill-current" />
                              <span className="ml-1 text-gray-500 font-medium font-inter">4.7</span>
                            </div>
                          </div>

                          {/* Quick buttons */}
                          <div className="grid grid-cols-4 gap-2 mt-4 relative z-10">
                            <Link 
                              to={`/product/${product.slug}`}
                              className="col-span-3 flex items-center justify-center space-x-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                              <span>Details</span>
                            </Link>
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={isOutOfStock}
                              className="col-span-1 flex items-center justify-center rounded-lg bg-[#E63946] text-white hover:bg-[#C1121F] disabled:bg-gray-200 disabled:text-gray-400 transition-colors cursor-pointer"
                            >
                              <ShoppingBag className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination controls */}
              {meta.last_page > 1 && (
                <div className="flex items-center justify-center space-x-3 mt-12 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => updateFilters({ page: Math.max(1, pageParam - 1) })}
                    disabled={pageParam === 1}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-gray-500 font-inter">
                    Page <strong className="text-gray-900 font-semibold">{pageParam}</strong> of {meta.last_page}
                  </span>
                  <button
                    onClick={() => updateFilters({ page: Math.min(meta.last_page, pageParam + 1) })}
                    disabled={pageParam === meta.last_page}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Shop;
