<template>
  <div class="w-full max-w-md mx-auto">
    <div class="text-center mb-8">
      <div class="mb-4">
        <svg class="mx-auto h-16 w-16 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h2 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
        Verify Your Email
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        We've sent a verification email to <span class="font-semibold">{{ email }}</span>
      </p>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div class="space-y-4">
        <p class="text-gray-600 dark:text-gray-400">
          Please check your email and click the verification link to activate your account.
        </p>
        
        <div class="text-sm text-gray-500 dark:text-gray-400">
          <p class="mb-2">Didn't receive the email?</p>
          <ul class="list-disc list-inside space-y-1">
            <li>Check your spam folder</li>
            <li>Make sure the email address is correct</li>
            <li>Wait a few minutes and try again</li>
          </ul>
        </div>

        <button
          @click="resendVerification"
          :disabled="loading || cooldown > 0"
          class="w-full py-3 px-4 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all duration-200 flex items-center justify-center"
          :class="{ 'opacity-50 cursor-not-allowed': loading || cooldown > 0 }"
        >
          <span v-if="loading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
          </span>
          <span v-else-if="cooldown > 0">
            Resend in {{ cooldown }}s
          </span>
          <span v-else>
            Resend Verification Email
          </span>
        </button>

        <div class="text-center">
          <router-link to="/auth/login" class="text-primary-600 hover:text-primary-500 font-medium">
            Back to Login
          </router-link>
        </div>
      </div>

      <div v-if="error" class="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-500 text-sm text-center">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const loading = ref(false);
const error = ref('');
const cooldown = ref(0);
const verificationCheckInterval = ref(null);

onMounted(async () => {
  // Get email from route query or auth store
  email.value = route.query.email || authStore.user?.email;
  
  if (!email.value) {
    router.push('/auth/login');
    return;
  }

  // Store email in auth store for verification check
  if (!authStore.user) {
    authStore.user = { email: email.value };
  }

  let verificationAttempts = 0;
  const maxAttempts = 20; // 1 minute total (3 seconds * 20)

  // Start checking verification status every 3 seconds
  verificationCheckInterval.value = setInterval(async () => {
    try {
      verificationAttempts++;
      
      const isVerified = await authStore.checkEmailVerification();
      if (isVerified) {
        clearInterval(verificationCheckInterval.value);
        
        // Show success message
        await Swal.fire({
          icon: 'success',
          title: 'Email Verified Successfully!',
        });

        // Redirect to login page with success message
        router.push({
          path: '/auth/login',
          query: { 
            verified: 'true',
            email: email.value 
          }
        });
      } else if (verificationAttempts >= maxAttempts) {
        // Stop checking after 1 minute
        clearInterval(verificationCheckInterval.value);
        await Swal.fire({
          icon: 'info',
          title: 'Verification Timeout',
          text: 'Please check your email and click the verification link. You can also try resending the verification email.',
          confirmButtonText: 'OK'
        });
      }
    } catch (err) {
      console.error('Error checking verification status:', err);
      // Don't show error to user, just log it
      // The verification check will continue in the background
    }
  }, 3000);
});

onUnmounted(() => {
  // Clean up interval when component is unmounted
  if (verificationCheckInterval.value) {
    clearInterval(verificationCheckInterval.value);
  }
  // Clear temporary user data if it exists
  if (authStore.user && !authStore.user.uid) {
    authStore.user = null;
  }
});

const startCooldown = () => {
  cooldown.value = 60;
  const timer = setInterval(() => {
    cooldown.value--;
    if (cooldown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};

const resendVerification = async () => {
  try {
    loading.value = true;
    error.value = '';
    await authStore.sendEmailVerification();
    startCooldown();
    await Swal.fire({
      icon: 'success',
      title: 'Verification Email Sent',
      text: 'Please check your inbox for the verification link.'
    });
  } catch (err) {
    error.value = err.message;
    await Swal.fire({
      icon: 'error',
      title: 'Failed to Send Verification Email',
      text: err.message
    });
  } finally {
    loading.value = false;
  }
};

async function checkVerification() {
  try {
    const isVerified = await authStore.checkEmailVerification();
    if (isVerified) {
      verificationStatus = 'success';
      statusMessage = 'Email verified successfully! Redirecting to login...';
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    }
  } catch (error) {
    console.error('Verification check error:', error);
    verificationStatus = 'error';
    statusMessage = error.message || 'Failed to check verification status';
  }
}
</script> 