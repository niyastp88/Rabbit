import React, { useEffect, useState } from "react";
import Hero from "../components/Layout/Hero";
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails";
import FeaturesSection from "../components/Products/FeaturesSection";
import { useDispatch } from "react-redux";
import axios from "axios";

const Home = () => {
  const disPatch = useDispatch();
  const [bestSellerProduct, setBestSellerProduct] = useState(null);
  const [homeContent, setHomeContent] = useState(null);

  useEffect(() => {
    // Fetch best seller product
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`,
        );
        setBestSellerProduct(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchHomeContent = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/home-content`,
        );
        setHomeContent(res.data);
      } catch (err) {
        console.error("Home content fetch error", err);
      }
    };
    fetchBestSeller();
    fetchHomeContent();
  }, [disPatch]);

  return (
    <div>
      <Hero image={homeContent?.heroImage} />

      <GenderCollectionSection
        menImage={homeContent?.menCollectionImage}
        womenImage={homeContent?.womenCollectionImage}
      />

      <NewArrivals />
      <h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2>
      {bestSellerProduct ? (
        <ProductDetails productId={bestSellerProduct._id} home={true} />
      ) : (
        <p className="text-center">Loading best seller product...</p>
      )}

      <FeaturesSection />
    </div>
  );
};

export default Home;
