import React from "react";

import Navbar from "../../Components/layout/Navbar";
import TablePage from "../../Components/management/managementList/TablePage";

export default function ProductPage() {
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
