<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="open" class="fixed inset-0 z-50 flex justify-end">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="$emit('close')" />

        <!-- Panel -->
        <Transition
          enter-active-class="transition ease-out duration-250"
          enter-from-class="translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="translate-x-0"
          leave-to-class="translate-x-full"
        >
          <div v-if="open" class="relative flex h-full w-full max-w-sm flex-col bg-white shadow-2xl">

            <!-- Header -->
            <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div class="flex items-center gap-2">
                <ShoppingCart :size="17" class="text-gray-700" />
                <span class="font-semibold text-gray-900 text-sm">Order Details</span>
                <span
                  v-if="cartItems.length > 0"
                  class="rounded-full bg-gray-900 px-2 py-0.5 text-xs font-semibold text-white"
                >
                  {{ totalCount }}
                </span>
              </div>
              <button
                class="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                @click="$emit('close')"
              >
                <X :size="17" />
              </button>
            </div>

            <!-- Cart items -->
            <div class="flex-1 overflow-y-auto px-5 py-4">

              <!-- Empty state -->
              <div v-if="cartItems.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
                <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">
                  <ShoppingCart :size="22" class="text-gray-400" />
                </div>
                <p class="text-sm font-medium text-gray-700">Your cart is empty</p>
                <p class="mt-0.5 text-xs text-gray-400">Add products from the catalog</p>
              </div>

              <!-- Items list -->
              <div v-else class="divide-y divide-gray-100">
                <div
                  v-for="item in cartItems"
                  :key="item.product.id"
                  class="flex items-center gap-3 py-3.5"
                >
                  <!-- Product info -->
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-medium text-gray-900">{{ item.product.name }}</p>
                    <p class="text-xs text-gray-400">${{ item.product.price }} each</p>
                  </div>

                  <!-- Quantity stepper -->
                  <div class="flex items-center gap-1">
                    <button
                      class="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 active:scale-95"
                      @click="decrement(item)"
                    >
                      <Minus :size="11" />
                    </button>
                    <span class="w-6 text-center text-sm font-semibold text-gray-900">{{ item.quantity }}</span>
                    <button
                      class="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                      :disabled="item.quantity >= item.product.stock"
                      @click="item.quantity++"
                    >
                      <Plus :size="11" />
                    </button>
                  </div>

                  <!-- Line total + remove -->
                  <div class="flex flex-col items-end gap-1 min-w-[52px]">
                    <span class="text-sm font-semibold text-gray-900">
                      ${{ (parseFloat(item.product.price) * item.quantity).toFixed(2) }}
                    </span>
                    <button
                      class="text-gray-300 transition hover:text-red-400 active:scale-90"
                      @click="remove(item)"
                    >
                      <Trash2 :size="13" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="border-t border-gray-100 px-5 py-4 space-y-2">
              <div class="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span class="text-gray-900">${{ subtotal }}</span>
              </div>
              <div class="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span class="font-medium text-emerald-600">FREE</span>
              </div>
              <div class="flex justify-between border-t border-gray-100 pt-2.5 text-base font-bold text-gray-900">
                <span>Total</span>
                <span>${{ subtotal }}</span>
              </div>

              <button
                :disabled="cartItems.length === 0 || ordering"
                class="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-2.5 text-sm font-medium text-white transition-all hover:bg-gray-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                @click="submitOrder"
              >
                <Loader2 v-if="ordering" :size="14" class="animate-spin" />
                <PackageCheck v-else :size="15" />
                {{ ordering ? 'Placing…' : 'Place Order' }}
              </button>
            </div>

          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>

  <OrderToast ref="orderToast" />
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { ShoppingCart, X, Plus, Minus, Trash2, Loader2, PackageCheck } from 'lucide-vue-next';
import type { Product } from '../api/product';
import { placeOrder } from '../api/order';
import OrderToast from './ToastMessage.vue';

interface CartItem {
  product: Product;
  quantity: number;
}

const props = defineProps<{
  open: boolean
  selectedProduct: Product | null
}>();

const emit = defineEmits<{
  close: []
  cartCountChanged: [count: number]
  orderPlaced: []
}>();

// Cart items
const cartItems = ref<CartItem[]>([]);

// Watch selected product and add to cart
watch(() => props.selectedProduct, (product) => {
  if (!product) return;

  // Check if product already exists in cart
  const existing = cartItems.value.find(i => i.product.id === product.id);

  if (existing) {
    if (existing.quantity < product.stock) existing.quantity++;
  } else {
    cartItems.value.push({ product, quantity: 1 });
  }

  emit('cartCountChanged', totalCount.value);
});

// Total number of items in cart
const totalCount = computed(() =>
  cartItems.value.reduce((sum, i) => sum + i.quantity, 0)
);

// Total price of all items
const subtotal = computed(() =>
  cartItems.value
    .reduce((sum, i) => sum + parseFloat(i.product.price) * i.quantity, 0)
    .toFixed(2)
);

// Decrease quantity or remove item
function decrement(item: CartItem) {
  if (item.quantity > 1) {
    item.quantity--;
  } else {
    remove(item);
  }
  emit('cartCountChanged', totalCount.value);
}

// Remove item from cart
function remove(item: CartItem) {
  cartItems.value = cartItems.value.filter(i => i.product.id !== item.product.id);
  emit('cartCountChanged', totalCount.value);
}

const ordering = ref(false);
const orderToast = ref<InstanceType<typeof OrderToast> | null>(null);

async function submitOrder() {
  if (cartItems.value.length === 0) return;

  ordering.value = true;

  try {
    await placeOrder({
      items: cartItems.value.map(i => ({
        product_id: i.product.id,
        quantity: i.quantity,
      })),
    });

    // Reset cart after success
    cartItems.value = [];
    emit('cartCountChanged', 0);
    emit('close');
    emit('orderPlaced');
    
    orderToast.value?.showSuccess('Order placed successfully!');
  } catch {
    orderToast.value?.showError('Failed to place order. Please try again.');
  } finally {
    ordering.value = false;
  }
}
</script>
