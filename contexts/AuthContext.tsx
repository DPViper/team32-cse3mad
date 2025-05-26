import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ProfileData = {
  userID: string;
  displayName: string;
  phone: string;
  activeLevel: string;
  email: string;
  avatar: string;
  createdAt: any;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  profile: ProfileData | null;
  refreshProfile: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  profile: null,
  refreshProfile: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as ProfileData;
      setProfile(data);

      await AsyncStorage.setItem("userProfile", JSON.stringify(data));
    }
  };

  const refreshProfile = () => {
    if (auth.currentUser?.uid) fetchProfile(auth.currentUser.uid);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser?.uid) {
        try {
          const cached = await AsyncStorage.getItem("userProfile");
          if (cached) setProfile(JSON.parse(cached));
        } catch (err) {
          console.log("No local profile found");
        }

        await fetchProfile(firebaseUser.uid); // Then sync from Firestore
      } else {
        setProfile(null);
        await AsyncStorage.removeItem("userProfile");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, profile, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
