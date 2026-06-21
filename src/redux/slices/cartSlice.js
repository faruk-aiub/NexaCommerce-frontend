import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth.isAuthenticated) {
        // Return local cart
        return { items: JSON.parse(localStorage.getItem('cart_items') || '[]') };
      }
      const response = await api.getCart();
      return response.data; // { items: [...], total_price: ... }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ product, quantity, variantDetails = {} }, { getState, rejectWithValue, dispatch }) => {
    try {
      const { auth } = getState();
      if (!auth.isAuthenticated) {
        // Guest Cart logic
        const localItems = JSON.parse(localStorage.getItem('cart_items') || '[]');
        const existingIdx = localItems.findIndex(
          item => item.product.id === product.id && JSON.stringify(item.variant_details) === JSON.stringify(variantDetails)
        );
        if (existingIdx !== -1) {
          localItems[existingIdx].quantity += quantity;
        } else {
          localItems.push({
            id: 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            product,
            quantity,
            variant_details: variantDetails,
            price: product.price,
          });
        }
        localStorage.setItem('cart_items', JSON.stringify(localItems));
        return { items: localItems };
      }
      const response = await api.addToCart(product.id, quantity, variantDetails);
      // Refetch full cart data to ensure accurate prices and database states are returned
      dispatch(fetchCart());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add item to cart');
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  'cart/updateCartQuantity',
  async ({ itemId, quantity }, { getState, rejectWithValue, dispatch }) => {
    try {
      const { auth } = getState();
      if (!auth.isAuthenticated) {
        const localItems = JSON.parse(localStorage.getItem('cart_items') || '[]');
        const idx = localItems.findIndex(item => item.id === itemId);
        if (idx !== -1) {
          localItems[idx].quantity = quantity;
        }
        localStorage.setItem('cart_items', JSON.stringify(localItems));
        return { items: localItems };
      }
      const response = await api.updateCartQuantity(itemId, quantity);
      dispatch(fetchCart());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update quantity');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { getState, rejectWithValue, dispatch }) => {
    try {
      const { auth } = getState();
      if (!auth.isAuthenticated) {
        let localItems = JSON.parse(localStorage.getItem('cart_items') || '[]');
        localItems = localItems.filter(item => item.id !== itemId);
        localStorage.setItem('cart_items', JSON.stringify(localItems));
        return { items: localItems };
      }
      const response = await api.removeFromCart(itemId);
      dispatch(fetchCart());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to remove item');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth.isAuthenticated) {
        localStorage.removeItem('cart_items');
        return { items: [] };
      }
      await api.clearCart();
      return { items: [] };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to clear cart');
    }
  }
);

// Helper to sync local guest cart items to database upon user log-in
export const syncCartOnLogin = createAsyncThunk(
  'cart/syncCartOnLogin',
  async (_, { getState, dispatch }) => {
    const localItems = JSON.parse(localStorage.getItem('cart_items') || '[]');
    if (localItems.length === 0) return;
    
    try {
      for (const item of localItems) {
        await api.addToCart(item.product.id, item.quantity, item.variant_details);
      }
      localStorage.removeItem('cart_items');
      dispatch(fetchCart());
    } catch (error) {
      console.error('Failed to sync guest cart on login', error);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.items || [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add To Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        if (action.payload?.items) {
          state.items = action.payload.items;
        }
      })
      // Update Quantity
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        if (action.payload?.items) {
          state.items = action.payload.items;
        }
      })
      // Remove Item
      .addCase(removeFromCart.fulfilled, (state, action) => {
        if (action.payload?.items) {
          state.items = action.payload.items;
        }
      })
      // Clear Cart
      .addCase(clearCart.fulfilled, (state, action) => {
        state.items = action.payload?.items || [];
      });
  },
});

export default cartSlice.reducer;
