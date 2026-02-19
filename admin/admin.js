import { app } from "../firebase-config.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  addDoc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);

/* ==============================
   AUTH + ROLE CHECK
============================== */

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  const roleSnap = await getDocs(
    query(collection(db, "users"), where("uid", "==", user.uid))
  );

  if (roleSnap.empty) {
    alert("Access Denied");
    await signOut(auth);
    return;
  }

  const role = roleSnap.docs[0].data().role;

  if (role !== "admin") {
    alert("Unauthorized Access");
    window.location.href = "../index.html";
    return;
  }

  loadDashboardStats();
  loadUsers();
});

/* ==============================
   DASHBOARD STATS
============================== */

async function loadDashboardStats() {

  const usersSnap = await getDocs(collection(db, "users"));
  const sessionsSnap = await getDocs(
    query(collection(db, "attendanceSessions"), where("status", "==", "active"))
  );

  let students = 0;
  let faculty = 0;

  usersSnap.forEach(doc => {
    const role = doc.data().role;
    if (role === "student") students++;
    if (role === "faculty") faculty++;
  });

  document.getElementById("totalStudents").innerText = students;
  document.getElementById("totalFaculty").innerText = faculty;
  document.getElementById("activeSessions").innerText = sessionsSnap.size;
}

/* ==============================
   CREATE USER
============================== */

window.createUser = async function () {

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const role = document.getElementById("role").value;

  if (!name || !email) {
    alert("Fill all fields");
    return;
  }

  const defaultPassword = "Password@123"; // later generate random

  try {

    // Create Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      defaultPassword
    );

    const newUser = userCredential.user;

    // Save role in Firestore
    await setDoc(doc(db, "users", newUser.uid), {
      uid: newUser.uid,
      name,
      email,
      role,
      createdAt: new Date()
    });

    alert("User created successfully");

    // IMPORTANT: Re-login admin automatically
    await signOut(auth);
    window.location.reload();

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

/* ==============================
   LOAD USERS TABLE
============================== */

async function loadUsers() {

  const snapshot = await getDocs(collection(db, "users"));
  const tbody = document.querySelector("#userTable tbody");
  tbody.innerHTML = "";

  snapshot.forEach(docSnap => {

    const data = docSnap.data();

    const row = `
      <tr>
        <td>${data.name}</td>
        <td>${data.email}</td>
        <td>${data.role}</td>
      </tr>
    `;

    tbody.innerHTML += row;
  });
}

/* ==============================
   ADD SUBJECT
============================== */

window.addSubject = async function () {

  const subjectName = document
    .getElementById("subjectName")
    .value.trim();

  if (!subjectName) {
    alert("Enter subject name");
    return;
  }

  try {

    await addDoc(collection(db, "subjects"), {
      name: subjectName,
      createdAt: new Date()
    });

    alert("Subject Added");
    document.getElementById("subjectName").value = "";

  } catch (error) {
    console.error(error);
    alert("Error adding subject");
  }
};

/* ==============================
   LOGOUT
============================== */

window.logout = async function () {
  await signOut(auth);
  window.location.href = "../index.html";
};
