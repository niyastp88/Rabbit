import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import {
  fetchAllOrders,
  updateOrderStatus,
} from "../../redux/slices/adminOrderSlice";
import { fetchReturnRequests } from "../../redux/slices/orderSlice";

const OrderManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.adminOrders);

  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      dispatch(fetchAllOrders());
      dispatch(fetchReturnRequests());
    }
  }, [dispatch, user, navigate]);
  const handleStatusChange = (orderId, status) => {
    dispatch(updateOrderStatus({ id: orderId, status }));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
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

            {/* Order Rows */}
            {[1, 2, 3, 4, 5, 6].map((row) => (
              <div key={row} className="grid grid-cols-5 gap-4 items-center">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-8 w-28 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) return <p>Error: {error}</p>;
  return (
    <div className="max-w-7xl mx-auto shadow-md sm:rounded-lg">
      {/* ADD PRODUCT */}
      <div className="flex justify-end mb-4">
        <Link
          to="/admin/returnrequests"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Return Requests
        </Link>
      </div>
      <table className="min-w-full text-left text-gray-500">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
          <tr>
            <th className="py-3 px-4">Order ID</th>
            <th className="py-3 px-4">Customer</th>
            <th className="py-3 px-4">Total Price</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr
                key={order._id}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">
                  #{order._id}
                </td>
                <td className="p-4">{order.user.name}</td>
                <td className="p-4">${order.totalPrice.toFixed(2)}</td>
                <td className="px-4">
                  <select
                    value={order.status}
                    disabled={
                      order.status === "Delivered" ||
                      order.status === "Cancelled"
                    }
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className={`border text-sm rounded-lg p-2.5
    ${
      order.status === "Delivered" || order.status === "Cancelled"
        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
        : "bg-gray-50 border-gray-300 text-gray-900"
    }`}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="p-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(order._id, "Delivered");
                    }}
                    disabled={
                      order.status === "Delivered" ||
                      order.status === "Cancelled"
                    }
                    className={`px-4 py-2 rounded text-white
    ${
      order.status === "Delivered" || order.status === "Cancelled"
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-green-500 hover:bg-green-600"
    }`}
                  >
                    Mark as Delivered
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500">
                No Orders Found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* ================= RETURN REQUESTS ================= */}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl rounded-lg p-6 overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Order #{selectedOrder._id}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            {/* Customer */}
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Customer</h3>
              <p>{selectedOrder.shippingAddress.firstname}</p>
              <p>Mobile:{selectedOrder.shippingAddress.phone}</p>
            </div>

            {/* Shipping */}
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Shipping Address</h3>
              <p>{selectedOrder.shippingAddress.address}</p>
              <p>
                {selectedOrder.shippingAddress.city},{" "}
                {selectedOrder.shippingAddress.postalcode}
              </p>
              <p>{selectedOrder.shippingAddress.state}</p>
            </div>

            {/* Products */}
            <div>
              <h3 className="font-semibold mb-2">Products</h3>

              <div className="space-y-3">
                {selectedOrder.orderItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-500">
                          Size:{item.size}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-right">
              <p className="text-lg font-semibold">
                Total: ₹{selectedOrder.totalPrice}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
