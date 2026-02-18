import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { fetchUserOrders } from "../redux/slices/orderSlice";

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-6">My Orders</h2>

        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="grid grid-cols-7 gap-4 items-center bg-white p-4 rounded-lg"
            >
              <div className="h-10 w-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded col-span-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <p>Error: {error}</p>;
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">My Ordres</h2>
      <table className="min-w-full text-left text-gray-500">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
          <tr>
            <th className="py-2 px-4 sm:py-3">Image</th>
            <th className="py-2 px-4 sm:py-3">Ordrer Id</th>
            <th className="py-2 px-4 sm:py-3">Created</th>
            <th className="py-2 px-4 sm:py-3">Shipping Address</th>
            <th className="py-2 px-4 sm:py-3">Items</th>
            <th className="py-2 px-4 sm:py-3">Price</th>
            <th className="py-2 px-4 sm:py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr
                key={order._id}
                onClick={() => handleRowClick(order._id)}
                className="border-b hover:border-gray-50 cursor-pointer"
              >
                <td className="py-2 px-2 sm:py-4 sm:px-4">
                  <img
                    src={order.orderItems[0].image}
                    alt={order.orderItems[0].name}
                    className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
                  />
                </td>
                <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium text-gray-900 whitespace-nowrap">
                  #{order._id}
                </td>
                <td>
                  {new Date(order.createdAt).toLocaleDateString()}{" "}
                  {new Date(order.createdAt).toLocaleTimeString()}
                </td>
                <td className="py-2 px-2 sm:py-4 sm:px-4">
                  {order.shippingAddress
                    ? `${order.shippingAddress.city},${order.shippingAddress.country}`
                    : "N/A"}
                </td>
                <td className="py-2 px-2 sm:py-4 sm:px-4">
                  {order.orderItems.length}
                </td>
                <td className="py-2 px-2 sm:py-4 sm:px-4">
                  ${order.totalPrice}
                </td>
                <td className="py-2 px-2 sm:py-4 sm:px-4">
                  <span
                    className={`${
                      order.isPaid
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    } px-2 py-1 rounded-full text-xs font-medium`}
                  >
                    {order.isPaid ? "Paid" : "Pending"}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  {/* Icon */}
                  <div className="text-6xl mb-4 opacity-70">🛍️</div>

                  {/* Heading */}
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No Orders Yet
                  </h3>

                  {/* Subtext */}
                  <p className="text-gray-500 mb-6 max-w-md">
                    Looks like you haven't placed any orders yet. Start shopping
                    to see your orders appear here.
                  </p>

                  {/* Button */}
                  <button
                    onClick={() => navigate("/")}
                    className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
                  >
                    Start Shopping
                  </button>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyOrdersPage;
