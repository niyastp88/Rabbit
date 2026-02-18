import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import {
  fetchProductDetails,
  updateProduct,
} from "../../redux/slices/productsSlice";
import { fetchCategories } from "../../redux/slices/categorySlice";
import { fetchMaterials } from "../../redux/slices/materialSlice";
import { fetchBrands } from "../../redux/slices/brandSlice";
import axios from "axios";
import { toast } from "sonner";

const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { selectedProduct, loading } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const { brands } = useSelector((state) => state.brands);
  const { materials } = useSelector((state) => state.materials);

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

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProductDetails(id));
    dispatch(fetchMaterials());
    dispatch(fetchBrands());
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      setProductData(selectedProduct);
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
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
        const images = [...prev.images];
        images[index] = { url: data.imageUrl, altText: "" };
        return { ...prev, images };
      });
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateProduct({ id, productData }));
    toast.success("Product updated successfully");
    navigate("/admin/products");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Edit Product</h2>

      <form onSubmit={handleSubmit}>
        <label className="block font-semibold mb-2">Name</label>
        <input
          className="w-full p-2 border mb-4"
          name="name"
          value={productData.name}
          onChange={handleChange}
          required
        />

        <label className="block font-semibold mb-2">Description</label>

        <textarea
          className="w-full p-2 border mb-4"
          name="description"
          value={productData.description}
          onChange={handleChange}
          required
        />

        <label className="block font-semibold mb-2">Price</label>

        <input
          className="w-full p-2 border mb-4"
          type="number"
          name="price"
          value={productData.price}
          onChange={handleChange}
          required
        />

        <label className="block font-semibold mb-2">Stock</label>

        <input
          className="w-full p-2 border mb-4"
          type="number"
          name="countInStock"
          value={productData.countInStock}
          onChange={handleChange}
          required
        />

        <label className="block font-semibold mb-2">Category</label>

        {/* Category */}
        <select
          name="category"
          value={productData.category}
          onChange={handleChange}
          className="w-full p-2 border mb-4"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Brand */}
        <label className="block font-semibold mb-2">Brand</label>
        <select
          name="brand"
          value={productData.brand}
          onChange={handleChange}
          className="w-full p-2 border mb-4"
        >
          <option value="">Select Brand</option>
          {brands.map((brand) => (
            <option key={brand._id} value={brand.name}>
              {brand.name}
            </option>
          ))}
        </select>

        {/* Material */}
        <label className="block font-semibold mb-2">Material</label>
        <select
          name="material"
          value={productData.material}
          onChange={handleChange}
          className="w-full p-2 border mb-4"
        >
          <option value="">Select Material</option>
          {materials.map((material) => (
            <option key={material._id} value={material.name}>
              {material.name}
            </option>
          ))}
        </select>
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
          value={productData.colors.join(",")}
          onChange={(e) =>
            setProductData({
              ...productData,
              colors: e.target.value.split(",").map((c) => c.trim()),
            })
          }
          required
        />

        {/* Image Uploads */}
        {[0, 1].map((i) => (
          <div key={i} className="mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, i)}
            />
            {productData.images[i] && (
              <img
                src={productData.images[i].url}
                className="w-24 h-24 mt-2 rounded"
              />
            )}
          </div>
        ))}

        <button className="w-full bg-green-600 text-white py-2 rounded">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
