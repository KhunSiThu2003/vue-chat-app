import { db } from './config';
import { doc, updateDoc, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

// Send a friend request
export async function sendFriendRequest(senderId, receiverId) {
  const receiverRef = doc(db, 'users', receiverId);
  await updateDoc(receiverRef, {
    friendRequests: arrayUnion(senderId)
  });
}

// Accept a friend request
export async function acceptFriendRequest(userId, friendId) {
  const userRef = doc(db, 'users', userId);
  const friendRef = doc(db, 'users', friendId);
  await updateDoc(userRef, {
    friends: arrayUnion(friendId),
    friendRequests: arrayRemove(friendId)
  });
  await updateDoc(friendRef, {
    friends: arrayUnion(userId)
  });
}

// Reject a friend request
export async function rejectFriendRequest(userId, friendId) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    friendRequests: arrayRemove(friendId)
  });
}

// Fetch friends for a user
export async function fetchFriends(userId) {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    return userDoc.data().friends || [];
  }
  return [];
}

// Fetch friend requests for a user
export async function fetchFriendRequests(userId) {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    return userDoc.data().friendRequests || [];
  }
  return [];
} 