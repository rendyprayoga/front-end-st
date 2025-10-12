import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { IProduct } from "../interface/products.interface";
import { Button, Col, Form, Row } from "react-bootstrap";
import styled from "styled-components";
import { createProduct, updateProduct } from "./productsAPI";

interface Props {
  callbackSubmit: (value: any) => void;
  dataSelected?: IProduct;
}

function ProductsForm({ callbackSubmit, dataSelected }: Props) {
  const validationsSchema = Yup.object().shape({
    name: Yup.string().required("Product name is required"),
    description: Yup.string().required("Description is required"),
    category: Yup.string().required("Category is required"),
    status: Yup.string().required("Status is required"),
    price: Yup.number().min(1, "Price must be at least 1").required(),
    stock: Yup.number().min(0, "Stock must be 0 or greater").required(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IProduct>({
    resolver: yupResolver(validationsSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      category: "",
      status: "active",
      price: 0,
      stock: 0,
    },
  });

  useEffect(() => {
    if (dataSelected) reset(dataSelected);
  }, [dataSelected]);

  const handleSubmitForm = (valueForm: IProduct) => {
    console.log(valueForm);
    saveProduct(valueForm);
  };

  const saveProduct = async (product: IProduct) => {
    try {
      const request = product?.id
        ? await updateProduct(product.id, product)
        : await createProduct(product);
      callbackSubmit(request);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form onSubmit={handleSubmit(handleSubmitForm)}>
      {/* Name */}
      <Form.Group className="mb-3">
        <Form.Label className="font-size-14">Product Name</Form.Label>
        <Form.Control
          {...register("name")}
          isInvalid={Boolean(errors?.name)}
          className="border-radius-5 p-6 height-40px"
          placeholder="Enter Product Name"
        />
        <Form.Control.Feedback type="invalid">
          {errors?.name?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* Description */}
      <Form.Group className="mb-3">
        <Form.Label className="font-size-14">Description</Form.Label>
        <Form.Control
          {...register("description")}
          isInvalid={Boolean(errors?.description)}
          className="border-radius-5 p-6"
          placeholder="Enter Description"
          as="textarea"
          rows={4}
        />
        <Form.Control.Feedback type="invalid">
          {errors?.description?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* Category & Status (Rapi - Sejajar) */}
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="font-size-14">Category</Form.Label>
            <Form.Control
              {...register("category")}
              isInvalid={Boolean(errors?.category)}
              className="border-radius-5 p-6 height-40px"
              placeholder="Enter Category"
            />
            <Form.Control.Feedback type="invalid">
              {errors?.category?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="font-size-14">Status</Form.Label>
            <Form.Select
              {...register("status")}
              isInvalid={Boolean(errors?.status)}
              className="border-radius-5 p-6 height-40px"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors?.status?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      {/* Price & Stock (Rapi) */}
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="font-size-14">Price</Form.Label>
            <Form.Control
              {...register("price")}
              type="number"
              isInvalid={Boolean(errors?.price)}
              className="border-radius-5 p-6 height-40px"
              placeholder="Enter Price"
            />
            <Form.Control.Feedback type="invalid">
              {errors?.price?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="font-size-14">Stock</Form.Label>
            <Form.Control
              {...register("stock")}
              type="number"
              isInvalid={Boolean(errors?.stock)}
              className="border-radius-5 p-6 height-40px"
              placeholder="Enter Stock"
            />
            <Form.Control.Feedback type="invalid">
              {errors?.stock?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      {/* Submit */}
      <Button type="submit">
        {dataSelected?.id ? "Update" : "Add New"} Product
      </Button>
    </Form>
  );
}

export default ProductsForm;

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
