import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMaterials,
  createMaterial,
  deleteMaterial,
} from "../../redux/slices/materialSlice";
import { toast } from "sonner";

const MaterialManagement = () => {
  const dispatch = useDispatch();
  const { materials, loading } = useSelector((state) => state.materials);

  const [name, setName] = useState("");

  useEffect(() => {
    dispatch(fetchMaterials());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await dispatch(createMaterial(name)).unwrap();
      toast.success("Material added successfully");
      setName("");
    } catch (error) {
      toast.error(error || "Failed to add material");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this material?")) return;

    try {
      await dispatch(deleteMaterial(id)).unwrap();
      toast.success("Material deleted");
    } catch (error) {
      toast.error(error || "Delete failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Material Management</h2>

      {/* Add Material */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <input
          type="text"
          className="flex-1 border p-2 rounded"
          placeholder="Enter material name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 rounded">
          Add
        </button>
      </form>

      {/* List Materials */}
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
          {materials.map((mat) => (
            <li
              key={mat._id}
              className="flex justify-between items-center border p-2 rounded"
            >
              <span>{mat.name}</span>
              <button
                onClick={() => handleDelete(mat._id)}
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

export default MaterialManagement;
