<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Admin Dashboard</h1>
    <div class="mb-4">
      <input type="text" placeholder="Search users..." class="input" />
    </div>
    <div class="space-y-2">
      <div v-for="user in users" :key="user.id" class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img :src="user.photoURL || 'https://ui-avatars.com/api/?name=' + user.displayName" class="h-10 w-10 rounded-full" />
          <div>
            <div class="font-semibold">{{ user.displayName }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ user.email }}</div>
          </div>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-secondary" @click="blockUser(user.id)">Block</button>
          <button class="btn btn-secondary" @click="deleteUser(user.id)">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Swal from 'sweetalert2';

const users = ref([
  { id: '1', displayName: 'User 1', email: 'user1@example.com', photoURL: null },
  { id: '2', displayName: 'User 2', email: 'user2@example.com', photoURL: null }
]);

const blockUser = (userId) => {
  Swal.fire({
    icon: 'warning',
    title: 'Block User',
    text: 'Are you sure you want to block this user?',
    showCancelButton: true,
    confirmButtonText: 'Block',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      // Placeholder for block logic
      Swal.fire('Blocked!', 'User has been blocked.', 'success');
    }
  });
};

const deleteUser = (userId) => {
  Swal.fire({
    icon: 'warning',
    title: 'Delete User',
    text: 'Are you sure you want to delete this user?',
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      // Placeholder for delete logic
      Swal.fire('Deleted!', 'User has been deleted.', 'success');
    }
  });
};
</script> 