import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { authService } from "./services/auth.service";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import IconSignIn from "../../Components/icon/SignInLogo/IconSignIn";
import styled from "styled-components";
import { Eye, EyeSlash } from "phosphor-react";

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === "admin") {
        navigate("/product-details");
      } else {
        navigate("/view-product");
      }
    }
  }, [navigate]);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email tidak valid")
      .required("Email wajib diisi"),
    password: Yup.string().required("Password wajib diisi"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const res = await authService.login(data.email, data.password);

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      if (res.user?.role === "admin") {
        navigate("/product-details");
      } else {
        navigate("/view-product");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "414px",
        margin: "100px auto",
        padding: "2rem",
        borderRadius: "24px",
        border: "1px solid var(--Border-Primary, #E6E9F0)",
        background: "var(--BG-Primary, #FFF)",
      }}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <IconSignIn />
        </div>
        <Description className="mb-3">
          Enter your username and password correctly
        </Description>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form.Group className="mb-3">
          <StyledLabel>Username</StyledLabel>
          <StyledControl
            type="email"
            placeholder="Enter username"
            {...register("email")}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <StyledLabel>Password</StyledLabel>
          <PasswordWrapper>
            <StyledControl
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              {...register("password")}
              isInvalid={!!errors.password}
            />
            <EyeButton
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <EyeSlash size={20} weight="regular" />
              ) : (
                <Eye size={20} weight="regular" />
              )}
            </EyeButton>
          </PasswordWrapper>
          <Form.Control.Feedback type="invalid">
            {errors.password?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Button
          style={{
            borderRadius: "8px",
            background: "var(--Primary-Base, #FF7900)",
            border: "none",
            fontSize: "14px",
            fontWeight: "500",
            lineHeight: "150%",
          }}
          type="submit"
          className="w-100"
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner size="sm" animation="border" /> Loading...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </Form>
    </div>
  );
};

export default LoginPage;

const Description = styled.div`
  color: var(--Font-Secondary, #5b5d63);
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
`;
const StyledLabel = styled(Form.Label)`
  color: var(--Font-Primary, #050506);
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
`;

const StyledControl = styled(Form.Control)`
  color: var(--Font-Placeholder, #7a7c81);
  font-size: 14px;
  font-weight: 400;
  line-height: 15s0%;

  //   &:: placeholder {
  //     font-family: "Inter";
  //   }
`;
const PasswordWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const EyeButton = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--Font-Primary, #050506);
`;
