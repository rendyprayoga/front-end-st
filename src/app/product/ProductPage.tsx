import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import TablePage from "./TablePage";
import {
  IParamsGetProduct,
  IProduct,
} from "../feature/product/interface/products.interface";
import { getProducts } from "../feature/product/products";
import ProductsForm from "../feature/components/form/ProductForm";

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
    <div className="p-4">
      <div className="d-flex justify-content-between mb-4">
        <h1>Daftar Product</h1>
        <Button variant="primary" size="lg" onClick={handleShow}>
          Tambah Product
        </Button>
      </div>

      <TablePage products={products} />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Products</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProductsForm />
        </Modal.Body>
      </Modal>
    </div>
  );
}
