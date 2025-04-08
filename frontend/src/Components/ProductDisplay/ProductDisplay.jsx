import React, { useContext, useState } from "react";
import "./ProductDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import { backend_url, currency } from "../../App";

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);
  const [selectedImage, setSelectedImage] = useState(product.image);

  const handleImageClick = (imgPath) => {
    setSelectedImage(imgPath); // No fetch, just show image
  };

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          {/* You can map over a list of images if available */}
          {[...Array(4)].map((_, index) => (
            <img
              key={index}
              src={backend_url + product.image}
              alt={`Thumbnail ${index + 1}`}
              onClick={() => handleImageClick(product.image)}
              className="thumbnail"
              style={{ cursor: "pointer" }}
            />
          ))}
        </div>
        <div className="productdisplay-img">
          <img
            className="productdisplay-main-img"
            src={backend_url + selectedImage}
            alt="Main product"
          />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
          {[...Array(4)].map((_, i) => (
            <img key={i} src={star_icon} alt="star" />
          ))}
          <img src={star_dull_icon} alt="dull star" />
          <p>(122)</p>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">
            {currency}
            {product.old_price}
          </div>
          <div className="productdisplay-right-price-new">
            {currency}
            {product.new_price}
          </div>
        </div>
        <div className="productdisplay-right-description">
          {product.description}
        </div>
        <div className="productdisplay-right-size">
          <h1>Select Size</h1>
          <div className="productdisplay-right-sizes">
            <div>S</div>
            <div>M</div>
            <div>L</div>
            <div>XL</div>
            <div>XXL</div>
          </div>
        </div>
        <button onClick={() => addToCart(product._id)}>ADD TO CART</button>
        <p className="productdisplay-right-category">
          <span>Category :</span> Women, T-shirt, Crop Top
        </p>
        <p className="productdisplay-right-category">
          <span>Tags :</span> Modern, Latest
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
