import api from './axios';

export interface Product {
  id: number;
  category_id: number;
  name: string;
  image: string;
  price: string;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  status: boolean;
  message: string;
  data: Product[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  }
}

export const getProducts = (page = 1, category_id?: number | null, search?: string) =>
  api.get<ProductsResponse>('/api/products', {
    params: {
      page,
      ...(category_id != null && { category_id }),
      ...(search?.trim() && { search: search.trim() }),
    },
  })
