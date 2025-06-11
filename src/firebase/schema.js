// Firestore Schema Reference

// Users Collection
// Document ID: user.uid
const userSchema = {
  displayName: 'string',
  email: 'string',
  photoURL: 'string',
  bio: 'string',
  createdAt: 'timestamp',
  friends: ['user.uid'], // Array of friend user IDs
  friendRequests: ['user.uid'], // Array of pending friend request user IDs
  blockedUsers: ['user.uid'], // Array of blocked user IDs
  settings: {
    theme: 'string', // 'light', 'dark', 'system'
    notifications: {
      inApp: 'boolean',
      sound: 'boolean',
      push: 'boolean'
    }
  }
};

// Chats Collection
// Document ID: auto-generated
const chatSchema = {
  participants: ['user.uid'], // Array of user IDs in the chat
  createdAt: 'timestamp',
  lastMessage: {
    text: 'string',
    senderId: 'user.uid',
    timestamp: 'timestamp'
  },
  pinned: 'boolean'
};

// Messages Collection
// Document ID: auto-generated
const messageSchema = {
  chatId: 'chat.documentId',
  senderId: 'user.uid',
  text: 'string',
  timestamp: 'timestamp',
  read: ['user.uid'], // Array of user IDs who have read the message
  reactions: {
    // Map of emoji to array of user IDs who reacted
    'emoji': ['user.uid']
  }
};

export { userSchema, chatSchema, messageSchema }; 