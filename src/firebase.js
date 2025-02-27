import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // 🔹 Firestore を追加
import { getStorage } from "firebase/storage"; // 🔹 Storage を追加
import { getAuth } from "firebase/auth";

// Firebase の設定
const firebaseConfig = {
  apiKey: "AIzaSyCRnrK-yoLvx75Kzqlqj_M6j-apwoo8-3s",
  authDomain: "kyoto-solution.firebaseapp.com",
  projectId: "kyoto-solution",
  storageBucket: "kyoto-solution.firebasestorage.app",
  messagingSenderId: "26152406786",
  appId: "1:26152406786:web:e14ba94f35b544ce613c1b",
  measurementId: "G-GVTB64WNJQ",
};

// Firebase を初期化
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // 🔹 Firestore を初期化
const storage = getStorage(app); // 🔹 Storage を初期化
const auth = getAuth(app);
// `db` と `storage` をエクスポート
export { db, storage, auth };
