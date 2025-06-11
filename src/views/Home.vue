<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Chats</h1>
      <button class="btn btn-primary">New Chat</button>
    </div>
    <div class="mb-4">
      <input type="text" placeholder="Search chats..." class="input" />
    </div>
    <div class="space-y-2">
      <div v-for="chat in 5" :key="chat" class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition">
        <div class="flex items-center gap-3">
          <img src="https://ui-avatars.com/api/?name=User+{{chat}}" class="h-10 w-10 rounded-full" />
          <div>
            <div class="font-semibold">User {{chat}}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Last message preview...</div>
          </div>
        </div>
        <div class="text-xs text-gray-400">2:30 PM</div>
      </div>
    </div>
  </div>
</template> 