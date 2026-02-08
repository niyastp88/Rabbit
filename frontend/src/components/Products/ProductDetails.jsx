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
    (state) => state.products
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
      })
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
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

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
                    mainImage === img.url
                      ? "border-black"
                      : "border-gray-300"
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
                        selectedSize === size
                          ? "bg-black text-white"
                          : ""
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
