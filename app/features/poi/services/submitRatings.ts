// services/submitRating.ts
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

export const submitRating = async (itemId: string, userId: string, rating: number, comment: string) => {
  try {
    await addDoc(collection(db, 'ratings'), {
      itemId,
      userId,
      rating,
      comment,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error adding rating: ', error);
  }
};