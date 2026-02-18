import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBrands,
  createBrand,
  deleteBrand,
} from "../../redux/slices/brandSlice";
import { toast } from "sonner";

const BrandManagement = () => {
  const dispatch = useDispatch();
  const { brands, loading } = useSelector((state) => state.brands);

  const [name, setName] = useState("");

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await dispatch(createBrand(name)).unwrap();
      toast.success("Brand added successfully");
      setName("");
    } catch (error) {
      toast.error(error || "Failed to add brand");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this brand?")) return;

    try {
      await dispatch(deleteBrand(id)).unwrap();
      toast.success("Brand deleted");
    } catch (error) {
      toast.error(error || "Delete failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Brand Management</h2>

      {/* Add Brand */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <input
          type="text"
          className="flex-1 border p-2 rounded"
          placeholder="Enter brand name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 rounded">
          Add
        </button>
      </form>

      {/* List Brands */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {/* List Skeleton */}
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex justify-between items-center border p-3 rounded"
            >
              <div className="h-4 w-40 bg-gray-200 rounded"></div>
              <div className="h-8 w-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <ul className="space-y-2">
          {brands.map((brand) => (
            <li
              key={brand._id}
              className="flex justify-between items-center border p-2 rounded"
            >
              <span>{brand.name}</span>
              <button
                onClick={() => handleDelete(brand._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BrandManagement;
