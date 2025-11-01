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
import styled from "styled-components";
import {
  DotsThree,
  CaretLeft,
  CaretRight,
  CheckCircle,
  XCircle,
  PencilSimpleLine,
} from "phosphor-react";
import {
  IManagementGetUser,
  IManagementUser,
} from "../interface/managementuser.interface";
import ManagementForm from "./ManagementForm";
import { deleteUsers, getUsers } from "../managementAPI";

function ManagementList() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<IManagementUser[]>([]);
  const [show, setShow] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [dataSelected, setDataSelected] = useState<IManagementUser>();
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
      email: "",
      full_name: "",
      role: "",
      is_active: true,
      phone: "",
    });
    setShow(true);
  };

  useEffect(() => {
    const params: IManagementGetUser = {
      skip: (currentPage - 1) * itemsPerPage,
      limit: itemsPerPage,
      sortBy: "id",
      order: "asc",
    };
    getUserData(params);

    return () => {
      console.log("clean");
    };
  }, [triggerGet, refreshTrigger, currentPage, itemsPerPage]);

  const refreshProductData = () => {
    const params: IManagementGetUser = {
      skip: (currentPage - 1) * itemsPerPage,
      limit: itemsPerPage,
      sortBy: "id",
      order: "asc",
    };
    getUserData(params);
  };
  const getUserData = async (params: IManagementGetUser) => {
    try {
      const request: any = await getUsers({ ...params });
      setUsers(request.data || request);
      setTotalData(request.total || request.length || 52);
    } catch (error) {
      console.log(error);
    }
  };

  const callbackSubmit = () => {
    refreshProductData();
    handleClose();
  };

  const onClickEdit = (item: IManagementUser) => {
    setDataSelected(item);
    setShow(true);
  };

  const onClickDetail = (item: IManagementUser) => {
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
      deleteUserById();
    }
  };

  const deleteUserById = async () => {
    try {
      await deleteUsers(String(modalDelete?.data?.id));
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

  return (
    <>
      <div>
        <div className="d-flex justify-content-between">
          <div className="d-flex flex-column gap-2 pb-4">
            <StyledTitle>Management User</StyledTitle>
            <Description>Lihat semua user yang tersedia di sistem.</Description>
          </div>
          <div className="d-flex gap-2">
            {/* <StyledButtonWithout onClick={() => setRefreshTrigger(Date.now())}>
              Refresh Data
            </StyledButtonWithout> */}
            <StyledButton onClick={handleShow}>Tambah User</StyledButton>
          </div>
        </div>

        {/* Tabel dengan styling baru */}
        <StyledTableContainer>
          <StyledTable>
            <thead>
              <tr>
                <th style={{ width: "38%" }}>Nama User</th>
                <th style={{ width: "10%" }}>No Telp</th>
                <th style={{ width: "15%" }}>Tanggal Dibuat</th>
                <th style={{ width: "12%" }}>Status</th>
                <th style={{ width: "8%" }}></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index: number) => (
                <React.Fragment key={user.id}>
                  <tr>
                    <td>
                      <UserInfoContainer>
                        {user.profile_picture ? (
                          <Image
                            src={`http://127.0.0.1:8000${user.profile_picture}`}
                            alt="Profile"
                            style={{
                              borderRadius: "8px",
                              width: "32px",
                              height: "32px",
                            }}
                            className="border me-3"
                          />
                        ) : (
                          <NoImagePlaceholder className="me-3">
                            No Image
                          </NoImagePlaceholder>
                        )}
                        <UserDetails>
                          <UserName>{user.full_name}</UserName>
                          <UserEmail>{user.email}</UserEmail>
                        </UserDetails>
                      </UserInfoContainer>
                    </td>
                    <td>{user.phone || "-"}</td>
                    <td>
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )
                        : "-"}
                    </td>
                    <td>
                      <StatusBadge $isActive={user.is_active}>
                        {user.is_active ? (
                          <>
                            <CheckCircle size={14} weight="fill" />
                            Active
                          </>
                        ) : (
                          <>
                            <CheckCircle size={14} weight="fill" />
                            Inactive
                          </>
                        )}
                      </StatusBadge>
                    </td>

                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          onClick={() => onClickDetail(user)}
                          className="d-flex align-items-center cursor-pointer gap-2"
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
                              onClick={() => onClickEdit(user)}
                              className="d-flex align-items-center gap-2"
                            >
                              Edit
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              onClick={() =>
                                setModalDelete({ show: true, data: user })
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
            {/* <PaginationInfo>
              Menampilkan {startItem}-{endItem} dari {totalData}
            </PaginationInfo> */}
            <PaginationContainer>{renderPaginationItems()}</PaginationContainer>
          </div>
        </StyledTableFooter>
      </div>

      {/* Modal Form User */}
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <div className="d-flex flex-column g-1">
            <TitleModal>Tambah User</TitleModal>
            <Description>
              Masukkan detail user untuk menambahkannya ke management user
            </Description>
          </div>
        </Modal.Header>
        <Modal.Body>
          <ManagementForm
            callbackSubmit={callbackSubmit}
            dataSelected={dataSelected}
            onCancel={() => setShow(false)}
          />
        </Modal.Body>
      </Modal>

      {/* Modal Detail User */}
      <Modal show={showDetail} onHide={handleCloseDetail} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Detail User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {dataSelected && (
            <div>
              <Row>
                <Col md={4}>
                  <div className="d-flex flex-column align-items-center mb-4">
                    <div
                      style={{
                        width: "150px",
                        height: "150px",
                        background: "#F8F9FA",
                        border: "1px dashed #D0D3D8",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      {dataSelected.profile_picture ? (
                        <img
                          src={`http://127.0.0.1:8000${dataSelected.profile_picture}`}
                          alt="Profile"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div className="text-muted d-flex flex-column align-items-center">
                          <i
                            className="bi bi-person-circle"
                            style={{ fontSize: "48px" }}
                          ></i>
                          <small>No Image</small>
                        </div>
                      )}
                    </div>
                  </div>
                </Col>

                <Col md={8}>
                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <div className="font-size-14 text-muted mb-1">
                          Nama User
                        </div>
                        <div>{dataSelected.full_name || "-"}</div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <div className="font-size-14 text-muted mb-1">
                          Phone Number
                        </div>
                        <div>{dataSelected.phone || "-"}</div>
                      </div>
                    </Col>
                  </Row>

                  <div className="mb-3">
                    <div className="font-size-14 text-muted mb-1">Email</div>
                    <div>{dataSelected.email || "-"}</div>
                  </div>

                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <div className="font-size-14 text-muted mb-1">Role</div>
                        <div>{dataSelected.role || "-"}</div>
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className="mb-3">
                        <div className="font-size-14 text-muted mb-1">
                          Status
                        </div>
                        <div>
                          <StatusBadge $isActive={dataSelected.is_active}>
                            {dataSelected.is_active ? (
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
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <div className="font-size-14 text-muted mb-1">
                          Tanggal Dibuat
                        </div>
                        <div>
                          {dataSelected.created_at
                            ? new Date(
                                dataSelected.created_at
                              ).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "-"}
                        </div>
                      </div>
                    </Col>

                    {dataSelected.updated_at && (
                      <Col md={6}>
                        <div className="mb-3">
                          <div className="font-size-14 text-muted mb-1">
                            Terakhir Diupdate
                          </div>
                          <div>
                            {new Date(
                              dataSelected.updated_at
                            ).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </Col>
                    )}
                  </Row>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <StyledButtonCancel onClick={handleCloseDetail}>
            Batal
          </StyledButtonCancel>
          <StyledButton
            variant="primary"
            onClick={() => {
              handleCloseDetail();
              onClickEdit(dataSelected!);
            }}
          >
            <PencilSimpleLine size={20} weight="fill" />
            Edit User
          </StyledButton>
        </Modal.Footer>
      </Modal>

      {/* Modal Delete Confirmation */}
      <Modal show={modalDelete?.show} size="sm">
        <Modal.Header>
          <Modal.Title>Delete User</Modal.Title>
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

export default ManagementList;

const TitleModal = styled.div`
  color: var(--Font-Primary, #020c1f);

  font-size: 1.33333rem;

  font-weight: 600;
  line-height: 1.86667rem;
`;

const Description = styled.div`
  font-size: 14px;
  color: #5b5d63;
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

// Styled components untuk tabel baru
const StyledTableContainer = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e7eaf0;
  overflow: hidden;
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

        border: none;
      }
    }
  }
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

const PaginationInfo = styled.span`
  font-size: 14px;
  color: #5b5d63;
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

// Styled components untuk user info
const UserInfoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-weight: 600;
  color: #1a1d29;
`;

const UserEmail = styled.div`
  font-size: 12px;
  color: #8b8d97;
  margin-top: 2px;
`;

const NoImagePlaceholder = styled.div`
  width: 32px;
  height: 32px;
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
