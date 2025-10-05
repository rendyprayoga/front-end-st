import React from "react";

import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { IProduct } from "../../product/interface/products.interface";
import { Button, Form } from "react-bootstrap";

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
      <Form.Group onSubmit={handleSubmit(handleSubmitform)} className="mb-3">
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
      <Button variant="primary" type="submit">
        Add New
      </Button>
    </>
  );
}

export default ProductsForm;
