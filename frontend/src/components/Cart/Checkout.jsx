import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import RazorpayButton from "./RazorpayButton";
import { useDispatch, useSelector } from "react-redux";
import { createCheckout } from "../../redux/slices/checkoutSlice";
import axios from "axios";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cart, loading, error } = useSelector((state) => state.cart);
  const { error: checkoutError } = useSelector((state) => state.checkout);
  const { user } = useSelector((state) => state.auth);

  const [checkoutId, setCheckoutId] = useState(null);
  const [validItems, setValidItems] = useState([]);
  const [checkingStock, setCheckingStock] = useState(true);

  const [shippingAddress, setShippingAddress] = useState({
    firstname: "",
    lastname: "",
    address: "",
    city: "",
    postalcode: "",
    state: "",
    phone: "",
  });

  useEffect(() => {
    if (!cart?.products?.length) {
      navigate("/");
      return;
    }

    const verifyStock = async () => {
      try {
        const available = [];

        for (const item of cart.products) {
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/products/${item.productId}`,
          );

          const stock = res.data.countInStock;

          if (stock === 0) {
            toast.error(`${item.name} is out of stock`);
          } else if (item.quantity > stock) {
            toast.error(`${item.name}: only ${stock} item(s) available`);
          } else {
            available.push(item);
          }
        }

        setValidItems(available);
        setCheckingStock(false);
      } catch (err) {
        console.error(err);
        toast.error("Stock verification failed");
        navigate("/cart");
      }
    };

    verifyStock();
  }, [cart, navigate]);

  const handleCreateCheckout = async (e) => {
    e.preventDefault();

    if (validItems.length === 0) {
      toast.error("No available products to checkout");
      return;
    }

    const totalPrice = validItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    const res = await dispatch(
      createCheckout({
        checkoutItems: validItems,
        shippingAddress,
        paymentMethod: "Razorpay",
        totalPrice,
      }),
    );
    if (res.meta.requestStatus === "rejected") {
      toast.error(res.payload?.message || "Checkout failed", {
        className:
          "bg-red-600 text-white border border-red-700 shadow-xl rounded-xl",
      });
      return;
    }

    if (res.payload?._id) {
      setCheckoutId(res.payload._id);
    }
  };

  if (loading || checkingStock) return <p>Loading checkout...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto py-10 px-6">
      {/* LEFT – FORM */}
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>

        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-lg mb-3">Contact</h3>
          <input
            disabled
            value={user?.email || ""}
            className="w-full p-2 border rounded mb-5"
          />

          <h3 className="text-lg mb-3">Delivery</h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              placeholder="First Name"
              type="text"
              className="p-2 border rounded"
              value={shippingAddress.firstname}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  firstname: e.target.value.replace(/[^a-zA-Z\s]/g, ""),
                })
              }
            />
            <input
              placeholder="Last Name"
              type="text"
              className="p-2 border rounded"
              value={shippingAddress.lastname}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  lastname: e.target.value.replace(/[^a-zA-Z\s]/g, ""),
                })
              }
            />
          </div>

          <input
            placeholder="Address"
            type="text"
            className="w-full p-2 border rounded mb-4"
            value={shippingAddress.address}
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                address: e.target.value.replace(/[^a-zA-Z\s]/g, ""),
              })
            }
          />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              placeholder="City"
              type="text"
              className="p-2 border rounded"
              value={shippingAddress.city}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  city: e.target.value.replace(/[^a-zA-Z\s]/g, ""),
                })
              }
            />
            <input
              placeholder="Postal Code"
              type="Number"
              className="p-2 border rounded"
              value={shippingAddress.postalcode}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  postalcode: e.target.value,
                })
              }
            />
          </div>

          <input
            placeholder="state"
            className="w-full p-2 border rounded mb-4"
            value={shippingAddress.state}
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                state: e.target.value,
              })
            }
          />

          <input
            placeholder="Phone"
            className="w-full p-2 border rounded mb-6"
            type="Number"
            value={shippingAddress.phone}
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                phone: e.target.value,
              })
            }
          />

          {!checkoutId ? (
            <button className="w-full bg-black text-white py-3 rounded">
              Continue to Payment
            </button>
          ) : (
            <RazorpayButton
              checkoutId={checkoutId}
              amount={validItems.reduce(
                (acc, i) => acc + i.price * i.quantity,
                0,
              )}
              onSuccess={() => navigate("/order-confirmation")}
            />
          )}
        </form>
      </div>

      {/* RIGHT – SUMMARY */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg mb-4">Order Summary</h3>

        {validItems.map((product, index) => (
          <div
            key={index}
            className="flex items-start justify-between py-3 border-b"
          >
            <div className="flex items-start">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-24 object-cover mr-4 rounded"
              />
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-500">
                  Size: {product.size} | Color: {product.color}
                </p>
                <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
              </div>
            </div>
            <p className="font-medium">
              ₹ {(product.price * product.quantity).toLocaleString()}
            </p>
          </div>
        ))}

        <div className="flex justify-between text-lg font-semibold mt-4">
          <span>Total</span>
          <span>
            ₹{" "}
            {validItems
              .reduce((a, b) => a + b.price * b.quantity, 0)
              .toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
