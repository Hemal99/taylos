import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const storage = getStorage(firebaseApp);

export async function uploadImageToFirebase(imageFile: File, folder: string): Promise<string> {
    if (!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) {
        throw new Error('Firebase Storage bucket is not configured. Please set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET in your .env file.');
    }
    const filePath = `${folder}/${Date.now()}-${imageFile.name}`;
    const storageRef = ref(storage, filePath);
    
    await uploadBytes(storageRef, imageFile);
    
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
}
