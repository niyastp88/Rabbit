import React from "react";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { TbBrandMeta } from "react-icons/tb";
import { FiPhoneCall } from "react-icons/fi";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-6">
        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 tracking-wide">
            ZayanCart
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Premium fashion for modern lifestyle. Quality fabrics, timeless
            designs, and effortless style.
          </p>
        </div>

        {/* SHOP */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Shop</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="#" className="hover:text-white transition">
                Men's Top Wear
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-white transition">
                Women's Top Wear
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-white transition">
                Men's Bottom Wear
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-white transition">
                Women's Bottom Wear
              </Link>
            </li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="#" className="hover:text-white transition">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-white transition">
                About Us
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-white transition">
                FAQs
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-white transition">
                Shipping & Returns
              </Link>
            </li>
          </ul>
        </div>

        {/* CONNECT */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Connect</h3>

          <div className="flex space-x-5 mb-6 text-gray-400">
            <a href="#" className="hover:text-white transition text-xl">
              <TbBrandMeta />
            </a>
            <a href="#" className="hover:text-white transition text-xl">
              <IoLogoInstagram />
            </a>
            <a href="#" className="hover:text-white transition text-xl">
              <RiTwitterXLine />
            </a>
          </div>

          <div className="flex items-center text-sm text-gray-400">
            <FiPhoneCall className="mr-2" />
            +91 98765 43210
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-500 text-sm">
        {new Date().getFullYear()} ZayanCart. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
