<template>
  <div class="flex flex-col h-full min-h-[60vh]">
    <!-- Chat Header -->
    <div class="flex items-center gap-3 p-4 border-b bg-white dark:bg-gray-800 dark:border-gray-700">
      <img src="https://ui-avatars.com/api/?name=Friend" class="h-10 w-10 rounded-full" />
      <div>
        <div class="font-semibold">Friend Name</div>
        <div class="text-xs text-green-500">Online</div>
      </div>
      <div class="ml-auto flex gap-2">
        <button class="btn btn-secondary">Pin</button>
        <button class="btn btn-secondary">Block</button>
      </div>
    </div>
    <!-- Messages List -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
      <div v-for="msg in 10" :key="msg" class="flex gap-2 items-end" :class="msg % 2 === 0 ? 'justify-end' : 'justify-start'">
        <img v-if="msg % 2 !== 0" src="https://ui-avatars.com/api/?name=Friend" class="h-8 w-8 rounded-full" />
        <div class="max-w-xs px-4 py-2 rounded-lg" :class="msg % 2 === 0 ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'">
          Message {{msg}}
        </div>
        <img v-if="msg % 2 === 0" src="https://ui-avatars.com/api/?name=Me" class="h-8 w-8 rounded-full" />
      </div>
    </div>
    <!-- Message Input -->
    <form class="flex items-center gap-2 p-4 border-t bg-white dark:bg-gray-800 dark:border-gray-700">
      <button type="button" class="btn btn-secondary">😊</button>
      <input type="text" placeholder="Type a message..." class="input flex-1" />
      <button type="submit" class="btn btn-primary">Send</button>
    </form>
  </div>
</template> 