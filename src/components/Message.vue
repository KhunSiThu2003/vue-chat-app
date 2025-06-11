<template>
  <div class="flex gap-2 items-end" :class="isOwnMessage ? 'justify-end' : 'justify-start'">
    <img v-if="!isOwnMessage" :src="message.senderPhotoURL || 'https://ui-avatars.com/api/?name=' + message.senderName" class="h-8 w-8 rounded-full" />
    <div class="max-w-xs px-4 py-2 rounded-lg" :class="isOwnMessage ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'">
      {{ message.text }}
    </div>
    <img v-if="isOwnMessage" :src="message.senderPhotoURL || 'https://ui-avatars.com/api/?name=' + message.senderName" class="h-8 w-8 rounded-full" />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  currentUserId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['react', 'read']);

const isOwnMessage = computed(() => props.message.senderId === props.currentUserId);
</script> 