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
  const wishlistProducts = useSelector(
    (state) => state.wishlist.products
  );

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleWishlist = async (e, productId, isWishlisted) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await dispatch(toggleWishlist(productId)).unwrap();

      toast.success(
        isWishlisted
          ? "Removed from wishlist"
          : "Added to wishlist",
        { duration: 1000 }
      );
    } catch {
      toast.error("Wishlist action failed");
    }
  };
  if(products.length===0){
    return <h3>No Products Found</h3>
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => {
        const isWishlisted = wishlistProducts.some(
          (item) => item.product._id === product._id
        );

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
                  onClick={(e) =>
                    handleWishlist(e, product._id, isWishlisted)
                  }
                  className={`absolute top-3 right-3 text-2xl transition ${
                    isWishlisted
                      ? "text-yellow-400"
                      : "text-gray-300 hover:text-yellow-400"
                  }`}
                >
                  {isWishlisted ? "❤️" : "🤍"}
                </button>
              )}

              <div className="w-full h-96 mb-4">
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              <h3 className="text-sm mb-2">{product.name}</h3>
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
