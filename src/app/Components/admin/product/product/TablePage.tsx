import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Dropdown,
  Modal,
  Table,
  Image,
  Row,
  Col,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { IParamsGetProduct, IProduct } from "../interface/products.interface";
import ProductsForm from "./ProductForm";
import { deleteProduct, getProducts } from "./productsAPI";
import styled from "styled-components";
import {
  CaretLeft,
  CaretRight,
  CheckCircle,
  DotsThree,
  Eye,
  PencilSimpleLine,
  XCircle,
} from "phosphor-react";
import {
  DFlexColumn,
  DFlexJustifyBetween,
} from "../../../../react-table/flex.styled";

function ProductsList() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [show, setShow] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [dataSelected, setDataSelected] = useState<IProduct>();
  const triggerGet = useRef<number>(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalData, setTotalData] = useState(0);

  const [modalDelete, setModalDelete] = useState<any>({
    show: false,
    data: null,
  });

  const handleClose = () => setShow(false);
  const handleCloseDetail = () => setShowDetail(false);

  const handleShow = () => {
    setDataSelected({
      name: "",
      description: "",
      price: 0,
      category: "",
      stock: 0,
      image_url: "",
      status: "active",
    });
    setShow(true);
  };
  useEffect(() => {
    const params: IParamsGetProduct = {
      skip: (currentPage - 1) * itemsPerPage,
      limit: itemsPerPage,
      sortBy: "id",
      order: "asc",
    };
    getProductData(params);
  }, [currentPage, itemsPerPage, refreshTrigger]);

  const getProductData = async (params: IParamsGetProduct) => {
    try {
      const request: any = await getProducts({ ...params });
      setProducts(request.data || request);
      setTotalData(request.total || request.length || 52);
    } catch (error) {
      console.log(error);
    }
  };

  const refreshProductData = () => {
    const params: IParamsGetProduct = {
      skip: (currentPage - 1) * itemsPerPage,
      limit: itemsPerPage,
      sortBy: "id",
      order: "asc",
    };
    getProductData(params);
  };
  const callbackSubmit = () => {
    refreshProductData();
    handleClose();
  };

  const onClickEdit = (item: IProduct) => {
    setDataSelected(item);
    setShow(true);
  };

  const onClickDetail = (item: IProduct) => {
    setDataSelected(item);
    setShowDetail(true);
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

  const totalPages = Math.ceil(totalData / itemsPerPage);

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    items.push(
      <PaginationItem
        key="prev"
        $disabled={currentPage === 1}
        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
      >
        <CaretLeft size={16} />
      </PaginationItem>
    );

    // Page numbers
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <PaginationItem
          key={page}
          $active={page === currentPage}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </PaginationItem>
      );
    }

    // Next button
    items.push(
      <PaginationItem
        key="next"
        $disabled={currentPage === totalPages}
        onClick={() =>
          currentPage < totalPages && handlePageChange(currentPage + 1)
        }
      >
        <CaretRight size={16} />
      </PaginationItem>
    );

    return items;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalData);

  const handleCancelForm = () => {
    setShow(false);
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
              Refresh Data
            </StyledButtonWithout>
            <StyledButton onClick={handleShow}>Tambah Product</StyledButton>
          </div>
        </div>

        {/* Tabel dengan styling baru */}
        <StyledTableContainer>
          <StyledTable>
            <thead>
              <tr>
                <th style={{ width: "38%" }}>Nama Produk</th>
                <th style={{ width: "15%" }}>Kategori</th>
                <th style={{ width: "10%" }}>Stok</th>
                <th style={{ width: "15%" }}>Harga</th>
                <th style={{ width: "12%" }}>Status</th>
                {/* <th style={{ width: "35%" }}></th> */}
                <th style={{ width: "40%" }}></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index: number) => (
                <React.Fragment key={product.id}>
                  <tr>
                    <td>
                      <ProductInfoContainer>
                        {product.image_url ? (
                          <Image
                            src={`http://127.0.0.1:8000${product.image_url}`}
                            alt="Product"
                            width={40}
                            height={40}
                            className="border me-3"
                            style={{ borderRadius: "8px", objectFit: "cover" }}
                          />
                        ) : (
                          <NoImagePlaceholder className="me-3">
                            No Image
                          </NoImagePlaceholder>
                        )}
                        <ProductDetails>
                          <ProductName>{product.name}</ProductName>
                        </ProductDetails>
                      </ProductInfoContainer>
                    </td>
                    <td>{product.category || "-"}</td>
                    <td>{product.stock}</td>
                    <td>
                      Rp {new Intl.NumberFormat("id-ID").format(product.price)}
                    </td>
                    <td>
                      <StatusBadge $isActive={product.status === "active"}>
                        {product.status === "active" ? (
                          <>
                            <CheckCircle size={14} weight="fill" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle size={14} weight="fill" />
                            Inactive
                          </>
                        )}
                      </StatusBadge>
                    </td>

                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          onClick={() => onClickDetail(product)}
                          className="d-flex align-items-center cursor-pointer gap-2 "
                          style={{ cursor: "pointer", color: "#FF7900" }}
                        >
                          Lihat Detail
                        </div>
                        <Dropdown>
                          <StyledToggle variant="" className="border-0 p-0">
                            <DotsThree size={22} />
                          </StyledToggle>
                          <StyledDropdownMenu>
                            <Dropdown.Item
                              onClick={() => onClickEdit(product)}
                              className="d-flex align-items-center gap-2"
                            >
                              Edit
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              onClick={() =>
                                setModalDelete({ show: true, data: product })
                              }
                              className="text-danger d-flex align-items-center gap-2"
                            >
                              Delete
                            </Dropdown.Item>
                          </StyledDropdownMenu>
                        </Dropdown>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </StyledTable>
        </StyledTableContainer>

        {/* Footer dengan pagination */}
        <StyledTableFooter>
          <div className="footer-left">
            <span>Menampilkan</span>
            <PageSelect
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </PageSelect>
            <span>dari {totalData} Data</span>
          </div>

          <div className="footer-right">
            <PaginationContainer>{renderPaginationItems()}</PaginationContainer>
          </div>
        </StyledTableFooter>
      </div>

      {/* Modal Form Product */}
      <Modal
        show={show}
        onHide={handleClose}
        centered
        size="lg"
        className="rounded"
      >
        <Modal.Header closeButton>
          <div className="d-flex flex-column">
            <TitleModal>Tambah Product</TitleModal>
            <ProductDescription>
              Masukkan detail produk untuk menambahkannya ke inventaris.
            </ProductDescription>
          </div>
        </Modal.Header>
        <Modal.Body>
          <ProductsForm
            callbackSubmit={callbackSubmit}
            onCancel={handleCancelForm}
            dataSelected={dataSelected}
          />
        </Modal.Body>
      </Modal>

      <Modal show={showDetail} onHide={handleCloseDetail} centered size="lg">
        <Modal.Header closeButton>
          <div className="d-flex flex-column">
            <TitleModal>Detail Product</TitleModal>
            <InputDetail>
              Berikut adalah detail dari produk yang dipilih.
            </InputDetail>
          </div>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <Col md={4}>
              <div className="d-flex flex-column align-items-center">
                <div
                  style={{
                    width: "100%",
                    height: "200px",

                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    document.getElementById("uploadInput")?.click()
                  }
                >
                  {dataSelected?.image_url ? (
                    <Image
                      src={`http://127.0.0.1:8000${dataSelected.image_url}`}
                      alt="Product"
                      width={120}
                      height={120}
                      style={{ borderRadius: "8px", objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ color: "#aaa" }}>Tidak ada gambar</span>
                  )}
                </div>
              </div>
            </Col>

            <Col md={8}>
              <Row className="mb-3">
                <Col md={6}>
                  <InputDetail>Nama Produk </InputDetail>
                  <DescriptionDetail>
                    {dataSelected?.name || "-"}
                  </DescriptionDetail>
                </Col>

                <Col md={6}>
                  <InputDetail>Kategori Produk </InputDetail>
                  <DescriptionDetail>
                    {dataSelected?.category || "-"}
                  </DescriptionDetail>
                </Col>
              </Row>
              <div className="mb-3">
                <InputDetail>Deskripsi Produk</InputDetail>
                <DescriptionDetail>
                  {dataSelected?.description || "-"}
                </DescriptionDetail>
              </div>
              <Row>
                <Col md={6}>
                  <InputDetail>Harga Satuan </InputDetail>
                  <DescriptionDetail>
                    {dataSelected?.price
                      ? `Rp ${new Intl.NumberFormat("id-ID").format(
                          dataSelected.price
                        )}`
                      : "-"}
                  </DescriptionDetail>
                </Col>

                <Col md={6}>
                  <CardStock>
                    <DFlexJustifyBetween>
                      <DFlexColumn>
                        <InputDetail>Stok Awal </InputDetail>
                        <DescriptionDetail>
                          {dataSelected?.stock || "-"}
                        </DescriptionDetail>
                      </DFlexColumn>

                      <ToglePerbarui>Perbarui</ToglePerbarui>
                    </DFlexJustifyBetween>
                  </CardStock>
                </Col>
              </Row>
              <Col md={6}>
                <InputDetail>Status</InputDetail>
                <DescriptionDetail>
                  <StatusBadge $isActive={dataSelected?.status === "active"}>
                    {dataSelected?.status === "active" ? (
                      <>
                        <CheckCircle size={14} weight="fill" />
                        Active
                      </>
                    ) : (
                      <>
                        <XCircle size={14} weight="fill" />
                        Inactive
                      </>
                    )}
                  </StatusBadge>
                </DescriptionDetail>
              </Col>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <StyledButtonCancel onClick={handleCloseDetail}>
            Tutup
          </StyledButtonCancel>
          <StyledButton
            variant="primary"
            onClick={() => {
              handleCloseDetail();
              onClickEdit(dataSelected!);
            }}
          >
            <PencilSimpleLine size={20} weight="fill" />
            Edit Product
          </StyledButton>
        </Modal.Footer>
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

const InputDetail = styled.div`
  color: var(--Font-Secondary, #5d6471);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
`;

const ToglePerbarui = styled.div`
  color: var(--Primary-Base, #ff7900);
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
`;

const DescriptionDetail = styled.div`
  color: var(--Font-Primary, #020c1f);

  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
`;

const CardStock = styled.div`
  padding: 12px 16px;
  gap: 4px;
  border-radius: 12px;
  background: var(--BG-Secondary, #f5f7fa);
`;

const TitleModal = styled.div`
  color: var(--Font-Primary, #020c1f);

  font-size: 1.33333rem;

  font-weight: 600;
  line-height: 1.86667rem;
`;

const StyledTableContainer = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e7eaf0;
  overflow: hidden;
`;

const StyledButtonCancel = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #d0d3d8;
  color: #555;
  cursor: pointer;
`;

const StyledTable = styled(Table)`
  margin: 0;

  thead tr th {
    background: var(--BG-Secondary, #f5f7fa) !important;
    color: var(--Font-Primary, #050506) !important;

    font-weight: 500;
    font-size: 0.93333rem;
    padding: 12px 16px;
  }

  tbody {
    tr {
      border-bottom: 1px solid #e7eaf0;

      &:last-child {
        border-bottom: none;
      }

      td {
        padding: 16px;
        font-size: 0.93333rem;
        font-weight: 400;
        line-height: 1.33333rem;
        // vertical-align: middle;
        border: none;
      }
    }
  }
`;

const ProductInfoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductName = styled.div`
  font-weight: 400;
  color: var(--Font-Primary, #050506);

  font-size: 0.93333rem;

  line-height: 1.33333rem;
`;

const ProductDescription = styled.div`
  font-size: 12px;
  color: #8b8d97;
  white-space: nowrap;
`;

const StatusBadge = styled.span<{ $isActive: boolean }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${(props) => (props.$isActive ? "#E9F9E9" : "#E7EAF0")};
  color: ${(props) => (props.$isActive ? "#26A326" : "#5B5D63")};
  border: 1px solid ${(props) => (props.$isActive ? "none" : "none")};
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const StyledTableFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border: 1px solid #e7eaf0;
  border-top: none;
  border-radius: 0 0 8px 8px;

  .footer-left {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #5b5d63;
  }

  .footer-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }
`;

const PageSelect = styled.select`
  padding: 4px 8px;
  border: 1px solid #e7eaf0;
  border-radius: 4px;
  background: white;
  font-size: 14px;
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PaginationItem = styled.div<{ $active?: boolean; $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: ${(props) => (props.$active ? "600" : "400")};
  color: ${(props) => {
    if (props.$disabled) return "#8b8d97";
    if (props.$active) return "#ffffff";
    return "#5b5d63";
  }};
  background-color: ${(props) => (props.$active ? "#ff7900" : "transparent")};
  border: 1px solid ${(props) => (props.$active ? "#ff7900" : "#e7eaf0")};
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};

  &:hover {
    background-color: ${(props) => {
      if (props.$disabled) return "transparent";
      if (props.$active) return "#ff7900";
      return "#f8f9fa";
    }};
  }
`;

const NoImagePlaceholder = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  font-size: 12px;
`;

// Styled components untuk modal detail
const DetailContainer = styled.div`
  padding: 8px 0;
`;

const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 8px 0;
`;

const DetailLabel = styled.div`
  font-weight: 600;
  color: #5b5d63;
  width: 200px;
  flex-shrink: 0;
  font-size: 14px;
`;

const DetailValue = styled.div`
  flex: 1;
  color: #1a1d29;
  font-size: 14px;
  word-break: break-word;
`;

// Header Styled Components
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
  color: var(--black);
  border-radius: 10px;
  border: 1px solid var(--Border-Primary, #e7eaf0);
  background: var(--Background-Primary, #fff);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;

  &:hover {
    background: var(--Background-Primary, #fff);
    border: 1px solid var(--Border-Primary, #e7eaf0);
    color: var(--black);
  }
`;

const StyledTitle = styled(Modal.Title)`
  font-size: 20px;
  font-weight: 600;
`;

const StyledDropdownMenu = styled(Dropdown.Menu)`
  border-radius: 0.5rem;
  border: 1px solid #e1e2e5;
  padding: 8px;
`;

const StyledToggle = styled(Dropdown.Toggle)`
  border: none;
  background: transparent;
  padding: 0;
  &::after {
    display: none !important;
  }
`;

const StyledModal = styled(Modal)`
  .modal-content {
    border-radius: 16px;
    padding: 1rem;
  }

  .modal-header {
    border-bottom: none;
    padding-bottom: 0.5rem;
  }

  .modal-title {
    font-size: 1.33333rem;
    font-weight: 600;
  }
`;
