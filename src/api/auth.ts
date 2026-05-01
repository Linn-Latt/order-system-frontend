import api from './axios'

export const login = (data: { email: string; password: string }) =>
  api.post('/api/login', data);

export const logout = () =>
  api.post('/api/logout');

export const register = (data: { name: string; email: string; password: string; password_confirmation: string }) =>
  api.post('/api/register', data);
