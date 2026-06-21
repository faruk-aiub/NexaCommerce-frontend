import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export const fetchProducts = createAsyncThunk(
  'catalog/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.getProducts(params);
      return response; // response contains data, meta, etc.
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  'catalog/fetchProductDetails',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.getProductDetails(slug);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch product details');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'catalog/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch categories');
    }
  }
);

export const fetchBrands = createAsyncThunk(
  'catalog/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getBrands();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch brands');
    }
  }
);

export const submitReview = createAsyncThunk(
  'catalog/submitReview',
  async ({ productId, rating, reviewText }, { rejectWithValue }) => {
    try {
      const response = await api.submitReview(productId, rating, reviewText);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to submit review');
    }
  }
);

const initialState = {
  products: [],
  meta: {
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 12,
  },
  categories: [],
  brands: [],
  currentProduct: null,
  loading: false,
  detailLoading: false,
  error: null,
};

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        if (payload?.status === 'success' && payload.data) {
          if (Array.isArray(payload.data.data)) {
            state.products = payload.data.data;
            state.meta = {
              current_page: payload.data.current_page || 1,
              last_page: payload.data.last_page || 1,
              total: payload.data.total || payload.data.data.length,
              per_page: payload.data.per_page || 12,
            };
          } else if (Array.isArray(payload.data)) {
            state.products = payload.data;
            state.meta = { current_page: 1, last_page: 1, total: payload.data.length, per_page: 20 };
          }
        } else if (Array.isArray(payload)) {
          state.products = payload;
          state.meta = { current_page: 1, last_page: 1, total: payload.length, per_page: 20 };
        } else {
          state.products = [];
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Details
      .addCase(fetchProductDetails.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })
      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // Fetch Brands
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.brands = action.payload;
      })
      // Submit Review
      .addCase(submitReview.fulfilled, (state, action) => {
        if (state.currentProduct && state.currentProduct.reviews) {
          state.currentProduct.reviews.push(action.payload);
        }
      });
  },
});

export const { clearCurrentProduct } = catalogSlice.actions;
export default catalogSlice.reducer;
