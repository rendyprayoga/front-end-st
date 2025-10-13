export interface IManagementUser{
  id?: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  profile_picture?: string;  
  phone?: string; 
  created_at?: string;
  updated_at?: string;
}

export interface IManagementGetUser{
 skip?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}