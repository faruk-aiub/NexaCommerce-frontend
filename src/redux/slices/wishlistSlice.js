import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth.isAuthenticated) {
        return JSON.parse(localStorage.getItem('wishlist_items') || '[]');
      }
      const response = await api.getWishlist();
      return response.data; // array of products or wishlist items
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch wishlist');
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  'wishlist/toggleWishlist',
  async (product, { getState, rejectWithValue, dispatch }) => {
    try {
      const { auth, wishlist } = getState();
      const isFavorited = wishlist.items.some(item => (item.product?.id === product.id || item.id === product.id));
      
      if (!auth.isAuthenticated) {
        let localWishlist = JSON.parse(localStorage.getItem('wishlist_items') || '[]');
        if (isFavorited) {
          localWishlist = localWishlist.filter(item => item.id !== product.id);
        } else {
          localWishlist.push(product);
        }
        localStorage.setItem('wishlist_items', JSON.stringify(localWishlist));
        return localWishlist;
      }
      
      if (isFavorited) {
        await api.removeFromWishlist(product.id);
      } else {
        await api.addToWishlist(product.id);
      }
      
      dispatch(fetchWishlist());
      return null;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to toggle wishlist item');
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.items = action.payload;
        }
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        if (action.payload) {
          state.items = action.payload;
        }
      });
  },
});

export default wishlistSlice.reducer;
