import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/DefaultLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/Home.vue')
        },
        {
          path: 'chat/:id',
          name: 'chat',
          component: () => import('../views/Chat.vue')
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('../views/Profile.vue')
        },
        {
          path: 'friends',
          name: 'friends',
          component: () => import('../views/Friends.vue')
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('../views/Settings.vue')
        }
      ]
    },
    {
      path: '/auth',
      component: () => import('../layouts/AuthLayout.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('../views/auth/Login.vue')
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('../views/auth/Register.vue')
        },
        {
          path: 'forgot-password',
          name: 'forgot-password',
          component: () => import('../views/auth/ForgotPassword.vue')
        },
        {
          path: 'verify-email',
          name: 'verify-email',
          component: () => import('../views/auth/VerifyEmail.vue'),
          meta: { requiresEmail: true }
        }
      ]
    }
  ]
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // Handle protected routes
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' });
    return;
  }

  // Handle auth routes when user is already logged in
  if (to.path.startsWith('/auth') && authStore.isAuthenticated) {
    // If user is not verified and trying to access non-verification pages
    if (!authStore.isEmailVerified && to.name !== 'verify-email') {
      next({ 
        name: 'verify-email',
        query: { email: authStore.user.email }
      });
      return;
    }
    // If user is verified, redirect to home
    if (authStore.isEmailVerified) {
      next({ name: 'home' });
      return;
    }
  }

  // Handle verify-email route
  if (to.name === 'verify-email') {
    // If no email is provided in query and user is not logged in
    if (!to.query.email && !authStore.user?.email) {
      next({ name: 'login' });
      return;
    }
  }

  next();
});

export default router; 