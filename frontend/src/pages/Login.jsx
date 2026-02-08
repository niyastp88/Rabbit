import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { loginUser, clearError } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart, fetchCart } from "../redux/slices/cartSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, guestId, loading, error } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
  if (!user) return;

  const syncCart = async () => {
    try {
      // 1️⃣ merge guest cart
      if (guestId) {
        await dispatch(mergeCart({ guestId })).unwrap();
      }

      // 2️⃣ 🔥 ALWAYS fetch fresh cart
      await dispatch(
        fetchCart({
          userId: user._id,
          guestId: null,
        })
      ).unwrap();

      // 3️⃣ redirect
      navigate(isCheckoutRedirect ? "/checkout" : "/", {
        replace: true,
      });
    } catch (err) {
      console.error("Cart sync failed", err);
      navigate("/");
    }
  };

  syncCart();
}, [user]); // ⚠️ ONLY user dependency


  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    try {
      await dispatch(loginUser({ email, password })).unwrap();
    } catch {
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">Rabbit</h2>
          <p className="text-sm text-gray-500 mt-1">
            Login to continue
          </p>
        </div>

        {error && (
          <div className="mb-4 text-red-600 bg-red-100 p-2 rounded text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                dispatch(clearError());
              }}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                dispatch(clearError());
              }}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-center mt-6">
          Don&apos;t have an account?{" "}
          <Link
            to={`/register?redirect=${encodeURIComponent(redirect)}`}
            className="text-blue-600 font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
