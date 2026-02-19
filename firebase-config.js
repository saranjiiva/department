// firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";

// 🔐 Your Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_ket4BhYuKPMSyVNL69w-LtK-u_WI_bo",
  authDomain: "department-portal-dc2e3.firebaseapp.com",
  projectId: "department-portal-dc2e3",
  storageBucket: "department-portal-dc2e3.firebasestorage.app",
  messagingSenderId: "52702310893",
  appId: "1:52702310893:web:58d50ee2ab7c0d844bf7e4",
  measurementId: "G-60YYWK6Q5S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Optional (not required for system logic)
export const analytics = getAnalytics(app);
