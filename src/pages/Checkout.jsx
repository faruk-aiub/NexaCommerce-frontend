import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MapPin, Plus, ArrowLeft, ShieldCheck, Ticket, Check, RefreshCw } from 'lucide-react';
import { fetchAddresses, addAddress } from '../redux/slices/authSlice';
import { fetchCart } from '../redux/slices/cartSlice';
import { placeOrder } from '../redux/slices/orderSlice';
import { toast } from 'sonner';

const addressSchema = z.object({
  address_line_1: z.string().min(3, 'Address is required'),
  address_line_2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State/Division is required'),
  postal_code: z.string().min(4, 'Valid postal code is required'),
  country: z.string().min(2, 'Country is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
});

export const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, addresses, loading: loadingAuth } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { loading: orderLoading } = useSelector((state) => state.order);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'Bangladesh',
      phone: '',
    }
  });

  useEffect(() => {
    dispatch(fetchAddresses());
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defAddr = addresses.find(a => a.is_default);
      setSelectedAddressId(defAddr ? defAddr.id : addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-md text-center py-20 px-4">
        <h3 className="font-poppins font-bold text-lg text-gray-900">Your cart is empty</h3>
        <p className="mt-2 text-sm text-gray-500 font-inter">Add items to your cart before proceeding to checkout.</p>
        <Link to="/shop" className="mt-6 inline-flex items-center space-x-1 rounded-full bg-[#E63946] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#C1121F]">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Catalog</span>
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

  // Apply Coupon discount
  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'SAVE10') {
      setAppliedCoupon({ code, type: 'percentage', value: 10 });
      toast.success('Coupon SAVE10 applied! (10% Off)');
    } else if (code === 'FLAT50') {
      setAppliedCoupon({ code, type: 'fixed', value: 50 });
      toast.success('Coupon FLAT50 applied! ($50.00 Off)');
    } else {
      toast.error('Invalid or expired coupon code.');
    }
  };

  const discount = appliedCoupon 
    ? (appliedCoupon.type === 'percentage' ? (subtotal * appliedCoupon.value) / 100 : appliedCoupon.value) 
    : 0;

  const shipping = subtotal > 150 ? 0 : 15;
  const total = Math.max(0, (subtotal - discount) + shipping);

  // Add Address Form Submit
  const onAddressSubmit = async (data) => {
    try {
      const added = await dispatch(addAddress(data)).unwrap();
      toast.success('Address added to your book');
      setSelectedAddressId(added.id);
      setShowAddressForm(false);
      reset();
    } catch (err) {
      toast.error(err || 'Failed to save address');
    }
  };

  // Place Order Action
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.warning('Please select a shipping address');
      return;
    }
    try {
      const order = await dispatch(placeOrder({ 
        shippingAddressId: selectedAddressId, 
        couponCode: appliedCoupon?.code || null 
      })).unwrap();
      toast.success('Order placed successfully! Please finalize payment details.');
      dispatch(fetchCart()); // Clear local/store cart
      navigate(`/dashboard/orders/${order.id}`); // Direct to order details view with invoice logs
    } catch (err) {
      toast.error(err || 'Checkout placement failed');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <Helmet>
        <title>Secure Checkout | NexaCommerce Premium</title>
      </Helmet>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        {/* Left Side: Address selectors */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="font-poppins text-2xl font-bold text-gray-900">Shipping & Delivery</h2>

          {/* Address selector board */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-poppins text-md font-bold text-gray-900 flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-[#E63946]" />
                <span>Select Shipping Address</span>
              </h3>
              {!showAddressForm && (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-[#E63946] hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>New Address</span>
                </button>
              )}
            </div>

            {loadingAuth ? (
              <div className="flex justify-center py-4">
                <RefreshCw className="h-6 w-6 text-[#E63946] animate-spin" />
              </div>
            ) : addresses.length === 0 && !showAddressForm ? (
              <p className="text-sm text-gray-500 font-inter text-center py-4">
                No addresses saved. Please define a shipping location.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`rounded-xl border p-4 cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? 'border-[#E63946] bg-red-50/20'
                        : 'border-gray-100 hover:border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <strong className="text-sm font-semibold text-gray-900">{user?.name}</strong>
                      {addr.is_default && (
                        <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed font-inter">
                      {addr.address_line_1}, {addr.address_line_2 && `${addr.address_line_2}, `}{addr.city} • {addr.state} • {addr.postal_code}, {addr.country}
                    </p>
                    <span className="block text-xs text-gray-500 mt-2 font-inter">Phone: {addr.phone}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* New address inline creation */}
          {showAddressForm && (
            <form onSubmit={handleSubmit(onAddressSubmit)} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm space-y-4 animate-fadeIn">
              <h3 className="font-poppins font-bold text-gray-900 text-md">Add New Location</h3>
              
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
                  onClick={() => setShowAddressForm(false)}
                  className="rounded-lg border border-gray-200 text-gray-700 px-5 py-2 text-xs font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Side: Totals summary panel */}
        <aside className="lg:col-span-4 mt-8 lg:mt-0 space-y-6">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-poppins font-bold text-gray-900 border-b border-gray-100 pb-3 text-lg">Order Items</h3>

            <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-xs text-gray-600 font-inter">
                  <span className="truncate max-w-[160px]">{item.product.name}</span>
                  <span className="font-semibold text-gray-900">x{item.quantity}</span>
                </div>
              ))}
            </div>

            <hr className="border-gray-100" />

            {/* Coupon Promo code Input */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase font-poppins flex items-center space-x-1">
                <Ticket className="h-4 w-4 text-[#E63946]" />
                <span>Promo Code</span>
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="e.g. SAVE10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs focus:border-[#E63946] focus:bg-white focus:outline-none transition-colors"
                  disabled={appliedCoupon !== null}
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="rounded-lg bg-[#E63946] text-white px-3 text-xs font-semibold hover:bg-[#C1121F] disabled:opacity-50 transition-colors cursor-pointer"
                  disabled={appliedCoupon !== null}
                >
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs text-emerald-600 font-semibold bg-emerald-50 p-2 rounded-lg">
                  <span className="flex items-center space-x-1">
                    <Check className="h-4.5 w-4.5" />
                    <span>Coupon ({appliedCoupon.code}) active!</span>
                  </span>
                  <button 
                    onClick={() => { setAppliedCoupon(null); setCouponCode(''); }}
                    className="text-red-500 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <hr className="border-gray-100" />

            <div className="space-y-2 text-sm text-gray-600 font-inter">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Courier</span>
                <span className="font-semibold text-gray-900">
                  {shipping === 0 ? <span className="text-emerald-600">FREE</span> : `$${shipping.toFixed(2)}`}
                </span>
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="flex justify-between font-poppins font-bold text-lg text-gray-950">
              <span>Total Amount</span>
              <span className="text-[#E63946]">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={orderLoading || !selectedAddressId}
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-[#E63946] py-3 text-sm font-semibold text-white hover:bg-[#C1121F] disabled:bg-gray-200 disabled:text-gray-400 shadow-lg shadow-red-200/50 cursor-pointer transition-colors"
            >
              <span>Place Secure Order</span>
            </button>
          </div>

          <div className="rounded-xl bg-gray-50 border border-gray-150 p-4 flex items-center space-x-3 text-xs text-gray-500">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <span>Secure tokens checkout. Verification handled by bank gateways.</span>
          </div>
        </aside>
      </div>
    </div>
  );
};
export default Checkout;
