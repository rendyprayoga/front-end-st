import React from "react";
import Navbar from "../../../layout/Navbar";
import ProductPage from "../../../../pages/product/ProductPage";

export default function ProductsDetails() {
  return (
    <>
      <Navbar />
      <div
        style={{
          padding: "0 80px",
          marginTop: "40px",
        }}
      >
        <ProductPage />
      </div>
    </>
  );
}
