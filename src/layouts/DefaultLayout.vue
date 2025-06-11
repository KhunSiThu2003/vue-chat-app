<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation -->
    <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                ChatApp
              </router-link>
            </div>

            <!-- Navigation Links -->
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link
                to="/"
                class="inline-flex items-center px-1 pt-1 border-b-2"
                :class="[$route.name === 'home' ? 'border-primary-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600']"
              >
                Home
              </router-link>
              <router-link
                to="/friends"
                class="inline-flex items-center px-1 pt-1 border-b-2"
                :class="[$route.name === 'friends' ? 'border-primary-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600']"
              >
                Friends
              </router-link>
            </div>
          </div>

          <!-- User Menu -->
          <div class="flex items-center">
            <button
              @click="toggleTheme"
              class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <sun-icon v-if="isDark" class="h-6 w-6" />
              <moon-icon v-else class="h-6 w-6" />
            </button>

            <Menu as="div" class="ml-3 relative">
              <MenuButton class="flex items-center">
                <img
                  :src="user?.photoURL || 'https://ui-avatars.com/api/?name=' + user?.displayName"
                  :alt="user?.displayName"
                  class="h-8 w-8 rounded-full"
                />
              </MenuButton>

              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div class="py-1">
                    <MenuItem v-slot="{ active }">
                      <router-link
                        to="/profile"
                        :class="[active ? 'bg-gray-100 dark:bg-gray-700' : '', 'block px-4 py-2 text-sm text-gray-700 dark:text-gray-200']"
                      >
                        Your Profile
                      </router-link>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <router-link
                        to="/settings"
                        :class="[active ? 'bg-gray-100 dark:bg-gray-700' : '', 'block px-4 py-2 text-sm text-gray-700 dark:text-gray-200']"
                      >
                        Settings
                      </router-link>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <button
                        @click="logout"
                        :class="[active ? 'bg-gray-100 dark:bg-gray-700' : '', 'block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200']"
                      >
                        Sign out
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline';
import { useAuthStore } from '../stores/auth';
import { useTheme } from '../composables/useTheme';

const router = useRouter();
const authStore = useAuthStore();
const { isDark, toggleTheme } = useTheme();

const user = computed(() => authStore.user);

const logout = async () => {
  try {
    await authStore.logout();
    router.push('/auth/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
</script> 