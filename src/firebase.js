import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // 🔹 Firestore を追加
import { getStorage } from "firebase/storage"; // 🔹 Storage を追加
import { getAuth } from "firebase/auth";

// Firebase の設定
const firebaseConfig = {
  //
};

// Firebase を初期化
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // 🔹 Firestore を初期化
const storage = getStorage(app); // 🔹 Storage を初期化
const auth = getAuth(app);
// `db` と `storage` をエクスポート
export { db, storage, auth };
