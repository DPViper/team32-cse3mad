import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';

// Define the shape of a User document
export interface User {
  id: string;
  displayName: string;
  phone: string;
  activeLevel: string;
}

/**
 * Custom hook that subscribes in real time to the 'users' collection.
 * Returns the current list of users and a loading flag.
 */
export function useFireStore() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reference the 'users' collection
    const usersColl = collection(db, 'users');

    // Start listening for updates
    const unsubscribe = onSnapshot(
      usersColl,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const loaded = snapshot.docs.map(doc => {
          const data = doc.data() as Omit<User, 'id'>;
          return { id: doc.id, ...data };
        });
        setUsers(loaded);
        setLoading(false);
      },
      (error) => {
        console.error('useFireStore error:', error);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  return { users, loading };
}
