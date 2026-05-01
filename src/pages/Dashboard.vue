<template>
  <div class="min-h-screen bg-[#F5F5F4] font-sans" @click="showUserMenu = false">

    <!-- Header -->
    <header class="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white/90 backdrop-blur-sm px-4 py-3 sm:px-8">
      <!-- Logo -->
      <div class="flex items-center gap-2 font-semibold text-gray-900 text-sm tracking-tight">
        <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900">
          <Package :size="14" class="text-white" />
        </div>
        <span class="hidden sm:inline">Order System</span>
      </div>

      <!-- Right actions -->
      <div class="flex items-center gap-2.5">
        <!-- Cart button with pulse badge -->
        <button
          class="relative flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-gray-700 active:scale-95 sm:px-4"
          @click="showSidebar = true"
        >
          <ShoppingCart :size="15" />
          <span class="hidden sm:inline">{{ auth.cartCount }} {{ auth.cartCount === 1 ? 'item' : 'items' }}</span>
          <span class="sm:hidden">{{ auth.cartCount }}</span>
          <!-- Pulse dot -->
          <span
            v-if="cartPulse"
            class="absolute -right-1 -top-1 flex h-3 w-3"
          >
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span class="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
          </span>
        </button>

        <!-- User dropdown -->
        <div class="relative" @click.stop>
          <button
            class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white transition hover:bg-gray-700"
            @click="showUserMenu = !showUserMenu"
          >
            {{ auth.isAuthenticated ? userInitials : '?' }}
          </button>

          <Transition
            enter-active-class="transition ease-out duration-150"
            enter-from-class="opacity-0 scale-95 translate-y-1"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition ease-in duration-100"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-1"
          >
            <div
              v-if="showUserMenu"
              class="absolute right-0 top-11 z-40 w-72 origin-top-right overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
            >
              <!-- Authenticated -->
              <template v-if="auth.isAuthenticated">
                <div class="flex items-center gap-3 bg-gray-50 px-4 py-4">
                  <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-sm font-bold text-white">
                    {{ userInitials }}
                  </div>
                  <div class="min-w-0">
                    <p class="truncate text-sm font-semibold text-gray-900">{{ auth.userName }}</p>
                    <p class="truncate text-xs text-gray-500">{{ auth.userEmail }}</p>
                  </div>
                </div>
                <div class="border-t border-gray-100">
                  <button
                    class="flex w-full items-center gap-2.5 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition"
                    @click="handleLogout"
                  >
                    <LogOut :size="15" />
                    Logout
                  </button>
                </div>
              </template>

              <!-- Guest -->
              <template v-else>
                <div class="flex items-center gap-3 bg-gray-50 px-4 py-4">
                  <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-200">
                    <User :size="20" class="text-gray-400" />
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-900">Your Profile</p>
                    <p class="text-xs text-gray-500">Not signed in</p>
                  </div>
                </div>
                <div class="border-t border-gray-100">
                  <button
                    class="flex w-full items-center gap-2.5 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                    @click="showUserMenu = false; router.push('/login')"
                  >
                    <LogOut :size="15" class="rotate-180" />
                    Log in
                  </button>
                </div>
              </template>
            </div>
          </Transition>
        </div>
      </div>
    </header>

    <!-- Main -->
    <main class="mx-auto max-w-6xl px-4 sm:px-8">

      <!-- Page heading -->
      <div class="mb-7">
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Product Catalog</h1>
        <p class="mt-1 text-sm text-gray-500">Browse and select products to add to your order</p>
      </div>

      <!-- Search & filter bar -->
      <div class="mb-6 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center">
        <!-- Search -->
        <div class="relative flex-1">
          <Search
            :size="15"
            class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products…"
            class="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 transition focus:border-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>

        <!-- Category filter -->
        <Select
          v-model="selectedCategory"
          :options="[{ id: null, name: 'All Categories' }, ...categories]"
          option-label="name"
          option-value="id"
          placeholder="All Categories"
          class="w-full sm:w-48"
        />
      </div>

      <!-- Error -->
      <div v-if="error" class="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
        <AlertCircle :size="15" class="shrink-0" />
        {{ error }}
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
        <div v-for="n in 6" :key="n" class="animate-pulse rounded-2xl border border-gray-200 bg-white p-4">
          <div class="mb-4 h-44 rounded-xl bg-gray-100" />
          <div class="mb-2 h-3 w-1/4 rounded-full bg-gray-100" />
          <div class="mb-2 h-4 w-2/3 rounded-full bg-gray-100" />
          <div class="mb-4 h-4 w-1/3 rounded-full bg-gray-100" />
          <div class="h-9 rounded-xl bg-gray-100" />
        </div>
      </div>

      <!-- Empty filtered state -->
      <div
        v-else-if="products.length === 0"
        class="flex flex-col items-center justify-center py-20 text-center"
      >
        <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
          <PackageSearch :size="26" class="text-gray-400" />
        </div>
        <p class="font-semibold text-gray-900">No products found</p>
        <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filter</p>
        <button
          class="mt-4 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          @click="searchQuery = ''; selectedCategory = null"
        >
          Clear filters
        </button>
      </div>

      <!-- Product grid -->
      <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
        <div
          v-for="product in products"
          :key="product.id"
          class="group flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          <!-- Image -->
          <div class="relative mb-4 flex h-44 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
            <img
              :src="`${imageBase}/${product.image}`"
              :alt="product.name"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              @error="($event.target as HTMLImageElement).style.opacity = '0'"
            />
            <!-- Category chip -->
            <span
              v-if="getCategoryName(product.category_id)"
              class="absolute left-2.5 top-2.5 rounded-md bg-white/90 px-2 py-0.5 text-xs font-medium text-gray-600 backdrop-blur-sm shadow-sm"
            >
              {{ getCategoryName(product.category_id) }}
            </span>
          </div>

          <!-- Info -->
          <p class="mb-1 truncate font-semibold text-gray-900">{{ product.name }}</p>
          <div class="mb-4 flex items-center justify-between">
            <span class="text-lg font-bold text-gray-900">${{ product.price }}</span>
            <!-- Color-coded stock badge -->
            <span :class="stockBadgeClass(product.stock)">
              <span :class="stockDotClass(product.stock)" class="inline-block h-1.5 w-1.5 rounded-full" />
              {{ product.stock === 0 ? 'Out of stock' : `Stock · ${product.stock}` }}
            </span>
          </div>

          <!-- Add to Order button -->
          <button
            :disabled="product.stock === 0 || addedIds.has(product.id)"
            :class="[
              'mt-auto flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-medium transition-all duration-200 active:scale-95',
              addedIds.has(product.id)
                ? 'bg-emerald-500 text-white cursor-default'
                : product.stock === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-gray-700'
            ]"
            @click="addToOrder(product)"
          >
            <Check v-if="addedIds.has(product.id)" :size="15" />
            <Plus v-else :size="15" />
            {{ addedIds.has(product.id) ? 'Added!' : 'Add to Order' }}
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <div class="mt-8 flex justify-center">
        <Paginator
          :first="(currentPage - 1) * perPage"
          :rows="perPage"
          :total-records="total"
          @page="fetchProducts($event.page + 1)"
        />
      </div>
    </main>

    <!-- Order Sidebar -->
    <OrderSidebar
      :open="showSidebar"
      :selected-product="selectedProduct"
      @close="showSidebar = false; selectedProduct = null"
      @cart-count-changed="onCartCountChanged"
      @orderPlaced="fetchProducts(currentPage)"
    />


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import {
  Package, PackageSearch, Search, Plus, Check,
  User, ShoppingCart, LogOut, AlertCircle
} from 'lucide-vue-next';
import { logout } from '../api/auth';
import { getProducts, type Product } from '../api/product';
import { getCategories, type Category } from '../api/category';
import { useAuthStore } from '../stores/auth';

