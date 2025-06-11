<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Friends</h1>
      <button class="btn btn-primary">Add Friend</button>
    </div>
    <div class="mb-4">
      <input type="text" placeholder="Search users..." class="input" />
    </div>
    <div class="mb-6">
      <h2 class="font-semibold mb-2">Friend Requests</h2>
      <div v-for="req in 2" :key="req" class="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg shadow mb-2">
        <div class="flex items-center gap-3">
          <img src="https://ui-avatars.com/api/?name=Request+{{req}}" class="h-8 w-8 rounded-full" />
          <div>Request User {{req}}</div>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-primary">Accept</button>
          <button class="btn btn-secondary">Reject</button>
        </div>
      </div>
    </div>
    <div>
      <h2 class="font-semibold mb-2">Your Friends</h2>
      <div v-for="friend in 4" :key="friend" class="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg shadow mb-2">
        <div class="flex items-center gap-3">
          <img src="https://ui-avatars.com/api/?name=Friend+{{friend}}" class="h-8 w-8 rounded-full" />
          <div>Friend {{friend}}</div>
        </div>
        <button class="btn btn-secondary">Chat</button>
      </div>
    </div>
  </div>
</template> 