import React, { useEffect, useState } from "react";
import "./CSS/ShopCategory.css";
import dropdown_icon from '../Components/Assets/dropdown_icon.png';
import Item from "../Components/Item/Item";
import { Link } from "react-router-dom";

const ShopCategory = ({ banner, category }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedSize, setSelectedSize] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sizes = ["All", "Small", "Medium", "Large"];

  // Fetch products from the server
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:4000/allproducts");
      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();
      setAllProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Apply Sorting and Filtering Together
  useEffect(() => {
    let filtered = allProducts.filter((item) => item.category === category);
    
    if (selectedSize !== "All") {
      filtered = filtered.filter((item) => item.size === selectedSize);
    }

    const sorted = filtered.sort((a, b) =>
      sortOrder === "asc" ? a.new_price - b.new_price : b.new_price - a.new_price
    );

    setSortedProducts(sorted);
  }, [allProducts, category, sortOrder, selectedSize]);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>Error: {error}</h2>;

  return (
    <div className="shopcategory">
      <img src={banner} className="shopcategory-banner" alt="Category Banner" />
      
      <div className="shopcategory-filters">
        <div className="shopcategory-sort">
          Sort by 
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
          <img src={dropdown_icon} alt="Dropdown Icon" />
        </div>
        
        <div className="shopcategory-filter">
          Filter by Size
          <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
            {sizes.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="shopcategory-products">
        {sortedProducts.map((item, i) => (
          <Item 
            id={item.id} 
            key={i} 
            name={item.name} 
            image={item.image}  
            new_price={item.new_price} 
            old_price={item.old_price}
          />
        ))}
      </div>

      <div className="shopcategory-loadmore">
        <Link to="/" style={{ textDecoration: "none" }}>Explore More</Link>
      </div>
    </div>
  );
};

export default ShopCategory;
