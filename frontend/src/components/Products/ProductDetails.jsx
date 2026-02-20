import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice";

const ProductDetails = ({ productId, home }) => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products,
  );
  const { user, guestId } = useSelector((state) => state.auth);

  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const productFetchId = productId || id;

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  /* ================= STOCK LOGIC ================= */
  const stock = selectedProduct?.countInStock || 0;
  const isOutOfStock = stock === 0;
  const reviews = selectedProduct?.reviews || [];

  /* ================= QUANTITY HANDLER ================= */
  const handleQuantityChange = (type) => {
    if (type === "minus" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }

    if (type === "plus") {
      if (quantity + 1 > stock) {
        toast.error(`Only ${stock} item(s) available`, { duration: 1000 });
        return;
      }
      if (quantity + 1 > 5) {
        toast.error("Maximum 5 items allowed", { duration: 1000 });
        return;
      }
      setQuantity((prev) => prev + 1);
    }
  };

  /* ================= ADD TO CART ================= */
  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("Product is out of stock");
      return;
    }

    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color", { duration: 1000 });
      return;
    }

    if (quantity > stock) {
      toast.error(`Only ${stock} item(s) available`, { duration: 1000 });
      return;
    }

    setIsButtonDisabled(true);

    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
      }),
    )
      .then(() => {
        toast.success("Product added to cart!", { duration: 1000 });
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  const disableAddToCart =
    isOutOfStock || quantity > stock || quantity > 5 || isButtonDisabled;

  /* ================= UI STATES ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>

          {/* Text */}
          <p className="text-gray-600 text-lg font-medium">
            Loading Product...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {selectedProduct && (
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
          <div className="flex flex-col md:flex-row">
            {/* LEFT THUMBNAILS */}
            <div className="hidden md:flex flex-col space-y-4 mr-6">
              {selectedProduct.images.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt=""
                  onClick={() => setMainImage(img.url)}
                  className={`w-20 h-20 object-cover cursor-pointer border ${
                    mainImage === img.url ? "border-black" : "border-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* MAIN IMAGE */}
            <div className="md:w-1/2 relative">
              {isOutOfStock && (
                <span className="absolute top-4 left-4 bg-red-600 text-white text-sm px-3 py-1 rounded z-10">
                  OUT OF STOCK
                </span>
              )}
              <img
                src={mainImage}
                alt=""
                className={`w-full rounded-lg ${
                  isOutOfStock ? "opacity-50" : ""
                }`}
              />
            </div>

            {/* RIGHT CONTENT */}
            <div className="md:w-1/2 md:ml-10">
              <h1 className="text-3xl font-semibold mb-2">
                {selectedProduct.name}
              </h1>

              <p className="text-xl text-gray-700 mb-4">
                ₹ {selectedProduct.price}
              </p>

              <p className="text-gray-600 mb-6">
                {selectedProduct.description}
              </p>

              {/* COLORS */}
              <div className="mb-4">
                <p className="mb-2 font-medium">Color</p>
                <div className="flex gap-2">
                  {selectedProduct.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border ${
                        selectedColor === color
                          ? "border-4 border-black"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* SIZES */}
              <div className="mb-4">
                <p className="mb-2 font-medium">Size</p>
                <div className="flex gap-2">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded ${
                        selectedSize === size ? "bg-black text-white" : ""
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* QUANTITY */}
              <div className="mb-6">
                <p className="mb-2 font-medium">Quantity</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleQuantityChange("minus")}
                    className="px-3 py-1 border rounded"
                    disabled={quantity === 1}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("plus")}
                    className="px-3 py-1 border rounded"
                    disabled={quantity >= stock || quantity >= 5}
                  >
                    +
                  </button>
                  {selectedProduct.countInStock < 5 && selectedProduct.countInStock > 0 && (
  <span className="inline-block text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-md ml-2">
    Only {selectedProduct.countInStock} left
  </span>
)}
                </div>
              </div>

              {/* ADD TO CART */}
              <button
                onClick={handleAddToCart}
                disabled={disableAddToCart}
                className={`w-full py-3 rounded text-white font-semibold ${
                  disableAddToCart
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-900"
                }`}
              >
                {isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}
              </button>
            </div>
          </div>
          {/* ================= REVIEWS SECTION ================= */}
          {!home && (
            <div className="mt-16">
              <h2 className="text-2xl font-semibold mb-4">
                Customer Reviews
                <span className="text-gray-500 text-base ml-2">
                  ({selectedProduct.numReviews})
                </span>
              </h2>

              {/* ⭐ Average rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-xl ${
                        star <= Math.round(selectedProduct.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-gray-600">
                  {selectedProduct.rating.toFixed(1)} / 5
                </span>
              </div>

              {/* No reviews */}
              {reviews.length === 0 && (
                <p className="text-gray-500">No reviews yet</p>
              )}

              {/* Reviews list */}
              <div className="space-y-6">
                {reviews
                  .slice() // avoid mutating state
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((review) => (
                    <div key={review._id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{review.name}</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-sm ${
                                star <= review.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>

                      {review.comment && (
                        <p className="text-gray-600 text-sm">
                          {review.comment}
                        </p>
                      )}

                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* SIMILAR PRODUCTS */}
          {!home && (
            <div className="mt-20">
              <h2 className="text-2xl text-center font-medium mb-4">
                You May Also Like
              </h2>
              <ProductGrid
                products={similarProducts}
                loading={loading}
                error={error}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
