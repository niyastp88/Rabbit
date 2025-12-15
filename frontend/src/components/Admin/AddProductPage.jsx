import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axios from "axios";
import { addProduct } from "../../redux/slices/productsSlice";

const AddProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.products);

  const [uploading, setUploading] = useState(false);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: 0,
    countInStock: "",
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "",
    images: [],
    isFeatured: false,
    isPublished: true,
    tags: [],
    weight: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setProductData((prev) => ({
        ...prev,
        images: [...prev.images, { url: data.imageUrl, altText: "" }],
      }));
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

    await dispatch(addProduct(payload)).unwrap();
    navigate("/admin/products");
  };

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Add Product</h2>

      {error && (
        <p className="mb-4 text-red-600 bg-red-100 p-2 rounded">{error}</p>
      )}

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <input
          className="w-full p-2 border mb-4"
          name="name"
          placeholder="Product Name"
          value={productData.name}
          onChange={handleChange}
          required
        />

        {/* Description */}
        <textarea
          className="w-full p-2 border mb-4"
          name="description"
          placeholder="Description"
          value={productData.description}
          onChange={handleChange}
          required
        />

        {/* Price */}
        <input
          className="w-full p-2 border mb-4"
          type="number"
          name="price"
          placeholder="Price"
          value={productData.price}
          onChange={handleChange}
        />

        {/* Stock */}
        <input
          className="w-full p-2 border mb-4"
          type="number"
          name="countInStock"
          placeholder="Stock"
          value={productData.countInStock}
          onChange={handleChange}
        />
        <div className="mb-4">
          <label className="block font-semibold mb-2">Category</label>
          <select
            name="category"
            value={productData.category}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            <option value="Top Wear">Top Wear</option>
            <option value="Bottom Wear">Bottom Wear</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Collection</label>
          <select
            name="collections"
            value={productData.collections}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Collection</option>
            <option value="Basics">Basics</option>
            <option value="Casual Collection">Casual Collection</option>
            <option value="Urban Collection">Urban Collection</option>
            <option value="Lounge Collection">Lounge Collection</option>
            
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

        {/* SKU */}
        <input
          className="w-full p-2 border mb-4"
          name="sku"
          placeholder="SKU"
          value={productData.sku}
          onChange={handleChange}
        />

        {/* Sizes */}
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
        />

        {/* Colors */}
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
        />

        {/* Image Upload */}
        <input type="file" onChange={handleImageUpload} />
        {uploading && <p>Uploading...</p>}

        <div className="flex gap-3 mt-4">
          {productData.images.map((img, i) => (
            <img
              key={i}
              src={img.url}
              alt="preview"
              className="w-20 h-20 object-cover rounded"
            />
          ))}
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;
