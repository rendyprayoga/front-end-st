import React from "react";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { DFlex } from "../../react-table/flex.styled";
import RenderIcon from "../Render/RenderIcon";
import IconSignIn from "../icon/SignInLogo/IconSignIn";
import { UserCircle, CaretDown } from "phosphor-react";
export default function HeaderBullion() {
  return (
    <StyledNavbar expand="lg" className="bg-body-tertiary">
      <>
        <Navbar.Brand href="#home">
          {" "}
          <IconSignIn />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <StyledDropdown
              title={
                <DFlex>
                  <CaretDown size={16} />
                  <UserCircle size={24} weight="regular" />
                </DFlex>
              }
              id="basic-nav-dropdown"
              align="end"
            >
              <NavDropdown.Item href="">Action</NavDropdown.Item>
              <NavDropdown.Item href="">Another action</NavDropdown.Item>
              <NavDropdown.Item href="">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="">Log Out</NavDropdown.Item>
            </StyledDropdown>
          </Nav>
        </Navbar.Collapse>
      </>
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
    display: none !important; /* hilangkan caret default bootstrap */
  }
`;
