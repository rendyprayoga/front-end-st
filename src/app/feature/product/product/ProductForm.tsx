import React, { useEffect } from "react";

import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { IProduct } from "../interface/products.interface";
import { Button, Col, Form, Row } from "react-bootstrap";
import styled from "styled-components";
import { DFlexJustifyEnd } from "../../../react-table/flex.styled";
import { createProduct, updateProduct } from "./productsAPI";

interface Props {
  callbackSubmit: (value: any) => void;
  dataSelected?: IProduct;
}
function ProductsForm({ callbackSubmit, dataSelected }: Props) {
  const validationsSchema = Yup.object().shape({
    title: Yup.string().required("title name is required"),
    description: Yup.string().required("title name is required"),
    price: Yup.number().min(1),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IProduct>({
    resolver: yupResolver(validationsSchema) as any,
    defaultValues: { title: "", description: "", price: 10 },
  });

  useEffect(() => {
    if (dataSelected) reset(dataSelected);
  }, [dataSelected]);

  const handleSubmitform = (valueForm: IProduct) => {
    console.log(valueForm);
    addProduct(valueForm);
  };

  const addProduct = async (product: IProduct) => {
    try {
      const request = product?.id
        ? await updateProduct(Number(product?.id), product)
        : await createProduct(product);
      callbackSubmit(request);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit(handleSubmitform)}>
        <Form.Group className="mb-3">
          <Form.Label className="font-size-14">Title</Form.Label>
          <Form.Control
            {...register("title")}
            isInvalid={Boolean(errors?.title)}
            className="border-radius-5 p-6 height-40px"
            placeholder="Enter Title"
          />
          <Form.Control.Feedback type="invalid">
            {errors?.title?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="font-size-14">Description</Form.Label>
          <Form.Control
            {...register("description")}
            isInvalid={Boolean(errors?.description)}
            className="border-radius-5 p-6 height-40px"
            placeholder="Enter Description"
            as={"textarea"}
            rows={4}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.description?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="font-size-14">Price</Form.Label>
          <Form.Control
            {...register("price")}
            type="number"
            isInvalid={Boolean(errors?.price)}
            className="border-radius-5 p-6 height-40px"
            placeholder="Enter Pice"
          />
          <Form.Control.Feedback type="invalid">
            {errors?.price?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Button type="submit">
          {dataSelected?.id ? "Update" : "Add New "} Product
        </Button>
      </Form>
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
