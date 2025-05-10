import React, { useEffect, useState } from "react";
import { Modal, View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { POI } from "../type";
import { getPOIDetails, getPOIComments } from "../services/poiService";
import StarRating from "./StarRating";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  poiId: string;
  onClose: () => void;
}

export const POIDetailModal = ({ poiId, onClose }: Props) => {
  const theme = useTheme();
  const [poi, setPOI] = useState<POI | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchDetails = async () => {
      const data = await getPOIDetails(poiId);
      setPOI(data);
      const allComments = await getPOIComments(poiId);
      setComments(allComments);
    };
    fetchDetails();
  }, [poiId]);

  if (!poi) return null;

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={styles.title}>{poi.title}</Text>
        {poi.image && (
          <Image source={{ uri: poi.image }} style={styles.image} />
        )}
        <Text style={{ color: theme.textSecondary }}>{poi.description}</Text>
        <Text style={{ marginTop: 8 }}>Address: {poi.address || "Unknown"}</Text>
        <Text style={{ fontSize: 18, marginTop: 10 }}>
          Rating: {poi.averageRating?.toFixed(1) || "N/A"}
        </Text>
        <StarRating
          itemId={poi.id}
          userId={user?.uid || ""}
          rating={poi.averageRating || 0}
          onChange={() => {}}
        />

        <TouchableOpacity
          style={[styles.reviewButton, { backgroundColor: theme.primary }]}
          onPress={() => router.push({
            pathname: "/features/poi/screens/ReviewScreen",
            params: {
              id: poi.id,
              title: poi.title,
              image: poi.image,
            }
          })}
        >
          <Text style={{ color: "#fff", textAlign: "center" }}>Post a Review</Text>
        </TouchableOpacity>

        <Text style={styles.reviewHeader}>Reviews</Text>
        {comments.map((comment, idx) => (
          <View key={idx} style={styles.comment}>
            <Text style={styles.commentAuthor}>{comment.userName}</Text>
            <StarRating
              itemId={poi.id}
              userId={user?.uid || ""}
              rating={comment.rating}
              onChange={() => {}}
            />
            <Text>{comment.text}</Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text>Close</Text>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  image: { height: 200, borderRadius: 8, marginBottom: 12 },
  reviewButton: {
    marginTop: 12,
    padding: 10,
    borderRadius: 6,
  },
  reviewHeader: { marginTop: 20, fontWeight: "600", fontSize: 16 },
  comment: { marginTop: 10 },
  commentAuthor: { fontWeight: "500" },
  closeButton: {
    padding: 12,
    backgroundColor: "#eee",
    alignItems: "center",
  },
});
