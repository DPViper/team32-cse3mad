import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { auth } from "@/lib/firebaseConfig";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseConfig";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import Toast from "react-native-toast-message";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

export default function profile() {
  const theme = useTheme();
  const styles = createThemedStyles(theme);
  const { profile, refreshProfile } = useAuth();
  const [name, setName] = useState(profile?.displayName || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const { user } = useAuth();
  const router = useRouter();
  const avatarUrl = user?.photoURL ?? "https://api.dicebear.com/7.x/adventurer/png?seed=default";

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        setName(snapshot.data().displayName);
      }
    };
    loadProfile();
  }, [user]);

  const handleSave = async () => {
    const uid = auth.currentUser?.uid;
    if (!auth.currentUser) return;

    if (!uid) return;

    await updateDoc(doc(db, "users", uid), {
      displayName: name,
      phone,
    });

    await updateProfile(auth.currentUser!, {
      displayName: name,
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=random&rounded=true&size=256`,
    });

    Toast.show({ type: "success", text1: "Profile updated!" });
    refreshProfile();

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random&rounded=true&size=256`;

    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: avatarUrl,
      });

      Toast.show({
        type: "success",
        text1: "Profile updated!",
      });
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: "Update failed",
        text2: e.message,
      });
    }
  };

  const fetchProfile = async () => {
    const docRef = doc(db, "users", auth.currentUser!.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("User data:", docSnap.data());
    }
  };

  return (
    <View style={styles.container}>
      {/* Avatar and information */}
      <View style={styles.profile}>
        {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      </View>
        <Text style={styles.name}>{auth.currentUser?.displayName ?? "Your Name"}</Text>
        <Text style={styles.memberSince}>Joined Apr 2025</Text>
      </View>

      {/* Settings Button */}
      <TouchableOpacity onPress={() => router.push("/settings")} style={styles.button}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <FlatList
        data={favoritePlaces}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => console.log("Navigate to detail:", item.id)}
            style={styles.listItem}
          >
            {/* Place Image */}
            <Image
              source={item.image}
              style={styles.placeImage}
              resizeMode="cover"
            />
            {/* Place Name and Rating */}
            <View style={styles.placeDetails}>
              <Text style={styles.placeName}>{item.name}</Text>
              <Text style={styles.placeRating}>{item.rating}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function createThemedStyles(theme: any) {
  return StyleSheet.create({
    avatarContainer: {
      marginTop: 60,
      marginBottom: 20,
      width: 120,
      height: 120,
      borderRadius: 60,
      overflow: "hidden",
      backgroundColor: "#ccc",
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
      backgroundColor: theme.primary,
      padding: 24,
      gap: 20,
    },
    profile: {
      alignItems: "center",
      marginBottom: 20,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 10,
    },
    name: {
      fontSize: 20,
      fontWeight: "700",
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

// Sample data for favorite places
const favoritePlaces = [
  {
    id: "1",
    name: "Farmer’s Daughters",
    rating: 4.7,
    image: require("../../FakeAssets/img/farmerdaughter.jpeg"),
  },
  {
    id: "2",
    name: "Library at Profilee Dock",
    rating: 4.8,
    image: require("../../FakeAssets/img/docklandlib.jpeg"),
  },
  {
    id: "3",
    name: "Point Ormond Lookout",
    rating: 4.6,
    image: require("../../FakeAssets/img/pointormond.jpg"),
  },
];
