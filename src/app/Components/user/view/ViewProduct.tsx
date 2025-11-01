import React, { useState } from "react";
import TablePage from "../product/TablePage";
import NavbarUser from "../../layout/NavbarUser";
import HeroSection from "../../layout/Hero/HeroSection";

export default function ViewProduct() {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <>
      <NavbarUser />
      <HeroSection onSearch={handleSearch} />
      <div
        style={{
          padding: "0 80px",
          marginTop: "40px",
        }}
      >
        <TablePage searchTerm={searchTerm} />
      </div>
    </>
  );
}
