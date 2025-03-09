import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBCKOTd8bWiJLAs8N3gGCSKjeAptvTiGY4",
  authDomain: "compa-c4148.firebaseapp.com",
  projectId: "compa-c4148",
  storageBucket: "compa-c4148.firebasestorage.app",
  messagingSenderId: "744703279179",
  appId: "1:744703279179:web:e7410f4f4bd9436bf10dce",
  measurementId: "G-SWTDD9NET8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);
auth.useDeviceLanguage(); // Set authentication language to match device

// Initialize Analytics
const analytics = getAnalytics(app);

export { auth, analytics };