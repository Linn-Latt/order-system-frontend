import axios, { type AxiosInstance } from 'axios';
import { useAuthStore } from '../stores/auth';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – router is a plain JS module without type declarations
import router from '../router';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

// Restore token on page reload
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('auth_user');
      const auth = useAuthStore();
      auth.logout();
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default api
