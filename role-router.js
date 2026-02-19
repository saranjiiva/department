// role-router.js

import { auth, db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

// ==============================
// ROLE ROUTER + PAGE PROTECTION
// ==============================

onAuthStateChanged(auth, async (user) => {

  const currentPath = window.location.pathname;

  // If not logged in → always go to index
  if (!user) {
    if (!currentPath.endsWith("index.html")) {
      window.location.href = "/index.html";
    }
    return;
  }

  try {

    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists()) {
      alert("User role not assigned.");
      return;
    }

    const role = userDoc.data().role;

    // =============================
    // REDIRECT FROM INDEX
    // =============================

    if (currentPath.endsWith("index.html") || currentPath === "/") {

      if (role === "admin") {
        window.location.href = "/admin/admin.html";
      }
      else if (role === "faculty") {
        window.location.href = "/faculty/faculty.html";
      }
      else if (role === "student") {
        window.location.href = "/student/student.html";
      }

      return;
    }

    // =============================
    // PROTECT ADMIN PAGE
    // =============================

    if (currentPath.includes("/admin/") && role !== "admin") {
      alert("Unauthorized access.");
      window.location.href = "/index.html";
    }

    // =============================
    // PROTECT FACULTY PAGE
    // =============================

    if (currentPath.includes("/faculty/") && role !== "faculty") {
      alert("Unauthorized access.");
      window.location.href = "/index.html";
    }

    // =============================
    // PROTECT STUDENT PAGE
    // =============================

    if (currentPath.includes("/student/") && role !== "student") {
      alert("Unauthorized access.");
      window.location.href = "/index.html";
    }

  } catch (error) {
    console.error("Role routing error:", error);
  }

});
