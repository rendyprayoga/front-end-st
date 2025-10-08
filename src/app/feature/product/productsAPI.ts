import axios, { AxiosResponse } from "axios";
import { IProduct } from "./interface/products.interface";

const API_BASE_URL = "https://dummyjson.com";

export const createProduct = async (product: IProduct): Promise<IProduct> => {
  const response: AxiosResponse<IProduct> = await axios.post(
    `${API_BASE_URL}/products/add`,
    product
  );
  return response.data;
};

// --- READ ALL ---
export const getProducts = async ({ params }: any): Promise<IProduct[]> => {
  const queryString = new URLSearchParams(params).toString();
  const response: AxiosResponse<IProduct[]> = await axios.get(
    `${API_BASE_URL}/products?${queryString}`
  );

  return response.data;
};

// --- READ BY ID ---
export const getProductById = async (id: string): Promise<IProduct> => {
  const response: AxiosResponse<IProduct> = await axios.get(
    `${API_BASE_URL}/products/${id}`
  );
  return response.data;
};

// --- UPDATE ---
export const updateProduct = async (
  id: number,
  product: IProduct
): Promise<IProduct> => {
  const response: AxiosResponse<IProduct> = await axios.put(
    `${API_BASE_URL}/products/${id}`,
    product
  );
  return response.data;
};

// --- DELETE ---
export const deleteProduct = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/products/${id}`);
};
