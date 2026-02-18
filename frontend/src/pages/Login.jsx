import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { loginUser, clearError, googleLogin } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart, fetchCart } from "../redux/slices/cartSlice";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, guestId, loading, error } = useSelector((state) => state.auth);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
    if (!user) return;
    navigate(isCheckoutRedirect ? "/checkout" : "/", {
      replace: true,
    });

    const syncCart = async () => {
      try {
        // merge guest cart
        if (guestId) {
          await dispatch(mergeCart({ guestId })).unwrap();
        }

        //   fetch fresh cart
        await dispatch(
          fetchCart({
            userId: user._id,
            guestId: null,
          }),
        ).unwrap();
      } catch (err) {
        console.error("Cart sync failed", err);
        navigate("/");
      }
    };

    syncCart();
  }, [user]);

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
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-wide">
          ZayanCart
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Login to continue
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 text-red-600 bg-red-100 p-3 rounded-lg text-center text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              dispatch(clearError());
            }}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
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
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="flex justify-end text-sm">
          <Link
            to="/forgot-password"
            className="text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          disabled={loading}
          className="w-full bg-black text-white py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-grow border-t"></div>
        <span className="mx-4 text-sm text-gray-500">OR</span>
        <div className="flex-grow border-t"></div>
      </div>

      {/* Google Login */}
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            const result = await dispatch(
              googleLogin({ token: credentialResponse.credential })
            );

            if (result.meta.requestStatus === "fulfilled") {
              navigate("/");
            }
          }}
          onError={() => console.log("Google Login Failed")}
        />
      </div>

      {/* Register */}
      <p className="text-sm text-center mt-8">
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
