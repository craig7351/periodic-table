
import { db } from "./firebaseConfig";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp
} from "firebase/firestore";
import { GuestMessage, GuestbookTag } from "../types";

const VISITOR_DOC_ID = "counter";
const STATS_COLLECTION = "stats";
const MESSAGES_COLLECTION = "guestbook";

// --- Visitor Counter Logic ---

export const initializeVisitorCounter = async () => {
  if (!db) return;

  const docRef = doc(db, STATS_COLLECTION, VISITOR_DOC_ID);

  try {
    // Try to update directly (increment)
    await updateDoc(docRef, {
      count: increment(1)
    });
  } catch (error: any) {
    // If document doesn't exist, create it
    if (error.code === 'not-found' || error.message.includes('No document to update')) {
        await setDoc(docRef, { count: 1 });
    } else {
        console.error("Error updating visitor count:", error);
    }
  }
};

export const subscribeToVisitorCount = (callback: (count: number) => void) => {
  if (!db) {
    callback(1234); // Fallback for demo if firebase not configured
    return () => {};
  }

  const docRef = doc(db, STATS_COLLECTION, VISITOR_DOC_ID);
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data().count);
    }
  });
};

// --- Guestbook Logic ---

export const addMessage = async (name: string, content: string, tag: GuestbookTag) => {
  if (!db) throw new Error("Firebase not initialized");

  // Random villager emoji
  const avatars = ["🦝", "🦊", "🐱", "🐶", "🐰", "🐨", "🦁", "🐷", "🐸", "🦉"];
  const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

  await addDoc(collection(db, MESSAGES_COLLECTION), {
    name,
    content,
    tag,
    avatar: randomAvatar,
    timestamp: serverTimestamp()
  });
};

export const subscribeToMessages = (callback: (msgs: GuestMessage[]) => void) => {
  if (!db) {
      // Demo data if firebase not configured
      callback([
          { name: "西施惠", content: "歡迎來到元素週期表！", timestamp: { seconds: Date.now()/1000 }, avatar: "🐶", tag: "一般留言" },
          { name: "貍克", content: "記得要還貸款喔！", timestamp: { seconds: Date.now()/1000 }, avatar: "🦝", tag: "一般留言" }
      ]);
      return () => {};
  }

  const q = query(
    collection(db, MESSAGES_COLLECTION),
    orderBy("timestamp", "desc"),
    limit(50)
  );

  return onSnapshot(q, (snapshot) => {
    const msgs: GuestMessage[] = [];
    snapshot.forEach((doc) => {
      msgs.push({ id: doc.id, ...doc.data() } as GuestMessage);
    });
    callback(msgs);
  });
};
