import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
  HiOutlineHeart,
} from "react-icons/hi2";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import WishlistDrawer from "../Layout/WishlistDrawer";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist } from "../../redux/slices/wishlistSlice";

const Navbar = () => {
  const dispatch = useDispatch();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);

  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { products: wishlistProducts = [] } = useSelector(
    (state) => state.wishlist,
  );

  // 🔹 Fetch wishlist on login
  useEffect(() => {
    if (user?._id) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

  const cartItemCount =
    cart?.products?.reduce((total, product) => total + product.quantity, 0) ||
    0;

  const wishlistCount = wishlistProducts.length;

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <Link to="/" className="text-2xl font-medium">
          ZayanCart
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/collections/all?gender=Men"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Men
          </Link>
          <Link
            to="/collections/all?gender=Women"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Women
          </Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-4">
          {user && user.role === "admin" && (
            <Link
              to="/admin"
              className="bg-black px-2 rounded text-sm text-white"
            >
              Admin
            </Link>
          )}

          <Link to="/profile">
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>

          {/* ❤️ Wishlist */}
          {user && (
            <button onClick={() => setWishlistOpen(true)} className="relative">
              <HiOutlineHeart className="h-6 w-6 text-gray-700" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 bg-yellow-400 text-white text-xs rounded-full px-2 py-0.5">
                  {wishlistCount}
                </span>
              )}
            </button>
          )}

          {/* 🛒 Cart */}
          <button onClick={() => setDrawerOpen(true)} className="relative">
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                {cartItemCount}
              </span>
            )}
          </button>

          <SearchBar />

          {/* Mobile menu */}
          <button onClick={() => setNavDrawerOpen(true)} className="md:hidden">
            <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </nav>

      {/* ================= DRAWERS ================= */}
      <CartDrawer
        drawerOpen={drawerOpen}
        toggleCartDrawer={() => setDrawerOpen(false)}
      />

      <WishlistDrawer
        open={wishlistOpen}
        toggle={() => setWishlistOpen(false)}
      />

      {/* ================= MOBILE MENU ================= */}
      <div
        className={`fixed top-0 left-0 w-3/4 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setNavDrawerOpen(false)}>
            <IoMdClose />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <Link to="/collections/all?gender=Men">Men</Link>
          <Link to="/collections/all?gender=Women">Women</Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
