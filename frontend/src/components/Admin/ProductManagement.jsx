import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import {
  deleteProduct,
  fetchAdminProducts,
} from "../../redux/slices/adminProductSlice";

const ProductManagement = () => {
  const dispatch = useDispatch();

  // 🔹 pagination states
  const [page, setPage] = useState(1);
  const limit = 10;

  const { products, loading, error, pages } = useSelector(
    (state) => state.adminProducts,
  );

  // 🔹 fetch products when page changes
  useEffect(() => {
    dispatch(fetchAdminProducts({ page, limit }));
  }, [dispatch, page]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Product Management</h2>

        {/* Add Button Skeleton */}
        <div className="flex justify-end mb-4">
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Table Skeleton */}
        <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white p-4">
          <div className="animate-pulse space-y-4">
            {/* Header Row */}
            <div className="grid grid-cols-5 gap-4 mb-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>

            {/* Product Rows */}
            {[1, 2, 3, 4, 5, 6, 7].map((row) => (
              <div key={row} className="grid grid-cols-5 gap-4 items-center">
                <div className="h-16 w-14 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="flex gap-2">
                  <div className="h-6 w-12 bg-gray-200 rounded"></div>
                  <div className="h-6 w-14 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Product Management</h2>

      {/* ADD PRODUCT */}
      <div className="flex justify-end mb-4">
        <Link
          to="/admin/products/add"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Product
        </Link>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products && products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  {/* IMAGE */}
                  <td className="p-4">
                    <img
                      src={
                        product.images?.[0]?.url ||
                        "https://via.placeholder.com/60x80?text=No+Image"
                      }
                      alt={product.name}
                      className="w-14 h-16 object-cover rounded"
                    />
                  </td>

                  {/* NAME */}
                  <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                    {product.name}
                  </td>

                  {/* PRICE */}
                  <td className="p-4">₹ {product.price}</td>

                  {/* STOCK */}
                  <td className="p-4">
                    {product.countInStock > 0 ? (
                      product.countInStock
                    ) : (
                      <span className="text-red-500 font-medium">
                        Out of stock
                      </span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4">
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No Products Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {/* PREV */}
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className={`px-3 py-1 rounded ${
              page === 1
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-black text-white"
            }`}
          >
            Prev
          </button>

          {/* PAGE NUMBERS */}
          {[...Array(pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1 ? "bg-black text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          {/* NEXT */}
          <button
            disabled={page === pages}
            onClick={() => setPage((p) => p + 1)}
            className={`px-3 py-1 rounded ${
              page === pages
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-black text-white"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
