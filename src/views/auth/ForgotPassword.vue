<template>
  <div class="w-full max-w-md mx-auto">
    <div class="text-center mb-8">
      <h2 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
        Reset Password
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        Enter your email address and we'll send you instructions to reset your password.
      </p>
    </div>

    <form class="space-y-6" @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email address
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="input w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': emailError }"
            placeholder="Enter your email"
            @blur="emailError"
          />
          <p v-if="emailError" class="mt-1 text-sm text-red-500">{{ emailError }}</p>
        </div>
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
          Sending reset email...
        </span>
        <span v-else>Send Reset Link</span>
      </button>

      <div v-if="error" class="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-500 text-sm text-center">
        {{ error }}
      </div>

      <div class="text-center">
        <router-link
          to="/auth/login"
          class="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
        >
          Back to sign in
        </router-link>
      </div>
    </form>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import Swal from 'sweetalert2';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const loading = ref(false);
const error = ref('');

// Email validation
const emailError = computed(() => {
  if (!email.value) return '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.value) ? '' : 'Please enter a valid email address';
});

// Form validation
const isFormValid = computed(() => {
  return !emailError.value && email.value;
});

const handleSubmit = async () => {
  try {
    if (!isFormValid.value) {
      error.value = 'Please fix the form errors before submitting';
      return;
    }

    loading.value = true;
    error.value = '';
    await authStore.resetPassword(email.value);
    Swal.fire({
      icon: 'success',
      title: 'Email Sent',
      text: 'Check your inbox for password reset instructions.'
    });
    router.push('/auth/login');
  } catch (err) {
    error.value = err.message;
    Swal.fire({
      icon: 'error',
      title: 'Reset Failed',
      text: err.message
    });
  } finally {
    loading.value = false;
  }
};
</script> 