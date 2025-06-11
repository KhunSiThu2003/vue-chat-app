<script setup>
import { onMounted, watch } from 'vue';
import { useAuthStore } from './stores/auth';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const router = useRouter();
const authStore = useAuthStore();
const { user, loading, error } = storeToRefs(authStore);

// Watch for authentication state changes
watch(user, (newUser, oldUser) => {
  if (newUser && !oldUser) {
    // User just logged in
    if (!newUser.emailVerified) {
      router.push({
          path: '/auth/verify-email',
          query: { email: newUser.email }
        });
    }
  }
});

// Watch for auth errors
watch(error, (newError) => {
  if (newError) {
    Swal.fire({
      icon: 'error',
      title: 'Authentication Error',
      text: newError,
      confirmButtonText: 'OK'
    });
  }
});

onMounted(async () => {
  try {
    // Initialize auth state
    await authStore.init();
  } catch (err) {
    console.error('Failed to initialize auth:', err);
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-75 z-50">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>

    <!-- Main Content -->
    <router-view v-else v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Add smooth transitions for dark mode */
.dark {
  transition: background-color 0.3s ease;
}

/* Improve loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
