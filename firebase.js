// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, addDoc, collection } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4a29FPTFWzvCUldnmHSTTUD0EtflNSOs",
  authDomain: "pixends-3aaf2.firebaseapp.com",
  projectId: "pixends-3aaf2",
  storageBucket: "pixends-3aaf2.appspot.com",
  messagingSenderId: "1056156909593",
  appId: "1:1056156909593:web:6f443d83e9479ea2d62a88",
  measurementId: "G-7DV087EY07"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Example usage of authentication and Firestore
document.getElementById('google-auth').addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .then(result => {
      console.log(result.user);
    })
    .catch(error => {
      console.error(error.message);
    });
});

// signup
document.getElementById('signup-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = e.target['signup-name'].value;
  const email = e.target['signup-email'].value;
  const password = e.target['signup-password'].value;

  window.globalName = name
  localStorage.setItem('name',window.globalName) 
  
  createUserWithEmailAndPassword(auth, email, password)
    .then(cred => {
      console.log("User Created:", cred.user);
      alert("User Created Successfully");
      e.target.reset();
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        alert('Email already in use. Please use a different email.');
      } else {
        console.error(error.message);
        alert(error.message);
      }
    });
});

onAuthStateChanged(auth, user => {
  if(user)
    {
      addDoc(collection(db, "scores"), {
        uid: user.uid,
        username: window.globalName,
        score: 50
      }).then(docRef => {
        console.log("Document written with ID: ", docRef.id);
      }).catch(error => {
        console.error("Error adding document: ", error);
      });
    }
});
onAuthStateChanged(auth, user => {
  if (user) {
    setupUI(user);
  } else {
    setupUI();
  }
});

// adding scores to firestore


const setupUI = (user) => {
  const loggedOutLinks = document.querySelectorAll('.logged-out');
  const loggedInLinks = document.querySelectorAll('.logged-in');
  
  if (user) {
    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
  } else {
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
  }
};

// logout
document.querySelector('#logout').addEventListener('click', (e) => {
  e.preventDefault();
  signOut(auth)
    .then(() => {
      console.log('User signed out');
    })
    .catch(error => {
      console.error(error.message);
    });
});

// login
document.querySelector('#login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = e.target['login-email'].value;
  const password = e.target['login-password'].value;
 
  signInWithEmailAndPassword(auth, email, password)
    .then(cred => {
      console.log("User Logged In:", cred.user.uid);
      e.target.reset();
      // Assuming you have a way to hide the modal
      document.querySelector('#login-modal').classList.remove('show');
    })
    .catch(error => {
      console.error(error.message);
    });
});

const scoresContainer = document.getElementById('scores-container');

async function fetchScores() {
  const querySnapshot = await getDocs(collection(db, "scores"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    createScoreCard(data.username, data.score);
  });
}

function createScoreCard(username, score) {
  const card = document.createElement('div');
  card.classList.add('col-md-4', 'mb-4');

  card.innerHTML = `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">${username}</h5>
        <p class="card-text">Score: ${score}</p>
      </div>
    </div>
  `;

  scoresContainer.appendChild(card);
}

fetchScores();

