// src/lib/eventsApi.ts
import { db } from "./firebase"; // Import the initialized Firestore instance
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy, // Optional: to order events by date
  Timestamp // Import Timestamp for date fields
} from "firebase/firestore";

// Define the structure of event data (when adding/updating)
export interface EventData {
  title: string;
  description: string;
  date: Timestamp; // Use Firestore Timestamp for dates
  time?: string; // Optional time
  location?: string; // Optional location
  // You might want to add a timestamp for ordering or tracking creation
  // createdAt?: import("firebase/firestore").Timestamp;
}

// Interface for Event including the Firestore document ID
export interface Event extends EventData {
  id: string;
}

const eventsCollectionRef = collection(db, "events");

// GET all events
export const getEvents = async (): Promise<Event[]> => {
  try {
    // Order by date, descending (most recent first)
    const q = query(eventsCollectionRef, orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);

    const events = querySnapshot.docs.map(doc => {
        const data = doc.data() as EventData;
        // Convert Firestore Timestamp to JS Date if needed for display,
        // but keep as Timestamp in the base data if preferred.
        // Example conversion: date: (data.date as Timestamp).toDate()
        return {
            id: doc.id,
            ...data,
        };
    });
    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

// ADD a new event
export const addEvent = async (eventData: EventData) => {
  try {
    // Ensure date is a Firestore Timestamp if it isn't already
    const dataToAdd = {
        ...eventData,
        date: eventData.date instanceof Timestamp ? eventData.date : Timestamp.fromDate(eventData.date) // Ensure date is Timestamp
    };
    const docRef = await addDoc(eventsCollectionRef, dataToAdd);
    return { id: docRef.id, ...dataToAdd }; // Return the new event with its ID
  } catch (error) {
    console.error("Error adding event:", error);
    throw error;
  }
};

// UPDATE an existing event
export const updateEvent = async (id: string, updatedData: Partial<EventData>) => {
  try {
    const eventDocRef = doc(db, "events", id);
    // Ensure date is a Firestore Timestamp if it's being updated
    const dataToUpdate = { ...updatedData };
    if (dataToUpdate.date && !(dataToUpdate.date instanceof Timestamp)) {
        dataToUpdate.date = Timestamp.fromDate(dataToUpdate.date as any); // Convert if necessary
    }
    await updateDoc(eventDocRef, dataToUpdate);
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

// DELETE an event
export const deleteEvent = async (id: string) => {
  try {
    const eventDocRef = doc(db, "events", id);
    await deleteDoc(eventDocRef);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

// Helper function to convert JS Date to Firestore Timestamp
export { Timestamp }; // Re-export Timestamp for convenience
