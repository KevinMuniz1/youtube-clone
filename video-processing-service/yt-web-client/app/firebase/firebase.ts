// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged,User} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAQyQh7eCZY9fTo15xBQWmCM0pSJ_1OfY",
  authDomain: "yt-clone-fd4db.firebaseapp.com",
  projectId: "yt-clone-fd4db",
  appId: "1:113049567368:web:0d172d20251c0c62e69f3d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export function signInWithGoogle(){

    return signInWithPopup(auth, new GoogleAuthProvider());
}

export function signOut(){

    return auth.signOut();
}

export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}