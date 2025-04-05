import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";

/**
 * Uploads an array of image files to Firebase Storage and returns their download URLs.
 * @param files Array of image files to upload.
 * @returns Array of download URLs.
 */
export async function uploadVehicleImages(files: File[]): Promise<string[]> {
  const storage = getStorage();
  const imageUrls: string[] = [];

  for (const file of files) {
    console.log("Uploading file:", file.name);

    const fileExtension = file.name.split(".").pop();
    const fileName = `vehicles/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
    const storageRef = ref(storage, fileName);

    try {
      const uploadTask = uploadBytesResumable(storageRef, file);

      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload progress for ${file.name}: ${progress}%`);
          },
          (error) => {
            console.error("Upload error:", error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("Download URL:", downloadURL);
            imageUrls.push(downloadURL);
            resolve();
          }
        );
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  return imageUrls;
}