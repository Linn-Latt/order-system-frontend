import { createRouter, createWebHistory } from 'vue-router';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import Dashboard from '../pages/Dashboard.vue';
import { useAuthStore } from '../stores/auth';

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Redirect authenticated users away from login page
router.beforeEach((to, _from, next) => {
  const auth = useAuthStore();
  if ((to.path === '/login' || to.path === '/register') && auth.isAuthenticated) {
    return next('/dashboard');
  }
  return next();
});

export default router
