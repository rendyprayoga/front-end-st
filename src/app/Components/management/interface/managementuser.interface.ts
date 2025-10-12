export interface IManagementUser{
  id?: string;
  email: string;
  full_name: string;
  role: string;
  is_active: string;
  created_at?: string;
  updated_at?: string;
}

export interface IManagementGetUser{
 skip?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}