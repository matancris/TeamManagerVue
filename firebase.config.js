import firebase from 'firebase/app'
import 'firebase/firestore'


var firebaseConfig = {
    apiKey: "AIzaSyATh9qp3Cnu-XCqtWcrRo3UQikYpzE44OU",
    authDomain: "team-manager-mc.firebaseapp.com",
    projectId: "team-manager-mc",
    storageBucket: "team-manager-mc.appspot.com",
    messagingSenderId: "453929113118",
    appId: "1:453929113118:web:19ce8c8301409b1300c00f",
    measurementId: "G-130DTHHQQD"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // firebase.analytics();