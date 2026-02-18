import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrderDetails,
  requestReturn,
  clearReturnStatus,
} from "../redux/slices/orderSlice";
import ProductReviewForm from "../components/Reviews/ProductReviewForm";
import { updateOrderStatus } from "../redux/slices/adminOrderSlice";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { orderDetails, loading, error, returnSuccess } = useSelector(
    (state) => state.orders,
  );

  const [activeReturnProduct, setActiveReturnProduct] = useState(null);
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");

  const RETURN_REASONS = [
    "Damaged",
    "Wrong Size",
    "Wrong Product",
    "Quality Issue",
    "Other",
  ];

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (returnSuccess) {
      setActiveReturnProduct(null);
      setReason("");
      setComment("");
      dispatch(fetchOrderDetails(id));
      dispatch(clearReturnStatus());
    }
  }, [returnSuccess, dispatch, id]);

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  const canReturn = () => {
    if (orderDetails.status !== "Delivered" || !orderDetails.deliveredAt)
      return false;

    const diffDays =
      (Date.now() - new Date(orderDetails.deliveredAt)) / (1000 * 60 * 60 * 24);

    return diffDays <= 7;
  };

  const submitReturn = (productId) => {
    if (!reason) {
      alert("Please select a return reason");
      return;
    }

    dispatch(
      requestReturn({
        orderId: orderDetails._id,
        productId,
        reason,
        comment,
      }),
    );
  };
  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await dispatch(
        updateOrderStatus({
          id: orderDetails._id,
          status: "Cancelled",
        }),
      ).unwrap();

      dispatch(fetchOrderDetails(id)); // refresh page
    } catch (err) {
      alert("Failed to cancel order");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <h2 className="text-2xl font-bold mb-6">Order Details</h2>

        <div className="border rounded-lg p-6 animate-pulse space-y-6">
          {/* Header Skeleton */}
          <div className="flex justify-between">
            <div className="space-y-2">
              <div className="h-4 w-48 bg-gray-200 rounded"></div>
              <div className="h-3 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
          </div>

          {/* Product Rows Skeleton */}
          {[1, 2].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between border-t pt-4"
            >
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 bg-gray-200 rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-gray-200 rounded"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>

              <div className="h-4 w-10 bg-gray-200 rounded"></div>
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-6">Order Details</h2>

      {!orderDetails ? (
        <p>No order found</p>
      ) : (
        <div className="border rounded-lg p-6">
          {/* ORDER HEADER */}
          <div className="flex justify-between mb-6">
            <div>
              <h3 className="font-semibold">Order ID: #{orderDetails._id}</h3>
              <p className="text-gray-500">
                {formatDate(orderDetails.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded text-sm font-medium
      ${
        orderDetails.status === "Cancelled"
          ? "bg-red-100 text-red-700"
          : orderDetails.status === "Processing"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-green-100 text-green-700"
      }`}
              >
                {orderDetails.status}
              </span>

              {/* ✅ Show Cancel Button ONLY if Processing */}
              {orderDetails.status === "Processing" && (
                <button
                  onClick={() => handleCancelOrder()}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>

          {/* PRODUCTS */}
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Total</th>
              </tr>
            </thead>

            <tbody>
              {orderDetails.orderItems.map((item) => (
                <React.Fragment key={item.productId}>
                  {/* PRODUCT ROW */}
                  <tr className="border-b">
                    <td className="p-3">
                      <div className="flex gap-3 items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded object-cover"
                        />
                        <div>
                          <Link
                            to={`/product/${item.productId}`}
                            className="text-blue-600 font-medium"
                          >
                            {item.name}
                          </Link>

                          {/* 🧠 RETURN STATUS BADGE */}
                          {item.returnRequested && (
                            <span
                              className={`px-2 py-1 text-xs rounded
      ${
        item.returnStatus === "approved"
          ? "bg-green-100 text-green-700"
          : item.returnStatus === "rejected"
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700"
      }
    `}
                            >
                              {item.returnStatus === "approved"
                                ? "Return Approved"
                                : item.returnStatus === "rejected"
                                  ? "Return Rejected"
                                  : "Return Requested"}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-3 text-center">{item.quantity}</td>

                    <td className="p-3 text-right">
                      ₹{item.price * item.quantity}
                    </td>
                  </tr>

                  {/* ⛔ RETURN UI */}
                  {orderDetails.status === "Delivered" &&
                    canReturn() &&
                    !item.returnRequested && (
                      <tr className="bg-gray-50">
                        <td colSpan="3" className="p-4">
                          {activeReturnProduct === item.productId ? (
                            <div className="space-y-3">
                              <select
                                className="border p-2 rounded w-full"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                              >
                                <option value="">Select reason</option>
                                {RETURN_REASONS.map((r) => (
                                  <option key={r} value={r}>
                                    {r}
                                  </option>
                                ))}
                              </select>

                              {reason === "Other" && (
                                <textarea
                                  className="border p-2 w-full rounded"
                                  placeholder="Enter reason"
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)}
                                />
                              )}

                              <button
                                onClick={() => submitReturn(item.productId)}
                                className="bg-black text-white px-4 py-2 rounded"
                              >
                                Submit Return
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                setActiveReturnProduct(item.productId)
                              }
                              className="text-red-600 font-medium"
                            >
                              Request Return
                            </button>
                          )}
                        </td>
                      </tr>
                    )}

                  {/* ⭐ REVIEW */}
                  {orderDetails.status === "Delivered" && (
                    <tr>
                      <td colSpan="3" className="p-4">
                        <ProductReviewForm productId={item.productId} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          <Link to="/my-orders" className="inline-block mt-6 text-blue-500">
            ← Back to My Orders
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
