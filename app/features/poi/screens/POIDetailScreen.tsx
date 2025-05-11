import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import { fetchComments, Comment } from "@/app/features/poi/services/fetchComments";
import { useLocalSearchParams } from "expo-router";

export default function POIDetailScreen() {
  const route = useRoute();
  const { poi } = route.params as any;

  // State for comments
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch comments for the selected POI 
  useEffect(() => {
    if (poi?.id) {
      console.log("Fetching comments for POI:", poi.id);
      setIsLoading(true);
      const unsubscribe = fetchComments(poi.id, (commentsList) => {
        setComments(commentsList);
        setIsLoading(false);
      });
      return () => unsubscribe();
    }
  }, [poi?.id]);;

  // Format date if it exists
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString();
    } catch (e) {
      return "";
    }
  };


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{poi.title}</Text>
      {poi.image && <Image source={{ uri: poi.image }} style={styles.image} />}
      <Text style={styles.address}>{poi.description}</Text>
      <Text style={styles.rating}>⭐ {poi.averageRating?.toFixed(1) || poi.rating || "N/A"}</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Post a Review</Text>
      </TouchableOpacity>

      

      {/* Display comments */}
      <Text style={styles.subTitle}>Reviews</Text>
      <View style={styles.commentsContainer}>
      {isLoading ? (
          <Text style={styles.loadingText}>Loading comments...</Text>
        ) : comments.length > 0 ? (
          comments.map(item => (
            <View key={item.id} style={styles.commentItem}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentName}>{item.displayName}</Text>
                {item.createdAt && (
                  <Text style={styles.commentDate}>{formatDate(item.createdAt)}</Text>
                )}
              </View>
              
              {/* Display stars based on the user's rating */}
              <View style={styles.starContainer}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Text 
                    key={star} 
                    style={[styles.star, star <= item.rating && styles.filledStar]}
                  >
                    ★
                  </Text>
                ))}
              </View>

              <Text style={styles.commentText}>{item.comment}</Text>
            </View>
          ))
        ) : (
          <Text style={[styles.commentText, {fontStyle: 'italic'}]}>No comments yet</Text>
        )}
      </View> 
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginVertical: 12,
  },
  address: {
    color: "#666",
  },
  rating: {
    fontSize: 16,
    marginVertical: 8,
  },
  button: {
    backgroundColor: "orange",
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  loadingText: {
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },

  commentsContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  commentItem: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: "orange",
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentName: {
    fontWeight: "bold",
    color: '#000',
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
  },
  commentText: {
    color: '#000',
    marginTop: 6,
  },
  starContainer: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  star: {
    fontSize: 18,
    color: "#CCC",
    marginRight: 2,
  },
  filledStar: {
    color: "#FFD700",
  },
});