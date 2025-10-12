import axios, { AxiosResponse } from "axios";
import { IProduct, IParamsGetProduct } from "../interface/products.interface";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1/products";

// --- CREATE PRODUCT ---
export const createProduct = async (product: IProduct): Promise<IProduct> => {
  const response: AxiosResponse<IProduct> = await axios.post(
    `${API_BASE_URL}`,
    product
  );
  return response.data;
};

// --- READ ALL PRODUCTS ---
export const getProducts = async (params?: IParamsGetProduct): Promise<IProduct[]> => {
  const response: AxiosResponse<IProduct[]> = await axios.get(
    `${API_BASE_URL}`,
    { params } // ✅ langsung kirim params ke axios, otomatis jadi query
  );
  return response.data;
};

// --- READ BY ID ---
export const getProductById = async (id: string): Promise<IProduct> => {
  const response: AxiosResponse<IProduct> = await axios.get(
    `${API_BASE_URL}/${id}`
  );
  return response.data;
};

// --- UPDATE PRODUCT ---
export const updateProduct = async (
  id: string,
  product: IProduct
): Promise<IProduct> => {
  const response: AxiosResponse<IProduct> = await axios.put(
    `${API_BASE_URL}/${id}`,
    product
  );
  return response.data;
};

// --- DELETE PRODUCT ---
export const deleteProduct = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};
