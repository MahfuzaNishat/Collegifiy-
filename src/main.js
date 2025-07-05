// Firebase v11 SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";


// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDG4eAORtyVbHGTw77X8NvKI35bY8sFfHo",
  authDomain: "collegefiy-project.firebaseapp.com",
  projectId: "collegefiy-project",
  storageBucket: "collegefiy-project.appspot.com",
  messagingSenderId: "958461136942",
  appId: "1:958461136942:web:9760a30af100b08ad5cfbf",
  measurementId: "G-V6558TBZQS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);


console.log("✅ Firebase initialized.");

const form = document.querySelector("form");
const pageTitle = document.title.toLowerCase();

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value.trim();

    if (!email || !password) {
      alert("Email and password are required!");
      return;
    }

    try {
      if (pageTitle.includes("create account")) {
        const firstName = document.getElementById("firstName")?.value.trim();
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
    
        writeUserData(user.uid, firstName, email);

            console.log(" Account created:", user);
            alert("Account created successfully! Redirecting...");
            window.location.href = "../html/dashboard.html";
          } else if (pageTitle.includes("login")) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log(" Logged in:", userCredential.user);
        alert("Login successful! Redirecting...");
        window.location.href = "../dashboard.html";
      } else {
        alert("Unknown page. Check your HTML <title>.");
      }
    } catch (error) {
      console.error("❌ Firebase error:", error.code || error.message);
      alert("Error: " + (error.message || "Something went wrong"));
    }
  });
  function writeUserData(userId, firstName, email) {
    console.log("⏳ Writing to DB:", userId, firstName, email);
    set(ref(db, 'user/' + userId), {
      firstName: firstName,
      email: email
    });
  }
  
  
  }
  

