import { defineStore } from 'pinia';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export const useAuthStore = defineStore('auth', {
  
  state: () => ({
    user: null,
    loading: true,
    error: null,
    lastActivity: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userId: (state) => state.user?.uid,
    isEmailVerified: (state) => state.user?.emailVerified || false,
    userDisplayName: (state) => state.user?.displayName || 'Anonymous User',
    userPhotoURL: (state) => state.user?.photoURL || null
  },

  actions: {
    async init() {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
          try {
            if (user) {
              const userDoc = await getDoc(doc(db, 'users', user.uid));
              this.user = {
                ...user,
                ...userDoc.data()
              };
              this.lastActivity = new Date().toISOString();
            } else {
              this.user = null;
              this.lastActivity = null;
            }
          } catch (error) {
            console.error('Error initializing auth state:', error);
            this.error = error.message;
          } finally {
            this.loading = false;
            resolve();
          }
        });
      });
    },

    async login(email, password) {
      try {
        this.error = null;
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        
        // Check if email is verified
        if (!user.emailVerified) {
          await signOut(auth);
          throw new Error('Please verify your email before logging in');
        }

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        this.user = {
          ...user,
          ...userDoc.data()
        };
        this.lastActivity = new Date().toISOString();
        
        // Update last login
        await updateDoc(doc(db, 'users', user.uid), {
          lastLogin: new Date().toISOString()
        });

        return user;
      } catch (error) {
        this.error = this.getErrorMessage(error);
        throw error;
      }
    },

    async register(email, password, displayName) {
      try {
        this.error = null;
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update profile with display name
        await updateProfile(user, { displayName });
        
        // Create user document
        const userData = {
          displayName,
          email,
          photoURL: null,
          bio: '',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          emailVerified: false,
          friends: [],
          friendRequests: [],
          blockedUsers: [],
          settings: {
            theme: 'light',
            notifications: {
              inApp: true,
              sound: true,
              push: true
            }
          }
        };

        await setDoc(doc(db, 'users', user.uid), userData);

        // Send verification email
        await sendEmailVerification(user, {
          url: `${window.location.origin}/auth/verify-email?email=${email}`
        });

        // Update local user state
        this.user = {
          ...user,
          ...userData
        };
        this.lastActivity = new Date().toISOString();

        return user;
      } catch (error) {
        this.error = this.getErrorMessage(error);
        throw error;
      }
    },

    async loginWithGoogle() {
      try {
        this.error = null;
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        provider.setCustomParameters({
          prompt: 'select_account'
        });

        const { user } = await signInWithPopup(auth, provider);
        
        // Check if user document exists
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (!userDoc.exists()) {
          // Create user document for new Google users
          const userData = {
            displayName: user.displayName || 'Anonymous User',
            email: user.email,
            photoURL: user.photoURL,
            bio: '',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            friends: [],
            friendRequests: [],
            blockedUsers: [],
            settings: {
              theme: 'light',
              notifications: {
                inApp: true,
                sound: true,
                push: true
              }
            },
            provider: 'google',
            emailVerified: user.emailVerified
          };

          await setDoc(doc(db, 'users', user.uid), userData);
          this.user = {
            ...user,
            ...userData
          };
        } else {
          // Update existing user
          const userData = userDoc.data();
          const updatedData = {
            ...userData,
            lastLogin: new Date().toISOString(),
            photoURL: user.photoURL || userData.photoURL,
            displayName: user.displayName || userData.displayName,
            emailVerified: user.emailVerified
          };

          await setDoc(doc(db, 'users', user.uid), updatedData, { merge: true });
          this.user = {
            ...user,
            ...updatedData
          };
        }

        this.lastActivity = new Date().toISOString();
        return user;
      } catch (error) {
        this.error = this.getErrorMessage(error);
        throw error;
      }
    },

    async logout() {
      try {
        this.error = null;
        if (this.user) {
          // Update last activity before logout
          await updateDoc(doc(db, 'users', this.user.uid), {
            lastActivity: new Date().toISOString()
          });
        }
        await signOut(auth);
        this.user = null;
        this.lastActivity = null;
      } catch (error) {
        this.error = this.getErrorMessage(error);
        throw error;
      }
    },

    async resetPassword(email) {
      try {
        this.error = null;
        await sendPasswordResetEmail(auth, email, {
          url: `${window.location.origin}/auth/login`
        });
      } catch (error) {
        this.error = this.getErrorMessage(error);
        throw error;
      }
    },

    async sendEmailVerification() {
      try {
        this.error = null;
        if (!auth.currentUser) {
          throw new Error('No user is currently signed in');
        }
        
        if (auth.currentUser.emailVerified) {
          throw new Error('Email is already verified');
        }
        
        await sendEmailVerification(auth.currentUser, {
          url: `${window.location.origin}/auth/verify-email?email=${auth.currentUser.email}`
        });
      } catch (error) {
        this.error = this.getErrorMessage(error);
        throw error;
      }
    },

    async checkEmailVerification() {
      try {
        this.error = null;
        if (!auth.currentUser) {
          throw new Error('No user is currently signed in');
        }

        // Reload the user to get the latest verification status
        await auth.currentUser.reload();
        
        // Check verification status directly from Firebase Auth
        if (auth.currentUser.emailVerified) {
          // Update user document with verified status
          await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            emailVerified: true
          });
          
          // Update local user state
          this.user = {
            ...this.user,
            emailVerified: true
          };
          
          return true;
        }
        
        return false;
      } catch (error) {
        console.error('Error checking email verification:', error);
        this.error = this.getErrorMessage(error);
        return false;
      }
    },

    // Helper method to get user-friendly error messages
    getErrorMessage(error) {
      const errorMessages = {
        'auth/user-not-found': 'No account found with this email address',
        'auth/wrong-password': 'Incorrect password',
        'auth/email-already-in-use': 'This email is already registered',
        'auth/weak-password': 'Password should be at least 6 characters',
        'auth/invalid-email': 'Please enter a valid email address',
        'auth/popup-closed-by-user': 'Sign in was cancelled. Please try again',
        'auth/popup-blocked': 'Pop-up was blocked by your browser. Please allow pop-ups for this site',
        'auth/cancelled-popup-request': 'Multiple pop-up requests were made. Please try again',
        'auth/account-exists-with-different-credential': 'An account already exists with the same email address but different sign-in credentials'
      };

      return errorMessages[error.code] || error.message;
    }
  }
}); 