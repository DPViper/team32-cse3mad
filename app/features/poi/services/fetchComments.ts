// app/features/poi/services/fetchComments.ts
import { collection, onSnapshot, Unsubscribe } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export type Comment = {
  id: string;
  userId: string;
  displayName: string;
  comment: string;
  rating: number;
  createdAt: any;
  // Add any other fields your comments might have
};

/**
 * Sets up a real-time listener for comments on a specific POI
 * @param poiId The ID of the POI to fetch comments for
 * @param setComments A state setter function to update the comments list
 * @returns Unsubscribe function to stop listening to updates
 */
export const fetchComments = (
  poiId: string,
  setComments: (comments: Comment[]) => void
): Unsubscribe => {
  if (!poiId) {
    // Return a dummy unsubscribe function if no poiId
    return () => {};
  }

  const unsubscribe = onSnapshot(
    collection(db, `pois/${poiId}/comments`),
    (snapshot) => {
      try {
        const commentList = snapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("Comment data:", data);
          return {
            id: doc.id,
            ...data,
            displayName: data.displayName || "Anonymous",
            comment: data.comment || data.text || "",
            rating: data.rating || 0
          };
        }) as Comment[];
        
        setComments(commentList);
      } catch (error) {
        console.error("Error processing comments:", error);
      }
    },
    (error) => {
      console.error("Error fetching comments:", error);
    }
  );

  return unsubscribe;
};