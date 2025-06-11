<template>
  <div class="max-w-lg mx-auto">
    <h1 class="text-2xl font-bold mb-6">Settings</h1>
    <form class="space-y-6">
      <div>
        <label class="block text-sm font-medium mb-2">Theme</label>
        <div class="flex gap-4">
          <label class="flex items-center gap-2">
            <input type="radio" name="theme" value="light" v-model="theme" />
            Light
          </label>
          <label class="flex items-center gap-2">
            <input type="radio" name="theme" value="dark" v-model="theme" />
            Dark
          </label>
          <label class="flex items-center gap-2">
            <input type="radio" name="theme" value="system" v-model="theme" />
            System
          </label>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Notifications</label>
        <div class="flex flex-col gap-2">
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="notifications.inApp" />
            In-app notifications
          </label>
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="notifications.sound" />
            Sound notifications
          </label>
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="notifications.push" />
            Push notifications
          </label>
        </div>
      </div>
      <div>
        <button type="submit" class="btn btn-primary w-full">Save Settings</button>
      </div>
    </form>
  </div>
</template>
<script setup>
import { ref } from 'vue';
const theme = ref('light');
const notifications = ref({ inApp: true, sound: true, push: true });
</script> 