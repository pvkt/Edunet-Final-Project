import React, { useContext, useEffect, useState } from "react";
import Breadcrums from "../Components/Breadcrums/Breadcrums";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import DescriptionBox from "../Components/DescriptionBox/DescriptionBox";
import RelatedProducts from "../Components/RelatedProducts/RelatedProducts";
import { useParams } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";

const Product = () => {
  const { products } = useContext(ShopContext);
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (products && products.length > 0) {
      const foundProduct = products.find((e) => e.id === Number(productId));
      setProduct(foundProduct || null);
    }
    setLoading(false);
  }, [products, productId]);

  if (loading) {
    return <h2>Loading Product...</h2>;
  }

  return product ? (
    <div>
      <Breadcrums product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox />
      <RelatedProducts id={product.id} category={product.category} />
    </div>
  ) : (
    <h2>Product Not Found</h2>
  );
};

export default Product;
