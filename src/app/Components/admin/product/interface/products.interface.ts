export interface IProduct {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  status: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface IParamsGetProduct {
  skip?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}
