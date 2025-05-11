// services/submitRating.ts
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

type SubmitRatingProps = {
  poiId: string;
  rating: number;
  user: any;
};

export async function SubmitRating({poiId, rating, user} : SubmitRatingProps) {
  try {
    await addDoc(collection(db, `pois/${poiId}/ratings`), {
      userId: user.uid,
      rating,
      createdAt: serverTimestamp(),
    });
  } catch (error : any) {
    console.error('Error adding rating: ', error);
  }
};