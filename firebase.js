import {getFirestore, addDoc, collection} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
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
  const db = getFirestore(app)

  const scorecard = {
    username: "Avin",
    score: 50
  }
   addDoc(collection(db,"scores"), scorecard).then((docref)=>{
    console.log("added")
   })
  

  console.log(app)

