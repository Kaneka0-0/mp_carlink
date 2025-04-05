import { addDoc, collection, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

export const COLLECTIONS = {
  VEHICLES: 'vehicles',
  BIDS: 'bids',
} as const;

export interface Vehicle {
  id?: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  color: string;
  mileage: number;
  description: string;
  images: string[];
  startingPrice: number;
  reservePrice?: number;
  status: 'active' | 'sold' | 'expired';
  createdAt: Timestamp;
}

export async function createVehicle(vehicleData: Omit<Vehicle, 'id' | 'createdAt'>) {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.VEHICLES), {
      ...vehicleData,
      createdAt: Timestamp.now(),
      status: 'active'
    });
    console.log("Vehicle created with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating vehicle:', error);
    throw new Error('Failed to create vehicle listing');
  }
}

export async function getVehicles() {
  try {
    const q = query(
      collection(db, COLLECTIONS.VEHICLES),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Vehicle[];
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw new Error('Failed to fetch vehicle listings');
  }
}