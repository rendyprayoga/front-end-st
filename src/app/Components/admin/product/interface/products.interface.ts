export interface IProduct{
id?:number;
title: string;
description: string;
price:number;
}

export interface IParamsGetProduct{
skip:number;
limit:number;
 sortBy?: string; 
  order?: "asc" | "desc";
}