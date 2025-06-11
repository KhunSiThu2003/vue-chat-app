import { db } from './config';
import { collection, addDoc, getDocs, doc, updateDoc, query, where, orderBy, serverTimestamp, arrayUnion, arrayRemove } from 'firebase/firestore';

// Create a new chat between two users
export async function createChat(userId1, userId2) {
  const chatRef = await addDoc(collection(db, 'chats'), {
    participants: [userId1, userId2],
    createdAt: serverTimestamp(),
    lastMessage: null,
    pinned: false
  });
  return chatRef.id;
}

// Fetch all chats for a user
export async function fetchUserChats(userId) {
  const q = query(
    collection(db, 'chats'),
    where('participants', 'array-contains', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Send a message in a chat
export async function sendMessage(chatId, senderId, text) {
  const messageRef = await addDoc(collection(db, 'messages'), {
    chatId,
    senderId,
    text,
    timestamp: serverTimestamp(),
    read: [senderId],
    reactions: {}
  });
  // Update the last message in the chat
  const chatRef = doc(db, 'chats', chatId);
  await updateDoc(chatRef, {
    lastMessage: {
      text,
      senderId,
      timestamp: serverTimestamp()
    }
  });
  return messageRef.id;
}

// Fetch messages for a chat
export async function fetchChatMessages(chatId) {
  const q = query(
    collection(db, 'messages'),
    where('chatId', '==', chatId),
    orderBy('timestamp', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Mark a message as read
export async function markMessageAsRead(messageId, userId) {
  const messageRef = doc(db, 'messages', messageId);
  await updateDoc(messageRef, {
    read: arrayUnion(userId)
  });
}

// Add a reaction to a message
export async function addReaction(messageId, emoji, userId) {
  const messageRef = doc(db, 'messages', messageId);
  await updateDoc(messageRef, {
    [`reactions.${emoji}`]: arrayUnion(userId)
  });
}

// Remove a reaction from a message
export async function removeReaction(messageId, emoji, userId) {
  const messageRef = doc(db, 'messages', messageId);
  await updateDoc(messageRef, {
    [`reactions.${emoji}`]: arrayRemove(userId)
  });
} 