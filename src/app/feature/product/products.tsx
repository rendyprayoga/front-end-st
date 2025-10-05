import axios, { AxiosResponse } from "axios";
import { IProduct } from "./interface/products.interface";
const API_BASE_URL = "https://dummyjson.com";

export const getProducts = async ({ params }: any): Promise<any> => {
  const queryString = new URLSearchParams(params).toString();
  const reponse: AxiosResponse<any> = await axios.get(
    `${API_BASE_URL}/products?${queryString}`
  );
  return reponse.data;
};

export const createProduct = async (product: any): Promise<any> => {
  const reponse: AxiosResponse<any> = await axios.post(
    `${API_BASE_URL}/products/add`,
    product
  );
  return reponse.data;
};
