<template>
  <div class="max-w-lg mx-auto">
    <h1 class="text-2xl font-bold mb-6">Your Profile</h1>
    <form class="space-y-6">
      <div class="flex flex-col items-center gap-4">
        <img :src="profileImageUrl" class="h-24 w-24 rounded-full object-cover border-4 border-primary-500" />
        <input v-model="profileImageUrl" type="url" placeholder="Profile Image URL" class="input" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Display Name</label>
        <input v-model="displayName" type="text" class="input" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Bio</label>
        <textarea v-model="bio" rows="3" class="input"></textarea>
      </div>
      <div>
        <button type="submit" class="btn btn-primary w-full">Save Changes</button>
      </div>
    </form>
  </div>
</template>
<script setup>
import { ref } from 'vue';
// Placeholder values, replace with store/user data
const displayName = ref('John Doe');
const bio = ref('This is my bio.');
const profileImageUrl = ref('https://ui-avatars.com/api/?name=John+Doe');
</script> 