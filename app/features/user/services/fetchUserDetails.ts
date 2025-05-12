// app/features/poi/services/fetchUserDetails.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export type UserProfile = {
  displayName: string;
  email: string;
  phone: string;
  avatar: string;
  activeLevel: string;
  createdAt: any;
  userID: string;
};

export const fetchUserDetails = async (
  userId: string
): Promise<UserProfile | null> => {
  if (!userId) return null;

  try {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);
    console.log("User data:", docSnap.data());
    if (docSnap.exists()) {
      const data = docSnap.data() as UserProfile;
      return data;
    } else {
      console.warn("No user document found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};
