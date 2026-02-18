import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const HomeContentManagement = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState({
    heroImage: "",
    menCollectionImage: "",
    womenCollectionImage: "",
  });

  /* 🔐 Admin protection */
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  /* 📥 Fetch existing home content */
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/home-content`,
        );
        if (data) setContent(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchContent();
  }, []);

  /* ☁️ Upload Image (reuse your existing upload API) */
  const uploadImage = async (file, field) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );

      setContent((prev) => ({
        ...prev,
        [field]: data.imageUrl,
      }));

      toast.success("Image uploaded");
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* 💾 Save changes */
  const handleSave = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/home-content`,
        content,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );

      toast.success("Home page updated successfully");
    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Home Page Content</h2>

      {/* HERO IMAGE */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Hero Image</label>
        {content.heroImage && (
          <img
            src={content.heroImage}
            alt="Hero"
            className="w-64 h-40 object-cover rounded-lg border shadow-sm mb-3"
          />
        )}
        <input
          type="file"
          onChange={(e) => uploadImage(e.target.files[0], "heroImage")}
        />
      </div>

      {/* MEN COLLECTION */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Men's Collection Image</label>
        {content.menCollectionImage && (
          <img
            src={content.menCollectionImage}
            alt="Men"
            className="w-64 h-40 object-cover rounded-lg border shadow-sm mb-3"
          />
        )}
        <input
          type="file"
          onChange={(e) => uploadImage(e.target.files[0], "menCollectionImage")}
        />
      </div>

      {/* WOMEN COLLECTION */}
      <div className="mb-6">
        <label className="block font-medium mb-2">
          Women's Collection Image
        </label>
        {content.womenCollectionImage && (
          <img
            src={content.womenCollectionImage}
            alt="Women"
            className="w-64 h-40 object-cover rounded-lg border shadow-sm mb-3"
          />
        )}
        <input
          type="file"
          onChange={(e) =>
            uploadImage(e.target.files[0], "womenCollectionImage")
          }
        />
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default HomeContentManagement;
