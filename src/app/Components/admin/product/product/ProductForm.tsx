import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { IProduct } from "../interface/products.interface";
import { Button, Col, Form, Row, Image } from "react-bootstrap";
import styled from "styled-components";
import { createProduct, updateProduct } from "./productsAPI";
import { FlexRow } from "../../../../react-table/flex.styled";

interface Props {
  callbackSubmit: (value: any) => void;
  dataSelected?: IProduct;
  onCancel: () => void;
}

function ProductsForm({ callbackSubmit, dataSelected, onCancel }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  // Tentukan apakah ini mode edit
  const isEditMode = !!dataSelected?.id;

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
    setValue,
    formState: { errors },
  } = useForm<IProduct>({
    resolver: yupResolver(validationsSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      category: "",
      status: "active",
      image_url: "",
      price: 0,
      stock: 0,
    },
  });

  useEffect(() => {
    if (dataSelected) {
      reset(dataSelected);
      if (dataSelected.image_url) {
        setImagePreview(`http://localhost:8000${dataSelected.image_url}`);
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

  const removeProductImage = () => {
    setValue("image_url", "");
    setImagePreview("");
    setSelectedFile(null);
  };

  const handleSubmitForm = async (valueForm: IProduct) => {
    try {
      setIsUploading(true);

      // If there's a new file selected, upload it first
      if (selectedFile) {
        const imageUrl = await uploadImage(selectedFile);
        valueForm.image_url = imageUrl;
      }

      await saveProduct(valueForm);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsUploading(false);
    }
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
    <StyledForm onSubmit={handleSubmit(handleSubmitForm)}>
      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label className="font-size-14">Product Image</Form.Label>

            <div className="d-flex flex-column align-items-center">
              {/* Kotak Preview */}
              <div
                style={{
                  width: "100%",
                  height: "200px",
                  background: "#F8F9FA",
                  border: "1px dashed #D0D3D8",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
                onClick={() => document.getElementById("uploadInput")?.click()}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div className="text-muted d-flex flex-column align-items-center">
                    <i className="bi bi-image" style={{ fontSize: "40px" }}></i>
                    <small>Belum ada gambar</small>
                  </div>
                )}
              </div>

              {/* Input File Hidden */}
              <input
                id="uploadInput"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />

              <Button
                className="mt-3"
                variant="outline-secondary"
                onClick={() => document.getElementById("uploadInput")?.click()}
                disabled={isUploading}
              >
                Unggah Gambar
              </Button>

              {imagePreview && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="mt-2"
                  onClick={removeProductImage}
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
        </Col>

        {/* Name */}
        <Col md={8}>
          <Form.Group className="mb-3">
            <Form.Label className="font-size-14">Product Name</Form.Label>
            <Form.Control
              {...register("name")}
              isInvalid={Boolean(errors?.name)}
              className="border-radius-5 p-6 height-40px"
              placeholder="Enter Product Name"
              disabled={isUploading}
            />
            <Form.Control.Feedback type="invalid">
              {errors?.name?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="font-size-14">Description</Form.Label>
            <Form.Control
              {...register("description")}
              isInvalid={Boolean(errors?.description)}
              className="border-radius-5 p-6"
              placeholder="Enter Description"
              as="textarea"
              rows={4}
              disabled={isUploading}
            />
            <Form.Control.Feedback type="invalid">
              {errors?.description?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="font-size-14">Category</Form.Label>
                <Form.Control
                  {...register("category")}
                  isInvalid={Boolean(errors?.category)}
                  className="border-radius-5 p-6 height-40px"
                  placeholder="Enter Category"
                  disabled={isUploading}
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
                  disabled={isUploading}
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
                  disabled={isUploading}
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
                  disabled={isUploading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors?.stock?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Submit */}

      <FlexRow className="d-flex justify-content-end align-items-center gap-2">
        <StyledButtonCancel onClick={onCancel}>cancel</StyledButtonCancel>
        {/* <StyledButtonCancel type="button" onClick={onCancel}>
          Cancel
        </StyledButtonCancel> */}
        <StyledButton type="submit" disabled={isUploading}>
          {isUploading
            ? "Uploading..."
            : dataSelected?.id
            ? "Update"
            : "Tambah"}
        </StyledButton>
      </FlexRow>
    </StyledForm>
  );
}

export default ProductsForm;

const StyledForm = styled(Form)`
  .form-label {
    font-weight: 500;
    margin-bottom: 6px;
  }

  .form-control,
  .form-select {
    border-radius: 8px;
    font-size: 14px;
  }

  .mb-3 {
    margin-bottom: 1.25rem !important;
  }

  button[type="submit"] {
    margin-top: 1.5rem;
    padding: 0.6rem 1.5rem;
    font-weight: 500;
  }
`;
const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 16px;

  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  border-radius: 0.66667rem;
  background: var(--Border-Secondary, #c0c5cc);
  border: 1px solid #d0d3d8;
  color: white;
  margin-bottom: 10px;
  cursor: pointer;
`;

const StyledButtonCancel = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  background: #fff;
  border: 1px solid #d0d3d8;
  color: #555;
  cursor: pointer;
`;
