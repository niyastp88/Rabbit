import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import login from "../assets/login.webp";
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
        // 1 Merge guest cart if exists
        if (cart?.products?.length > 0 && guestId) {
          await dispatch(mergeCart({ guestId, user })).unwrap();
        }

        //  Fetch fresh user cart from backend
        const mergedCart = await dispatch(
          mergeCart({ guestId, user })
        ).unwrap();

        // Update local cart immediately
        // cartSlice already handles fulfilled mergeCart
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      } catch (err) {
        console.error("Cart sync failed", err);
      }
    };

    syncCart();
  }, [user, guestId, dispatch, navigate, isCheckoutRedirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(clearError());

      await dispatch(loginUser({ email, password })).unwrap();
      //  success → do nothing (redirect handled by useEffect)
    } catch (err) {
      //  login failed → clear inputs
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="flex">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-medium">Rabbit</h2>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Hey there!👋</h2>
          <p className="text-center mb-6">
            Enter your username and password to Login
          </p>
          {error && (
            <div className="mb-4 text-red-600 bg-red-100 p-2 rounded text-center">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                dispatch(clearError());
              }}
              className="w-full p-2 border rounded"
              placeholder="Enter your email address"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                dispatch(clearError());
              }}
              className="w-full p-2 border rounded"
              placeholder="Enter your password"
            />
          </div>
          <button className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition">
            Sign In
          </button>
          <p>
            Don't have an account?{" "}
            <Link
              to={`/register?redirect=${encodeURIComponent(redirect)}`}
              className="text-blue-500"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
      <div className="hidden md:block w-1/2 bg-gray-600">
        <div className="h-full flex flex-col justify-center items-center">
          <img
            src={login}
            alt="Login to Account"
            className="h-[750px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
