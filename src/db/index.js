import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import "firebase/compat/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyDp6GFMkRhlEDO8a_rLdPdtzxok2Buc3nk",
  authDomain: "focusmix-c67ff.firebaseapp.com",
  projectId: "focusmix-c67ff",
  storageBucket: "focusmix-c67ff.appspot.com",
  messagingSenderId: "484961684464",
  appId: "1:484961684464:web:981747934f659ff7562b35",
  measurementId: "G-1LBFMB95YZ"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
export { firebase, db, auth }