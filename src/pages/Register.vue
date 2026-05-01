<template>
  <div class="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
    <div class="w-full max-w-sm">
      <form
        class="space-y-4 rounded-xl border border-gray-200 bg-white px-6 shadow-sm"
        @submit.prevent="handleRegister"
      >
        <div>
          <p class="text-2xl font-semibold text-gray-900 py-3">Create account</p>
          <p class="text-sm text-gray-500">Sign up to get started.</p>
        </div>

        <p
          v-if="error"
          class="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600"
          role="alert"
        >
          {{ error }}
        </p>

        <!-- Name -->
        <div class="flex flex-col space-y-1">
          <label for="name" class="text-sm font-medium text-gray-700">Name</label>
          <input
            id="name"
            v-model="name"
            type="text"
            autocomplete="name"
            placeholder="Your name"
            required
            class="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition focus:border-[#4D4D4D] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4D4D4D]"
          />
        </div>

        <!-- Email -->
        <div class="flex flex-col space-y-1">
          <label for="email" class="text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="you@example.com"
            required
            class="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition focus:border-[#4D4D4D] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4D4D4D]"
          />
        </div>

        <!-- Password -->
        <div class="flex flex-col space-y-1">
          <label for="password" class="text-sm font-medium text-gray-700">Password</label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="your password"
              required
              class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 pr-10 text-sm text-gray-900 placeholder-gray-400 transition focus:border-[#4D4D4D] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4D4D4D]"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              @click="showPassword = !showPassword"
            >
              <EyeOff v-if="!showPassword" :size="16" />
              <Eye v-else :size="16" />
            </button>
          </div>
        </div>

        <!-- Confirm Password -->
        <div class="flex flex-col space-y-1">
          <label for="password-confirmation" class="text-sm font-medium text-gray-700">Confirm Password</label>
          <div class="relative">
            <input
              id="password-confirmation"
              v-model="passwordConfirmation"
              :type="showConfirm ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="confirm your password"
              required
              class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 pr-10 text-sm text-gray-900 placeholder-gray-400 transition focus:border-[#4D4D4D] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4D4D4D]"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
              :aria-label="showConfirm ? 'Hide password' : 'Show password'"
              @click="showConfirm = !showConfirm"
            >
              <EyeOff v-if="!showConfirm" :size="16" />
              <Eye v-else :size="16" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-lg bg-[#4D4D4D] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ loading ? 'Creating account…' : 'Create account' }}
        </button>

        <p class="text-center text-sm text-gray-500 pb-2">
          Already have an account?
          <RouterLink to="/login" class="font-medium text-[#4D4D4D] hover:underline">Sign in</RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Eye, EyeOff } from 'lucide-vue-next';
import { register } from '../api/auth';
import { useAuthStore } from '../stores/auth';
import api from '../api/axios';

const router = useRouter();
const auth = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const error = ref('');
const loading = ref(false);
const showPassword = ref(false);
const showConfirm = ref(false);

const handleRegister = async (): Promise<void> => {
  error.value = '';
  loading.value = true;

  try {
    const response = await register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    });
    const token = response.data.data.token;
    const user = response.data.data.user;
    
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    auth.login(user?.name ?? '', user?.role ?? '', user?.email ?? '');
    router.push('/dashboard');
  } catch (e: any) {
    error.value = e.response?.data?.message ?? 'Registration failed';
  } finally {
    loading.value = false;
  }
};
</script>
