# Order System — Frontend
A Vue 3 single-page application for browsing products and placing orders. 
It communicates with a Laravel backend REST API.

---

## Tech Stack
Vue 3 (version 3.5.32)
Language TypeScript (version 6.0.2)
Vite (version 8.0.10)
Vue Router (version 5.0.6)
State management (Pinia - version 3.0.4)
HTTP client (Axios - version 1.15.2)
UI components (PrimeVue 4 - Aura theme)
Icons (lucide-vue-next)
Tailwind CSS 3 + PostCSS (version 3.4.19)

---

## Requirements
Make sure the following are installed before you begin:
- **Node.js** v18 or later 
- **npm** v9 or later (bundled with Node)
- The **backend API** running and accessible (checck backend repo for setup)

---

## Setup Guide

### 1. Clone the repository
```bash
git clone <repository-url>
cd order-system-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the project root (copy from the example below). 
This file is not committed to version control.

```env
VITE_API_BASE_URL="http://order-system-api.test"
```

Change the URL to match wherever your backend API is running. 
The Axios instance reads this value at `import.meta.env.VITE_API_BASE_URL`.

`order-system-api.test` is the default. 
Adjust it to `http://localhost:8000` or your actual host if needed.

### 4. Start the development server
```bash
npm run dev
```

---

## Project Structure
```
src/
  api/
    axios.ts        # Axios instance (base URL, Bearer token header, 401 interceptor)
    auth.ts         # login, logout, register
    order.ts        # placeOrder and OrderItem with PlaceOrderPayload types
    product.ts      # getProducts with ProductsResponse types
    category.ts     # getCategories with Category type
  components/
    OrderSidebar.vue  
    ToastMessage.vue  
  pages/
    Login.vue         
    Register.vue      
    Dashboard.vue     
  router/
    index.js          # Routes + auth guard 
  stores/
    auth.ts           # Pinia store: isAuthenticated, userName, userEmail, userRole, cartCount
  App.vue             # Root component — renders <RouterView />
  main.ts             # App entry point — registers plugins
  style.css           # Global styles
.env                  # Environment variables (VITE_API_BASE_URL)
```

---

## Routes
Redirects to `/dashboard` 
`/login` (`Login.vue` and redirects to `/dashboard` if already authenticated)
`/register` (`Register.vue` and redirects to `/dashboard` if already authenticated)
`/dashboard` (`Dashboard.vue` for Authenticated users)

---

## Auth Flow
- Token-based (Bearer). After login or registration the token is stored in `localStorage` under `token`.
- User profile (name, email, role, cartCount) is persisted in `localStorage` under `auth_user`.
- The Pinia `auth` store (`src/stores/auth.ts`) is the single source of truth for auth state in the app.
- Every Axios request automatically attaches the token via a request header set in `src/api/axios.ts`.
- Any `401` response from the API automatically clears the token, resets the store, and redirects to `/login`.

---

