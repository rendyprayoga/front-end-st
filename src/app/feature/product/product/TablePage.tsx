import React, { useEffect, useRef, useState } from "react";
import { Button, Container, Modal, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { IParamsGetProduct, IProduct } from "../interface/products.interface";
import ProductsForm from "./ProductForm";
import { deleteProduct, getProducts } from "./productsAPI";
import styled from "styled-components";

function ProductsList() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [show, setShow] = useState(false);
  const [dataSelected, setDataSelected] = useState<IProduct>();
  const triggerGet = useRef<number>(0);

  const [modalDelete, setModalDelete] = useState<any>({
    show: false,
    data: null,
  });

  const handleClose = () => setShow(false);

  const handleShow = () => {
    setDataSelected({ title: "", description: "", price: 10 });
    setShow(true);
  };

  useEffect(() => {
    const params: IParamsGetProduct = {
      skip: 0,
      limit: 10,
      sortBy: "id",
      order: "asc",
    };
    getProductData(params);

    return () => {
      console.log("clean");
    };
  }, [triggerGet]);

  const getProductData = async (params: IParamsGetProduct) => {
    try {
      const request: any = await getProducts({ params: params });
      setProducts(request.products);
    } catch (error) {
      console.log(error);
    }
  };

  const callbackSubmit = (values: IProduct) => {
    triggerGet.current = Date.now();
    handleClose();
  };

  const onClickEdit = (item: IProduct) => {
    setDataSelected(item);
    setShow(true);
  };

  const handleCloseModalDelete = () => {
    setModalDelete((prevState: any) => ({ ...prevState, show: false }));
  };

  const handleApplyConfirm = (type: "x" | "y") => {
    if (type === "x") {
      handleCloseModalDelete();
    } else {
      deleteProductById();
    }
  };

  const deleteProductById = async () => {
    try {
      const resp = await deleteProduct(modalDelete?.data?.id);
      console.log(resp);
      handleCloseModalDelete();
    } catch (error) {}
  };

  return (
    <>
      <div>
        <div className="d-flex justify-content-between">
          <TitleBasic>Daftar Product</TitleBasic>
          <StyledButton onClick={handleShow}>Tambah Product</StyledButton>
        </div>
        <Table>
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index: number) => (
              <React.Fragment key={product.id}>
                <tr>
                  <td>{index + 1}</td>
                  <td>{product.title}</td>
                  <td>{product.description}</td>
                  <td>$ {product.price}</td>
                  <td className="d-flex gap-2">
                    <Button
                      variant="warning"
                      onClick={() => navigate(String(product?.id))}
                    >
                      Detail
                    </Button>
                    <Button variant="info" onClick={() => onClickEdit(product)}>
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() =>
                        setModalDelete({ show: true, data: product })
                      }
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Form Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProductsForm
            callbackSubmit={callbackSubmit}
            dataSelected={dataSelected}
          />
        </Modal.Body>
      </Modal>
      <Modal show={modalDelete?.show} size="sm">
        <Modal.Header>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Apakah anda yakin?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleApplyConfirm("x")}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleApplyConfirm("y")}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ProductsList;

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
