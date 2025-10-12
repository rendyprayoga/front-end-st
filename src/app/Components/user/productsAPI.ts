import axios, { AxiosResponse } from "axios";
import { IParamsGetProduct, IProduct } from "./interface/products.interface";


const API_BASE_URL = "http://127.0.0.1:8000/api/v1/products";

// --- CREATE PRODUCT ---
// --- READ ALL PRODUCTS ---
export const getProducts = async (params?: IParamsGetProduct): Promise<IProduct[]> => {
  const response: AxiosResponse<IProduct[]> = await axios.get(
    `${API_BASE_URL}`,
    { params } 
  );
  return response.data;
};

