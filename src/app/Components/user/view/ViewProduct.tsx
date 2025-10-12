import React from "react";
import Navbar from "../../layout/Navbar";
import TablePage from "../product/TablePage";

export default function ViewProduct() {
  return (
    <>
      <Navbar />
      <div
        style={{
          padding: "0 80px",
          marginTop: "40px",
        }}
      >
        {" "}
        <TablePage />
      </div>
    </>
  );
}
