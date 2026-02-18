import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

const RazorpayButton = ({ checkoutId, amount, onSuccess }) => {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const loadScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const loaded = await loadScript();
      if (!loaded) {
        alert("Razorpay SDK failed");
        return navigate("/payment-failed");
      }

      // 1️⃣ Create Razorpay order from backend
      const { data: order } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/razorpay`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        order_id: order.id,
        name: "ZayanCart",
        description: "Order Payment",

        // 2️⃣ SUCCESS HANDLER
        handler: async (response) => {
          try {
            setProcessing(true);
            // verify payment
            await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/verify`,
              response,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                },
              },
            );

            // finalize checkout
            await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                },
              },
            );

            onSuccess(); // → navigate to order-confirmation
          } catch (err) {
            setProcessing(false);
            navigate("/payment-failed");
          }
        },

        // 3️⃣ USER CLOSES POPUP
        modal: {
          ondismiss: function () {
            navigate("/payment-failed");
          },
        },
      };

      const rzp = new window.Razorpay(options);

      // 4️⃣ PAYMENT FAILED EVENT
      rzp.on("payment.failed", function () {
        navigate("/payment-failed");
      });

      rzp.open();
    } catch (error) {
      navigate("/payment-failed");
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={processing}
      className={`w-full py-3 rounded text-white font-semibold transition ${
        processing
          ? "bg-gray-500 cursor-not-allowed"
          : "bg-black hover:bg-gray-900"
      }`}
    >
      {processing ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          Processing Payment...
        </span>
      ) : (
        `Pay With Razorpay ₹ ${amount}`
      )}
    </button>
  );
};

export default RazorpayButton;
