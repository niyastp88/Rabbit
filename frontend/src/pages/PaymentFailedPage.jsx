import React from "react";
import { useNavigate } from "react-router";

const PaymentFailedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white mt-10 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-6">
        Payment Failed ❌
      </h1>

      <p className="text-gray-600 mb-8">
        Unfortunately, your payment could not be completed.
        <br />
        Please try again or choose a different payment method.
      </p>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => navigate("/checkout")}
          className="bg-black text-white px-6 py-3 rounded hover:bg-gray-900"
        >
          Retry Payment
        </button>

        <button
          onClick={() => navigate("/")}
          className="border border-gray-400 px-6 py-3 rounded hover:bg-gray-100"
        >
          Continue Shopping
        </button>
      </div>

      <div className="mt-10 text-sm text-gray-500">
        <p>
          If amount was debited, it will be refunded within 5–7 working days.
        </p>
        <p>For help, contact support.</p>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
