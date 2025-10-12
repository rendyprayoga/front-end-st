import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button, Col, Form, Row } from "react-bootstrap";
import styled from "styled-components";

import { IManagementUser } from "../interface/managementuser.interface";
import { createUsers, updateUsers } from "../managementAPI";

interface Props {
  callbackSubmit: (value: any) => void;
  dataSelected?: IManagementUser;
}

function ManagementForm({ callbackSubmit, dataSelected }: Props) {
  const validationsSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email must be valid")
      .required("Email is required"),
    full_name: Yup.string().required("Full name is required"),
    role: Yup.string().required("Role is required"),

    is_active: Yup.string().required("Status is required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IManagementUser>({
    resolver: yupResolver(validationsSchema) as any,
    defaultValues: {
      email: "",
      full_name: "",
      role: "",
      is_active: "true",
    },
  });

  useEffect(() => {
    if (dataSelected) reset(dataSelected);
  }, [dataSelected]);

  const handleSubmitForm = (valueForm: IManagementUser) => {
    console.log(valueForm);
    saveUser(valueForm);
  };

  const saveUser = async (user: IManagementUser) => {
    try {
      const request = user?.id
        ? await updateUsers(user.id, user)
        : await createUsers(user);
      callbackSubmit(request);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form onSubmit={handleSubmit(handleSubmitForm)}>
      {/* Email */}
      <Form.Group className="mb-3">
        <Form.Label className="font-size-14">Email</Form.Label>
        <Form.Control
          {...register("email")}
          isInvalid={Boolean(errors?.email)}
          className="border-radius-5 p-6 height-40px"
          placeholder="Enter Email"
          type="email"
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
        />
        <Form.Control.Feedback type="invalid">
          {errors?.full_name?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* Role & Status (Rapi - Sejajar) */}
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="font-size-14">Role</Form.Label>
            <Form.Control
              {...register("role")}
              isInvalid={Boolean(errors?.role)}
              className="border-radius-5 p-6 height-40px"
              placeholder="Enter Role"
            />
            <Form.Control.Feedback type="invalid">
              {errors?.role?.message}
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
      <Button type="submit">
        {dataSelected?.id ? "Update" : "Add New"} User
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
