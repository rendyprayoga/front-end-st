import React from "react";

import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { IProduct } from "../../product/interface/products.interface";
import { Button, Col, Form, Row } from "react-bootstrap";
import styled from "styled-components";
import { DFlexJustifyEnd } from "../../../react-table/flex.styled";

function ProductsForm() {
  const validationsSchema = Yup.object().shape({
    title: Yup.string().required("title name is required"),
    description: Yup.string().required("title name is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IProduct>({
    resolver: yupResolver(validationsSchema) as any,
    defaultValues: { title: "", description: "", price: 10 },
  });

  const handleSubmitform = (valueForm: IProduct) => {
    console.log(valueForm);
    // addProduct(valueForm);
  };

  // const addProduct = async (product: IProduct) => {
  //   try {
  //     const request = await createProduct(product);
  //     callbackSubmit(request);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <>
      <Row>
        <Col md={4}>
          <div>image</div>
        </Col>
        <Col md={8}>
          <Form.Group
            onSubmit={handleSubmit(handleSubmitform)}
            className="mb-3"
          >
            <Form.Label>Title</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="enter title"
              {...register("title")}
              isInvalid={Boolean(errors?.title)}
            />
            <Form.Control.Feedback type="invalid">
              {errors?.title?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              required
              as="textarea"
              rows={3}
              {...register("description")}
              isInvalid={Boolean(errors?.description)}
            />
            <Form.Control.Feedback type="invalid">
              {errors?.description?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Price</Form.Label>
            <Form.Control
              required
              type="number"
              placeholder="enter number"
              {...register("price")}
              isInvalid={Boolean(errors?.price)}
            />
            <Form.Control.Feedback type="invalid">
              {errors?.price?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <DFlexJustifyEnd>
        <StyledButtonCancel>Batal</StyledButtonCancel>
        <StyledButton type="submit">Add New</StyledButton>
      </DFlexJustifyEnd>
    </>
  );
}

export default ProductsForm;

const StyledButton = styled(Button as any)`
  display: flex;
  height: 40px;
  padding: var(--Padding-p-0, 0) var(--Padding-p-12, 12px);
  justify-content: center;
  align-items: center;
  gap: var(--Gap-g-8, 8px);
  border-radius: 10px;

  background: var(--Border-Secondary, #c0c5cc);
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
  border: none;
  &:hover {
    background: var(--Border-Secondary, #c0c5cc);
  }
`;

const StyledButtonCancel = styled.button`
  display: flex;
  height: 40px;
  padding: var(--Padding-p-0, 0) var(--Padding-p-12, 12px);
  justify-content: center;
  align-items: center;
  gap: var(--Gap-g-8, 8px);
  color: var(--black);
  border-radius: 10px;
  border: 1px solid var(--Border-Primary, #e7eaf0);
  background: var(--Background-Primary, #fff);
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
`;
