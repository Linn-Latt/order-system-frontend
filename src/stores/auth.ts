import { defineStore } from 'pinia';

const STORAGE_KEY = 'auth_user';

interface AuthUser {
  userName: string;
  userEmail: string;
  userRole: string;
  cartCount?: number;
}

function loadUser(): AuthUser {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : { userName: '', userEmail: '', userRole: '', cartCount: 0 };
    return {
      userName: parsed.userName ?? '',
      userEmail: parsed.userEmail ?? '',
      userRole: parsed.userRole ?? '',
      cartCount: parsed.cartCount ?? 0,
    };
  } catch {
    return { userName: '', userEmail: '', userRole: '', cartCount: 0 };
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: !!localStorage.getItem('token'),
    userName: loadUser().userName,
    userEmail: loadUser().userEmail,
    userRole: loadUser().userRole,
    cartCount: loadUser().cartCount ?? 0,
  }),
  actions: {
    login(name = '', role = '', email = '') {
      this.isAuthenticated = true;
      this.userName = name;
      this.userEmail = email;
      this.userRole = role;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        userName: name,
        userEmail: email,
        userRole: role,
        cartCount: this.cartCount,
      }));
    },
    logout() {
      this.isAuthenticated = false;
      this.userName = '';
      this.userEmail = '';
      this.userRole = '';
      this.cartCount = 0;
      localStorage.removeItem(STORAGE_KEY);
    },
    addToCart() {
      this.cartCount++;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        userName: this.userName,
        userEmail: this.userEmail,
        userRole: this.userRole,
        cartCount: this.cartCount,
      }));
    },
  },
});
