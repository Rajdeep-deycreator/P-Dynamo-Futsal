// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFgu3vBf9K0iclJwhGpq0pM0grbFp81-E",
  authDomain: "p-dynamo-futsal.firebaseapp.com",
  projectId: "p-dynamo-futsal",
  storageBucket: "p-dynamo-futsal.firebasestorage.app",
  messagingSenderId: "430197265354",
  appId: "1:430197265354:web:12fec9347ca3c7cac7f533",
  measurementId: "G-SFFEKX53TN"
};

firebase.initializeApp(firebaseConfig)
const db=firebase.firestore()
const auth=firebase.auth()
const analytics= firebase.analytics()
