import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Heart, ShoppingBag, Eye, Trash2 } from 'lucide-react';
import { fetchWishlist, toggleWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { toast } from 'sonner';

export const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: wishlistItems, loading } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleAddToCart = async (product) => {
    try {
      await dispatch(addToCart({ product, quantity: 1 })).unwrap();
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      toast.error('Failed to add item to cart');
    }
  };

  const handleRemoveFromWishlist = async (product) => {
    try {
      await dispatch(toggleWishlist(product)).unwrap();
      toast.success('Product removed from wishlist');
    } catch (err) {
      toast.error('Failed to remove product');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md text-center py-20 px-4">
        <h3 className="font-poppins font-bold text-lg text-gray-900">Please Sign In</h3>
        <p className="mt-2 text-sm text-gray-500 font-inter">Sign in to view your favorited collections.</p>
        <Link to="/login" className="mt-6 inline-flex items-center space-x-1 rounded-full bg-[#E63946] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#C1121F]">
          <span>Sign In / Register</span>
        </Link>
      </div>
    );
  }

  const isEmpty = wishlistItems.length === 0;

  if (isEmpty) {
    return (
      <div className="mx-auto max-w-md text-center py-20 px-4">
        <Helmet>
          <title>Your Wishlist | NexaCommerce Premium</title>
        </Helmet>
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-[#E63946] mx-auto mb-6">
          <Heart className="h-10 w-10" />
        </div>
        <h2 className="font-poppins text-2xl font-bold tracking-tight text-gray-900">Your Wishlist is Empty</h2>
        <p className="mt-2 text-sm text-gray-500 font-inter">Explore the store to favorite premium designs.</p>
        <Link to="/shop" className="mt-6 inline-flex items-center space-x-1 rounded-full bg-[#E63946] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#C1121F]">
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <Helmet>
        <title>Your Wishlist | NexaCommerce Premium</title>
      </Helmet>

      <div className="pb-4 border-b border-gray-100">
        <h2 className="font-poppins text-2xl font-bold text-gray-900">Your Favorites Wishlist</h2>
        <p className="text-xs text-gray-500 font-inter mt-1">Manage designs you have pinned for later.</p>
      </div>

      <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {wishlistItems.map((item) => {
          // In some schemas, backend returns wishlist items where item.product is the product object,
          // while in other cases it is the product itself. Let's handle both.
          const product = item.product || item;
          const image = product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';

          return (
            <div 
              key={product.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative h-56 overflow-hidden bg-gray-50 flex items-center justify-center p-2">
                <img src={image} alt={product.name} className="max-h-full max-w-full object-contain" />
                <button
                  onClick={() => handleRemoveFromWishlist(product)}
                  className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm border border-gray-150 text-gray-500 hover:text-red-500 cursor-pointer"
                  title="Remove from favorites"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>

              <div className="flex flex-1 flex-col p-4 space-y-2 justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#E63946] uppercase font-poppins">{product.brand?.name || 'Brand'}</span>
                  <h3 className="font-poppins font-semibold text-gray-900 mt-0.5 truncate">
                    <Link to={`/product/${product.slug}`}>
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-sm font-bold text-gray-950 font-poppins mt-1">${parseFloat(product.price).toFixed(2)}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    to={`/product/${product.slug}`}
                    className="flex items-center justify-center space-x-1 rounded-lg border border-gray-200 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex items-center justify-center space-x-1 rounded-lg bg-[#E63946] text-white hover:bg-[#C1121F] py-2 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Buy</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Wishlist;
