import React, { useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlist,
  removeFromWishlist,
} from "../../redux/slices/wishlistSlice";
import { Link } from "react-router";

const WishlistDrawer = ({ open, toggle }) => {
  const dispatch = useDispatch();

  const { products = [], loading } = useSelector((state) => state.wishlist);
  const { user } = useSelector((state) => state.auth);

  // 🔹 Always fetch wishlist when drawer opens
  useEffect(() => {
    if (open && user?._id) {
      dispatch(fetchWishlist());
    }
  }, [open, dispatch, user]);

  return (
    <div
      className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">Your Wishlist</h2>
        <button onClick={toggle}>
          <IoMdClose className="h-6 w-6" />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 overflow-y-auto h-full">
        {loading ? (
          <p className="text-center mt-10">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">Wishlist is empty</p>
        ) : (
          products.map((item) => {
            const product = item.product;

            // ✅ SAFETY: skip unpopulated product
            if (!product || typeof product === "string") {
              return null;
            }

            return (
              <div
                key={product._id}
                className="flex items-center justify-between mb-4 border-b pb-4"
              >
                <Link
                  to={`/product/${product._id}`}
                  onClick={toggle}
                  className="flex items-center gap-4"
                >
                  <img
                    src={product.images?.[0]?.url || "/placeholder.png"}
                    alt={product.name}
                    className="w-20 h-24 object-cover rounded"
                  />

                  <div>
                    <h3 className="text-sm font-medium">{product.name}</h3>
                    <p className="text-gray-500 text-sm">₹ {product.price}</p>
                  </div>
                </Link>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    dispatch(removeFromWishlist(product._id));
                  }}
                >
                  <RiDeleteBinLine className="h-5 w-5 text-red-600" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default WishlistDrawer;
