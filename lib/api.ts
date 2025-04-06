import { db } from "@/lib/firebase";
import { addDoc, collection, deleteDoc, doc, FieldValue, getDoc, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";
import { deleteObject, getStorage, ref } from "firebase/storage";

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
  status: 'active' | 'sold' | 'cancelled';
  createdAt: FieldValue | Date;
  sellerId: string;
}

export async function submitNewVehicle(formData: VehicleData, userId: string) {
  try {
    // Create a clean object without undefined values
    const vehicleData: VehicleData = {
      brand: formData.brand,
      model: formData.model,
      year: formData.year,
      type: formData.type,
      color: formData.color,
      mileage: formData.mileage,
      description: formData.description,
      images: formData.images,
      startingPrice: formData.startingPrice,
      status: formData.status,
      createdAt: serverTimestamp(),
      sellerId: userId,
    };

    // Only add reservePrice if it exists and is not undefined
    if (formData.reservePrice !== undefined) {
      vehicleData.reservePrice = formData.reservePrice;
    }

    console.log("Submitting vehicle data:", vehicleData);

    // Add vehicle to Firestore
    const docRef = await addDoc(collection(db, "vehicles"), vehicleData);
    console.log("Vehicle submitted successfully with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error submitting vehicle:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to submit vehicle: ${error.message}`);
    }
    throw new Error("Failed to submit vehicle");
  }
}

export async function getAllVehicles() {
  try {
    const q = query(collection(db, "vehicles"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    throw new Error("Failed to fetch vehicles");
  }
}

export async function deleteVehicle(vehicleId: string, userId: string) {
  try {
    const vehicleRef = doc(db, "vehicles", vehicleId);
    const vehicleDoc = await getDoc(vehicleRef);

    if (!vehicleDoc.exists()) {
      throw new Error("Vehicle not found");
    }

    const vehicleData = vehicleDoc.data();
    if (vehicleData.sellerId !== userId) {
      throw new Error("You don't have permission to delete this vehicle");
    }

    // Delete the vehicle document
    await deleteDoc(vehicleRef);

    // Delete associated images from storage if they exist
    if (vehicleData.images && vehicleData.images.length > 0) {
      const storage = getStorage();
      const storageRef = ref(storage, `vehicles/${userId}/${vehicleId}`);
      await deleteObject(storageRef);
    }

    return true;
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    throw error;
  }
}