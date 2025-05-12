import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Image,
} from "react-native";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Ionicons } from "@expo/vector-icons";
import { StretchOutY } from "react-native-reanimated";

export default function SendFriendRequestScreen() {
  const { user } = useAuth();
  const theme = useTheme();
  const styles = createThemedStyles(theme);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendRequest = async () => {
    if (!user) return;
    if (email.trim() === "" || email === user.email) {
      Alert.alert(
        "Invalid email",
        "Please enter a valid email different from your own."
      );
      return;
    }

    setSending(true);

    try {
      // Find user by email
      const q = query(collection(db, "users"), where("email", "==", email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        Alert.alert("User not found", "No user found with that email.");
        return;
      }

      const targetUser = snapshot.docs[0];
      const targetData = targetUser.data();
      const to = targetUser.id;

      // Check if request already exists
      const existing = query(
        collection(db, "friendRequests"),
        where("from", "==", user.uid),
        where("to", "==", to)
      );

      const existingSnap = await getDocs(existing);
      if (!existingSnap.empty) {
        Alert.alert("Request already sent");
        return;
      }

      console.log("auth uid:", user?.uid);
      console.log("sending payload:", {
        from: user?.uid,
        to: targetUser.id,
      });

      // Create friend request
      await addDoc(collection(db, "friendRequests"), {
        from: user.uid,
        to,
        status: "pending",
        createdAt: Timestamp.now(),
        userName: user.displayName,
      });

      Alert.alert("Friend request sent!", `To ${targetData.displayName}`);
      setEmail("");
    } catch (error) {
      console.error("Send request error:", error);
      Alert.alert("Error", "Could not send friend request.");
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* header */}
      <Text style={styles.header}>Send Friend Request</Text>

      {/* illustration */}
      <View style={styles.topIllustration}>
        <Image
          source={require("../../../../assets/images/friend-request-illustration.png")}
          style={styles.illustrationImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.searchBar}>
        <TextInput
          placeholder="Enter user's email"
          placeholderTextColor={theme.placeholderText}
          style={styles.searchInput}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <Button
        onPress={handleSendRequest}
        style={styles.button}
        loading={sending}
      >
        Send Request
      </Button>
    </View>
  );
}

function createThemedStyles(theme: any) {
  const { width } = Dimensions.get("window");

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.background,
      justifyContent: "flex-start",
    },
    header: {
      fontSize: 22,
      fontWeight: "600",
      marginBottom: 20,
      textAlign: "center",
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: "textdark",
      fontFamily: "PlusJakartaSans",
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.textbox,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.secondary,
      marginTop: 20,
      paddingHorizontal: 15,
      paddingVertical: 18,
      marginBottom: 20,
    },
    button: {
      borderRadius: 15,
      width: "80%",
      alignSelf: "center",
      alignItems: "center",
    },
    buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
    topIllustration: {
      alignItems: "center",
      width: "100%",
    },
    illustrationImage: {
      width: width * 0.75,
      height: width * 0.75,
    },
  });
}
