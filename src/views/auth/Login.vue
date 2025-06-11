<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import AuthLayout from '../../layouts/AuthLayout.vue';
import Swal from 'sweetalert2';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const showPassword = ref(false);

onMounted(() => {
  // Check if coming from verification
  if (route.query.verified === 'true') {
    email.value = route.query.email as string;
  }
});

// Email validation
const emailError = computed(() => {
  if (!email.value) return '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.value) ? '' : 'Please enter a valid email address';
});

// Password validation
const passwordError = computed(() => {
  if (!password.value) return '';
  if (password.value.length < 8) return 'Password must be at least 8 characters long';
  if (!/[A-Z]/.test(password.value)) return 'Password must contain at least one uppercase letter';
  if (!/[a-z]/.test(password.value)) return 'Password must contain at least one lowercase letter';
  if (!/[0-9]/.test(password.value)) return 'Password must contain at least one number';
  return '';
});

// Form validation
const isFormValid = computed(() => {
  return !emailError.value && !passwordError.value && email.value && password.value;
});

const handleSubmit = async () => {
  try {
    if (!isFormValid.value) {
      error.value = 'Please fix the form errors before submitting';
      return;
    }

    loading.value = true;
    error.value = '';
    await authStore.login(email.value, password.value);
    router.push('/');
  } catch (err) {
    if (err instanceof Error) {
      error.value = err.message;
    } else if (typeof err === 'string') {
      error.value = err;
    } else {
      error.value = 'An unexpected error occurred. Please try again.';
    }
  } finally {
    loading.value = false;
  }
};

const handleGoogleLogin = async () => {
  try {
    loading.value = true;
    error.value = '';
    const user = await authStore.loginWithGoogle();
    if (!user.emailVerified) {
      await Swal.fire({
        icon: 'info',
        title: 'Email Verification Required',
        text: 'Please verify your email address to continue.',
        confirmButtonText: 'Continue'
      });
      router.push({
        path: '/auth/verify-email',
        query: { email: user.email }
      });
      return;
    }
    router.push('/');
  } catch (err) {
    if (err instanceof Error) {
      error.value = err.message;
    } else if (typeof err === 'string') {
      error.value = err;
    } else {
      error.value = 'An unexpected error occurred. Please try again.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="w-full max-w-md mx-auto ">
    <div class="text-center mb-8">
      <h2 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
        Welcome Back
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        Don't have an account?
        <router-link to="/auth/register" class="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
          Sign up
        </router-link>
      </p>
    </div>

    <form class="space-y-6" @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email address</label>
          <input
            id="email"
            v-model="email"
            name="email"
            type="email"
            required
            class="input w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': emailError }"
            placeholder="Enter your email"
            @blur="emailError"
          />
          <p v-if="emailError" class="mt-1 text-sm text-red-500">{{ emailError }}</p>
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="input w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all pr-10"
              :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': passwordError }"
              placeholder="Enter your password"
              @blur="passwordError"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              @click="showPassword = !showPassword"
            >
              <svg
                v-if="showPassword"
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fill-rule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                  clip-rule="evenodd"
                />
                <path
                  d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"
                />
              </svg>
            </button>
          </div>
          <p v-if="passwordError" class="mt-1 text-sm text-red-500">{{ passwordError }}</p>
        </div>
      </div>

      <div class="flex items-center justify-end">
        <router-link to="/auth/forgot-password" class="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors">
          Forgot password?
        </router-link>
      </div>

      <button
        type="submit"
        :disabled="loading || !isFormValid"
        class="w-full py-3 px-4 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all duration-200 flex items-center justify-center"
        :class="{ 'opacity-50 cursor-not-allowed': !isFormValid }"
      >
        <span v-if="loading" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Signing in...
        </span>
        <span v-else>Sign in</span>
      </button>

      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
        </div>
      </div>

      <button
        type="button"
        @click="handleGoogleLogin"
        :disabled="loading"
        class="w-full py-3 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center"
      >
        <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Sign in with Google
      </button>

      <div v-if="error" class="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-500 text-sm text-center">
        {{ error }}
      </div>
    </form>
  </div>
</template> 