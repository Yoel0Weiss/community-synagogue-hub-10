// src/lib/prayerTimeApi.ts
import { db } from "./firebase"; // Import the initialized Firestore instance
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy // Optional: to order the results
} from "firebase/firestore";

// Define the structure of a prayer time object based on PrayerTimesManager.tsx
// Note: Firestore generates the 'id', so we don't include it when adding.
// We'll receive it back from Firestore after adding or fetching.
export interface PrayerTimeData {
  location: string;
  type: string; // 'שחרית', 'מנחה', 'ערבית'
  day: string; // 'רגיל', 'ימים ב׳-ה׳', etc.
  time: string;
  // You might want to add a timestamp for ordering or tracking
  // createdAt?: import("firebase/firestore").Timestamp;
}

// Interface for PrayerTime including the Firestore document ID
export interface PrayerTime extends PrayerTimeData {
  id: string;
}

const prayerTimesCollectionRef = collection(db, "prayerTimes");

// GET all prayer times
export const getPrayerTimes = async (): Promise<PrayerTime[]> => {
  try {
    // Optional: Order by a specific field, e.g., type or a timestamp
    // const q = query(prayerTimesCollectionRef, orderBy("type"));
    // const querySnapshot = await getDocs(q);

    const querySnapshot = await getDocs(prayerTimesCollectionRef);
    const prayerTimes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() ? doc.data() as PrayerTimeData : { location: "", type: "", day: "", time: "" }),
    }));
    return prayerTimes;
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

// ADD a new prayer time
export const addPrayerTime = async (prayerData: PrayerTimeData) => {
  try {
    // Optional: Add a server timestamp if needed
    // const dataWithTimestamp = { ...prayerData, createdAt: serverTimestamp() };
    const docRef = await addDoc(prayerTimesCollectionRef, prayerData);
    return { id: docRef.id, ...prayerData }; // Return the new prayer time with its ID
  } catch (error) {
    console.error("Error adding prayer time:", error);
    throw error;
  }
};

// UPDATE an existing prayer time
export const updatePrayerTime = async (id: string, updatedData: Partial<PrayerTimeData>) => {
  try {
    const prayerDocRef = doc(db, "prayerTimes", id);
    await updateDoc(prayerDocRef, updatedData);
  } catch (error) {
    console.error("Error updating prayer time:", error);
    throw error;
  }
};

// DELETE a prayer time
export const deletePrayerTime = async (id: string) => {
  try {
    const prayerDocRef = doc(db, "prayerTimes", id);
    await deleteDoc(prayerDocRef);
  } catch (error) {
    console.error("Error deleting prayer time:", error);
    throw error;
  }
};
