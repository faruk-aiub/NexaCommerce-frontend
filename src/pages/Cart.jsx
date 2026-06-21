import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Trash2, ShoppingBag, ArrowRight, ShoppingCart } from 'lucide-react';
import { fetchCart, updateCartQuantity, removeFromCart, clearCart } from '../redux/slices/cartSlice';
import { toast } from 'sonner';

export const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: cartItems, loading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQtyChange = async (itemId, currentQty, amount) => {
    const newQty = currentQty + amount;
    if (newQty < 1) return;
    try {
      await dispatch(updateCartQuantity({ itemId, quantity: newQty })).unwrap();
    } catch (err) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await dispatch(removeFromCart(itemId)).unwrap();
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    try {
      await dispatch(clearCart()).unwrap();
      toast.success('Cart cleared');
    } catch (err) {
      toast.error('Failed to clear cart');
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.warning('Please sign in to proceed with checkout');
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  const isEmpty = cartItems.length === 0;

  if (isEmpty) {
    return (
      <div className="mx-auto max-w-md text-center py-20 px-4">
        <Helmet>
          <title>Your Shopping Cart | NexaCommerce Premium</title>
        </Helmet>
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-[#E63946] mx-auto mb-6">
          <ShoppingCart className="h-10 w-10" />
        </div>
        <h2 className="font-poppins text-2xl font-bold tracking-tight text-gray-900">Your Cart is Empty</h2>
        <p className="mt-2 text-sm text-gray-500 font-inter">
          Explore our exclusive designs to find your perfect fit.
        </p>
        <Link 
          to="/shop" 
          className="mt-8 inline-flex items-center space-x-2 rounded-full bg-[#E63946] px-8 py-3 text-sm font-semibold text-white hover:bg-[#C1121F] shadow-lg shadow-red-200/50"
        >
          <ShoppingBag className="h-4.5 w-4.5" />
          <span>Explore Catalog</span>
        </Link>
      </div>
    );
  }

  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => {
    let unitPrice = parseFloat(item.product.discount_price ?? item.product.price);
    if (item.variant_details) {
      Object.entries(item.variant_details).forEach(([type, value]) => {
        const variant = item.product.variants?.find(v => v.type === type && v.value === value);
        if (variant) {
          unitPrice += parseFloat(variant.price_modifier || 0);
        }
      });
    }
    return acc + (unitPrice * item.quantity);
  }, 0);

  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Helmet>
        <title>Shopping Cart | NexaCommerce Premium</title>
      </Helmet>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        {/* Cart items list */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h2 className="font-poppins text-2xl font-bold text-gray-900">Your Shopping Cart</h2>
            <button
              onClick={handleClearCart}
              className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
            >
              Clear Cart
            </button>
          </div>

          <div className="space-y-4">
            {cartItems.map((item) => {
              const product = item.product;
              const image = product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';

              let unitPrice = parseFloat(product.discount_price ?? product.price);
              if (item.variant_details) {
                Object.entries(item.variant_details).forEach(([type, value]) => {
                  const variant = product.variants?.find(v => v.type === type && v.value === value);
                  if (variant) {
                    unitPrice += parseFloat(variant.price_modifier || 0);
                  }
                });
              }

              return (
                <div 
                  key={item.id}
                  className="flex items-center space-x-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <div className="h-20 w-20 flex-shrink-0 rounded-lg border border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center p-1">
                    <img src={image} alt={product.name} className="max-h-full max-w-full object-contain" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-poppins font-semibold text-gray-900 truncate">
                      <Link to={`/product/${product.slug}`} className="hover:text-[#E63946]">
                        {product.name}
                      </Link>
                    </h3>
                    
                    {/* Variant tags */}
                    {item.variant_details && Object.keys(item.variant_details).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {Object.entries(item.variant_details).map(([type, value]) => (
                          <span 
                            key={type}
                            className="inline-block rounded bg-red-50 px-2 py-0.5 text-[10px] font-medium text-[#E63946]"
                          >
                            {type}: {value}
                          </span>
                        ))}
                      </div>
                    )}
                    <span className="block text-xs font-semibold text-gray-500 font-poppins mt-1">
                      ${unitPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity adjusts */}
                  <div className="flex items-center rounded-lg border border-gray-200 p-0.5">
                    <button 
                      onClick={() => handleQtyChange(item.id, item.quantity, -1)}
                      className="px-2 py-0.5 text-gray-500 hover:bg-gray-50 rounded"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold font-poppins">{item.quantity}</span>
                    <button 
                      onClick={() => handleQtyChange(item.id, item.quantity, 1)}
                      className="px-2 py-0.5 text-gray-500 hover:bg-gray-50 rounded"
                    >
                      +
                    </button>
                  </div>

                  <div className="w-24 text-right font-poppins font-bold text-gray-900">
                    ${(unitPrice * item.quantity).toFixed(2)}
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pricing Summary section */}
        <aside className="lg:col-span-4 mt-8 lg:mt-0 space-y-6">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-poppins font-bold text-gray-900 border-b border-gray-100 pb-3 text-lg">Order Summary</h3>

            <div className="flex justify-between text-sm text-gray-600 font-inter">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm text-gray-600 font-inter">
              <span>Shipping Cost</span>
              <span className="font-semibold text-gray-900">
                {shipping === 0 ? <span className="text-emerald-600">FREE</span> : `$${shipping.toFixed(2)}`}
              </span>
            </div>

            {shipping > 0 && (
              <p className="text-[10px] text-[#E63946] italic font-inter">
                Add ${(150 - subtotal).toFixed(2)} more to unlock free shipping!
              </p>
            )}

            <div className="border-t border-gray-100 pt-4 flex justify-between font-poppins font-bold text-lg text-gray-950">
              <span>Total</span>
              <span className="text-[#E63946]">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-[#E63946] py-3 text-sm font-semibold text-white hover:bg-[#C1121F] shadow-lg shadow-red-200/50 cursor-pointer transition-colors"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
export default Cart;
