import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useAuth } from "@/hooks/useAuth";

type CommentsProps = {
  poiId: string;
  ratings: number;
};

export default function Comments({ poiId, ratings }: CommentsProps) {
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<any[]>([]);
  const { user } = useAuth();

  // Listen realtime comments
  useEffect(() => {
    if (poiId) {
      const unsub = onSnapshot(
        collection(db, `pois/${poiId}/comments`),
        (snapshot) => {
          try {
            const commentList = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setComments(commentList);
          } catch (error) {
            console.error("Error processing comments:", error);
            Alert.alert("Error", "Failed to load comments");
          }
        },
        (error) => {
          console.error("Error fetching comments:", error);
          Alert.alert("Error", "Failed to fetch comments");
        }
      );
      return () => unsub();
    }
  }, [poiId]);

  const handlePostComment = async () => {
    if (!user || !poiId || comment.trim() === "") return;
    try {
      await addDoc(collection(db, `pois/${poiId}/comments`), {
        userId: user.uid,
        displayName: user.displayName || "Anonymous",
        comment,
        rating: ratings,
        createdAt: new Date(),
      });
      setComment("");
      Alert.alert("Comment posted");
    } catch (error) {
      console.error("Error posting comment:", error);
      Alert.alert("Error", "Failed to post comment");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your Comment:</Text>
      <TextInput
        style={styles.input}
        placeholder="Write your comment..."
        value={comment}
        onChangeText={setComment}
      />
      <TouchableOpacity onPress={handlePostComment} style={styles.button}>
        <Text style={styles.buttonText}>💬 Post Comment</Text>
      </TouchableOpacity>
      
      <Text style={styles.label}>Comments:</Text>
      <ScrollView style={styles.commentsList}>
        {comments.map((c) => (
          <View key={c.id} style={styles.commentItem}>
            <Text style={styles.commentHeader}>
              {typeof c.displayName === "string" && typeof c.rating === "number"
                ? `${c.displayName} ⭐ ${c.rating}`
                : "Anonymous ⭐ 0"}
            </Text>
            <Text>{String(c.comment ?? "")}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginTop: 6,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    marginTop: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  commentsList: {
    maxHeight: 100,
    marginTop: 4,
  },
  commentItem: {
    marginBottom: 8,
  },
  commentHeader: {
    fontWeight: "600",
  },
});