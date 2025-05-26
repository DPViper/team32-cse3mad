import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '@/lib/firebaseConfig';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export async function pickImage(): Promise<string | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.7,
  });
  if (!result.canceled && result.assets.length > 0) {
    return result.assets[0].uri;
  }
  return null;
}

export async function uploadImageAsync(uri: string, userId: string): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  const filename = `${userId}_${Date.now()}.jpg`;
  const storage = getStorage();
  const storageRef = ref(storage, `comments/${filename}`);
  await uploadBytes(storageRef, blob);
  return await getDownloadURL(storageRef);
}
