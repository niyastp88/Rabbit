import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/wishlist`;

// 🔹 Get Wishlist
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// 🔹 Toggle Wishlist (Add / Remove)
export const toggleWishlist = createAsyncThunk(
  "wishlist/toggleWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        API_URL,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// 🔹 Remove from Wishlist (Delete)
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`${API_URL}/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
  builder
    // FETCH
    .addCase(fetchWishlist.fulfilled, (state, action) => {
      state.products = action.payload.products || [];
    })

    // TOGGLE (optimistic)
    .addCase(toggleWishlist.pending, (state, action) => {
      const productId = action.meta.arg;

      const index = state.products.findIndex(
        (p) => p.product?._id === productId
      );

      if (index > -1) {
        state.products.splice(index, 1);
      } else {
        state.products.push({
          product: { _id: productId },
        });
      }
    })

    // ✅ DELETE (FIXED)
    .addCase(removeFromWishlist.fulfilled, (state, action) => {
      const deletedProductId = action.meta.arg;

      state.products = state.products.filter(
        (item) => item.product?._id !== deletedProductId
      );
    });
}


,
});

export default wishlistSlice.reducer;
