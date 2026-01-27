import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  createCategory,
  deleteCategory,
} from "../../redux/slices/categorySlice";
import { toast } from "sonner";

const CategoryManagement = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.categories);

  const [name, setName] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await dispatch(createCategory(name)).unwrap();
      toast.success("Category added successfully");
      setName("");
    } catch (error) {
      toast.error(error || "Failed to add category");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await dispatch(deleteCategory(id)).unwrap();
      toast.success("Category deleted");
    } catch (error) {
      toast.error(error || "Delete failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Category Management</h2>

      {/* Add Category */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <input
          type="text"
          className="flex-1 border p-2 rounded"
          placeholder="Enter category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 rounded">
          Add
        </button>
      </form>

      {/* List Categories */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li
              key={cat._id}
              className="flex justify-between items-center border p-2 rounded"
            >
              <span>{cat.name}</span>
              <button
                onClick={() => handleDelete(cat._id)}
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

export default CategoryManagement;
