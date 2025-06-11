<template>
  <div>
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search users..."
      class="input"
      @input="handleSearch"
    />
    <div v-if="searchResults.length > 0" class="mt-2 space-y-2">
      <div
        v-for="user in searchResults"
        :key="user.id"
        @click="$emit('select', user)"
        class="p-3 bg-white dark:bg-gray-800 rounded-lg shadow flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <img :src="user.photoURL || 'https://ui-avatars.com/api/?name=' + user.displayName" class="h-8 w-8 rounded-full" />
        <div class="font-semibold">{{ user.displayName }}</div>
      </div>
    </div>
    <div v-else-if="searchQuery" class="mt-2 text-gray-500 dark:text-gray-400">
      No users found.
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { defineEmits } from 'vue';

const emit = defineEmits(['select']);

const searchQuery = ref('');
const searchResults = ref([]);

const handleSearch = () => {
  // Placeholder for search logic
  // In a real app, you would query Firestore or an API here
  searchResults.value = [
    { id: '1', displayName: 'User 1', photoURL: null },
    { id: '2', displayName: 'User 2', photoURL: null }
  ];
};
</script> 