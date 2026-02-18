import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axios from "axios";
import { addProduct } from "../../redux/slices/productsSlice";
import { toast } from "sonner";
import { fetchCategories } from "../../redux/slices/categorySlice";
import { fetchMaterials } from "../../redux/slices/materialSlice";
import { fetchBrands } from "../../redux/slices/brandSlice";

const AddProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const { brands } = useSelector((state) => state.brands);
  const { materials } = useSelector((state) => state.materials);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBrands());
    dispatch(fetchMaterials());
  }, [dispatch]);

  const [uploading, setUploading] = useState(false);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    countInStock: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    material: "",
    gender: "",
    images: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      setProductData((prev) => {
        const newImages = [...prev.images];
        newImages[index] = { url: data.imageUrl, altText: "" };
        return { ...prev, images: newImages };
      });
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...productData,
      price: Number(productData.price),
      countInStock: Number(productData.countInStock),
      discountPrice: productData.discountPrice
        ? Number(productData.discountPrice)
        : undefined,
    };

    try {
      await dispatch(addProduct(payload)).unwrap();
      navigate("/admin/products");
      toast.success("Product added successfully!", {
        duration: 1200,
      });
    } catch (err) {
      toast.error(err?.message || "Failed to add product", {
        duration: 1500,
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Add Product</h2>
      <form
        onSubmit={handleSubmit}
        className={uploading ? "opacity-60 pointer-events-none" : ""}
      >
        {/* Name */}
        <label className="block font-semibold mb-2">Product Name</label>
        <input
          className="w-full p-2 border mb-4"
          name="name"
          placeholder="Product Name"
          value={productData.name}
          onChange={handleChange}
          required
        />

        {/* Description */}
        <label className="block font-semibold mb-2">Description</label>
        <textarea
          className="w-full p-2 border mb-4"
          name="description"
          placeholder="Description"
          value={productData.description}
          onChange={handleChange}
          required
        />

        {/* Price */}
        <label className="block font-semibold mb-2">Price</label>
        <input
          className="w-full p-2 border mb-4"
          type="number"
          name="price"
          placeholder="Price"
          value={productData.price}
          onChange={handleChange}
          required
        />

        {/* Stock */}
        <label className="block font-semibold mb-2">Stock</label>
        <input
          className="w-full p-2 border mb-4"
          type="number"
          name="countInStock"
          placeholder="Stock"
          value={productData.countInStock}
          onChange={handleChange}
          required
        />
        <div className="mb-4">
          <label className="block font-semibold mb-2">Category</label>
          <select
            name="category"
            value={productData.category}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Category</option>

            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Brand</label>
          <select
            name="brand"
            value={productData.brand}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Brand</option>

            {brands.map((brand) => (
              <option key={brand._id} value={brand.name}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Material</label>
          <select
            name="material"
            value={productData.material}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Material</option>

            {materials.map((material) => (
              <option key={material._id} value={material.name}>
                {material.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Gender</label>
          <select
            name="gender"
            value={productData.gender}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        {/* Sizes */}
        <label className="block font-semibold mb-2">Sizes</label>
        <input
          className="w-full p-2 border mb-4"
          placeholder="Sizes (XS,S,M,L)"
          value={productData.sizes.join(",")}
          onChange={(e) =>
            setProductData({
              ...productData,
              sizes: e.target.value.split(",").map((s) => s.trim()),
            })
          }
          required
        />

        {/* Colors */}
        <label className="block font-semibold mb-2">Colors</label>
        <input
          className="w-full p-2 border mb-4"
          placeholder="Colors (Red,Blue)"
          value={productData.colors.join(",")}
          onChange={(e) =>
            setProductData({
              ...productData,
              colors: e.target.value.split(",").map((c) => c.trim()),
            })
          }
          required
        />

        {/* Image Upload */}
        {/* Image Upload 1 */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Upload Image 1</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, 0)}
            required
            disabled={uploading}
          />
        </div>

        {/* Image Upload 2 */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Upload Image 2</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, 1)}
            required
            disabled={uploading}
          />
        </div>
        <div className="flex gap-4 mt-4">
          {productData.images.map((img, i) =>
            img ? (
              <img
                key={i}
                src={img.url}
                alt={`preview-${i}`}
                className="w-24 h-24 object-cover rounded"
              />
            ) : null,
          )}
        </div>
        {uploading && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
            Uploading image, please wait...
          </div>
        )}

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </form>
      {error && (
        <p className="mb-4 text-red-600 bg-red-100 p-2 rounded">{error}</p>
      )}
    </div>
  );
};

export default AddProductPage;
