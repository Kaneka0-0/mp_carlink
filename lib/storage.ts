import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "./firebase";

/**
 * Uploads an array of image files to Firebase Storage and returns their download URLs.
 * @param files Array of image files to upload.
 * @returns Array of download URLs.
 */
export async function uploadVehicleImages(files: File[]): Promise<string[]> {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be authenticated to upload images");
    }

    const uploadPromises = files.map(async (file) => {
      const storageRef = ref(storage, `vehicles/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    });

    return Promise.all(uploadPromises);
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
}

interface VehicleData {
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
  createdAt: Date;
}

export async function createVehicleListing(vehicleData: VehicleData) {
  try {
    const docRef = await addDoc(collection(db, "vehicles"), {
      ...vehicleData,
      createdAt: new Date(),
      status: 'active'
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating vehicle listing:", error);
    throw error;
  }
}