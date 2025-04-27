import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  Button,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import Toast from "react-native-toast-message";

import { useTheme } from "@/contexts/ThemeContext";

const favoritePlaces = [
  {
    id: "1",
    name: "Paris Jazz Cat Club",
    type: "Jazz Club - VIC 3000",
    image: require("../../FakeAssets/img/pariscat.jpg"),
  },
  {
    id: "2",
    name: "LeTao Melbourne",
    type: "Bakery - VIC 3000",
    image: require("../../FakeAssets/img/letao.jpg"),
  },
  {
    id: "3",
    name: "Little Rogue.",
    type: "Coffee Shop - VIC 3000",
    image: require("../../FakeAssets/img/littlerogue.jpg"),
  },
];

export default function profile() {
  const theme = useTheme();
  const styles = createThemedStyles(theme);
  const { profile, refreshProfile } = useAuth();
  const [name, setName] = useState(profile?.displayName || "");
  const [phone, setPhone] = useState(profile?.phone || "");

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
        {name && (
          <Image
            source={{
              uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                name
              )}&background=random&rounded=true&size=64`,
            }}
            style={styles.avatar}
          />
        )}
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.memberSince}>Joined Apr 2025</Text>
      </View>

      {/* test button to log out */}
      <TouchableOpacity
        style={{
          backgroundColor: "#FF0000",
          padding: 10,
          borderRadius: 5,
          marginBottom: 20,
        }}
        onPress={() => signOut(auth)}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Log out</Text>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Display Name"
          placeholderTextColor={theme.placeholderText}
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
      </View>
      <Button title="Save Changes" onPress={handleSave} />
    </View>
  );
}

function createThemedStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.primary,
      padding: 24,
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
    favTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 10,
    },
    placeItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
    },
    placeImage: {
      width: 50,
      height: 50,
      borderRadius: 8,
      marginRight: 10,
    },
    placeInfo: {
      flex: 1,
    },
    placeName: {
      fontSize: 15,
      fontWeight: "500",
    },
    placeType: {
      fontSize: 13,
      color: "#777",
    },
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
