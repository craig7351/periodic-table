
import * as firebase from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: 請將下方的設定替換成您在 Firebase Console 取得的設定
// 請參考我提供的「第二部分：Firebase 設定教學」來填寫這裡
const firebaseConfig = {
  apiKey: "AIzaSyCvJdAbwEwTU_LWoJReVptF3t5ZsZR_M34",
  authDomain: "periodic-e63f2.firebaseapp.com",
  projectId: "periodic-e63f2",
  storageBucket: "periodic-e63f2.firebasestorage.app",
  messagingSenderId: "589683941228",
  appId: "1:589683941228:web:55b8362fa2608fd10c5d49"
};


// Initialize Firebase
// We use a try-catch to prevent the app from crashing if config is invalid during development
let app;
let db;

try {
    // Attempt to get initializeApp from namespace or default export to handle various environment configurations
    const init = (firebase as any).initializeApp || (firebase as any).default?.initializeApp;
    
    if (init) {
        app = init(firebaseConfig);
        db = getFirestore(app);
    } else {
        console.warn("Could not find initializeApp in firebase/app module");
    }
} catch (e: any) {
    // Log only the message to avoid potential circular reference issues with the Error object in some environments
    console.warn("Firebase 初始化失敗。請檢查 services/firebaseConfig.ts 中的設定。錯誤訊息:", e.message);
}

export { db };
