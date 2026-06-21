import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
});

// Request interceptor to dynamically inject authorization token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle blobs (like PDFs) and structure errors
apiClient.interceptors.response.use(
  (response) => {
    // If it's a blob response, return the data directly (which is the blob)
    if (response.config.responseType === 'blob' || response.headers['content-type']?.includes('application/pdf')) {
      return response.data;
    }
    return response.data;
  },
  (error) => {
    const formattedError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'Something went wrong',
      errors: error.response?.data?.errors || null,
    };
    console.error(`API Client Error:`, formattedError);
    return Promise.reject(formattedError);
  }
);

// High-level service methods corresponding to the previous fetch service:
export const api = {
  setToken: (token) => {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  },
  getToken: () => localStorage.getItem('auth_token'),

  // --- AUTH & PROFILE ---
  login: async (email, password) => {
    const response = await apiClient.post('/login', { email, password });
    if (response.status === 'success' && response.data?.token) {
      api.setToken(response.data.token);
    }
    return response;
  },

  register: async (name, email, password, password_confirmation) => {
    const response = await apiClient.post('/register', { name, email, password, password_confirmation });
    if (response.status === 'success' && response.data?.token) {
      api.setToken(response.data.token);
    }
    return response;
  },

  logout: async () => {
    try {
      await apiClient.post('/logout');
    } finally {
      api.setToken(null);
    }
  },

  getProfile: () => apiClient.get('/profile'),
  updateProfile: (name, email) => apiClient.put('/profile', { name, email }),

  // --- ADDRESSES ---
  getAddresses: () => apiClient.get('/addresses'),
  addAddress: (address) => apiClient.post('/addresses', address),
  updateAddress: (id, address) => apiClient.put(`/addresses/${id}`, address),
  deleteAddress: (id) => apiClient.delete(`/addresses/${id}`),

  // --- CATALOG ---
  getProducts: (params = {}) => {
    return apiClient.get('/products', { params });
  },
  getProductDetails: (slug) => apiClient.get(`/products/${slug}`),
  getCategories: () => apiClient.get('/categories'),
  getBrands: () => apiClient.get('/brands'),
  submitReview: (productId, rating, reviewText) => {
    return apiClient.post(`/products/${productId}/reviews`, { rating, review_text: reviewText });
  },

  // --- CART ---
  getCart: () => apiClient.get('/cart'),
  addToCart: (productId, quantity, variantDetails = {}) => {
    return apiClient.post('/cart', { product_id: productId, quantity, variant_details: variantDetails });
  },
  updateCartQuantity: (itemId, quantity) => {
    return apiClient.put(`/cart/${itemId}`, { quantity });
  },
  removeFromCart: (itemId) => apiClient.delete(`/cart/${itemId}`),
  clearCart: () => apiClient.post('/cart/clear'),

  // --- WISHLIST ---
  getWishlist: () => apiClient.get('/wishlist'),
  addToWishlist: (productId) => apiClient.post('/wishlist', { product_id: productId }),
  removeFromWishlist: (productId) => apiClient.delete(`/wishlist/${productId}`),

  // --- CHECKOUT & ORDERS ---
  checkout: (shippingAddressId, couponCode = null) => {
    return apiClient.post('/checkout', { shipping_address_id: shippingAddressId, coupon_code: couponCode });
  },
  getOrders: (page = 1, perPage = 10) => {
    return apiClient.get(`/orders`, { params: { page, per_page: perPage } });
  },
  getOrderDetails: (id) => apiClient.get(`/orders/${id}`),
  payOrder: (id, paymentMethod, transactionId) => {
    return apiClient.post(`/orders/${id}/pay`, { payment_method: paymentMethod, transaction_id: transactionId });
  },
  getInvoiceBlob: (id) => {
    return apiClient.get(`/invoices/${id}/download`, { responseType: 'blob' });
  },

  // --- ADMIN PANEL ---
  getAdminStats: () => apiClient.get('/admin/dashboard'),
  getAdminUsers: (page = 1) => apiClient.get('/admin/users', { params: { page } }),
  getAdminCoupons: () => apiClient.get('/admin/coupons'),
  createCoupon: (coupon) => apiClient.post('/admin/coupons', coupon),
  updateCoupon: (id, coupon) => apiClient.put(`/admin/coupons/${id}`, coupon),
  deleteCoupon: (id) => apiClient.delete(`/admin/coupons/${id}`),
  getAdminReviews: (page = 1) => apiClient.get('/admin/reviews', { params: { page } }),
  approveReview: (id) => apiClient.post(`/admin/reviews/${id}/approve`),
  deleteReview: (id) => apiClient.delete(`/admin/reviews/${id}`),
  getAdminInvoices: (page = 1) => apiClient.get('/admin/invoices', { params: { page } }),

  // Admin Brand CRUD
  createBrand: (formData) => apiClient.post('/admin/brands', formData),
  updateBrand: (id, formData) => {
    if (formData instanceof FormData) {
      if (!formData.has('_method')) {
        formData.append('_method', 'PUT');
      }
      return apiClient.post(`/admin/brands/${id}`, formData);
    }
    return apiClient.put(`/admin/brands/${id}`, formData);
  },
  deleteBrand: (id) => apiClient.delete(`/admin/brands/${id}`),

  // Admin Category CRUD
  createCategory: (category) => apiClient.post('/admin/categories', category),
  updateCategory: (id, category) => apiClient.put(`/admin/categories/${id}`, category),
  deleteCategory: (id) => apiClient.delete(`/admin/categories/${id}`),

  // Admin Product CRUD
  createProduct: (productData) => {
    return apiClient.post('/admin/products', productData);
  },
  updateProduct: (id, productData) => {
    if (productData instanceof FormData) {
      if (!productData.has('_method')) {
        productData.append('_method', 'PUT');
      }
      return apiClient.post(`/admin/products/${id}`, productData);
    }
    return apiClient.put(`/admin/products/${id}`, productData);
  },
  deleteProduct: (id) => apiClient.delete(`/admin/products/${id}`),

  // Admin Order Status Update
  updateOrderStatus: (id, status) => apiClient.put(`/admin/orders/${id}/status`, { status }),
};

export default apiClient;
