import api from './axios';

export interface Category {
  id: number;
  name: string;
}

export const getCategories = () =>
  api.get<{ status: boolean; message: string; data: Category[] }>('/api/categories');
