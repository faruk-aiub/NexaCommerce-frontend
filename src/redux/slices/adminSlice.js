import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export const fetchAdminStats = createAsyncThunk(
  'admin/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getAdminStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch admin stats');
    }
  }
);

export const fetchAdminUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await api.getAdminUsers(page);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch users');
    }
  }
);

export const fetchAdminCoupons = createAsyncThunk(
  'admin/fetchCoupons',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getAdminCoupons();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch coupons');
    }
  }
);

export const createCoupon = createAsyncThunk(
  'admin/createCoupon',
  async (coupon, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.createCoupon(coupon);
      dispatch(fetchAdminCoupons());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create coupon');
    }
  }
);

export const updateCoupon = createAsyncThunk(
  'admin/updateCoupon',
  async ({ id, coupon }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.updateCoupon(id, coupon);
      dispatch(fetchAdminCoupons());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update coupon');
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  'admin/deleteCoupon',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await api.deleteCoupon(id);
      dispatch(fetchAdminCoupons());
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete coupon');
    }
  }
);

export const fetchAdminReviews = createAsyncThunk(
  'admin/fetchReviews',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await api.getAdminReviews(page);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch reviews');
    }
  }
);

export const approveReview = createAsyncThunk(
  'admin/approveReview',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.approveReview(id);
      dispatch(fetchAdminReviews());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to approve review');
    }
  }
);

export const deleteReview = createAsyncThunk(
  'admin/deleteReview',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await api.deleteReview(id);
      dispatch(fetchAdminReviews());
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete review');
    }
  }
);

export const fetchAdminInvoices = createAsyncThunk(
  'admin/fetchInvoices',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await api.getAdminInvoices(page);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch invoices');
    }
  }
);

// CRUD operations
export const createBrand = createAsyncThunk(
  'admin/createBrand',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.createBrand(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create brand');
    }
  }
);

export const updateBrand = createAsyncThunk(
  'admin/updateBrand',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.updateBrand(id, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update brand');
    }
  }
);

export const deleteBrand = createAsyncThunk(
  'admin/deleteBrand',
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteBrand(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete brand');
    }
  }
);

export const createCategory = createAsyncThunk(
  'admin/createCategory',
  async (category, { rejectWithValue }) => {
    try {
      const response = await api.createCategory(category);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create category');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'admin/updateCategory',
  async ({ id, category }, { rejectWithValue }) => {
    try {
      const response = await api.updateCategory(id, category);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update category');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'admin/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteCategory(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete category');
    }
  }
);

export const createProduct = createAsyncThunk(
  'admin/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await api.createProduct(productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'admin/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await api.updateProduct(id, productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'admin/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteProduct(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete product');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'admin/updateOrderStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.updateOrderStatus(id, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update order status');
    }
  }
);

const initialState = {
  stats: null,
  users: [],
  coupons: [],
  reviews: [],
  invoices: [],
  meta: {},
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Stats
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Users
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.users = action.payload?.data || action.payload;
      })
      // Fetch Coupons
      .addCase(fetchAdminCoupons.fulfilled, (state, action) => {
        state.coupons = action.payload;
      })
      // Fetch Reviews
      .addCase(fetchAdminReviews.fulfilled, (state, action) => {
        state.reviews = action.payload?.data || action.payload;
      })
      // Fetch Invoices
      .addCase(fetchAdminInvoices.fulfilled, (state, action) => {
        state.invoices = action.payload?.data || action.payload;
      });
  },
});

export default adminSlice.reducer;
