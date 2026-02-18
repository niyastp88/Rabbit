import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base API URL for materials
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/materials`;

// Fetch all material
export const fetchMaterials = createAsyncThunk(
  "materials/fetchMaterials",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(API_URL);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

// Create a new material (Admin only)
export const createMaterial = createAsyncThunk(
  "materials/createMaterial",
  async (name, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        API_URL,
        { name },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

// Delete a material by ID (Admin only)
export const deleteMaterial = createAsyncThunk(
  "materials/deleteMaterial",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

const materialSlice = createSlice({
  name: "materials",
  initialState: {
    materials: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchMaterials.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.materials = action.payload;
      })
      .addCase(fetchMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createMaterial.fulfilled, (state, action) => {
        state.materials.push(action.payload);
      })

      // DELETE
      .addCase(deleteMaterial.fulfilled, (state, action) => {
        state.materials = state.materials.filter(
          (mat) => mat._id !== action.payload,
        );
      });
  },
});

export default materialSlice.reducer;
