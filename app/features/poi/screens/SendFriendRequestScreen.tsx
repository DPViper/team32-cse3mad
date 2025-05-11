import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { collection, query, where, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";

export default function SendFriendRequestScreen() {
  const { user } = useAuth();
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendRequest = async () => {
    if (!user) return;
    if (email.trim() === "" || email === user.email) {
      Alert.alert("Invalid email", "Please enter a valid email different from your own.");
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

      // Create friend request
      await addDoc(collection(db, "friendRequests"), {
        from: user.uid,
        to,
        status: "pending",
        createdAt: Timestamp.now(),
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
      <Text style={styles.title}>Send Friend Request</Text>

      <TextInput
        placeholder="Enter user's email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity onPress={handleSendRequest} style={styles.button} disabled={sending}>
        {sending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send Request</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#F58A07",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
