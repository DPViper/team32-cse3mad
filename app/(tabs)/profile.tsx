import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";

import { auth } from "@/lib/firebaseConfig";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebaseConfig";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { useTheme } from "@/contexts/ThemeContext";
import { collection, getDocs } from "firebase/firestore";
import { useFocusEffect } from "expo-router";
import { POI } from "../features/poi/type";
import { POIDetailModal } from "../features/poi/components/POIDetailModal";

export default function profile() {
  const theme = useTheme();
  const styles = createThemedStyles(theme);
  const { profile, refreshProfile } = useAuth();
  const [name, setName] = useState(profile?.displayName || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [createdAt, setCreatedAt] = useState("");
  const [pois, setPOIs] = useState<POI[]>([]);
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const avatarUrl =
    user?.photoURL ??
    "https://api.dicebear.com/7.x/adventurer/png?seed=default";
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchFavorites = async () => {
    if (!user) return;
    try {
      const snap = await getDocs(collection(db, `users/${user.uid}/favorites`));
      const items = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFavorites(items);
    } catch (err) {
      console.error("Failed to load favorites:", err);
      Alert.alert("Error loading favorites");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavorites(); // Refresh favorites when the screen gains focus
    }, [user])
  );
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      const snapshot = await getDoc(docRef);
      const createdAt = snapshot.data()?.createdAt;
      if (createdAt) {
        setCreatedAt(createdAt.toDate().toString());
      } else {
        setCreatedAt("Unknown");
      }

      if (snapshot.exists()) {
        setName(snapshot.data().displayName);
      }
    };
    loadProfile();
  }, [user]);

  return (
    <View style={styles.container}>
      {/* Avatar and information */}
      <View style={styles.profile}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        </View>
        <Text style={styles.name}>
          {auth.currentUser?.displayName ?? "Your Name"}
        </Text>
        <Text style={styles.memberSince}>
          {createdAt
            ? `Joined ${new Date(createdAt).toLocaleString("en-AU", {
                year: "numeric",
                month: "short",
              })}`
            : "Joined date unknown"}
        </Text>
      </View>

      <Text style={[styles.name, { marginTop: 16, marginBottom: 4 }]}>
        Favorite Places
      </Text>

      {favorites.length === 0 && !loading ? (
        <Text style={styles.memberSince}>No favorites yet</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedPOI(item);
                setShowDetail(true);
              }}
              style={styles.listItem}
            >
              <Image
                source={{ uri: item.image ?? undefined }}
                style={styles.placeImage}
                resizeMode="cover"
              />
              <View style={styles.placeDetails}>
                <Text style={styles.placeName}>{item.title}</Text>
                {item.averageRating && (
                  <Text style={styles.placeRating}>{item.averageRating}</Text>
                )}
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {showDetail && selectedPOI && (
        <POIDetailModal
          poiId={selectedPOI.id}
          onClose={() => setShowDetail(false)}
        />
      )}
    </View>
  );
}

function createThemedStyles(theme: any) {
  return StyleSheet.create({
    avatarContainer: {
      marginTop: 10,
      marginBottom: 20,
      width: 120,
      height: 120,
      borderRadius: 60,
      overflow: "hidden",
      backgroundColor: theme.button,
    },
    button: {
      backgroundColor: "#ffa200",
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "600",
      textAlign: "center",
    },
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 24,
      gap: 20,
    },
    profile: {
      alignItems: "center",
      marginBottom: 20,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 50,
      marginBottom: 10,
    },
    name: {
      fontSize: 20,
      fontWeight: "900",
      color: theme.textDark,
      fontFamily: "PlusJakartaSans",
    },
    memberSince: {
      fontSize: 14,
      color: theme.secondary,
    },
    listItem: {
      flexDirection: "row",
      marginBottom: 16,
      alignItems: "center",
      gap: 12,
    },
    placeImage: { width: 130, height: 60, borderRadius: 8 },
    placeDetails: {
      gap: 10,
    },
    placeName: {
      fontSize: 16,
      color: theme.textDark,
      fontFamily: "PlusJakartaSans",
      fontWeight: "600",
    },
    placeRating: { color: theme.textLight },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.inputBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: 12,
    },
    input: {
      flex: 1,
      height: 48,
      color: theme.textDark,
    },
  });
}
