import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch logged-in user's orders
export const fetchUserOrders = createAsyncThunk(
  "/orders/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data || { message: "Something went wrong" },
      );
    }
  },
);

// Fetch single order details by ID
export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data || { message: "Something went wrong" },
      );
    }
  },
);

// Request return for a specific product in an order
export const requestReturn = createAsyncThunk(
  "orders/requestReturn",
  async ({ orderId, productId, reason, comment }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/return`,
        { productId, reason, comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
      return { productId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Return request failed" },
      );
    }
  },
);

// Fetch all return requests (Admin only)
export const fetchReturnRequests = createAsyncThunk(
  "orders/fetchReturnRequests",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/returns`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch returns" },
      );
    }
  },
);

// Update return status (Admin: approve / reject)
export const updateReturnStatus = createAsyncThunk(
  "orders/updateReturnStatus",
  async ({ orderId, productId, action }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/return/${productId}`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
      return { orderId, productId, action };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Update failed" },
      );
    }
  },
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    totalOrders: 0,
    orderDetails: null,
    loading: false,
    error: null,
    returnSuccess: false,
    returnRequests: [],
  },
  reducers: {
    clearReturnStatus: (state) => {
      state.returnSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      // Fetch order Details
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      /* REQUEST RETURN */
      .addCase(requestReturn.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.returnSuccess = false;
      })
      .addCase(requestReturn.fulfilled, (state) => {
        state.loading = false;
        state.returnSuccess = true;
      })
      .addCase(requestReturn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      // FETCH RETURNS
      .addCase(fetchReturnRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReturnRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.returnRequests = action.payload;
      })
      .addCase(fetchReturnRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // UPDATE RETURN STATUS
      .addCase(updateReturnStatus.fulfilled, (state, action) => {
        const { orderId, productId, action: status } = action.payload;

        const order = state.returnRequests.find((o) => o._id === orderId);
        if (order) {
          const item = order.orderItems.find(
            (i) => i.productId.toString() === productId,
          );
          if (item) {
            item.returnStatus = status;
          }
        }
      });
  },
});

export const { clearReturnStatus } = orderSlice.actions;
export default orderSlice.reducer;
