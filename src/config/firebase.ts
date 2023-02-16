import { FirebaseOptions, initializeApp } from "firebase/app";

const FirebaseCredentials: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: "veggieclub-ar.appspot.com",
};


export default initializeApp(FirebaseCredentials);

