import React from "react";
import { updateReturnStatus } from "../../redux/slices/orderSlice";
import { useDispatch, useSelector } from "react-redux";

const ReturnRequests = () => {
  const { returnRequests } = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">Return Requests</h2>

      {returnRequests.length === 0 ? (
        <p className="text-gray-500">No return requests</p>
      ) : (
        <div className="space-y-6">
          {returnRequests.map((order) =>
            order.orderItems
              .filter((item) => item.returnRequested)
              .map((item) => (
                <div
                  key={`${order._id}-${item.productId}`}
                  className="border rounded-lg p-4 flex justify-between items-start"
                >
                  {/* LEFT */}
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Order #{order._id}
                      </p>
                      <p className="text-sm">
                        Reason: <b>{item.returnReason}</b>
                      </p>
                      {item.returnComment && (
                        <p className="text-sm text-gray-600">
                          Comment: {item.returnComment}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        Requested on{" "}
                        {new Date(item.returnRequestedAt).toLocaleDateString()}
                      </p>

                      {/* STATUS */}
                      <span className="inline-block mt-2 px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700">
                        {item.returnStatus}
                      </span>
                    </div>
                  </div>

                  {/* RIGHT ACTIONS */}
                  {item.returnStatus === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          dispatch(
                            updateReturnStatus({
                              orderId: order._id,
                              productId: item.productId,
                              action: "approved",
                            }),
                          )
                        }
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          dispatch(
                            updateReturnStatus({
                              orderId: order._id,
                              productId: item.productId,
                              action: "rejected",
                            }),
                          )
                        }
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              )),
          )}
        </div>
      )}
    </div>
  );
};

export default ReturnRequests;
