import React, { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../components/Products/FilterSidebar";
import SortOptions from "../components/Products/SortOptions";
import ProductGrid from "../components/Products/ProductGrid";
import { useParams, useSearchParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductByFilters } from "../redux/slices/productsSlice";

const CollectionPage = () => {
  const [page, setPage] = useState(1);
  const limit = 12;

  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const disPatch = useDispatch();
  const {
    products,
    loading,
    error,
    page: currentPage,
    pages,
  } = useSelector((state) => state.products);

  const queryParams = Object.fromEntries([...searchParams]);
  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSideOpen] = useState(false);

  useEffect(() => {
    disPatch(
      fetchProductByFilters({
        collection,
        ...queryParams,
        page,
        limit,
      }),
    );
  }, [disPatch, collection, searchParams, page]);

  const toggleSidebar = () => {
    setIsSideOpen(!isSidebarOpen);
  };
  const handleClickOutside = (e) => {
    // Close sidebar if clicked outside
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSideOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Mobile Filter button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden border p-2 flex justify-center items-center"
      >
        <FaFilter className="mr-2" />
        Filters
      </button>
      {/* Filter Sidebar */}
      <div
        ref={sidebarRef}
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}
      >
        <FilterSidebar />
      </div>
      <div className="flex-grow p-4">
        {/* Sort Options */}
        <SortOptions />
        {/* Product Grid */}
        <ProductGrid products={products} loading={loading} error={error} />
        {pages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {/* PREV */}
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className={`px-3 py-1 rounded border text-sm transition
        ${
          page === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white text-black hover:bg-black hover:text-white"
        }`}
            >
              Prev
            </button>

            {/* PAGE NUMBERS */}
            {[...Array(pages)].map((_, i) => {
              const pageNumber = i + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`px-3 py-1 rounded border text-sm transition
            ${
              page === pageNumber
                ? "bg-black text-white cursor-default"
                : "bg-white text-black hover:bg-black hover:text-white"
            }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            {/* NEXT */}
            <button
              disabled={page === pages}
              onClick={() => setPage(page + 1)}
              className={`px-3 py-1 rounded border text-sm transition
        ${
          page === pages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white text-black hover:bg-black hover:text-white"
        }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
