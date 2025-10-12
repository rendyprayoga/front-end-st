import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { Navbar, NavDropdown } from "react-bootstrap";
import { UserCircle, CaretDown } from "phosphor-react";
import { DFlex } from "../../react-table/flex.styled";
import IconSignIn from "../icon/SignInLogo/IconSignIn";

export default function HeaderBullion() {
  const storedUser = localStorage.getItem("user");

  const user: { full_name: string; role: string } = storedUser
    ? JSON.parse(storedUser)
    : { full_name: "", role: "" };

  const role = user.role || "guest";
  const full_name = user.full_name || "User";

  return (
    <StyledNavbar expand="lg">
      <Navbar.Brand as={NavLink} to="/">
        <IconSignIn />
      </Navbar.Brand>

      <StyledDropdown
        title={
          <DFlex>
            <CaretDown size={16} />
            <TitleBasic>{full_name}</TitleBasic>
            <UserCircle size={24} weight="regular" />
          </DFlex>
        }
        id="basic-nav-dropdown"
        align="end"
      >
        {role === "admin" && (
          <>
            <NavDropdown.Item as={NavLink} to="/product-details">
              Products
            </NavDropdown.Item>
            <NavDropdown.Item as={NavLink} to="/management-users">
              Manage Users
            </NavDropdown.Item>
            <NavDropdown.Divider />
          </>
        )}

        {role === "user" && (
          <>
            <NavDropdown.Item as={NavLink} to="/view-product">
              View Products
            </NavDropdown.Item>
            <NavDropdown.Divider />
          </>
        )}

        <NavDropdown.Item>Profile</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Log Out
        </NavDropdown.Item>
      </StyledDropdown>
    </StyledNavbar>
  );
}

const StyledNavbar = styled(Navbar)`
  border-bottom: 1px solid var(--Border-Primary, #e6e9f0);
  display: flex;
  height: 60px;
  padding: 0 80px;
  justify-content: space-between;
  align-items: center;
`;

const StyledDropdown = styled(NavDropdown)`
  .dropdown-toggle {
    background: none !important;
    border: none !important;
    box-shadow: none !important;
    display: flex;
    align-items: center;
    gap: 6px;
    color: #333;
  }
  .dropdown-toggle::after {
    display: none !important;
  }
`;

const TitleBasic = styled.div`
  color: var(--Font-Primary, #050506);
  font-size: 14px;
  font-weight: 500;
  line-height: 140%;
`;
