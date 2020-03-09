import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const fbConfig = {
  apiKey: "AIzaSyDiscmkrO7KwNMIVqQSGsViHCPgaA_Cty8",
  authDomain: "playandloot.firebaseapp.com",
  databaseURL: "https://playandloot.firebaseio.com",
  projectId: "playandloot",
  storageBucket: "playandloot.appspot.com",
  messagingSenderId: "651773897271",
  appId: "1:651773897271:web:48ba221d0f7d43a07c6db2"
};

try {
  firebase.initializeApp(fbConfig);
  firebase.firestore();
  console.log("Firebase init", new Date())
} catch (err) {
  console.error("An error occured", err);
}

export default firebase 