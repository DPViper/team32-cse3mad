import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { POI } from "../type";
import { getPOIDetails, getPOIComments } from "../services/poiService";
import StarRating from "./StarRating";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "@/components/SafeScreen";
import { Button } from "@/components/ui/button";

interface Props {
  poiId: string;
  onClose: () => void;
}

export const POIDetailModal = ({ poiId, onClose }: Props) => {
  const theme = useTheme();
  const styles = createThemedStyles(theme);
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

      <SafeAreaProvider>
        <SafeScreen>
          <ScrollView style={styles.container}>
            <Text style={styles.title}>{poi.title}</Text>
            {poi.image && (
              <Image source={{ uri: poi.image }} style={styles.image} />
            )}
            <Text style={styles.address}>{poi.description}</Text>

            {/* rating */}
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Text style={styles.rating}>
                Rating: {poi.averageRating?.toFixed(1) || "N/A"}
              </Text>
              <StarRating
                poiId={poi.id}
                userId={user?.uid || ""}
                rating={poi.averageRating || 0}
                onChange={() => {}}
              />
            </View>


            <Button
              onPress={() =>
                router.push({
                  pathname: "/features/poi/screens/ReviewScreen",
                  params: {
                    id: poi.id,
                    title: poi.title,
                    image: poi.image,
                  },
                })
              }
            >
              Post a Review
            </Button>


            {/* review section */}
            <Text style={styles.reviewHeader}>Reviews</Text>
            {comments.map((comment, idx) => (
              <View key={idx} style={styles.comment}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.commentAuthor}>
                    {comment.displayName}
                  </Text>
                  <Text style={styles.timeAgo}>
                    {formatDistanceToNow(comment.createdAt.toDate(), {
                      addSuffix: true,
                      includeSeconds: true,
                    }).replace("about", "")}
                  </Text>
                </View>

                <StarRating
                  poiId={poi.id}
                  userId={user?.uid || ""}
                  rating={comment.rating}
                  onChange={() => {}}
                />

                <Text style={styles.commentContent}>{comment.comment}</Text>
              </View>
            ))}
          </ScrollView>

          <Button variant="outline" onPress={onClose}>
            Close
          </Button>
        </SafeScreen>
      </SafeAreaProvider>
    </Modal>
  );
};

function createThemedStyles(theme: any) {
  return StyleSheet.create({
    container: { paddingHorizontal: 16, backgroundColor: theme.background },
    title: {
      fontSize: 22,
      marginBottom: 8,
      alignSelf: "center",
      color: theme.textDark,
      fontFamily: "PlusJakartaSansBold",
    },
    image: { height: 200, borderRadius: 20, marginBottom: 12 },
    address: {
      color: theme.secondary,
      fontFamily: "PlusJakartaSans",
    },
    rating: {
      fontSize: 18,
      marginTop: 10,
      color: theme.secondary,
      marginRight: 5,
    },
    reviewHeader: {
      marginTop: 20,
      marginBottom: 10,
      fontWeight: "600",
      fontSize: 25,
      fontFamily: "PlusJakartaSansSemiBold",
    },
    comment: {
      marginBottom: 10,
      paddingTop: 10,
      borderTopWidth: 0.5,
      borderBottomColor: theme.border,
    },
    commentAuthor: {
      fontWeight: "500",
      color: theme.textDark,
      fontFamily: "PlusJakartaSans",
      marginRight: 5,
    },
    timeAgo: {
      color: theme.textSecondary,
      // paddingTop: 2,
      fontFamily: "PlusJakartaSans",
    },
    commentContent: {
      fontSize: 16,
      color: theme.textDark,
      fontFamily: "PlusJakartaSans",
    },
    closeButton: {
      padding: 12,
      backgroundColor: "#eee",
      alignItems: "center",
    },
  });
}
