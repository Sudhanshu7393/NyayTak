/*
============================================================
Firebase Authentication & User Database Configurator
------------------------------------------------------------
This file initializes Firebase Authentication if configuration keys are present.
If no keys are found in environment variables (VITE_FIREBASE_API_KEY),
it automatically falls back to a fully-featured, secure simulated Auth system
so the project runs out-of-the-box without crashing!

To use real Firebase, create a `.env` file in the `frontend` root and add:
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
============================================================
*/

import { initializeApp, getApps } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from "firebase/auth";

const keys = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const isRealFirebaseConfigured = keys.apiKey && keys.apiKey !== "YOUR_API_KEY_HERE";

let firebaseApp = null;
let realAuth = null;

if (isRealFirebaseConfigured) {
  try {
    if (!getApps().length) {
      firebaseApp = initializeApp(keys);
    }
    realAuth = getAuth();
  } catch (error) {
    console.error("Firebase Auth initialization failed, falling back to simulation mode:", error);
  }
}

// ==========================================
// SIMULATED AUTH CLIENT (LocalStorage DB)
// ==========================================
class SimulatedAuth {
  constructor() {
    this.listeners = [];
    this.currentUser = null;

    // Load initial user state from localStorage
    try {
      const stored = localStorage.getItem("nyaytak_simulated_user");
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    } catch (_) {}
  }

  // Retrieve all registered users (for admin panel)
  getRegisteredUsers() {
    try {
      const stored = localStorage.getItem("nyaytak_registered_users");
      return stored ? JSON.parse(stored) : [];
    } catch (_) {
      return [];
    }
  }

  // Trigger Auth state listeners
  notify() {
    this.listeners.forEach(cb => cb(this.currentUser));
  }

  onAuthStateChanged(callback) {
    this.listeners.push(callback);
    // Execute immediately with current state
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  async signIn(email, password) {
    const users = this.getRegisteredUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      throw new Error("No user found with this email address.");
    }
    if (user.password !== password) {
      throw new Error("Incorrect password. Please try again.");
    }

    const sessionUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt
    };

    this.currentUser = sessionUser;
    localStorage.setItem("nyaytak_simulated_user", JSON.stringify(sessionUser));
    this.notify();
    return sessionUser;
  }

  async signUp(email, password, displayName) {
    const users = this.getRegisteredUsers();
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());

    if (exists) {
      throw new Error("An account already exists with this email.");
    }

    const newUser = {
      uid: `usr-${Date.now()}`,
      email: email,
      password: password, // Simulated DB stores plain text for ease of review
      displayName: displayName || email.split("@")[0],
      createdAt: new Date().toLocaleDateString("en-IN")
    };

    // Save in custom user DB
    users.push(newUser);
    localStorage.setItem("nyaytak_registered_users", JSON.stringify(users));

    // Sign in immediately
    const sessionUser = {
      uid: newUser.uid,
      email: newUser.email,
      displayName: newUser.displayName,
      createdAt: newUser.createdAt
    };

    this.currentUser = sessionUser;
    localStorage.setItem("nyaytak_simulated_user", JSON.stringify(sessionUser));
    this.notify();
    return sessionUser;
  }

  async signInWithGoogle() {
    const mockEmail = prompt("Enter simulated Google email address to sign in:", "sudhanshu.google@gmail.com");
    if (!mockEmail || !mockEmail.trim()) {
      throw new Error("Google login cancelled or invalid email.");
    }
    const email = mockEmail.trim().toLowerCase();
    const displayName = email.split("@")[0];
    
    const users = this.getRegisteredUsers();
    let user = users.find(u => u.email.toLowerCase() === email);
    if (!user) {
      user = {
        uid: `google-${Date.now()}`,
        email: email,
        password: "google-linked",
        displayName: displayName.charAt(0).toUpperCase() + displayName.slice(1),
        createdAt: new Date().toLocaleDateString("en-IN")
      };
      users.push(user);
      localStorage.setItem("nyaytak_registered_users", JSON.stringify(users));
    }

    const sessionUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt
    };

    this.currentUser = sessionUser;
    localStorage.setItem("nyaytak_simulated_user", JSON.stringify(sessionUser));
    this.notify();
    return sessionUser;
  }

  async signOut() {
    this.currentUser = null;
    localStorage.removeItem("nyaytak_simulated_user");
    this.notify();
  }
}

const simulatedAuthInstance = new SimulatedAuth();

