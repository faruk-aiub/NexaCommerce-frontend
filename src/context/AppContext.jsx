import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({ items: [], subtotal: 0, total_amount: 0 });
  const [wishlist, setWishlist] = useState([]);
  const [currentView, setCurrentView] = useState('catalog'); // 'catalog', 'product', 'cart', 'checkout', 'orders', 'profile', 'admin'
  const [selectedProductSlug, setSelectedProductSlug] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [toast, setToast] = useState(null);

  // Show auto-dismiss toast alerts
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Sync route views with browser back button / hash
  const navigate = (view, extra = null) => {
    setCurrentView(view);
    if (view === 'product' && extra) {
      setSelectedProductSlug(extra);
    }
    if (view === 'orders' && extra) {
      setSelectedOrderId(extra);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initial Auth Check
  useEffect(() => {
    const initAuth = async () => {
      const token = api.getToken();
      if (token) {
        try {
          const profileData = await api.getProfile();
          if (profileData.status === 'success') {
            setUser(profileData.data);
            // Fetch cart and wishlist
            fetchCartData();
            fetchWishlistData();
          } else {
            api.setToken(null);
          }
        } catch (err) {
          console.error("Auth initialization failed", err);
          api.setToken(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // Fetch Cart from Backend
  const fetchCartData = async () => {
    if (!api.getToken()) return;
    try {
      const res = await api.getCart();
      if (res.status === 'success') {
        setCart(res.data || { items: [], subtotal: 0, total_amount: 0 });
      }
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  };

  // Fetch Wishlist from Backend
  const fetchWishlistData = async () => {
    if (!api.getToken()) return;
    try {
      const res = await api.getWishlist();
      if (res.status === 'success') {
        setWishlist(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch wishlist", err);
    }
  };

  // User Authentication wrappers
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.login(email, password);
      if (res.status === 'success') {
        setUser(res.data.user);
        showToast('Welcome back, ' + res.data.user.name + '!', 'success');
        await fetchCartData();
        await fetchWishlistData();
        navigate('catalog');
      }
    } catch (err) {
      showToast(err.message || 'Login failed. Please check credentials.', 'danger');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, passwordConfirmation) => {
    setLoading(true);
    try {
      const res = await api.register(name, email, password, passwordConfirmation);
      if (res.status === 'success') {
        setUser(res.data.user);
        showToast('Registration successful! Welcome, ' + res.data.user.name + '!', 'success');
        await fetchCartData();
        await fetchWishlistData();
        navigate('catalog');
      }
    } catch (err) {
      showToast(err.message || 'Registration failed. Please fix validation errors.', 'danger');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.logout();
      setUser(null);
      setCart({ items: [], subtotal: 0, total_amount: 0 });
      setWishlist([]);
      showToast('Logged out successfully.', 'success');
      navigate('catalog');
    } catch (err) {
      showToast('Logout failed', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (name, email) => {
    try {
      const res = await api.updateProfile(name, email);
      if (res.status === 'success') {
        setUser(res.data);
        showToast('Profile updated successfully!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'danger');
      throw err;
    }
  };

  // Cart operations wrappers
  const addToCart = async (productId, quantity, variantDetails = {}) => {
    if (!user) {
      showToast('Please login to add items to cart.', 'warning');
      return;
    }
    try {
      const res = await api.addToCart(productId, quantity, variantDetails);
      if (res.status === 'success') {
        showToast('Item added to cart.', 'success');
        await fetchCartData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to add item to cart.', 'danger');
    }
  };

  const updateCartQuantity = async (itemId, quantity) => {
    try {
      const res = await api.updateCartQuantity(itemId, quantity);
      if (res.status === 'success') {
        await fetchCartData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update quantity.', 'danger');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await api.removeFromCart(itemId);
      if (res.status === 'success') {
        showToast('Item removed from cart.', 'success');
        await fetchCartData();
      }
    } catch (err) {
      showToast('Failed to remove item.', 'danger');
    }
  };

  const clearCart = async () => {
    try {
      const res = await api.clearCart();
      if (res.status === 'success') {
        showToast('Cart cleared.', 'success');
        setCart({ items: [], subtotal: 0, total_amount: 0 });
      }
    } catch (err) {
      showToast('Failed to clear cart.', 'danger');
    }
  };

  // Wishlist wrappers
  const toggleWishlist = async (productId) => {
    if (!user) {
      showToast('Please login to manage wishlist.', 'warning');
      return;
    }
    const exists = wishlist.some(item => item.product_id === productId);
    try {
      if (exists) {
        const res = await api.removeFromWishlist(productId);
        if (res.status === 'success') {
          showToast('Product removed from wishlist.', 'success');
          setWishlist(prev => prev.filter(item => item.product_id !== productId));
        }
      } else {
        const res = await api.addToWishlist(productId);
        if (res.status === 'success') {
          showToast('Product added to wishlist.', 'success');
          setWishlist(prev => [...prev, res.data]);
        }
      }
    } catch (err) {
      showToast('Failed to update wishlist.', 'danger');
    }
  };

  const isProductInWishlist = (productId) => {
    return wishlist.some(item => item.product_id === productId);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        loading,
        cart,
        wishlist,
        currentView,
        selectedProductSlug,
        selectedOrderId,
        toast,
        showToast,
        navigate,
        login,
        register,
        logout,
        updateProfile,
        fetchCartData,
        fetchWishlistData,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isProductInWishlist,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
