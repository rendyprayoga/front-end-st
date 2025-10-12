import axios, { AxiosResponse } from "axios";
import { IManagementUser, IManagementGetUser } from "./interface/managementuser.interface";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1/users";

// --- CREATE PRODUCT ---
export const createUsers = async (product: IManagementUser): Promise<IManagementUser> => {
  const response: AxiosResponse<IManagementUser> = await axios.post(
    `${API_BASE_URL}`,
    product
  );
  return response.data;
};


export const getUsers = async (params?: IManagementGetUser): Promise<IManagementUser[]> => {
  const response: AxiosResponse<IManagementUser[]> = await axios.get(
    `${API_BASE_URL}`,
    { params } 
  );
  return response.data;
};

// --- READ BY ID ---
export const getUsersById = async (id: string): Promise<IManagementUser> => {
  const response: AxiosResponse<IManagementUser> = await axios.get(
    `${API_BASE_URL}/${id}`
  );
  return response.data;
};

// --- UPDATE PRODUCT ---
export const updateUsers = async (
  id: string,
  product: IManagementUser
): Promise<IManagementUser> => {
  const response: AxiosResponse<IManagementUser> = await axios.put(
    `${API_BASE_URL}/${id}`,
    product
  );
  return response.data;
};

// --- DELETE PRODUCT ---
export const deleteUsers = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};
