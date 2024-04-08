import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDa4b8fxACXQCuoVVJLukpAKGeGsNq_M_M",
  authDomain: "tickets-c9421.firebaseapp.com",
  projectId: "tickets-c9421",
  storageBucket: "tickets-c9421.appspot.com",
  messagingSenderId: "1037299538007",
  appId: "1:1037299538007:web:bc4c3ba8c329287008eb12",
  measurementId: "G-C53S2MYDWV",
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const database = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, database, storage };
