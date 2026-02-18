import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { clearError, registerUser, verifyOTP } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../redux/slices/cartSlice";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, guestId, loading, error } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
    if (user) {
      if (cart?.products?.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : "/", { replace: true });
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/", { replace: true });
      }
    }
  }, [user]);
  useEffect(() => {
    let interval;

    if (showOTP) {
      setTimer(30);
      setCanResend(false);

      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [showOTP]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    setSendingOTP(true);

    const result = await dispatch(
      registerUser({ name, email, password, mobile }),
    );

    if (result.meta.requestStatus === "fulfilled") {
      setShowOTP(true);
    }

    setSendingOTP(false);
  };

  const handleVerify = async () => {
    dispatch(clearError());
    setVerifying(true);
    await dispatch(verifyOTP({ email, otp }));
    setVerifying(false);
  };

  const handleResend = async () => {
    if (!canResend) return;

    setSendingOTP(true);
    await dispatch(registerUser({ name, email, password, mobile }));
    setSendingOTP(false);

    setTimer(30);
    setCanResend(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 transition-all duration-300">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold tracking-tight">
            Create New Account
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Secure your account with OTP verification
          </p>
        </div>
        {error && (
          <div className="mb-4 bg-red-100 text-red-600 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {!showOTP ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
              placeholder="Full Name"
              required
              onInvalid={(e) =>
                e.target.setCustomValidity("Please enter your full name")
              }
              onInput={(e) => e.target.setCustomValidity("")}
            />

            <input
              type="Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
              placeholder="Mobile (Optional)"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
              placeholder="Email Address"
              required
              onInvalid={(e) =>
                e.target.setCustomValidity("Please enter vaild email address")
              }
              onInput={(e) => e.target.setCustomValidity("")}
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
              placeholder="Password"
              required
              onInvalid={(e) =>
                e.target.setCustomValidity("Please enter password")
              }
              onInput={(e) => e.target.setCustomValidity("")}
            />

            <button
              type="submit"
              disabled={sendingOTP}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-60"
            >
              {sendingOTP ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          /* OTP SECTION */
          <div className="bg-gray-50 border rounded-xl p-6 text-center shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Verify Your Email</h3>

            <p className="text-sm text-gray-500 mb-4">
              We've sent a 6-digit OTP to
              <br />
              <span className="font-medium text-black">{email}</span>
            </p>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full text-center tracking-widest text-xl font-semibold px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black"
              placeholder="Enter OTP"
            />

            <button
              type="button"
              onClick={handleVerify}
              disabled={verifying}
              className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-60"
            >
              {verifying ? "Verifying..." : "Verify & Create Account"}
            </button>

            {/* TIMER */}
            <div className="mt-4 text-sm text-gray-500">
              {!canResend ? (
                <p>
                  Resend OTP in <span className="font-semibold">{timer}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        )}

        <p className="text-sm text-center mt-6">
          Already have an account?{" "}
          <Link
            to={`/login?redirect=${encodeURIComponent(redirect)}`}
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
