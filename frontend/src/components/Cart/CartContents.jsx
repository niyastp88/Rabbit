import React, { useEffect } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import {
  fetchCart,
  removeFromCart,
  updateCartItemQuantity,
} from "../../redux/slices/cartSlice";

const CartContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  // Handle aading or substracting to cart
  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          size,
          color,
        })
      );
    }
  };

  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({ productId, guestId, userId, size, color }));
  };

  return (
    <div>
      {cart.products.map((prodcut, index) => (
        <div
          key={index}
          className="flex items-start justify-between py-4 border-b"
        >
          <div className="flex items-start">
            <img
              src={prodcut.image}
              alt={prodcut.name}
              className="w-20 h-24 object-cover mr-4 rounded"
            />
            <div>
              <h3>{prodcut.name}</h3>
              <p className="text-sm text-gray-500">
                size: {prodcut.size} | color: {prodcut.color}
              </p>
              <div className="flex items-center mt-2">
                <button
                  onClick={() =>
                    handleAddToCart(
                      prodcut.productId,
                      1,
                      prodcut.quantity,
                      prodcut.size,
                      prodcut.color
                    )
                  }
                  className="border rounded px-2 py-1 text-xl font-medium"
                >
                  +
                </button>
                <span className="mx-4">{prodcut.quantity}</span>
                <button
                  onClick={() =>
                    handleAddToCart(
                      prodcut.productId,
                      -1,
                      prodcut.quantity,
                      prodcut.size,
                      prodcut.color
                    )
                  }
                  className="border rounded px-2 py-1 text-xl font-medium"
                >
                  -
                </button>
              </div>
            </div>
          </div>
          <div>
            <p className="font-medium">$ {prodcut.price.toLocaleString()}</p>
            <button
              onClick={() =>
                handleRemoveFromCart(
                  prodcut.productId,
                  prodcut.size,
                  prodcut.color
                )
              }
            >
              <RiDeleteBinLine className="h-6 w-6 mt-2 text-red-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContents;
