<template>
  <div class="space-y-2">
    <div v-for="chat in chats" :key="chat.id" @click="$emit('select', chat)" class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition">
      <div class="flex items-center gap-3">
        <img :src="chat.photoURL || 'https://ui-avatars.com/api/?name=' + chat.displayName" class="h-10 w-10 rounded-full" />
        <div>
          <div class="font-semibold">{{ chat.displayName }}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">{{ chat.lastMessage?.text || 'No messages yet' }}</div>
        </div>
      </div>
      <div class="text-xs text-gray-400">{{ formatTimestamp(chat.lastMessage?.timestamp) }}</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  chats: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['select']);

function formatTimestamp(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate();
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
</script> 