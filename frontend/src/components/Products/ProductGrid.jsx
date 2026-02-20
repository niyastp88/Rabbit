import React, { useEffect } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlist,
  toggleWishlist,
} from "../../redux/slices/wishlistSlice";
import { toast } from "sonner";

const ProductGrid = ({ products, loading, error }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const wishlistProducts = useSelector((state) => state.wishlist.products);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white p-4 rounded-lg animate-pulse">
            {/* Image skeleton */}
            <div className="w-full h-96 bg-gray-200 rounded-lg mb-4"></div>

            {/* Title skeleton */}
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>

            {/* Rating skeleton */}
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>

            {/* Price skeleton */}
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) return <p>Error: {error}</p>;

  const handleWishlist = async (e, productId, isWishlisted) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await dispatch(toggleWishlist(productId)).unwrap();

      toast.success(
        isWishlisted ? "Removed from wishlist" : "Added to wishlist",
        { duration: 1000 },
      );
    } catch {
      toast.error("Wishlist action failed");
    }
  };
  if (!loading && products.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl">🛍️</span>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
          No Products Found
        </h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => {
        const isWishlisted = wishlistProducts.some(
          (item) => item.product._id === product._id,
        );
        const isOutOfStock = product.countInStock === 0;
        const avgRating = product.rating || 0;
        const reviewCount = product.numReviews || 0;

        return (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="block relative"
          >
            <div className="bg-white p-4 rounded-lg relative">
              {/* ❤️ only if logged in */}
              {user && (
                <button
                  onClick={(e) => handleWishlist(e, product._id, isWishlisted)}
                  className={`absolute top-3 right-3 text-2xl transition ${
                    isWishlisted
                      ? "text-yellow-400"
                      : "text-gray-300 hover:text-yellow-400"
                  }`}
                >
                  {isWishlisted ? "❤️" : "🤍"}
                </button>
              )}
              {isOutOfStock && (
                <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                  OUT OF STOCK
                </span>
              )}

              <div className="w-full h-96 mb-4">
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className={`w-full h-full object-cover rounded-lg ${
                    isOutOfStock ? "opacity-50" : ""
                  }`}
                />
              </div>

              <h3 className="text-sm mb-2">{product.name}</h3>
              {/* ⭐ RATING */}
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-sm ${
                      star <= Math.round(product.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}

                {product.numReviews > 0 ? (
                  <span className="text-xs text-gray-500 ml-1">
                    ({product.rating.toFixed(1)})
                  </span>
                ) : (
                  <span className="text-xs text-gray-400 ml-1">No reviews</span>
                )}

               {product.countInStock < 5 && product.countInStock > 0 && (
  <span className="inline-block text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-md ml-2">
    Only {product.countInStock} left
  </span>
)}
              </div>

              <p className="text-gray-500 font-medium text-sm">
                ₹ {product.price}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductGrid;
