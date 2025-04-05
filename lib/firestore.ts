import { db } from "./firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";

export interface VehicleInput {
  brand: string;
  model: string;
  year: number;
  type: string;
  color: string;
  price: number;
  images: string[];
  ownerId: string;
  auctionEndsAt: Timestamp;
}

/**
 * Creates a new vehicle document in the Firestore `vehicles` collection.
 * @param vehicle Vehicle data to store.
 * @returns The ID of the created document.
 */
export async function createVehicle(vehicle: VehicleInput): Promise<string> {
  const docRef = await addDoc(collection(db, "vehicles"), {
    ...vehicle,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}