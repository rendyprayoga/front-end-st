export interface IManagementUser{
id?:number;
name: string;
phone: number;
date:Date | string;
status: boolean
}

export interface IManagementGetUser{
skip:number;
limit:number;
 sortBy?: string; 
  order?: "asc" | "desc";
}