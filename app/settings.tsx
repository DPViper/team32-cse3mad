import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";
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
  const [editing, setEditing] = useState(false);
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
    });

    Toast.show({ type: "success", text1: "Profile updated!" });
    refreshProfile();

    try {
      // Update the user's profile in Firestore
      await updateDoc(doc(db, "users", uid), {
        displayName: name,
        phone,
      });
      await updateProfile(auth.currentUser, {
        displayName: name,
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.sectionTitle}>My account</Text>
          <TouchableOpacity onPress={() => setEditing(!editing)}>
            <Text style={[styles.rowText, { color: theme.textDark }]}>
              {editing ? "Cancel" : "Edit"}
            </Text>
          </TouchableOpacity>
        </View>

        {editing ? (
          <>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={name}
                onChangeText={setName}
                placeholderTextColor={theme.textSecondary}
              />
            </View>
            <View style={[styles.inputContainer, { marginTop: 12 }]}>
              <TextInput
                style={styles.input}
                placeholder="Phone"
                value={phone}
                onChangeText={setPhone}
                placeholderTextColor={theme.textSecondary}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.signOutSection}>
              <Button onPress={handleSave} style={styles.signOutButton}>
                Save
              </Button>
            </View>
          </>
        ) : (
          <>
            <View style={styles.row}>
              <Text style={styles.rowText}>Username</Text>
              <Text style={styles.rowText}>
                {profile?.displayName || "N/A"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowText}>Mobile Number</Text>
              <Text style={styles.rowText}>{profile?.phone || "N/A"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowText}>Email</Text>
              <Text style={styles.rowText}>{profile?.email || "N/A"}</Text>
            </View>
          </>
        )}

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

// const handleSave = async () => {
//   const uid = auth.currentUser?.uid;
//   if (!auth.currentUser) return;
//   if (!uid) return;

//   Toast.show({ type: "success", text1: "Profile updated!" });
//   refreshProfile();

//   try {
//     // Update the email in Firestore
//     await updateEmail(auth.currentUser, email);
//     // Update the user's profile in Firestore
//     await updateDoc(doc(db, "users", uid), {
//       displayName: name,
//       phone,
//       email,
//     });
//     // Update the user's profile in Firebase Auth
//     await updateProfile(auth.currentUser, {
//       displayName: name,
//     });

//     Toast.show({
//       type: "success",
//       text1: "Profile updated!",
//     });
//   } catch (e: any) {
//     Toast.show({
//       type: "error",
//       text1: "Update failed",
//       text2: e.message,
//     });
//   }
// };
