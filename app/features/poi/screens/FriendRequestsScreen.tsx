import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  getDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export default function FriendRequestsScreen() {
  const { user } = useAuth();
  const theme = useTheme();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userReady, setUserReady] = useState(false);

  useEffect(() => {
    if (!user) return;

    setUserReady(true);

    const fetchRequests = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, "friendRequests"),
          where("to", "==", user.uid),
          where("status", "==", "pending")
        );
        const snapshot = await getDocs(q);
        const enriched = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();
            const senderDoc = await getDoc(doc(db, "users", data.from));
            const sender = senderDoc.exists() ? senderDoc.data() : null;

            return {
              id: docSnap.id,
              ...data,
              userName: sender?.displayName || data.from,
              userAvatar: sender?.avatar || "",
            };
          })
        );

        setRequests(enriched);
      } catch (err) {
        console.error("Failed to load friend requests", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user]);

  if (!userReady) return null;

  const handleAccept = async (request: any) => {
    if (!user) return;
    try {
      // Update status to accepted
      const ref = doc(db, "friendRequests", request.id);
      await updateDoc(ref, { status: "accepted" });

      // Fetch sender info
      const senderDoc = await getDoc(doc(db, "users", request.from));
      const sender = senderDoc.data();

      // Add each other to friends lists
      await Promise.all([
        addDoc(collection(db, "friends", user.uid, "list"), {
          uid: request.from,
          displayName: sender?.displayName || "Friend",
          avatar: sender?.avatar || "",
          since: new Date(),
        }),
        addDoc(collection(db, "friends", request.from, "list"), {
          uid: user.uid,
          displayName: user.displayName || "You",
          avatar: user.photoURL || "",
          since: new Date(),
        }),
      ]);

      // Remove from visible list
      setRequests((prev) => prev.filter((r) => r.id !== request.id));
      Alert.alert("Friend request accepted!");
    } catch (err) {
      console.error("Failed to accept request", err);
      Alert.alert("Failed to accept request.");
    }
  };

  const handleReject = async (request: any) => {
    try {
      const ref = doc(db, "friendRequests", request.id);
      await updateDoc(ref, { status: "rejected" });

      setRequests((prev) => prev.filter((r) => r.id !== request.id));
    } catch (err) {
      console.error("Failed to reject request", err);
    }
  };

  const renderRequest = ({ item }: { item: any }) => (
    <View style={styles.requestItem}>
      <Text style={styles.name}>{item.userName}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, styles.accept]}
          onPress={() => handleAccept(item)}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.reject]}
          onPress={() => handleReject(item)}
        >
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Friend Requests</Text>
      {requests.length === 0 ? (
        <Text style={styles.empty}>No pending requests</Text>
      ) : (
        <FlatList
          data={requests}
          renderItem={renderRequest}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  empty: { textAlign: "center", marginTop: 40, fontSize: 16, color: "#888" },
  requestItem: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 12,
  },
  name: { fontSize: 16, fontWeight: "500", marginBottom: 8 },
  buttons: { flexDirection: "row", justifyContent: "space-between" },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  accept: {
    backgroundColor: "#28a745",
  },
  reject: {
    backgroundColor: "#dc3545",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
