import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./app/feature/auth/LoginPage";
import ProductsDetails from "./app/feature/product/product/ProductsDetails";

function ProductsRouting() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/product-details" element={<ProductsDetails />} />
          {/* <Route path="detail/:id" element={<ProductsDetail />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default ProductsRouting;
