import { db } from "@/lib/firebaseConfig";
import {
  doc,
  getDocs,
  collection,
  updateDoc,
  addDoc,
  setDoc,
} from "firebase/firestore";

// Tính average rating của 1 POI từ Firestore
export const calculateAverageRating = async (
  poiId: string
): Promise<number> => {
  try {
    const ratingsSnapshot = await getDocs(
      collection(db, `pois/${poiId}/ratings`)
    );
    const ratings = ratingsSnapshot.docs.map((doc) => doc.data().value);
    const avg =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
        : 0;

    await updateDoc(doc(db, "pois", poiId), {
      averageRating: avg,
    });

    return avg;
  } catch (error) {
    console.error("🔥 Error calculating average rating:", error);
    return 0;
  }
};

// Lưu POI mới kèm rating ban đầu của người dùng
export const savePOI = async (
  poi: {
    title: string;
    description: string;
    coordinate: { latitude: number; longitude: number };
    rating?: number;
    image?: string;
  },
  user: { uid: string },
  rating: number
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "pois"), {
      title: poi.title,
      description: poi.description,
      latitude: poi.coordinate.latitude,
      longitude: poi.coordinate.longitude,
      rating: rating,
      averageRating: rating,
      image: poi.image ?? null,
      createdBy: user.uid,
      createdAt: new Date(),
    });

    await setDoc(doc(db, `pois/${docRef.id}/ratings/${user.uid}`), {
      value: rating,
      ratedAt: new Date(),
    });

    await calculateAverageRating(docRef.id);
    return docRef.id;
  } catch (err) {
    console.error("🔥 Error saving POI:", err);
    throw err;
  }
};
