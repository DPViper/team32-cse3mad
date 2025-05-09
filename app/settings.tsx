import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebaseConfig";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import Toast from "react-native-toast-message";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { Button } from "@/components/ui/button";

export default function settings() {
  const theme = useTheme();
  const styles = createThemedStyles(theme);
  const { profile, refreshProfile } = useAuth();
  const [name, setName] = useState(profile?.displayName || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const router = useRouter();
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

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/(auth)");
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Settings",
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: theme.primary,
          },
          headerTitleStyle: {
            fontFamily: "PlusJakartaSansSemiBold",
          },
          headerTintColor: theme.textDark,
        }}
      />
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>My account</Text>

        <View style={styles.row}>
          <Text style={styles.rowText}>Username</Text>
          <Text style={styles.rowText}>oldnxeldawell</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowText}>Mobile Number</Text>
          <Text style={styles.rowText}>0433978126</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowText}>Email</Text>
          <Text style={styles.rowText}>noel.anhduy@gmail.com</Text>
        </View>

        {/* Log Out Button */}
        <View style={styles.signOutSection}>
          <Button onPress={handleLogout} style={styles.signOutButton}>
            Sign Out
          </Button>
        </View>
      </View>
    </>
  );
}

function createThemedStyles(theme: any) {
  return StyleSheet.create({
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
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 20,
      justifyContent: "flex-start",
    },
    sectionTitle: {
      fontWeight: "700",
      fontSize: 20,
      color: theme.textDark,
      marginTop: 20,
      marginBottom: 8,
      fontFamily: "PlusJakartaSansSemiBold",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.border,
    },
    rowText: {
      color: theme.textDark,
      fontFamily: "PlusJakartaSans",
    },
    signOutSection: {
      alignItems: "center",
      marginTop: 20,
    },
    signOutButton: { borderRadius: 30, width: "50%" },
  });
}
