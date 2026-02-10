import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import ProductGrid from "../components/Products/ProductGrid";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderDetails } from "../redux/slices/orderSlice";
import ProductReviewForm from "../components/Reviews/ProductReviewForm";


const OrderDetailsPage = () => {
  const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};



  const statusStyles = {
  Processing: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.orders);
  console.log(orderDetails)

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Order Details</h2>
      {!orderDetails ? (
        <p> No Order details found</p>
      ) : (
        <div className="p-4 sm:p-6 rounded-lg border">
          {/* Order Info*/}
          <div className="flex flex-col sm:flex-row justify-between mb-8">
            <div>
              <h3 className="text-lg md:text-xl font-semibold">
                Order ID:#{orderDetails._id}
              </h3>
              <p className="text-gray-600">
  {formatDate(orderDetails.createdAt)}
</p>


            </div>
            <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
              <span
                className={`${
                  orderDetails.isPaid
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                } px-3 py-1 rounded-full text-sm font-medium mb-2`}
              >
                {orderDetails.isPaid ? "Payment Paid" : "Payment pending"}
              </span>
              <span
  className={`${
    statusStyles[orderDetails.status] ||
    "bg-gray-100 text-gray-700"
  } px-3 py-1 rounded-full text-sm font-medium mb-2`}
>
  {orderDetails.status}
</span>

            </div>
          </div>
          {/* Customer,Payment,Shipping Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold mb-2">Payment Info</h4>
              <p>Payment Method: Razorpay</p>
              <p>status: {orderDetails.isPaid ? "Paid" : "Unpaid"}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Shipping Info</h4>
              <p>Shipping Method: {orderDetails.shippingMethod}</p>
              <p>
                Address:{" "}
                {`${orderDetails.shippingAddress.city},${orderDetails.shippingAddress.country}`}
              </p>
            </div>
          </div>
          {/* Product list */}
          <div className="overflow-x-auto">
  <h4 className="text-lg font-semibold mb-4">Products</h4>

  <table className="w-full min-w-[600px] border-collapse text-gray-700">
    <thead className="bg-gray-100">
      <tr>
        <th className="py-3 px-4 text-left">Product</th>
        <th className="py-3 px-4 text-center">Unit Price</th>
        <th className="py-3 px-4 text-center">Qty</th>
        <th className="py-3 px-4 text-right">Total</th>
      </tr>
    </thead>

    <tbody>
  {orderDetails.orderItems.map((item) => (
    <React.Fragment key={item.productId}>
      {/* PRODUCT ROW */}
      <tr className="border-b">
        <td className="py-4 px-4">
          <div className="flex items-center gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-14 h-14 object-cover rounded"
            />
            <Link
              to={`/product/${item.productId}`}
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              {item.name}
            </Link>
          </div>
        </td>

        <td className="py-4 px-4 text-center">
          ₹{item.price}
        </td>

        <td className="py-4 px-4 text-center">
          {item.quantity}
        </td>

        <td className="py-4 px-4 text-right font-medium">
          ₹{item.price * item.quantity}
        </td>
      </tr>

      {/* ✅ REVIEW ROW (ONLY IF DELIVERED) */}
      {orderDetails.status === "Delivered" && (
        <tr className="bg-gray-50">
          <td colSpan="4" className="px-4 py-4">
            <ProductReviewForm productId={item.productId} />
          </td>
        </tr>
      )}
    </React.Fragment>
  ))}
</tbody>

  </table>
</div>

          {/* Back to Orders Link */}
          <Link to="/my-orders" className="text-blue-500 hover:underline">
            Back to My Orders
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
