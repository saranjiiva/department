// auth.js

import { auth } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

// ============================
// LOGIN FUNCTION
// ============================

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", async () => {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorBox = document.getElementById("error");

    errorBox.textContent = "";

    if (!email || !password) {
      errorBox.textContent = "Please enter email and password.";
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Role routing will automatically handle redirect
    } catch (error) {
      errorBox.textContent = error.message;
    }

  });
}

// ============================
// LOGOUT FUNCTION
// ============================

window.logout = async function () {
  try {
    await signOut(auth);
    window.location.href = "/index.html";
  } catch (error) {
    console.error("Logout Error:", error);
  }
};

// ============================
// OPTIONAL: PROTECT INDEX PAGE
// If already logged in, redirect automatically
// ============================

onAuthStateChanged(auth, (user) => {
  if (user && window.location.pathname.endsWith("index.html")) {
    // Role router will redirect
  }
});
