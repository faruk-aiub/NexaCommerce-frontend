import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async ({ page = 1, perPage = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await api.getOrders(page, perPage);
      return response; // response contains data, meta, etc.
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  'order/fetchOrderDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.getOrderDetails(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch order details');
    }
  }
);

export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async ({ shippingAddressId, couponCode = null }, { rejectWithValue }) => {
    try {
      const response = await api.checkout(shippingAddressId, couponCode);
      return response.data; // order object
    } catch (error) {
      return rejectWithValue(error.message || 'Order checkout failed');
    }
  }
);

export const payForOrder = createAsyncThunk(
  'order/payForOrder',
  async ({ id, paymentMethod, transactionId }, { rejectWithValue }) => {
    try {
      const response = await api.payOrder(id, paymentMethod, transactionId);
      return response.data; // updated order object
    } catch (error) {
      return rejectWithValue(error.message || 'Order payment failed');
    }
  }
);

export const trackOrderById = createAsyncThunk(
  'order/trackOrder',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.getOrderDetails(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'No order found with this tracking number/ID');
    }
  }
);

const initialState = {
  orders: [],
  meta: {
    current_page: 1,
    last_page: 1,
    total: 0,
  },
  currentOrder: null,
  trackedOrder: null,
  loading: false,
  trackingLoading: false,
  error: null,
  trackingError: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearTrackedOrder: (state) => {
      state.trackedOrder = null;
      state.trackingError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        if (payload?.status === 'success' && payload.data) {
          if (Array.isArray(payload.data.data)) {
            state.orders = payload.data.data;
            state.meta = {
              current_page: payload.data.current_page || 1,
              last_page: payload.data.last_page || 1,
              total: payload.data.total || payload.data.data.length,
            };
          } else if (Array.isArray(payload.data)) {
            state.orders = payload.data;
            state.meta = {
              current_page: 1,
              last_page: 1,
              total: payload.data.length,
            };
          }
        } else if (action.payload?.data && Array.isArray(action.payload.data)) {
          state.orders = action.payload.data;
          state.meta = action.payload.meta || {
            current_page: action.payload.current_page || 1,
            last_page: action.payload.last_page || 1,
            total: action.payload.total || action.payload.data.length,
          };
        } else if (Array.isArray(action.payload)) {
          state.orders = action.payload;
        }
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Order Details
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Track Order
      .addCase(trackOrderById.pending, (state) => {
        state.trackingLoading = true;
        state.trackedOrder = null;
        state.trackingError = null;
      })
      .addCase(trackOrderById.fulfilled, (state, action) => {
        state.trackingLoading = false;
        state.trackedOrder = action.payload;
      })
      .addCase(trackOrderById.rejected, (state, action) => {
        state.trackingLoading = false;
        state.trackingError = action.payload;
      })
      // Place Order
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Pay Order
      .addCase(payForOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        const idx = state.orders.findIndex(ord => ord.id === action.payload.id);
        if (idx !== -1) {
          state.orders[idx] = action.payload;
        }
      });
  },
});

export const { clearCurrentOrder, clearTrackedOrder } = orderSlice.actions;
export default orderSlice.reducer;
