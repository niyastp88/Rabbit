import React from "react";
import { Link } from "react-router";
import defaultHero from "../../assets/rabbit-hero.webp";

const Hero = ({ image }) => {
  return (
    <section className="relative">
      <img
        src={image || defaultHero}
        alt="Rabbit"
        className="w-full h-[400px] md:h-[600px] lg:h-[750px] object-cover"
      />

      <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
        <div className="text-center text-white p-6">
          <Link
            to="/collections/all"
            className="
    inline-block
    bg-green-500
    hover:bg-green-600
    text-white
    font-semibold
    px-8
    py-3
    text-lg
    rounded-full
    shadow-lg
    hover:shadow-2xl
    transition-all
    duration-300
    transform
    hover:scale-105
    backdrop-blur-sm
  "
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
