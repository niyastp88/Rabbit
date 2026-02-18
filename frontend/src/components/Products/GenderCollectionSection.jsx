import React from "react";
import { Link } from "react-router";
import mensDefault from "../../assets/mens-collection.webp";
import womensDefault from "../../assets/womens-collection.webp";

const GenderCollectionSection = ({ menImage, womenImage }) => {
  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto flex flex-col md:flex-row gap-8">
        {/* WOMEN */}
        <div className="relative flex-1">
          <img
            src={womenImage || womensDefault}
            alt="Women's Collection"
            className="w-full h-[700px] object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-white/90 p-4">
            <h2 className="text-lg font-semibold">Women's Collection</h2>
            <Link
              to="/collections/all?gender=Women"
              className="text-gray-900 underline"
            >
              Shop Now
            </Link>
          </div>
        </div>

        {/* MEN */}
        <div className="relative flex-1">
          <img
            src={menImage || mensDefault}
            alt="Men's Collection"
            className="w-full h-[700px] object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-white/90 p-4">
            <h2 className="text-lg font-semibold">Men's Collection</h2>
            <Link
              to="/collections/all?gender=Men"
              className="text-gray-900 underline"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderCollectionSection;
