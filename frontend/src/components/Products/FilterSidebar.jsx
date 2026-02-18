import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { fetchCategories } from "../../redux/slices/categorySlice";
import { fetchBrands } from "../../redux/slices/brandSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchMaterials } from "../../redux/slices/materialSlice";

const FilterSidebar = () => {
   const dispatch = useDispatch();
    const { categories, loading } = useSelector((state) => state.categories);
    const { brands} = useSelector((state) => state.brands);
    const { materials} = useSelector((state) => state.materials);
  useEffect(() => {
      dispatch(fetchCategories());
      dispatch(fetchBrands())
      dispatch(fetchMaterials())
    }, [dispatch]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 1000,
  });
  const [priceRange, setPriceRange] = useState([0, 1000]);
  
  
  const colors = [
    "Red",
    "Blue",
    "Black",
    "Green",
    "Yellow",
    "Gray",
    "White",
    "Pink",
    "Beige",
    "Navy",
  ];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
 
  
  const genders = ["Men", "Women"];
  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color ? params.color.split(",") : [],
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: params.minPrice || 0,
      maxPrice: params.maxPrice || 1000,
    });
    setPriceRange([0, params.maxPrice || 1000]);
  }, [searchParams]);

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    let newFilters = { ...filters };
    if (type === "checkbox") {
      if (checked) {
        newFilters[name] = [...(newFilters[name] || []), value];
      } else {
        newFilters[name] = newFilters[name].filter((item) => item !== value);
      }
    } else {
      newFilters[name] = value;
    }
    setFilters(newFilters);
    updateURLParams(newFilters);
  };
  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        params.append(key, newFilters[key].join(","));
      } else if (newFilters[key]) {
        params.append(key, newFilters[key]);
      }
    });
    setSearchParams(params);
    navigate(`?${params.toString()}`);
  };

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    setPriceRange([0, newPrice]);
    const newFilters = { ...filters, minPrice: 0, maxPrice: newPrice };
    setFilters(filters);
    updateURLParams(newFilters);
  };

 return (
  <div className="h-screen flex flex-col bg-white border-r">

    {/* Header */}
    <div className="p-4 border-b sticky top-0 bg-white z-10">
      <h3 className="text-xl font-semibold text-gray-800">Filters</h3>
    </div>

    {/* Scrollable Content */}
    <div className="flex-1 overflow-y-auto p-4 space-y-6">

      {/* Category */}
      <details className="group">
        <summary className="cursor-pointer font-medium text-gray-700 flex justify-between items-center">
          Category
          <span className="group-open:rotate-180 transition">⌄</span>
        </summary>
        <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-2">
          {categories.map((category) => (
            <label key={category._id} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="category"
                value={category.name}
                onChange={handleFilterChange}
                checked={filters.category === category.name}
                className="accent-black"
              />
              {category.name}
            </label>
          ))}
        </div>
      </details>

      {/* Gender */}
      <details className="group">
        <summary className="cursor-pointer font-medium text-gray-700 flex justify-between items-center">
          Gender
          <span className="group-open:rotate-180 transition">⌄</span>
        </summary>
        <div className="mt-3 space-y-2">
          {genders.map((gender) => (
            <label key={gender} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="gender"
                value={gender}
                onChange={handleFilterChange}
                checked={filters.gender === gender}
                className="accent-black"
              />
              {gender}
            </label>
          ))}
        </div>
      </details>

      {/* Color */}
      <details className="group">
        <summary className="cursor-pointer font-medium text-gray-700 flex justify-between items-center">
          Color
          <span className="group-open:rotate-180 transition">⌄</span>
        </summary>
        <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-2">
          {colors.map((color) => (
            <label key={color} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="color"
                value={color}
                onChange={handleFilterChange}
                checked={filters.color.includes(color)}
                className="accent-black"
              />
              {color}
            </label>
          ))}
        </div>
      </details>

      {/* Size */}
      <details className="group">
        <summary className="cursor-pointer font-medium text-gray-700 flex justify-between items-center">
          Size
          <span className="group-open:rotate-180 transition">⌄</span>
        </summary>
        <div className="mt-3 space-y-2">
          {sizes.map((size) => (
            <label key={size} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="size"
                value={size}
                onChange={handleFilterChange}
                checked={filters.size.includes(size)}
                className="accent-black"
              />
              {size}
            </label>
          ))}
        </div>
      </details>

      {/* Brand */}
      <details className="group">
        <summary className="cursor-pointer font-medium text-gray-700 flex justify-between items-center">
          Brand
          <span className="group-open:rotate-180 transition">⌄</span>
        </summary>
        <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-2">
          {brands.map((brand) => (
            <label key={brand._id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="brand"
                value={brand.name}
                onChange={handleFilterChange}
                checked={filters.brand.includes(brand.name)}
                className="accent-black"
              />
              {brand.name}
            </label>
          ))}
        </div>
      </details>

      {/* Material */}
      <details className="group">
        <summary className="cursor-pointer font-medium text-gray-700 flex justify-between items-center">
          Material
          <span className="group-open:rotate-180 transition">⌄</span>
        </summary>
        <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-2">
          {materials.map((material) => (
            <label key={material._id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="material"
                value={material.name}
                onChange={handleFilterChange}
                checked={filters.material.includes(material.name)}
                className="accent-black"
              />
              {material.name}
            </label>
          ))}
        </div>
      </details>

      {/* Price */}
      <details open className="group">
        <summary className="cursor-pointer font-medium text-gray-700 flex justify-between items-center">
          Price
          <span className="group-open:rotate-180 transition">⌄</span>
        </summary>
        <div className="mt-4">
          <input
            type="range"
            min={0}
            max={1000}
            value={priceRange[1]}
            onChange={handlePriceChange}
            className="w-full accent-black"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>₹0</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>
      </details>

    </div>
  </div>
);

};

export default FilterSidebar;