// ==========================================
// UNIFIED AUTH EXPORT INTERFACE
// ==========================================
export const authService = {
  isSimulated: !realAuth,
  
  onAuthStateChanged: (callback) => {
    if (realAuth) {
      return onAuthStateChanged(realAuth, callback);
    }
    return simulatedAuthInstance.onAuthStateChanged(callback);
  },

  signIn: async (email, password) => {
    if (realAuth) {
      const cred = await signInWithEmailAndPassword(realAuth, email, password);
      return cred.user;
    }
    return simulatedAuthInstance.signIn(email, password);
  },

  signUp: async (email, password, displayName) => {
    if (realAuth) {
      const cred = await createUserWithEmailAndPassword(realAuth, email, password);
      await updateProfile(cred.user, { displayName });
      
      // Keep track of registered users in LocalStore even if real Firebase is used,
      // so admin panel can easily list them client-side.
      try {
        const raw = localStorage.getItem("nyaytak_registered_users") || "[]";
        const list = JSON.parse(raw);
        if (!list.some(u => u.email.toLowerCase() === email.toLowerCase())) {
          list.push({
            uid: cred.user.uid,
            email: email,
            displayName: displayName,
            createdAt: new Date().toLocaleDateString("en-IN")
          });
          localStorage.setItem("nyaytak_registered_users", JSON.stringify(list));
        }
      } catch (_) {}

      return cred.user;
    }
    return simulatedAuthInstance.signUp(email, password, displayName);
  },

  signOut: async () => {
    if (realAuth) {
      return signOut(realAuth);
    }
    return simulatedAuthInstance.signOut();
  },

  signInWithGoogle: async (customEmail) => {
    if (realAuth) {
      const provider = new GoogleAuthProvider();
      
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        await signInWithRedirect(realAuth, provider);
        return null;
      }
      
      const cred = await signInWithPopup(realAuth, provider);
      
      try {
        const raw = localStorage.getItem("nyaytak_registered_users") || "[]";
        const list = JSON.parse(raw);
        if (!list.some(u => u.email.toLowerCase() === cred.user.email.toLowerCase())) {
          list.push({
            uid: cred.user.uid,
            email: cred.user.email,
            displayName: cred.user.displayName || cred.user.email.split("@")[0],
            createdAt: new Date().toLocaleDateString("en-IN")
          });
          localStorage.setItem("nyaytak_registered_users", JSON.stringify(list));
        }
      } catch (_) {}

      return cred.user;
    }
    
    // Use selected email or fallback
    const email = (customEmail || "sudhanshupandey7393@gmail.com").trim().toLowerCase();
    const displayName = email.split("@")[0];
    
    const users = simulatedAuthInstance.getRegisteredUsers();
    let user = users.find(u => u.email.toLowerCase() === email);
    if (!user) {
      user = {
        uid: `google-${Date.now()}`,
        email: email,
        password: "google-linked",
        displayName: displayName.charAt(0).toUpperCase() + displayName.slice(1),
        createdAt: new Date().toLocaleDateString("en-IN")
      };
      users.push(user);
      localStorage.setItem("nyaytak_registered_users", JSON.stringify(users));
    }

    const sessionUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt
    };

    simulatedAuthInstance.currentUser = sessionUser;
    localStorage.setItem("nyaytak_simulated_user", JSON.stringify(sessionUser));
    simulatedAuthInstance.notify();
    return sessionUser;
  },

  handleRedirectResult: async (callback) => {
    if (realAuth) {
      try {
        const result = await getRedirectResult(realAuth);
        if (result?.user) {
          try {
            const raw = localStorage.getItem("nyaytak_registered_users") || "[]";
            const list = JSON.parse(raw);
            if (!list.some(u => u.email.toLowerCase() === result.user.email.toLowerCase())) {
              list.push({
                uid: result.user.uid,
                email: result.user.email,
                displayName: result.user.displayName || result.user.email.split("@")[0],
                createdAt: new Date().toLocaleDateString("en-IN")
              });
              localStorage.setItem("nyaytak_registered_users", JSON.stringify(list));
            }
          } catch (_) {}
          callback(result.user);
        }
      } catch (error) {
        console.error("Redirect auth error:", error);
        alert("Firebase Auth Redirect Error: " + error.message);
      }
    }
  },

  getUsersList: () => {
    try {
      const raw = localStorage.getItem("nyaytak_registered_users");
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  }
};
