import React, { createContext, useEffect, useState } from "react";
import { backend_url } from "../App";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});

  useEffect(() => {
    fetch(`${backend_url}/allproducts`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        const defaultCart = {};
        data.forEach((product) => {
          defaultCart[product._id] = 0;
        });
        setCartItems(defaultCart);
      });

    if (localStorage.getItem("auth-token")) {
      fetch(`${backend_url}/getcart`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => setCartItems(data));
    }
  }, []);

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = products.find((p) => p._id === item);
        if (itemInfo) totalAmount += cartItems[item] * itemInfo.new_price;
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let total = 0;
    for (const item in cartItems) {
      total += cartItems[item];
    }
    return total;
  };

  const addToCart = (itemId) => {
    if (!localStorage.getItem("auth-token")) {
      alert("Please login to add items to cart");
      return;
    }
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
    fetch(`${backend_url}/addtocart`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "auth-token": localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId }),
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] - 1,
    }));
    fetch(`${backend_url}/removefromcart`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "auth-token": localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId }),
    });
  };

  const contextValue = {
    products,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartItems,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
