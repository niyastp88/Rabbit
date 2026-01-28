import axios from "axios";
import { useNavigate } from "react-router";

const RazorpayButton = ({ checkoutId, amount, onSuccess }) => {
  const navigate = useNavigate();

  const loadScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
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
        }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        order_id: order.id,
        name: "Rabbit",
        description: "Order Payment",

        // 2️⃣ SUCCESS HANDLER
        handler: async (response) => {
          try {
            // verify payment
            await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/verify`,
              response,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                },
              }
            );

            // finalize checkout
            await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                },
              }
            );

            onSuccess(); // → navigate to order-confirmation
          } catch (err) {
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
      className="w-full bg-black text-white py-3 rounded"
    >
      Pay ₹ {amount}
    </button>
  );
};

export default RazorpayButton;
