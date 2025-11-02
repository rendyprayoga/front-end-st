import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Navbar, NavDropdown } from "react-bootstrap";
import { UserCircle, CaretDown } from "phosphor-react";
import { DFlex } from "../../react-table/flex.styled";
import IconSignIn from "../icon/SignInLogo/IconSignIn";
import IconSignUser from "../icon/SignInLogo/IconSignUser";
import { authService } from "../../feature/auth/services/auth.service";

export default function NavbarUser() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : { full_name: "User", profile_picture: "" };

  useEffect(() => {
    if ((!user.profile_picture || user.profile_picture === "") && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const syncUserData = async () => {
        try {
          const userDetail = await authService.getCurrentUser(parsedUser.email);
          if (userDetail && userDetail.profile_picture) {
            const updatedUser = { ...parsedUser, ...userDetail };
            localStorage.setItem("user", JSON.stringify(updatedUser));
          }
        } catch (error) {
          console.log("Sync gagal:", error);
        }
      };

      setTimeout(syncUserData, 2000);
    }
  }, [storedUser]);
  const full_name = user.full_name || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <StyledNavbar expand="lg">
      <Navbar.Brand as={NavLink} to="/">
        <IconSignUser />
      </Navbar.Brand>

      <StyledDropdown
        title={
          <DFlex>
            <CaretDown size={16} />
            <TitleBasic>{full_name}</TitleBasic>
            {user.profile_picture ? (
              <ProfileImage
                src={`http://localhost:8000${user.profile_picture}`}
                alt="Profile"
              />
            ) : (
              <UserCircle size={24} weight="regular" />
            )}
          </DFlex>
        }
        id="basic-nav-dropdown"
        align="end"
      >
        <NavDropdown.Item as={NavLink} to="/profile">
          Profile
        </NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={handleLogout}>Log Out</NavDropdown.Item>
      </StyledDropdown>
    </StyledNavbar>
  );
}

const StyledNavbar = styled(Navbar)`
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 10;
  background: rgba(5, 5, 6, 0.12);
  border: none;
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
    color: #fff;
  }
  .dropdown-toggle::after {
    display: none !important;
  }
`;

const TitleBasic = styled.div`
  color: var(--Font-Primary, #ffff);
  font-size: 14px;
  font-weight: 500;
  line-height: 140%;
`;

const ProfileImage = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
`;
