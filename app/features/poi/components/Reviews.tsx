import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  DocumentData,
} from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

type Reviews = {
  id: string;
  userId: string;
  displayName: string;
  comment: string;
  createdAt: { toDate: () => Date };
};

type ReviewsProps = {
  poiId: string;
};

export default function Comments({ poiId }: ReviewsProps) {
  const [comments, setComments] = useState<Reviews[]>([]);
  const [newReview, setNewReview] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, `pois/${poiId}/comments`),
      (snapshot) => {
        const list = snapshot.docs.map((doc) => {
          const data = doc.data() as DocumentData;
          return {
            id: doc.id,
            userId: data.userId ?? "",
            displayName: data.displayName ?? "Anonymous",
            comment: data.comment ?? "",
            createdAt: data.createdAt ?? { toDate: () => new Date() },
          };
        });
        setComments(list);
      }
    );
    return () => unsub();
  }, [poiId]);

  const handlePost = async () => {
    if (!user || !newReview.trim()) return;
    try {
      await addDoc(collection(db, `pois/${poiId}/comments`), {
        userId: user.uid,
        displayName: user.displayName || "Anonymous",
        comment: newReview.trim(),
        createdAt: new Date(),
      });
      setNewReview("");
      Alert.alert("✓ Review posted");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to post review");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Text style={styles.name}>{item.displayName}</Text>
            <Text style={styles.text}>{item.comment}</Text>
          </View>
        )}
        style={styles.list}
      />

      <TextInput
        style={styles.input}
        placeholder="Write a review..."
        value={newReview}
        onChangeText={setNewReview}
      />
      <Button title="Submit Review" onPress={handlePost} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 8 },
  list: { flexGrow: 0, maxHeight: 200, marginBottom: 12 },
  commentItem: {
    marginBottom: 8,
    padding: 6,
    backgroundColor: "#f1f1f1",
    borderRadius: 4,
  },
  name: { fontWeight: "600", marginBottom: 2 },
  text: { fontSize: 14 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
});
