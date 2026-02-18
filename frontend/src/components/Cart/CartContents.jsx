import React, { useEffect, useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import {
  fetchCart,
  removeFromCart,
  updateCartItemQuantity,
} from "../../redux/slices/cartSlice";
import axios from "axios";

const CartContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  const [stockMap, setStockMap] = useState({});

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const results = await Promise.all(
          cart.products.map(async (item) => {
            const res = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/products/${item.productId}`,
            );
            return {
              productId: item.productId,
              countInStock: res.data.countInStock,
            };
          }),
        );

        const map = {};
        results.forEach((r) => {
          map[r.productId] = r.countInStock;
        });

        setStockMap(map);

        //  auto adjust quantity if stock reduced
        cart.products.forEach((item) => {
          const stock = map[item.productId];
          if (stock !== undefined && stock > 0 && item.quantity > stock) {
            dispatch(
              updateCartItemQuantity({
                productId: item.productId,
                quantity: stock,
                size: item.size,
                color: item.color,
                userId,
                guestId,
              }),
            );
          }
        });
      } catch (err) {
        console.error("Stock fetch failed", err);
      }
    };

    if (cart?.products?.length > 0) {
      fetchStocks();
    }
  }, [cart.products, dispatch, userId, guestId]);

  //  quantity handler
  const handleQuantityChange = (productId, delta, quantity, size, color) => {
    const stock = stockMap[productId] ?? 0;
    let newQuantity = quantity + delta;

    if (stock === 0) return;

    if (newQuantity < 1) return;
    if (newQuantity > 5) return;
    if (newQuantity > stock) return;

    dispatch(
      updateCartItemQuantity({
        productId,
        quantity: newQuantity,
        size,
        color,
        userId,
        guestId,
      }),
    );
  };

  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({ productId, size, color, userId, guestId }));
  };

  return (
    <div>
      {cart.products.map((product, index) => {
        const stock = stockMap[product.productId];
        const isOutOfStock = stock === 0;
        const isLowStock = stock > 0 && stock < 5;

        return (
          <div
            key={index}
            className="flex items-start justify-between py-4 border-b"
          >
            <div className="flex items-start">
              <img
                src={product.image}
                alt={product.name}
                className={`w-20 h-24 object-cover mr-4 rounded ${
                  isOutOfStock ? "opacity-50" : ""
                }`}
              />

              <div>
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-500">
                  Size: {product.size} | Color: {product.color}
                </p>

                {/* 🔥 STOCK STATUS */}
                {isOutOfStock && (
                  <p className="text-xs text-red-600 mt-1 font-semibold">
                    OUT OF STOCK
                  </p>
                )}

                {isLowStock && (
                  <p className="text-xs text-orange-600 mt-1">
                    Only {stock} left
                  </p>
                )}

                {/* 🔹 Quantity controls */}
                <div className="flex items-center mt-2">
                  <button
                    disabled={product.quantity <= 1 || isOutOfStock}
                    onClick={() =>
                      handleQuantityChange(
                        product.productId,
                        -1,
                        product.quantity,
                        product.size,
                        product.color,
                      )
                    }
                    className="border rounded px-2 py-1 text-xl font-medium disabled:opacity-40"
                  >
                    -
                  </button>

                  <span className="mx-4">{product.quantity}</span>

                  <button
                    disabled={
                      isOutOfStock ||
                      product.quantity >= 5 ||
                      product.quantity >= stock
                    }
                    onClick={() =>
                      handleQuantityChange(
                        product.productId,
                        1,
                        product.quantity,
                        product.size,
                        product.color,
                      )
                    }
                    className="border rounded px-2 py-1 text-xl font-medium disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="font-medium">
                ₹ {(product.price * product.quantity).toLocaleString()}
              </p>
              <button
                onClick={() =>
                  handleRemoveFromCart(
                    product.productId,
                    product.size,
                    product.color,
                  )
                }
              >
                <RiDeleteBinLine className="h-6 w-6 mt-2 text-red-600 hover:text-red-700" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartContents;
