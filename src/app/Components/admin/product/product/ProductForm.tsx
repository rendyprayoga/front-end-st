import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { IProduct } from "../interface/products.interface";
import { Button, Col, Form, Row, Image, Card } from "react-bootstrap";
import styled from "styled-components";
import { createProduct, updateProduct } from "./productsAPI";
import { FlexRow } from "../../../../react-table/flex.styled";
import { UploadSimple } from "phosphor-react";

interface Props {
  callbackSubmit: (value: any) => void;
  dataSelected?: IProduct;
  onCancel: () => void;
}

function ProductsForm({ callbackSubmit, dataSelected, onCancel }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isActive, setIsActive] = useState(true);

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
    watch,
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

  const statusvalue = watch("status");

  useEffect(() => {
    if (dataSelected) {
      reset(dataSelected);
      if (dataSelected.image_url) {
        setImagePreview(`http://localhost:8000${dataSelected.image_url}`);
      }

      setIsActive(dataSelected.status === "active");
    }
  }, [dataSelected, reset]);

  const handleStatusToggle = (checked: boolean) => {
    setIsActive(checked);
    setValue("status", checked ? "active" : "inactive");
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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
            <div className="d-flex flex-column align-items-center">
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

              <input
                id="uploadInput"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />

              <StyledButtonUpload
                className="mt-3 w-100 gap-2"
                onClick={() => document.getElementById("uploadInput")?.click()}
                disabled={isUploading}
              >
                <UploadSimple size={18} /> Unggah Gambar
              </StyledButtonUpload>

              {imagePreview && (
                <StyledButtonUpload
                  className="mt-2"
                  onClick={removeProductImage}
                  disabled={isUploading}
                >
                  Hapus Gambar
                </StyledButtonUpload>
              )}
            </div>
          </Form.Group>
        </Col>

        <Col md={8}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <StyledTitle>
                  Nama Produk{" "}
                  <span style={{ color: "var(--State-Danger-Base, #EB2F2F)" }}>
                    *
                  </span>
                </StyledTitle>
                <Form.Control
                  {...register("name")}
                  isInvalid={Boolean(errors?.name)}
                  className="border-radius-5 p-6 height-40px"
                  placeholder="Masukan nama produk"
                  disabled={isUploading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors?.name?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <StyledTitle>
                  Kategori Produk{" "}
                  <span style={{ color: "var(--State-Danger-Base, #EB2F2F)" }}>
                    *
                  </span>
                </StyledTitle>
                <Form.Select
                  {...register("category")}
                  isInvalid={Boolean(errors?.category)}
                  className="border-radius-5 p-6 height-40px"
                  disabled={isUploading}
                >
                  <option value="">Pilih kategori</option>
                  <option value="Smartphone">Smartphone</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Alat Tulis">Alat Tulis</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors?.category?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* Deskripsi Produk */}
          <div className="mb-3">
            <StyledTitle>Deskripsi Produk</StyledTitle>
            <Form.Group>
              <Form.Control
                {...register("description")}
                isInvalid={Boolean(errors?.description)}
                className="border-radius-5 p-6"
                placeholder="Masukan deskripsi produk"
                as="textarea"
                rows={4}
                disabled={isUploading}
              />
              <Form.Control.Feedback type="invalid">
                {errors?.description?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          <Row>
            <Col md={6}>
              <StyledTitle>
                Harga Satuan{" "}
                <span style={{ color: "var(--State-Danger-Base, #EB2F2F)" }}>
                  *
                </span>
              </StyledTitle>
              <Form.Group className="mb-3">
                <div className="input-group">
                  <span className="input-group-text">Rp</span>
                  <Form.Control
                    {...register("price")}
                    type="number"
                    isInvalid={Boolean(errors?.price)}
                    className="border-radius-5 p-6 height-40px"
                    placeholder="0"
                    disabled={isUploading}
                  />
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors?.price?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <StyledTitle>
                Stok Awal{" "}
                <span style={{ color: "var(--State-Danger-Base, #EB2F2F)" }}>
                  *
                </span>
              </StyledTitle>
              <Form.Group className="mb-3">
                <div className="input-group">
                  <Form.Control
                    {...register("stock")}
                    type="number"
                    isInvalid={Boolean(errors?.stock)}
                    className="border-radius-5 p-6 height-40px"
                    placeholder="0"
                    disabled={isUploading}
                  />
                  <span className="input-group-text">Unit</span>
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors?.stock?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* Status Produk */}
          <div className="mb-3">
            <StyledTitle className="">Status Produk</StyledTitle>
            <Card className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex flex-column">
                  <Description>
                    Sistem akan menandai produk sebagai "Menipis" secara
                    otomatis jika stoknya mendekati habis.
                  </Description>
                </div>
                <div className="d-flex align-items-center">
                  <StyledTitle
                    htmlFor="status-switch"
                    className="me-2 mb-0 cursor-pointer"
                    style={{ cursor: "pointer", fontWeight: "400" }}
                  >
                    {isActive ? "Aktif" : "Nonaktif"}
                  </StyledTitle>

                  <SwitchContainer>
                    <SwitchInput
                      type="checkbox"
                      id="status-switch"
                      checked={isActive}
                      onChange={(e) => handleStatusToggle(e.target.checked)}
                      disabled={isUploading}
                    />
                    <SwitchSlider className="slider round" />
                  </SwitchContainer>
                </div>

                <input
                  type="hidden"
                  {...register("status")}
                  value={isActive ? "active" : "inactive"}
                />
              </div>
            </Card>
          </div>
        </Col>
      </Row>

      {/* Tombol Aksi */}
      <div className="mt-4 d-flex justify-content-end gap-2">
        <StyledButtonCancel onClick={onCancel} type="button">
          Cancel
        </StyledButtonCancel>
        <StyledButton type="submit" disabled={isUploading}>
          {isUploading
            ? "Uploading..."
            : dataSelected?.id
            ? "Update"
            : "Tambah"}
        </StyledButton>
      </div>
    </StyledForm>
  );
}

export default ProductsForm;
const StyledButtonUpload = styled.button`
  color: var(--Font-Primary, #020c1f);
  height: 40px;
  font-size: 0.93333rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.33333rem;

  display: flex;
  align-items: center;
  justify-content: center;

  line-height: 1;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #d0d3d8;

  cursor: pointer;
`;

const Description = styled.div`
  color: var(--Font-Secondary, #5d6471);

  font-size: 0.8rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.2rem;
`;

const StyledTitle = styled(Form.Label)`
  color: var(--Font-Primary, #020c1f);
  font-size: 0.93333rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.33333rem;
`;

const FlexRoww = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
`;
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
  border-radius: 8px;
  background: var(--Border-Secondary, #c0c5cc);
  border: 1px solid #d0d3d8;
  color: white;
  cursor: pointer;
`;

const StyledButtonCancel = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #d0d3d8;
  color: #555;
  cursor: pointer;
`;

const SwitchContainer = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + .slider {
    background-color: #ff7900;
  }

  &:checked + .slider:before {
    transform: translateX(26px);
  }

  &:disabled + .slider {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SwitchSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }

  &.round {
    border-radius: 34px;
  }

  &.round:before {
    border-radius: 50%;
  }
`;
