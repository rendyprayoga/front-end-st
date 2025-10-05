import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import TablePage from "./TablePage";
import {
  IParamsGetProduct,
  IProduct,
} from "../feature/product/interface/products.interface";
import { getProducts } from "../feature/product/products";
import ProductsForm from "../feature/components/form/ProductForm";
import styled from "styled-components";
import { Plus } from "phosphor-react";
import { FlexColumn } from "../react-table/flex.styled";

export default function ProductPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const params: IParamsGetProduct = { skip: 0, limit: 10 };
    getData(params);

    return () => {
      console.log("clean");
    };
  }, []);

  const getData = async (params: IParamsGetProduct) => {
    try {
      const request: any = await getProducts({ params });
      setProducts(request.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="">
      <div className="d-flex justify-content-between mb-4">
        <div className="d-flex flex-column">
          <TitleBasic style={{ fontSize: "20px", fontWeight: "600" }}>
            Daftar Product
          </TitleBasic>
          <Description>
            Lihat semua produk yang tersedia di inventaris.
          </Description>
        </div>
        <StyledButton size="lg" onClick={handleShow}>
          <Plus size={20} />
          Tambah Product
        </StyledButton>
      </div>

      <TablePage products={products} />

      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <div className="d-flex flex-column">
            <StyledTitle>Tambah Products</StyledTitle>
            <Description>
              Masukkan detail produk untuk menambahkannya ke inventaris.
            </Description>
          </div>
        </Modal.Header>
        <Modal.Body>
          <ProductsForm />
        </Modal.Body>
      </Modal>
    </div>
  );
}

const TitleBasic = styled.div`
  color: var(--Font-Primary, #050506);

  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
`;

const Description = styled.div`
  overflow: hidden;
  color: var(--Font-Secondary, #5b5d63);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
`;

const StyledButton = styled(Button as any)`
  display: flex;
  height: 40px;
  padding: var(--Padding-p-0, 0) var(--Padding-p-12, 12px);
  justify-content: center;
  align-items: center;
  gap: var(--Gap-g-8, 8px);
  border-radius: 10px;
  background: var(--Primary-500, #ff7900);
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
  border: none;

  &: hover {
    background: var(--Primary-200, #ff7900);
  }
`;

const StyledTitle = styled(Modal.Title)`
  color: var(--Font-Primary, #020c1f);
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 28px;
`;