import OrderSidebar from '../components/OrderSidebar.vue';
import { Select } from 'primevue';
import Paginator from 'primevue/paginator';

const router = useRouter();
const auth = useAuthStore();

// State 
const searchQuery = ref('');
const selectedCategory = ref<number | null>(null);
const categories = ref<Category[]>([]);

const products = ref<Product[]>([]);
const loading = ref(false);
const error = ref('');
const currentPage = ref(1);
const lastPage = ref(1);
const total = ref(0);
const perPage = ref(10);

// UI state
const showUserMenu = ref(false);
const showSidebar = ref(false);
const selectedProduct = ref<Product | null>(null);

// Set of product IDs that were just added
const addedIds = ref<Set<number>>(new Set());

// Cart badge pulse
const cartPulse = ref(false);

let searchTimer: ReturnType<typeof setTimeout>

// Computed 
const userInitials = computed(() => {
  if (!auth.userName) return 'U';

  return auth.userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
});

const imageBase = import.meta.env.VITE_API_BASE_URL ?? '';

// Helpers
function getCategoryName(categoryId: number): string {
  return categories.value.find(c => c.id === categoryId)?.name ?? '';
}

function stockBadgeClass(stock: number) {
  if (stock === 0) return 'flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium bg-red-50 text-red-600';
  if (stock <= 5) return 'flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium bg-amber-50 text-amber-600';
  return 'flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-600';
}

function stockDotClass(stock: number) {
  if (stock === 0) return 'bg-red-500';
  if (stock <= 5) return 'bg-amber-500';
  return 'bg-emerald-500';
}

// Pulse helper 
function triggerCartPulse() {
  cartPulse.value = true;
  setTimeout(() => { cartPulse.value = false }, 2000);
}

function onCartCountChanged(count: number) {
  auth.cartCount = count;
  triggerCartPulse();
}

// API 
async function fetchProducts(page = 1) {
  loading.value = true;
  error.value = '';
  
  try {
    const res = await getProducts(page, selectedCategory.value, searchQuery.value);
    products.value = res.data.data;
    currentPage.value = res.data.pagination.current_page;
    lastPage.value = res.data.pagination.last_page;
    total.value = res.data.pagination.total;
    perPage.value = res.data.pagination.per_page;
  } catch {
    error.value = 'Failed to load products.';
  } finally {
    loading.value = false;
  }
}

async function handleLogout() {
  try {
    await logout();
  } finally {
    auth.logout();
    localStorage.removeItem('token');
    router.push('/');
  }
}

function addToOrder(product: Product) {
  if (!auth.isAuthenticated) {
    router.push('/login');
    return;
  }

  // Show feedback
  addedIds.value = new Set([...addedIds.value, product.id]);
  setTimeout(() => {
    addedIds.value = new Set([...addedIds.value].filter(id => id !== product.id))
  }, 1200);

  selectedProduct.value = product;
  showSidebar.value = true;
}

watch(selectedCategory, () => fetchProducts(1));

watch(searchQuery, () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => fetchProducts(1), 400);
})

onMounted(() => {
  fetchProducts();
  getCategories().then(res => { categories.value = res.data.data });
})
</script>