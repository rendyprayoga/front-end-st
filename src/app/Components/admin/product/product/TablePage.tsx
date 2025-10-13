import React, { useEffect, useRef, useState } from "react";
import { Button, Dropdown, Modal, Table, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { IParamsGetProduct, IProduct } from "../interface/products.interface";
import ProductsForm from "./ProductForm";
import { deleteProduct, getProducts } from "./productsAPI";
import styled from "styled-components";
import { DotsThree } from "phosphor-react";

function ProductsList() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [show, setShow] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [dataSelected, setDataSelected] = useState<IProduct>();
  const triggerGet = useRef<number>(0);

  const [modalDelete, setModalDelete] = useState<any>({
    show: false,
    data: null,
  });

  const handleClose = () => setShow(false);

  const handleShow = () => {
    setDataSelected({
      name: "",
      description: "",
      price: 0,
      category: "",
      stock: 0,
      image_url: "",
      status: "",
    });
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
  }, [triggerGet, refreshTrigger]);

  const getProductData = async (params: IParamsGetProduct) => {
    try {
      const request: any = await getProducts({ ...params });
      setProducts(request);
    } catch (error) {
      console.log(error);
    }
  };

  const callbackSubmit = () => {
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
      await deleteProduct(String(modalDelete?.data?.id));
      handleCloseModalDelete();
      triggerGet.current = Date.now();
    } catch (error) {}
  };

  return (
    <>
      <div>
        <div className="d-flex justify-content-between">
          <div className="d-flex flex-column gap-2 pb-4">
            <StyledTitle>Daftar Product</StyledTitle>
            <Description>
              Lihat semua produk yang tersedia di inventaris.
            </Description>
          </div>
          <div className="d-flex gap-2">
            <StyledButtonWithout onClick={() => setRefreshTrigger(Date.now())}>
              Perbarui stock
            </StyledButtonWithout>
            <StyledButton onClick={handleShow}>Tambah Product</StyledButton>
          </div>
        </div>

        <Table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Produk</th>
              <th>Kategori</th>
              <th>Stok</th>
              <th>Harga</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index: number) => (
              <React.Fragment key={product.id}>
                <tr>
                  <td>{index + 1}</td>
                  <td>
                    {product.image_url ? (
                      <Image
                        src={`http://127.0.0.1:8000${product.image_url}`}
                        alt="Profile"
                        width={40}
                        height={40}
                        roundedCircle
                        className="border"
                      />
                    ) : (
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          backgroundColor: "#e9ecef",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#6c757d",
                          fontSize: "12px",
                        }}
                      >
                        No Image
                      </div>
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.stock}</td>
                  <td>
                    Rp {new Intl.NumberFormat("id-ID").format(product.price)}
                  </td>
                  <td>{product.status}</td>
                  <td>
                    <Dropdown>
                      <StyledToggle variant="" className="border-0 p-0">
                        <DotsThree size={22} />
                      </StyledToggle>
                      <StyledDropdownMenu>
                        <Dropdown.Item
                          onClick={() =>
                            setModalDelete({ show: true, data: product })
                          }
                        >
                          Delete
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => onClickEdit(product)}>
                          Edit
                        </Dropdown.Item>
                      </StyledDropdownMenu>
                    </Dropdown>
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
  font-size: 14px;
  font-weight: 500;
`;

const Description = styled.div`
  font-size: 14px;
  color: #5b5d63;
`;

const StyledButton = styled(Button as any)`
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  background: #ff7900;
  border: none;
  font-size: 0.875rem;

  font-weight: 500;
  line-height: 1.25rem;

  &:hover {
    background: #ff7900;
    border: none;
  }
`;

const StyledButtonWithout = styled(Button as any)`
  height: 40px;
  padding: 0 12px;
  color:var(--black)
  border-radius: 10px;
  border: 1px solid var(--Border-Primary, #e7eaf0);
  background: var(--Background-Primary, #fff);
    font-size: 0.875rem;

font-weight: 500;
line-height: 1.25rem;

  &:hover {
     background: var(--Background-Primary, #fff);
       border: 1px solid var(--Border-Primary, #e7eaf0);
         color:var(--black)
  }
`;

const StyledTitle = styled(Modal.Title)`
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
`;

const StyledDropdownMenu = styled(Dropdown.Menu)`
  border-radius: 0.5rem;
  border: 1px solid #e1e2e5;
`;

const StyledToggle = styled(Dropdown.Toggle)`
  border: none;
  background: transparent;
  padding: 0;
  &::after {
    display: none !important;
  }
`;
