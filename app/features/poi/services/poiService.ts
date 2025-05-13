import { db } from "@/lib/firebaseConfig";
import {
  doc,
  getDocs,
  getDoc,
  collection,
  updateDoc,
  addDoc,
  setDoc,
} from "firebase/firestore";
import { POI } from "../type";

// Fetches full POI info from Firestore
export const getPOIDetails = async (poiId: string): Promise<POI | null> => {
  try {
    const docRef = doc(db, "pois", poiId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as POI;
    }
    return null;
  } catch (error) {
    console.error("Error fetching POI details:", error);
    return null;
  }
};

// Fetches all comments for a POI
export const getPOIComments = async (poiId: string) => {
  try {
    const commentsRef = collection(db, "pois", poiId, "comments");
    const snapshot = await getDocs(commentsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching POI comments:", error);
    return [];
  }
};

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
    id: string;
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
    const docRef = doc(db, "pois", poi.id);
    await setDoc(docRef, {
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
