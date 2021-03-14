import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/firestore";
import "firebase/auth";

// Initialize Cloud Firestore through Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC1HVubj72Lrw-sNgWpixRCggSCHwkMvsE",
  authDomain: "impossible-hotel.firebaseapp.com",
  databaseURL: "https://impossible-hotel-default-rtdb.firebaseio.com",
  projectId: "impossible-hotel",
  storageBucket: "impossible-hotel.appspot.com",
  messagingSenderId: "442004868702",
  appId: "1:442004868702:web:578c0931521ef1e2f52ecf",
  measurementId: "G-9JKH0Q3J5Q"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

firebase.getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

export default firebase;
export const db = firebase.firestore();
export const auth = firebase.auth();
