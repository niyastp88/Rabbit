import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/forgot-password`,
      { email },
    );

    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Forgot Password</h2>
          <p className="text-sm text-gray-500 mt-2">
            Enter your email to receive reset instructions
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
              required
            />

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="text-center bg-green-50 border border-green-200 p-4 rounded-lg">
            <p className="text-green-700 text-sm">
              If this email exists, a reset link has been sent.
            </p>
          </div>
        )}

        <p className="text-sm text-center mt-6">
          Remember your password?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
