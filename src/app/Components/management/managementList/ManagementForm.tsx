import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button, Col, Form, Row, Image } from "react-bootstrap";
import styled from "styled-components";

import { IManagementUser } from "../interface/managementuser.interface";
import { createUsers, updateUsers } from "../managementAPI";

interface Props {
  callbackSubmit: (value: any) => void;
  dataSelected?: IManagementUser;
  isEdit?: boolean;
}

interface IManagementUserForm extends IManagementUser {
  password?: string;
  confirmPassword?: string;
}

function ManagementForm({ callbackSubmit, dataSelected }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  // Tentukan apakah ini mode edit
  const isEditMode = !!dataSelected?.id;

  const validationsSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email must be valid")
      .required("Email is required"),
    full_name: Yup.string().required("Full name is required"),
    role: Yup.string().required("Role is required"),
    phone: Yup.string()
      .matches(/^[0-9+\-\s()]*$/, "Phone number is not valid")
      .min(8, "Phone number must be at least 8 characters")
      .max(15, "Phone number too long"),
    is_active: Yup.boolean().required("Status is required"),
    password: Yup.string().test(
      "password-conditional",
      "Password must be at least 6 characters",
      function (value) {
        if (isEditMode && value && value !== "") {
          return value.length >= 6;
        }
        if (!isEditMode) {
          return !!(value && value.trim() && value.length >= 6);
        }
        return true;
      }
    ),
    confirmPassword: Yup.string().test(
      "confirmPassword-conditional",
      "Passwords must match",
      function (value) {
        const { password } = this.parent;

        if (password && password !== "") {
          return value === password;
        }

        if (isEditMode && (!password || password === "")) {
          return true;
        }

        return true;
      }
    ),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IManagementUserForm>({
    resolver: yupResolver(validationsSchema) as any,
    defaultValues: {
      email: "",
      full_name: "",
      role: "",
      is_active: true,
      profile_picture: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const profilePicture = watch("profile_picture");
  const passwordValue = watch("password");

  useEffect(() => {
    if (dataSelected) {
      const resetData = {
        ...dataSelected,
        password: "",
        confirmPassword: "",
      };
      reset(resetData);
      if (dataSelected.profile_picture) {
        setImagePreview(`http://localhost:8000${dataSelected.profile_picture}`);
      }
    }
  }, [dataSelected, reset]);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPG, JPEG, and PNG files are allowed");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image function
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/upload/image",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.image_url;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleSubmitForm = async (valueForm: IManagementUserForm) => {
    try {
      setIsUploading(true);

      // If there's a new file selected, upload it first
      if (selectedFile) {
        const imageUrl = await uploadImage(selectedFile);
        valueForm.profile_picture = imageUrl;
      }

      // Hapus confirmPassword sebelum mengirim data
      const { confirmPassword, ...userData } = valueForm;

      // Jika edit user dan password kosong, hapus field password
      if (isEditMode && (!userData.password || userData.password === "")) {
        delete userData.password;
      }

      await saveUser(userData as IManagementUser);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const saveUser = async (user: IManagementUser) => {
    try {
      const request = user?.id
        ? await updateUsers(user.id, user)
        : await createUsers(user);

      const currentUserStr = localStorage.getItem("user");
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        if (currentUser.id === user.id) {
          const updatedUser = { ...currentUser, ...user };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }

      callbackSubmit(request);
    } catch (error) {
      console.log(error);
    }
  };

  const removeProfilePicture = () => {
    setValue("profile_picture", "");
    setImagePreview("");
    setSelectedFile(null);
  };

  return (
    <Form onSubmit={handleSubmit(handleSubmitForm)}>
      {/* Profile Picture Upload */}
      <Form.Group className="mb-3">
        <Form.Label className="font-size-14">Profile Picture</Form.Label>

        <div className="d-flex flex-column align-items-center">
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
              cursor: "pointer",
            }}
            onClick={() =>
              document.getElementById("uploadProfileInput")?.click()
            }
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile Preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div className="text-muted d-flex flex-column align-items-center">
                <i
                  className="bi bi-person-circle"
                  style={{ fontSize: "48px" }}
                ></i>
                <small>Pilih Foto</small>
              </div>
            )}
          </div>

          <input
            id="uploadProfileInput"
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileSelect}
            style={{ display: "none" }}
            disabled={isUploading}
          />

          <Button
            className="mt-3"
            variant="outline-secondary"
            onClick={() =>
              document.getElementById("uploadProfileInput")?.click()
            }
            disabled={isUploading}
          >
            Unggah Gambar
          </Button>

          {imagePreview && (
            <Button
              variant="outline-danger"
              size="sm"
              className="mt-2"
              onClick={removeProfilePicture}
              disabled={isUploading}
            >
              Hapus Gambar
            </Button>
          )}
        </div>

        <Form.Text className="text-muted">
          Upload JPG, JPEG, atau PNG (max 5MB)
        </Form.Text>
      </Form.Group>

      {/* Email */}
      <Form.Group className="mb-3">
        <Form.Label className="font-size-14">Email</Form.Label>
        <Form.Control
          {...register("email")}
          isInvalid={Boolean(errors?.email)}
          className="border-radius-5 p-6 height-40px"
          placeholder="Enter Email"
          type="email"
          disabled={isUploading}
        />
        <Form.Control.Feedback type="invalid">
          {errors?.email?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* Full Name */}
      <Form.Group className="mb-3">
        <Form.Label className="font-size-14">Nama User</Form.Label>
        <Form.Control
          {...register("full_name")}
          isInvalid={Boolean(errors?.full_name)}
          className="border-radius-5 p-6 height-40px"
          placeholder="Enter Full Name"
          disabled={isUploading}
        />
        <Form.Control.Feedback type="invalid">
          {errors?.full_name?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* Password & Confirm Password */}
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="font-size-14">
              Password {!isEditMode && <span className="text-danger">*</span>}
            </Form.Label>
            <Form.Control
              {...register("password")}
              isInvalid={Boolean(errors?.password)}
              className="border-radius-5 p-6 height-40px"
              placeholder={
                isEditMode ? "Enter new password (optional)" : "Enter Password"
              }
              type="password"
              disabled={isUploading}
            />
            <Form.Control.Feedback type="invalid">
              {errors?.password?.message}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              {isEditMode
                ? "Leave blank to keep current password"
                : "Minimum 6 characters"}
            </Form.Text>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="font-size-14">
              Confirm Password{" "}
              {!isEditMode && <span className="text-danger">*</span>}
            </Form.Label>
            <Form.Control
              {...register("confirmPassword")}
              isInvalid={Boolean(errors?.confirmPassword)}
              className="border-radius-5 p-6 height-40px"
              placeholder={
                isEditMode
                  ? "Confirm new password (optional)"
                  : "Confirm Password"
              }
              type="password"
              disabled={isUploading || (isEditMode && !passwordValue)}
            />
            <Form.Control.Feedback type="invalid">
              {errors?.confirmPassword?.message}
            </Form.Control.Feedback>
            {isEditMode && !passwordValue && (
              <Form.Text className="text-muted">
                Confirm password is optional when password is empty
              </Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>

      {/* Role & Status */}
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="font-size-14">Role</Form.Label>
            <Form.Select
              {...register("role")}
              isInvalid={Boolean(errors?.role)}
              className="border-radius-5 p-6 height-40px"
              disabled={isUploading}
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors?.role?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="font-size-14">Phone Number</Form.Label>
            <Form.Control
              {...register("phone")}
              isInvalid={Boolean(errors?.phone)}
              className="border-radius-5 p-6 height-40px"
              placeholder="Enter Phone Number"
              disabled={isUploading}
            />
            <Form.Control.Feedback type="invalid">
              {errors?.phone?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="font-size-14">Status</Form.Label>
            <Form.Select
              {...register("is_active")}
              isInvalid={Boolean(errors?.is_active)}
              className="border-radius-5 p-6 height-40px"
              disabled={isUploading}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors?.is_active?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      {/* Submit */}
      <Button type="submit" disabled={isUploading}>
        {isUploading ? "Uploading..." : isEditMode ? "Update" : "Add New"} User
      </Button>
    </Form>
  );
}

export default ManagementForm;
/* Styled Buttons (tidak diubah) */
const StyledButton = styled(Button as any)`
  display: flex;
  height: 40px;
  padding: 0 12px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  background: #c0c5cc;
  font-size: 14px;
  font-weight: 500;
  border: none;
  &:hover {
    background: #b1b6bd;
  }
`;

const StyledButtonCancel = styled.button`
  display: flex;
  height: 40px;
  padding: 0 12px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  color: var(--black);
  border-radius: 10px;
  border: 1px solid #e7eaf0;
  background: #fff;
  font-size: 14px;
  font-weight: 500;
  line-height: 140%;
`;
