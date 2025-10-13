import React, { useEffect, useRef, useState } from "react";
import { Button, Dropdown, Modal, Table, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { DotsThree } from "phosphor-react";
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
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [dataSelected, setDataSelected] = useState<IManagementUser>();
  const triggerGet = useRef<number>(0);

  const [modalDelete, setModalDelete] = useState<any>({
    show: false,
    data: null,
  });

  const handleClose = () => setShow(false);

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
      skip: 0,
      limit: 10,
      sortBy: "id",
      order: "asc",
    };
    getUserData(params);

    return () => {
      console.log("clean");
    };
  }, [triggerGet, refreshTrigger]);

  const getUserData = async (params: IManagementGetUser) => {
    try {
      const request: any = await getUsers({ ...params });
      setUsers(request);
    } catch (error) {
      console.log(error);
    }
  };

  const callbackSubmit = () => {
    triggerGet.current = Date.now();
    handleClose();
  };

  const onClickEdit = (item: IManagementUser) => {
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

  return (
    <>
      <div>
        <div className="d-flex justify-content-between">
          <div className="d-flex flex-column gap-2 pb-4">
            <StyledTitle>Management User</StyledTitle>
            <Description>Lihat semua user yang tersedia di sistem.</Description>
          </div>
          <div className="d-flex gap-2">
            <StyledButtonWithout onClick={() => setRefreshTrigger(Date.now())}>
              Refresh Data
            </StyledButtonWithout>
            <StyledButton onClick={handleShow}>Tambah User</StyledButton>
          </div>
        </div>

        <Table>
          <thead>
            <tr>
              <th>No</th>
              <th>Profile</th>
              <th>Nama User</th>
              <th>Full Name</th>
              <th>phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created At</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index: number) => (
              <React.Fragment key={user.id}>
                <tr>
                  <td>{index + 1}</td>
                  <td>
                    {user.profile_picture ? (
                      <Image
                        src={`http://127.0.0.1:8000${user.profile_picture}`}
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
                  <td>{user.email}</td>
                  <td>{user.full_name}</td>
                  <td>{user.phone}</td>
                  <td>{user.role}</td>
                  <td>{user.is_active ? "Active" : "Inactive"}</td>
                  <td>
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <Dropdown>
                      <StyledToggle variant="" className="border-0 p-0">
                        <DotsThree size={22} />
                      </StyledToggle>
                      <StyledDropdownMenu>
                        <Dropdown.Item
                          onClick={() =>
                            setModalDelete({ show: true, data: user })
                          }
                        >
                          Delete
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => onClickEdit(user)}>
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
          <Modal.Title>Form User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ManagementForm
            callbackSubmit={callbackSubmit}
            dataSelected={dataSelected}
          />
        </Modal.Body>
      </Modal>

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
  font-size: 20px;
  font-weight: 600;
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
